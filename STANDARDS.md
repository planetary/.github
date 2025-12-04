# PLANETARY AGENCY STANDARDIZATION - REVISED FINDINGS

> **Last Updated**: 2025-12-03
> **Status**: Draft - Awaiting Final Approval
> **Owner**: Lead Engineer (Hel Rabelo) + Director of Technology ( Chris )

---

## PROJECT MANAGEMENT & COLLABORATION STANDARDS

### GitHub (Version Control)

#### Repository Organization

**Client-Owned Repos**:
```
github.com/client-org/project-name
Examples:
- github.com/dintaifung/dtf-website
- github.com/burlington/burlington-com
```
- We have contributor access
- Client owns the repo
- Follow client's access policies

**Planetary-Owned Repos**:
```
github.com/planetary-agency/project-name
Examples:
- github.com/planetary-agency/177milkstreet
- github.com/planetary-agency/planetary-website
```
- We own and manage
- Full admin access
- We control deployment

#### Branch Strategy

**Standard Branch Names**:
```
main              # Production branch (protected)
staging           # Staging environment (if applicable)
develop           # Development branch (some projects)

feature/LINEAR-123-brief-description
fix/LINEAR-456-brief-description
hotfix/LINEAR-789-brief-description
deps/update-nextjs
```

**Branch Protection Rules** (for Planetary-owned repos):
- `main` requires PR approval from Lead Engineer or Director
- No direct commits to `main`
- Status checks must pass (lint, type check, build)
- Delete branches after merge

#### Commit Standards

**Conventional Commits Format**:
```
<type>: <description>

[optional body]

[optional Linear reference]
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config)
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes bug nor adds feature
- `perf:` - Performance improvement
- `test:` - Adding or updating tests

**Examples**:
```bash
# Good
git commit -m "feat: add product filtering to catalog page"
git commit -m "fix: resolve mobile menu overflow on iPad"
git commit -m "chore: upgrade next.js to 15.5"

# Bad (avoid)
git commit -m "update"
git commit -m "fix stuff"
git commit -m "WIP"
```

**Commit Body Guidelines**:
- Keep commits focused (one logical change per commit)
- First line max 72 characters
- Use present tense ("add feature" not "added feature")
- Reference Linear issues: `Closes LINEAR-123`
- **NEVER** add co-author lines or "Generated with Claude Code"
- **NEVER** add "claude" to commit messages

#### Pull Request Standards

**Standard PR Template**: We use the shared template from `https://github.com/planetary/.github`

**PR Title Format**:
```
[TEAM-123] Brief description of changes
```

**Our PR Template Includes**:
- **Ticket**: Link to Linear issue
- **Summary**: Problem, Solution, How it works
- **Testing/QA Steps**: Step-by-step verification instructions
- **Acceptance Criteria**: Definition of "done"
- **Author Checklist**: Self-review items

**PR Review Process**:
1. Create PR and assign to Lead Engineer or senior developer
2. Ensure CI passes (build, lint, type check)
3. Address review comments
4. Get approval
5. **Reviewer merges** (not PR author)
6. Delete branch after merge

**PR Size Guidelines**:
- Small PRs preferred (< 400 lines changed)
- If larger, explain why in description
- Break up large features into multiple PRs when possible

---

## PACKAGE MANAGEMENT & DEPENDENCY UPDATES

### Dependency Audit Schedule

**Weekly** (Automated via Dependabot or GitHub):
- Security patches for critical vulnerabilities
- Review and merge automated PRs

**Monthly**:
- Minor version updates for key dependencies
- Review changelog for breaking changes
- Test thoroughly before merging

**Quarterly**:
- Major version updates (Next.js, React, Sanity)
- Plan migration path
- Allocate dedicated time for testing

**Commands to Run**:
```bash
# Check for security vulnerabilities
npm audit

# See outdated packages
npm outdated

# Update package-lock.json without changing package.json
npm update

# Interactive update (recommended)
npx npm-check-updates -i
```

### Lock File Standards

**Always Use**: `package-lock.json` (npm)

