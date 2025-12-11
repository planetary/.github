# Project Structure Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Monorepo Layout

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

---

## Component Organization

### blocks/ - Major content sections
```
blocks/
├── Hero/
├── TextImageSplit/
├── CardGrid/
├── Newsletter/
└── Testimonials/
```

### elements/ - Atomic components
```
elements/
├── Button/
├── Card/
├── Input/
├── Modal/
└── Badge/
```

### global/ - Site-wide components
```
global/
├── Header/
├── Footer/
├── Navigation/
└── MobileMenu/
```

### layouts/ - Page templates
```
layouts/
├── DefaultLayout/
├── BlogLayout/
└── LandingLayout/
```

### shared/ - Utilities and helpers
```
shared/
├── Container/
├── Section/
├── Loader/
└── ErrorBoundary/
```
