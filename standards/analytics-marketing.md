# Analytics & Marketing Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Analytics Pipeline

**Standard Approach**: Google Tag Manager (GTM) as the single source of truth

### Rule #1: All Third-Party Scripts via GTM
```
✅ DO: Add scripts through GTM interface
❌ DON'T: Add <script> tags directly to codebase
```

**Why**:
- Marketing teams can update without deployments
- Easier to manage across environments (dev/staging/prod)
- Better performance (script loading control)
- Audit trail of changes

### Implementation
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

### What Goes in GTM
- Google Analytics 4
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar
- Klaviyo
- Any marketing/tracking pixels
- Consent management scripts

### What Stays in Code
- Next.js Script component for critical functionality
- Essential services (e.g., Shopify checkout if needed for functionality)

---

## Consent Management

**Standard**: Implement Google Consent Mode v2 (required for GDPR/CCPA)

**Reference Implementation**: See 177 Milk Street `/website/app/layout.tsx` for production-tested pattern

**Consent Platform**: Client choice (OneTrust, Cookiebot, Osano, etc.)

### Critical Script Loading Order
1. **Consent Mode Initialization** (`beforeInteractive`) - Set default consent to "denied"
2. **Google Tag Manager** - Loads with consent mode awareness
3. **Consent Platform** (OneTrust, Cookiebot, etc.) - Updates consent when user accepts

### Complete Implementation (Recommended Pattern)

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
          MUST load before GTM to set default consent states to 'denied'.
        */}
        {GTM_ID && (
          <Script
            id="gtm-consent-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

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

        {/* STEP 2: GOOGLE TAG MANAGER */}
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

        {/* STEP 3: CONSENT PLATFORM (Example: OneTrust) */}
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
                    if (typeof OnetrustActiveGroups !== 'undefined' &&
                        OnetrustActiveGroups.indexOf('C0002') !== -1) {
                      if (typeof gtag === 'function') {
                        gtag('consent', 'update', {
                          'analytics_storage': 'granted'
                        });
                      }
                    }

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

### For Other Consent Platforms

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

### Testing Consent Implementation

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

---

## SEO Standards

### Required on Every Page
- Dynamic metadata via `generateMetadata()`
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Proper heading hierarchy (h1 → h2 → h3)

### Site-wide Requirements
- Sitemap.xml generation
- robots.txt configuration
- Schema.org structured data (LD+JSON)

### Implementation
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

---

## Structured Data (LD+JSON)

### Required Schemas
- Organization (site-wide)
- WebSite (site-wide)
- BreadcrumbList (navigation)
- Page-specific (Article, Product, Event, etc.)

### Implementation
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