**Rules**:
- ✅ Commit `package-lock.json` to Git
- ✅ Use `npm ci` in CI/CD (Vercel) for reproducible builds
- ✅ Use `npm install` locally for development
- ❌ Never delete `package-lock.json` to "fix" issues
- ❌ Never mix package managers (no yarn.lock or pnpm-lock.yaml)

**When Lock File Conflicts Occur**:
```bash
# 1. Pull latest from main
git pull origin main

# 2. Reinstall to resolve conflicts
rm -rf node_modules package-lock.json
npm install

# 3. Commit resolved lock file
git add package-lock.json
git commit -m "chore: resolve package-lock.json conflicts"
```

---

## MARKETING/BUSINESS STANDARDS (REVISED)

### Analytics Pipeline

**Standard Approach**: Google Tag Manager (GTM) as the single source of truth

#### Rule #1: All Third-Party Scripts via GTM
```
✅ DO: Add scripts through GTM interface
❌ DON'T: Add <script> tags directly to codebase
```

**Why**:
- Marketing teams can update without deployments
- Easier to manage across environments (dev/staging/prod)
- Better performance (script loading control)
- Audit trail of changes

**Implementation**:
```typescript
// app/layout.tsx - ONLY include GTM
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html>
      <body>
        <GoogleTagManager gtmId={GTM_ID} />
        {children}
      </body>
    </html>
  )
}
```

**What Goes in GTM**:
- Google Analytics 4
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar
- Klaviyo
- Any marketing/tracking pixels
- Consent management scripts

**What Stays in Code**:
- Next.js Script component for critical functionality
- Essential services (e.g., Shopify checkout if needed for functionality)

### Consent Management (PRIORITY: Based on 177 Milk Street Implementation)

**Standard**: Implement Google Consent Mode v2 (required for GDPR/CCPA)

**Reference Implementation**: See 177 Milk Street `/website/app/layout.tsx` for production-tested pattern

**Consent Platform**: Client choice (OneTrust, Cookiebot, Osano, etc.)

---

#### Complete Implementation (Recommended Pattern)

**Critical Script Loading Order**:
1. **Consent Mode Initialization** (`beforeInteractive`) - Set default consent to "denied"
2. **Google Tag Manager** - Loads with consent mode awareness
3. **Consent Platform** (OneTrust, Cookiebot, etc.) - Updates consent when user accepts

