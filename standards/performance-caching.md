# Performance & Caching Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Performance Standards

### Core Web Vitals Requirements
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Lighthouse Score Target
≥90 across all metrics

### Required Optimizations
- All images via `next/image` component
- Font optimization via `next/font`
- Critical CSS inline
- Code splitting via dynamic imports
- Bundle size monitoring

### NO PAID MONITORING TOOLS
Vercel Analytics/Speed Insights cost extra. Use instead:
- Lighthouse CI for free monitoring
- Chrome DevTools Performance tab
- WebPageTest for third-party testing
- Google Search Console for Core Web Vitals

---

## Caching Strategy

### Next.js Caching Layers
1. **Request Memoization** - Automatic deduplication of fetch requests
2. **Data Cache** - Persistent HTTP cache (opt-in with `revalidate`)
3. **Full Route Cache** - Pre-rendered HTML and RSC payload
4. **Router Cache** - Client-side navigation cache

### Standard Caching Pattern
```typescript
// app/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every 1 hour

export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map(page => ({ slug: page.slug }))
}
```

### Sanity Content Caching
```typescript
// lib/sanity.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for published content
  // useCdn: false for draft content or real-time updates
})

// Fetch with revalidation
export async function getPage(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug },
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  )
}
```

### Cache Control Headers (when needed)
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable', // 1 year
        },
      ],
    },
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ]
}
```

### When to Use Each Strategy
- **Static pages (About, Contact)**: `export const revalidate = false` (static)
- **Dynamic content (Blog, Products)**: `revalidate: 3600` (1 hour)
- **Real-time data (Cart, User profile)**: `revalidate: 0` or `cache: 'no-store'`

---

## CDN & Asset Optimization

### Vercel Edge Network
All projects automatically benefit from global CDN

### Image Optimization
```typescript
import Image from 'next/image'

// Sanity images
<Image
  src={urlFor(image).url()}
  alt={image.alt || ''}
  width={800}
  height={600}
  quality={85}
  priority={false} // Only true for above-the-fold images
/>
```

### Font Optimization
```typescript
import { Inter, DM_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Static Asset Guidelines
- Store images in `/public/images/`
- Use SVG for icons and logos
- Compress images before upload (use ImageOptim, Squoosh, or TinyPNG)
- Lazy load images below the fold

---

## Redirects & URL Management

### Static Redirects (next.config.ts)
```typescript
async redirects() {
  return [
    // www → non-www (or vice versa)
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.example.com' }],
      destination: 'https://example.com/:path*',
      permanent: true,
    },
    // Old pages
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true, // 301
    },
    // Pattern matching
    {
      source: '/blog/:slug',
      destination: '/articles/:slug',
      permanent: true,
    },
  ]
}
```

### Dynamic Redirects from Sanity
Best Practice: see 177 Milk Street

```typescript
// sanity/schemaTypes/documents/redirect.ts
export default {
  name: 'redirect',
  type: 'document',
  title: 'Redirect',
  fields: [
    {
      name: 'source',
      type: 'string',
      title: 'Source URL',
      description: 'The old URL to redirect from (e.g., /old-page)',
    },
    {
      name: 'destination',
      type: 'string',
      title: 'Destination URL',
      description: 'The new URL to redirect to (e.g., /new-page)',
    },
    {
      name: 'permanent',
      type: 'boolean',
      title: 'Permanent Redirect (301)',
      description: 'Use 301 for SEO, 302 for temporary redirects',
      initialValue: true,
    },
  ],
}

// next.config.ts
async redirects() {
  const sanityRedirects = await client.fetch(`
    *[_type == "redirect"]{
      source,
      destination,
      permanent
    }
  `)

  return [
    ...staticRedirects,
    ...sanityRedirects,
  ]
}
```

### URL Best Practices
- Always use lowercase slugs
- Use hyphens, not underscores: `/blog/my-post` ✅ not `/blog/my_post` ❌
- Trailing slash consistency: Choose one (with or without) and stick to it
- Avoid deep nesting: `/blog/post-title` ✅ not `/blog/2024/12/03/post-title` ❌

---

## Dynamic Redirect Updates (Without Redeploy)

### Option 1: Vercel Deploy Hook + Sanity Webhook (Recommended)

Best for: Infrequent updates (weekly/monthly), acceptable 2-5 min delay

Setup:
1. Create Deploy Hook in Vercel: Project Settings → Git → Deploy Hooks
2. Create Sanity Webhook filtered to `_type == "redirect"` pointing to the deploy hook URL

Pros: Zero code changes, zero runtime overhead, battle-tested
Cons: 2-5 minute delay for changes to go live

### Option 2: Middleware-Based Runtime Redirects

Best for: Frequent updates (daily), need near-instant changes (~60s)

Reference implementation: `planetary/177milkstreet` branch `feature/MIL2-311-dynamic-redirects-middleware`

Key considerations:
- Adds ~1-3ms latency per request (cache hit)
- Requires fallback logic if Sanity is unreachable
- Use Map for O(1) lookups with large redirect lists
- Preserve correct HTTP status codes (301/307) for SEO

### Decision Guide

| Factor | Deploy Hook | Middleware |
|--------|-------------|------------|
| Update delay | 2-5 minutes | ~60 seconds |
| Code changes | None | New caching layer |
| Runtime risk | None | Sanity dependency |
| Maintenance | None | Cache logic |
