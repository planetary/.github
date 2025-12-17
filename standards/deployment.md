# Deployment Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Vercel Configuration

**All projects deploy to Vercel**

### vercel.json (optional, only if needed)
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

### Environment Variables
- Set in Vercel dashboard
- Separate for Production / Preview / Development
- Never commit `.env.local` to Git
- Always update `.env.local.example`

### Deployment Branches
- `main` → Production
- `staging` → Staging (if exists)
- All PRs → Preview deployments

---

## Pre-Deployment Checklist

Before merging to `main`:

- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No console errors in browser
- [ ] Tested on mobile/tablet
- [ ] Analytics tracking verified (if changes)
- [ ] Related issue updated

---

## Shared Configuration Repository

**Location**: `https://github.com/planetary/.github`

### What Goes Here
- Pull request template ✅ (already exists)
- ESLint shared config
- Prettier shared config
- TypeScript base config
- Playwright config template
- GitHub Actions workflows (test, deploy)
- Dependabot config
- Code of Conduct / Contributing guidelines

### How to Use in Projects
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

### Benefits
- Single source of truth for all config
- Update once, apply everywhere
- Easier onboarding (contractors know where to look)
- Version control for standards evolution

### Repository Structure
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