```typescript
// app/layout.tsx
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
  const ONE_TRUST_ID = process.env.NEXT_PUBLIC_ONE_TRUST_DATA_DOMAIN_ID

  return (
    <html lang="en">
      <body>
        {/*
          STEP 1: GOOGLE CONSENT MODE INITIALIZATION
          ============================================
          MUST load before GTM to set default consent states to 'denied'.
          This ensures proper privacy-first consent flow:
          - Events fire with analytics_storage: denied by default
          - Consent platform updates to 'granted' when user accepts
          - GA4 reprocesses events on the same page with granted status
          - Engagement metrics are properly tracked after consent
        */}
        {GTM_ID && (
          <Script
            id="gtm-consent-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                // Set default consent to 'denied' as a baseline
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'wait_for_update': 500
                });
              `,
            }}
          />
        )}

        {/*
          STEP 2: GOOGLE TAG MANAGER
          ============================
          GTM loads AFTER consent initialization but BEFORE consent platform.
          This ensures GTM respects the default 'denied' consent state.
        */}
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

        {/*
          STEP 3: CONSENT PLATFORM (Example: OneTrust)
          ==============================================
          Provides cookie consent banner and manages user preferences.
          OptanonWrapper is called when:
          1. Initial page load (after OneTrust initializes)
          2. User changes consent preferences

          Consent Categories (verify IDs match your platform settings):
          - C0002: Performance/Analytics Cookies → analytics_storage
          - C0004: Targeting/Advertising Cookies → ad_storage, ad_user_data, ad_personalization
        */}
        {ONE_TRUST_ID && (
          <>
            <Script
              src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
              type="text/javascript"
              data-domain-script={ONE_TRUST_ID}
            />
            <Script
              id="onetrust-optanon-script"
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
                  function OptanonWrapper() {
                    // OnetrustActiveGroups is a comma-delimited string: ",C0001,C0002,C0003,"

                    // Check if Performance/Analytics cookies accepted (C0002)
                    if (typeof OnetrustActiveGroups !== 'undefined' &&
                        OnetrustActiveGroups.indexOf('C0002') !== -1) {
                      if (typeof gtag === 'function') {
                        gtag('consent', 'update', {
                          'analytics_storage': 'granted'
                        });
                      }
                    }

                    // Check if Targeting/Advertising cookies accepted (C0004)
                    if (typeof OnetrustActiveGroups !== 'undefined' &&
                        OnetrustActiveGroups.indexOf('C0004') !== -1) {
                      if (typeof gtag === 'function') {
                        gtag('consent', 'update', {
                          'ad_storage': 'granted',
                          'ad_user_data': 'granted',
                          'ad_personalization': 'granted'
                        });
                      }
                    }
                  }
                `,
              }}
            />
          </>
        )}

        {children}
      </body>
    </html>
  )
}
```

---

#### For Other Consent Platforms

**Cookiebot**:
```typescript
<Script
  src="https://consent.cookiebot.com/uc.js"
  data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID}
  type="text/javascript"
/>
<Script id="cookiebot-consent-update">
  {`
    window.addEventListener('CookiebotOnConsentReady', function() {
      gtag('consent', 'update', {
        'analytics_storage': Cookiebot.consent.statistics ? 'granted' : 'denied',
        'ad_storage': Cookiebot.consent.marketing ? 'granted' : 'denied',
      });
    });
  `}
</Script>
```

**Osano**:
```typescript
<Script src="https://cmp.osano.com/{CLIENT_ID}/osano.js" />
<Script id="osano-consent-update">
  {`
    Osano.cm.addEventListener('osano-cm-consent-saved', function(consent) {
      gtag('consent', 'update', {
        'analytics_storage': consent.ANALYTICS ? 'granted' : 'denied',
        'ad_storage': consent.MARKETING ? 'granted' : 'denied',
      });
    });
  `}
</Script>
```

---

#### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Choose one consent platform:
NEXT_PUBLIC_ONE_TRUST_DATA_DOMAIN_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# OR
NEXT_PUBLIC_COOKIEBOT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# OR
NEXT_PUBLIC_OSANO_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

#### Testing Consent Implementation

**Verification Checklist**:
1. Open DevTools → Network tab
2. Load page → Verify no GA4 tracking cookies (`_ga`, `_gid`) until consent
3. Open banner → Accept cookies
4. Verify `gtag('consent', 'update', ...)` is called in Console
5. Verify GA4 cookies are now set
6. Check GA4 DebugView for events with correct consent state

**Common Issues**:
- ❌ Script loading order wrong → GTM tracks before consent initialized
- ❌ Missing `wait_for_update` → Race condition with consent platform
- ❌ Wrong consent category IDs → Update never fires
- ❌ `gtag` not defined → GTM not loaded properly

### SEO Standards

**Required on Every Page**:
- Dynamic metadata via `generateMetadata()`
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Proper heading hierarchy (h1 → h2 → h3)

**Site-wide Requirements**:
- Sitemap.xml generation
- robots.txt configuration
- Schema.org structured data (LD+JSON)

**Implementation**:
```typescript
// app/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPageData(params.slug)

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://example.com/${params.slug}`,
      type: 'website',
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
    robots: {
      index: !page.noindex,
      follow: !page.nofollow,
    },
  }
}
```

### Structured Data (LD+JSON)

**Required Schemas**:
- Organization (site-wide)
- WebSite (site-wide)
- BreadcrumbList (navigation)
- Page-specific (Article, Product, Event, etc.)

**Implementation**:
```typescript
export default function Page() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    sameAs: [
      'https://twitter.com/company',
      'https://facebook.com/company',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {/* page content */}
    </>
  )
}
```

### Performance Standards

**Core Web Vitals Requirements**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Lighthouse Score Target**: ≥90 across all metrics

**Required Optimizations**:
- All images via `next/image` component
- Font optimization via `next/font`
- Critical CSS inline
- Code splitting via dynamic imports
- Bundle size monitoring

**NO PAID MONITORING TOOLS** (Vercel Analytics/Speed Insights cost extra):
- Use Lighthouse CI for free monitoring
- Chrome DevTools Performance tab
- WebPageTest for third-party testing
- Google Search Console for Core Web Vitals

### Caching Strategy

**Next.js Caching Layers**:
1. **Request Memoization** - Automatic deduplication of fetch requests
2. **Data Cache** - Persistent HTTP cache (opt-in with `revalidate`)
3. **Full Route Cache** - Pre-rendered HTML and RSC payload
4. **Router Cache** - Client-side navigation cache

**Standard Caching Pattern**:
```typescript
// app/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every 1 hour

