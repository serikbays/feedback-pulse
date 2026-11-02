const { test, expect } = require('@playwright/test');

test.describe('Feedback E2E Tests', () => {
  test('Page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('body')).toBeVisible();
  });
});
