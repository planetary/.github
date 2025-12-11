# Planetary Code Standards

Organization-wide templates, configurations, and guidelines for Planetary repositories.

## What's Included

| File/Directory | Purpose |
|------|---------|
| [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) | PR template applied to all repos |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Author and reviewer guidelines |
| [`STANDARDS.md`](STANDARDS.md) | Complete agency standards documentation |
| [`configs/`](configs/) | Shared configuration files for all projects |

## Shared Configurations

The `configs/` directory contains standardized configuration files that can be used across all Planetary projects:

### ESLint

```bash
# Install dependencies
npm install -D eslint eslint-config-next eslint-config-prettier prettier

# For full Next.js config with Tailwind support:
npm install -D @typescript-eslint/eslint-plugin eslint-plugin-unused-imports eslint-plugin-tailwindcss

# Use in your project
# .eslintrc.json
{
  "extends": ["./node_modules/@planetary/eslint-config/next.js"]
}
```

### Prettier

```bash
# Install dependency
npm install -D prettier

# Use in your project
# .prettierrc or prettier.config.js
module.exports = require('@planetary/prettier-config')

# Or copy configs/prettier/index.json to your project root as .prettierrc
```

### TypeScript

```bash
# Use in your project
# tsconfig.json
{
  "extends": "@planetary/typescript-config/next.json",
  "compilerOptions": {
    // Your project-specific overrides
  }
}

# Or copy configs/typescript/next.json to your project and customize
```

### Tailwind CSS

```bash
# Install dependencies
npm install -D tailwindcss @tailwindcss/typography

# Use in your project
# tailwind.config.js
module.exports = {
  presets: [require('@planetary/tailwind-config')],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Your brand-specific colors and customizations
    }
  }
}
```

### Playwright

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Copy the example config and test files
cp configs/playwright/config.ts ./playwright.config.ts
cp configs/playwright/critical-paths.spec.ts ./tests/critical-paths.spec.ts

# Customize for your project's pages and routes
```

### Gitignore

```bash
# Copy the Next.js + Sanity gitignore template
cp configs/gitignore/nextjs-sanity.gitignore ./.gitignore

# Includes: dependencies, build outputs, env files, IDE configs, and AI agent files
```

## Installation Options

### Option 1: Reference from .github repo (Recommended for local development)

```json
// package.json
{
  "devDependencies": {
    "@planetary/eslint-config": "file:../.github/configs/eslint",
    "@planetary/prettier-config": "file:../.github/configs/prettier",
    "@planetary/typescript-config": "file:../.github/configs/typescript",
    "@planetary/tailwind-config": "file:../.github/configs/tailwind"
  }
}
```

### Option 2: Copy configs directly (Alternative)

Simply copy the relevant config files from `configs/` to your project and customize as needed.

## How It Works

This is the organization-level `.github` repository. GitHub automatically applies these templates to all Planetary repositories that don't have their own.

### Overriding for a Specific Repo

Any repository can override these templates by adding its own `.github/PULL_REQUEST_TEMPLATE.md`.

## Usage in New Projects

When starting a new Planetary project:

1. Review [STANDARDS.md](STANDARDS.md) for complete agency standards
2. Install shared configs using Option 1 or 2 above
3. Copy Playwright config and customize for your routes
4. Follow the component structure and coding standards
5. Implement consent management and analytics per the standards

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on updating these shared resources.

## Questions?

For standards questions or implementation help:
- Create an issue in this repo
- Ask in #engineering Slack channel
- Tag @lead-engineer or @director-tech