export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map(page => ({ slug: page.slug }))
}
```

**Sanity Content Caching**:
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

**Cache Control Headers** (when needed):
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

**When to Use Each Strategy**:
- **Static pages (About, Contact)**: `export const revalidate = false` (static)
- **Dynamic content (Blog, Products)**: `revalidate: 3600` (1 hour)
- **Real-time data (Cart, User profile)**: `revalidate: 0` or `cache: 'no-store'`

### CDN & Asset Optimization

**Vercel Edge Network**: All projects automatically benefit from global CDN

**Image Optimization**:
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

**Font Optimization**:
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

**Static Asset Guidelines**:
- Store images in `/public/images/`
- Use SVG for icons and logos
- Compress images before upload (use ImageOptim, Squoosh, or TinyPNG)
- Lazy load images below the fold

### Redirects & URL Management

**Static Redirects** (next.config.ts):
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

**Dynamic Redirects from Sanity** (Best Practice: see 177 Milk Street):
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

**URL Best Practices**:
- Always use lowercase slugs
- Use hyphens, not underscores: `/blog/my-post` ✅ not `/blog/my_post` ❌
- Trailing slash consistency: Choose one (with or without) and stick to it
- Avoid deep nesting: `/blog/post-title` ✅ not `/blog/2024/12/03/post-title` ❌

---

## SHARED TESTING STANDARDS

### Critical Path Testing (Required for All Projects)

**What to Test**:
- All pages load without errors (200 status codes)
- All critical routes are accessible
- All API endpoints return expected responses
- Forms submit successfully
- Navigation works across pages

**Test Framework**: Playwright (E2E) or Vitest (Unit/Integration)

#### Playwright E2E Tests (Recommended)

**Setup**:
```bash
npm install -D @playwright/test
npx playwright install
```

**Example: Critical Path Tests**
```typescript
// tests/critical-paths.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Critical Pages', () => {
  const pages = [
    { url: '/', title: 'Home' },
    { url: '/about', title: 'About' },
    { url: '/contact', title: 'Contact' },
    { url: '/blog', title: 'Blog' },
  ]

  pages.forEach(({ url, title }) => {
    test(`${title} page loads successfully`, async ({ page }) => {
      const response = await page.goto(url)
      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(new RegExp(title, 'i'))
    })
  })
})

test.describe('Navigation', () => {
  test('main navigation links work', async ({ page }) => {
    await page.goto('/')

    // Test header navigation
    await page.click('nav a:has-text("About")')
    await expect(page).toHaveURL(/.*about/)

    await page.click('nav a:has-text("Contact")')
    await expect(page).toHaveURL(/.*contact/)
  })
})

test.describe('API Routes', () => {
  test('/api/health returns 200', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
  })
})

test.describe('Forms', () => {
  test('Contact form submits successfully', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('textarea[name="message"]', 'Test message')

    await page.click('button[type="submit"]')

    await expect(page.locator('.success-message')).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(3000)
  })
})
```

**Run Tests**:
```json
// package.json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  }
}
```

#### Shared Test Config (Store in planetary/.github)

**playwright.config.ts Template**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### CI/CD Integration

**GitHub Actions Workflow** (Store in planetary/.github/workflows):
```yaml
# .github/workflows/test.yml
name: Playwright Tests
on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main, staging ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 22
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Test Coverage Goals

