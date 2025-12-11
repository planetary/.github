# Tooling Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Required Tools (All Projects)

### 1. ESLint + Prettier (Code Quality)
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

### 2. TypeScript (Type Safety)
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

### 3. Storybook (Component Documentation)
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

### 4. Sanity CLI (CMS Management)
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

---

## ❌ DO NOT USE (Removed from Standards)

### husky (Pre-commit Hooks) - REMOVED

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

---

## Optional Tools (Project-Specific)

### Testing
```bash
# Only add if client requires tests or complex logic
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Or for E2E
npm install -D playwright @playwright/test
```

### Animation Libraries
```bash
# For complex animations
npm install gsap framer-motion

# For simple transitions - use CSS/Tailwind
```

### State Management
```bash
# Only when needed (complex state across many components)
npm install zustand
```
