# Testing Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Critical Path Testing (Required for All Projects)

### What to Test
- All pages load without errors (200 status codes)
- All critical routes are accessible
- All API endpoints return expected responses
- Forms submit successfully
- Navigation works across pages

### Test Framework
Playwright (E2E) or Vitest (Unit/Integration)

---

## Playwright E2E Tests (Recommended)

### Setup
```bash
npm install -D @playwright/test
npx playwright install
```

### Example: Critical Path Tests
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

### Run Tests
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

---

## Shared Test Config

Store in `planetary/.github`

### playwright.config.ts Template
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

---

## CI/CD Integration

### GitHub Actions Workflow
Store in `planetary/.github/workflows`

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

---

## Test Coverage Goals

### Minimum Coverage (All Projects)
- ✅ Homepage loads
- ✅ All main navigation pages load
- ✅ Contact/lead forms submit
- ✅ API health check endpoint
- ✅ Mobile responsive (at least one breakpoint)

### Ideal Coverage (Mature Projects)
- All public pages (generated from sitemap)
- All form submissions
- All API endpoints
- Authentication flows (login, logout, signup)
- Checkout/purchase flows (e-commerce)
- Search functionality