**Minimum Coverage** (All Projects):
- ✅ Homepage loads
- ✅ All main navigation pages load
- ✅ Contact/lead forms submit
- ✅ API health check endpoint
- ✅ Mobile responsive (at least one breakpoint)

**Ideal Coverage** (Mature Projects):
- All public pages (generated from sitemap)
- All form submissions
- All API endpoints
- Authentication flows (login, logout, signup)
- Checkout/purchase flows (e-commerce)
- Search functionality

---

## STANDARD SHARED TOOLING

### Required Tools (All Projects)

#### 1. ESLint + Prettier (Code Quality)
```json
// package.json
{
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-next": "latest",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.0"
  },
  "scripts": {
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### 2. TypeScript (Type Safety)
```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

#### 3. Storybook (Component Documentation)
```json
{
  "devDependencies": {
    "@storybook/react": "^8.0.0",
    "@storybook/nextjs": "^8.0.0"
  },
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

**When to Use Storybook**:
- Projects with 10+ custom components
- Design system components
- Components used across multiple pages
- When PMs/designers need to preview components

**When to Skip**:
- Small single-page sites
- Prototype projects
- Internal tools

#### 4. Sanity CLI (CMS Management)
```json
{
  "devDependencies": {
    "@sanity/cli": "^3.0.0"
  },
  "scripts": {
    "sanity:deploy": "sanity deploy",
    "sanity:graphql": "sanity graphql deploy"
  }
}
```

### ❌ DO NOT USE (Removed from Standards)

#### husky (Pre-commit Hooks) - REMOVED
**Why Removed**:
- Slows down developer workflow
- Can be bypassed with `--no-verify`
- Causes friction for contractors
- Better to catch issues in CI/PR review
- False sense of security

**Instead**:
- Run `npm run lint` manually before committing
- CI checks on PR (GitHub Actions)
- Code review catches issues
- Trust developers to run checks

### Optional Tools (Project-Specific)

#### Testing
```bash
# Only add if client requires tests or complex logic
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Or for E2E
npm install -D playwright @playwright/test
```

#### Animation Libraries
```bash
# For complex animations
npm install gsap framer-motion

# For simple transitions - use CSS/Tailwind
```

#### State Management
```bash
# Only when needed (complex state across many components)
npm install zustand

```

---

## STANDARD PROJECT STRUCTURE

### Monorepo Layout
```
project-name/
├── website/                 # or nextjs/
│   ├── app/
│   │   ├── (pages)/        # Route groups
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout (GTM goes here)
│   │   └── globals.css
│   ├── components/
│   │   ├── blocks/         # Major content sections (Hero, CTA, etc.)
│   │   ├── elements/       # Atomic UI (Button, Card, Input)
│   │   ├── global/         # Site-wide (Header, Footer, Nav)
│   │   ├── layouts/        # Page wrappers
│   │   └── shared/         # Reusable utilities
│   ├── lib/
│   │   ├── sanity.ts       # CMS client
│   │   ├── gtm.ts          # GTM utilities
│   │   └── analytics.ts    # Event tracking
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── .env.local.example  # REQUIRED
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── next.config.ts
│   ├── tailwind.config.ts  # If using Tailwind
│   ├── tsconfig.json
│   └── package.json
├── cms/                     # or sanity/
│   ├── schemaTypes/
│   │   ├── documents/      # Page types (page, post, etc.)
│   │   ├── objects/        # Reusable content
│   │   └── sections/       # Content blocks
│   ├── structure/          # Studio customization
│   ├── sanity.config.ts
│   ├── tsconfig.json
│   └── package.json
├── .nvmrc                   # Node 22.x
├── .gitignore
├── README.md
├── vercel.json             # If needed
└── package.json            # Workspace root
```

### Component Organization

**blocks/** - Major content sections
```
blocks/
├── Hero/
├── TextImageSplit/
├── CardGrid/
├── Newsletter/
└── Testimonials/
```

**elements/** - Atomic components
```
elements/
├── Button/
├── Card/
├── Input/
├── Modal/
└── Badge/
```

**global/** - Site-wide components
```
global/
├── Header/
├── Footer/
├── Navigation/
└── MobileMenu/
```

**layouts/** - Page templates
```
layouts/
├── DefaultLayout/
├── BlogLayout/
└── LandingLayout/
```

**shared/** - Utilities and helpers
```
shared/
├── Container/
├── Section/
├── Loader/
└── ErrorBoundary/
```

---

## AI USAGE GUIDELINES

### When AI is Helpful ✅

**Code Generation**:
- Boilerplate code (components, pages, API routes)
- TypeScript types and interfaces
- Sanity schemas
- Utility functions

**Problem Solving**:
- Debugging complex issues
- Performance optimization suggestions
- Accessibility improvements
- Cross-browser compatibility fixes

**Documentation** (Selective):
- Inline code comments for complex logic
- JSDoc for public APIs
- README setup instructions

### When AI Creates Problems ❌

**Documentation Overload**:
```
❌ DON'T: Generate excessive .md files
project/
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── DEVELOPMENT.md
├── TESTING.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
└── docs/
    ├── components/
    │   ├── Button.md
    │   ├── Card.md
    │   └── ... (20+ more)
    └── ...

