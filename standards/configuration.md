# Configuration Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## .env.local.example Template

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

---

## .eslintrc.json Standard

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

---

## .prettierrc Standard

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

---

## tsconfig.json Standard

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

---

## next.config.ts Standard

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

## Environment Variables

### Naming Convention
- `NEXT_PUBLIC_*` - Exposed to browser (safe for public)
- No prefix - Server-side only (secrets, API keys)

### Required Variables (All Projects)
| Variable | Description | Public |
|----------|-------------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Yes |
| `SANITY_API_TOKEN` | Sanity API token | No |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | Yes |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | Yes |
