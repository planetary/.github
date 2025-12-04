import { test, expect } from '@playwright/test'

/**
 * Example critical path tests for Planetary projects
 * Copy this file to your project's tests/ directory and customize for your pages
 */

test.describe('Critical Pages', () => {
  const pages = [
    { url: '/', title: 'Home' },
    { url: '/about', title: 'About' },
    { url: '/contact', title: 'Contact' },
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