✅ DO: Keep it minimal
project/
├── README.md           # Setup, commands, environment
└── CLAUDE.md          # Project-specific notes for AI
```

**Over-Commenting**:
```typescript
❌ DON'T: Comment obvious code
// This function adds two numbers together
function add(a: number, b: number): number {
  // Return the sum of a and b
  return a + b
}

✅ DO: Comment complex logic only
// Apply exponential backoff for rate-limited API calls
// Retries: 1s, 2s, 4s, 8s, then fails
async function fetchWithRetry(url: string, maxRetries = 4) {
  // ...complex retry logic
}
```

**Generic Test Files**:
```typescript
❌ DON'T: Generate placeholder tests
describe('Button', () => {
  it('should render', () => {
    expect(true).toBe(true) // Placeholder
  })
})

✅ DO: Write meaningful tests or skip tests
// Only add tests for:
// - Complex business logic
// - Critical user flows
// - Bug reproductions
```

### AI Best Practices

**Rule #1: Review Every AI-Generated Change**
- Don't blindly accept AI suggestions
- Understand the code before committing
- Check for over-engineering

**Rule #2: Prefer Editing Over Creating**
- Start with existing project patterns
- Ask AI to match existing code style
- Avoid introducing new patterns unnecessarily

**Rule #3: Simplicity Over Cleverness**
```typescript
❌ AI might suggest:
const isEven = (n: number) => !(n & 1)

✅ Prefer readable code:
const isEven = (n: number) => n % 2 === 0
```

**Rule #4: Delete AI-Generated Boilerplate**
- Remove generic comments
- Delete placeholder documentation
- Remove unused imports/functions
- Clean up verbose error messages

**Rule #5: Use AI for Initial Drafts, Human for Final Polish**
```
1. AI generates component structure
2. Human reviews and simplifies
3. Human adds project-specific logic
4. Human tests thoroughly
5. Human commits with meaningful message
```

### AI Tools We Use

**GitHub Copilot**: Code autocomplete (optional per developer)
**Claude Code**: Complex refactoring and architecture questions
**ChatGPT/Claude Web**: Quick problem solving, not for generating entire files

### AI Anti-Patterns to Avoid

**❌ Asking AI to Generate Entire Projects**
- Results in generic, non-specific code
- Doesn't follow our patterns
- Creates maintenance burden

**❌ Letting AI Write Git Commits**
- Generic commit messages like "Updated files"
- No context or reasoning
- Violates our commit standards

**❌ AI-Generated Documentation Sprawl**
- Hundreds of markdown files
- Outdated immediately after creation
- Nobody reads them
- Clutter the repo

**❌ Copy-Paste Without Understanding**
- Security vulnerabilities
- Performance issues
- Doesn't fit project architecture
- Technical debt

**✅ Use AI as a Pair Programming Partner**
- Discuss approach first
- Let AI draft implementation
- Review and refine together
- Learn from the suggestions

---

## CONFIGURATION STANDARDS

### .env.local.example Template
```bash
# Required for all projects

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_...  # Server-side only

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://example.com

# Optional: Consent Management
# NEXT_PUBLIC_ONETRUST_ID=...
# NEXT_PUBLIC_COOKIEBOT_ID=...

# Optional: Third-party services
# SENDGRID_API_KEY=...
# KLAVIYO_API_KEY=...
```

### .eslintrc.json Standard
```json
{
  "extends": [
    "next",
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "semi": ["error", "never"],
    "quotes": ["error", "single"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off"
  }
}
```

### .prettierrc Standard
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### tsconfig.json Standard
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.ts Standard
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Enable React strict mode
  reactStrictMode: true,

  // Redirect www to non-www (or vice versa)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.example.com' }],
        destination: 'https://example.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

---

## DEPLOYMENT STANDARDS

### Vercel Configuration

**All projects deploy to Vercel**

**vercel.json** (optional, only if needed):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Environment Variables**:
- Set in Vercel dashboard
- Separate for Production / Preview / Development
- Never commit `.env.local` to Git
- Always update `.env.local.example`

**Deployment Branches**:
- `main` → Production
- `staging` → Staging (if exists)
- All PRs → Preview deployments

### Pre-Deployment Checklist

Before merging to `main`:
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No console errors in browser
- [ ] Tested on mobile/tablet
- [ ] Analytics tracking verified (if changes)
- [ ] Linear issue updated

---

## REVISED IMPLEMENTATION PRIORITIES

### 🚨 Phase 0: CRITICAL SECURITY FIX (Week 1)

**Priority 0**: Sanity V3 → V4 Migration (SECURITY)
- **Why**: Glob vulnerability in V3 affecting 3 projects
- **Projects**: 177 Milk Street, Burlington, Planetary.co
- **Order**:
  1. 177 Milk Street (test migration process, most complex)
  2. Burlington (well-structured, good reference)
  3. Planetary.co (simplest, lowest priority)
- **Timeline**: Complete within 1-2 weeks
- **Reference**: Use Din Tai Fung as working example

```bash
# Migration Steps per Project
1. Create branch: deps/upgrade-sanity-v4
2. Update dependencies: npm install sanity@latest @sanity/client@latest
3. Update imports: createClient from 'next-sanity' instead of '@sanity/client'
4. Test thoroughly (build, CMS, frontend)
5. Deploy to staging
6. Verify all content types work
7. Deploy to production
```

### Phase 1: Documentation & Standards (Week 2) 🎯

**Priority 1**: Finalize Standards Document
- ✅ This document (PLANETARY_STANDARDS_REVISED.md)
- Review with Director of Technology
- Gather feedback from current contractors
- Publish to `planetary/.github` as `STANDARDS.md`

**Priority 2**: Setup Shared Config Repository
- Create `planetary/.github/configs/` structure
- Add shared ESLint, Prettier, TypeScript configs
- Add Playwright test config template
- Add GitHub Actions workflow templates
- Document usage in README

**Priority 3**: Update Each Project's CLAUDE.md
```markdown
# [Project Name]

## Quick Links
- Linear: [Board URL]
- Slack: #client-{project} (internal) / #shared-{project} (with client)
- GitHub: github.com/{org}/{repo}
- Staging: https://staging-url.vercel.app
- Production: https://example.com
- Sanity Studio: https://example.sanity.studio

## Standards
This project follows [Planetary Standards](https://github.com/planetary/.github/STANDARDS.md)

## Project-Specific Notes
[Any deviations or unique patterns for this project]
[Third-party integrations specific to this client]
[Known issues or workarounds]
```

### Phase 2: Cleanup & Standardization (Weeks 3-4)

**Priority 4**: Remove husky from All Projects
```bash
# For each project
npm uninstall husky lint-staged
rm -rf .husky
# Remove husky-related scripts from package.json
# Create PR: "chore: remove husky pre-commit hooks"
```

**Priority 5**: Add/Update `.env.local.example` Files
- Ensure all projects have complete examples
- Document all required environment variables
- Include comments explaining each variable

**Priority 6**: Implement Consent Management Standard
- Audit all projects for consent implementation
- Update to 177 Milk Street pattern where missing
- Test consent flow on staging

**Priority 7**: Add Critical Path Tests
- Create Playwright test suite per project
- Minimum: Homepage, navigation, forms
- Setup GitHub Actions workflow
- Document test coverage

### Phase 3: Optimization & Enhancement (Weeks 5-8)

**Priority 8**: Implement Caching Strategy
- Review current caching across projects
- Add `revalidate` configurations where appropriate
- Optimize Sanity client configurations
- Add cache headers for static assets

**Priority 9**: Add Dynamic Redirects from Sanity
- Create redirect schema in Sanity (if not exists)
- Implement dynamic redirect loading in next.config.ts
- Give clients ability to manage redirects via CMS

**Priority 10**: Standardize Component Structure (Gradual)
- No need to refactor all at once
- Apply to new components first
- Refactor existing during feature work
- Use blocks/elements/global/layouts/shared structure

### Phase 4: Continuous Improvement (Ongoing)

**Priority 11**: Contractor Onboarding Materials
- Create Linear onboarding template
- Record Loom walkthrough videos
- Setup shadowing program for first tickets

**Priority 12**: Gather Feedback & Iterate
- Monthly check-ins with contractors
- Quarterly review of standards
- Update documentation based on learnings

**Priority 13**: Performance Monitoring
- Setup Lighthouse CI on all projects
- Track Core Web Vitals via Google Search Console
- Monthly performance reports

---

## SHARED CONFIGURATION REPOSITORY

**Location**: `https://github.com/planetary/.github`

**What Goes Here**:
- Pull request template ✅ (already exists)
- ESLint shared config
- Prettier shared config
- TypeScript base config
- Playwright config template
- GitHub Actions workflows (test, deploy)
- Dependabot config
- Code of Conduct / Contributing guidelines

**How to Use in Projects**:
```json
// package.json
{
  "devDependencies": {
    "@planetary/eslint-config": "file:../.github/configs/eslint",
    "@planetary/prettier-config": "file:../.github/configs/prettier"
  }
}

// .eslintrc.json
{
  "extends": ["@planetary/eslint-config"]
}

// prettier.config.js
module.exports = require('@planetary/prettier-config')
```

**Benefits**:
- Single source of truth for all config
- Update once, apply everywhere
- Easier onboarding (contractors know where to look)
- Version control for standards evolution

**Repository Structure**:
```
planetary/.github/
├── PULL_REQUEST_TEMPLATE.md  ✅ (exists)
├── configs/
│   ├── eslint/
│   │   ├── next.json
│   │   └── package.json
│   ├── prettier/
│   │   ├── index.json
│   │   └── package.json
│   ├── typescript/
│   │   ├── next.json
│   │   ├── base.json
│   │   └── package.json
│   └── playwright/
│       └── playwright.config.ts
├── workflows/
│   ├── test.yml
│   └── deploy.yml
└── README.md
```

---

## QUESTIONS OR FEEDBACK?

**For Standards Questions**:
- Create issue in `planetary/.github` repo
- Tag @lead-engineer or @director-tech
- Discuss in #engineering Slack channel

**For Project-Specific Implementation**:
- Create Linear ticket in project board
- Reference this standards doc
- Tag appropriate team members

---

## CHANGELOG

### 2025-12-03 - Initial Draft
- Comprehensive analysis of 4 existing projects
- Standards created based on current best practices
- Prioritization based on security (Sanity V4) and business impact
- Feedback incorporated from initial review

---

**Document Status**: Draft awaiting approval
**Last Updated**: 2025-12-03
**Next Review**: After initial feedback
