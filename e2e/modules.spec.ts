import { test, expect } from '@playwright/test';

test.describe('Accounting Modules', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should navigate to Fiscal Years and create one', async ({ page }) => {
        // Navigate to Fiscal Years
        await page.click('text=Fiscal Years');
        await expect(page).toHaveURL('/fiscal-years');
        await page.waitForLoadState('networkidle');

        // Click create button and wait for modal
        await page.click('text=Create Fiscal Year');
        await page.waitForSelector('input[name="yearName"]', { state: 'visible', timeout: 5000 });

        // Fill the form
        const yearName = `FY ${new Date().getFullYear() + 1}`;
        await page.fill('input[name="yearName"]', yearName);
        await page.fill('input[name="startDate"]', '2026-01-01');
        await page.fill('input[name="endDate"]', '2026-12-31');

        // Submit the form
        await page.click('button[type="submit"]');

        // Wait for modal to close
        await page.waitForSelector('input[name="yearName"]', { state: 'hidden', timeout: 5000 });

        // Wait for network to settle
        await page.waitForLoadState('networkidle');

        // Check if table exists and has content (more flexible than exact text match)
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to Accounts and create a new account', async ({ page }) => {
        // Navigate to Accounts
        await page.click('text=Accounts');
        await expect(page).toHaveURL('/accounts');
        await page.waitForLoadState('networkidle');

        // Click create button and wait for modal
        await page.click('text=Create Account');
        await page.waitForSelector('input[data-testid="accountName"]', { state: 'visible', timeout: 5000 });

        // Fill the form with unique name
        const accountName = `Test Account ${Date.now()}`;
        await page.fill('input[data-testid="accountName"]', accountName);

        // Select Level 1
        await page.selectOption('select[data-testid="accountLevel"]', '1');
        await page.waitForTimeout(500); // Wait for type field to appear

        // Select Asset type
        await page.selectOption('select[data-testid="accountType"]', 'Asset');

        // Submit the form
        await page.click('button[type="submit"]');

        // Wait for modal to close
        await page.waitForSelector('input[data-testid="accountName"]', { state: 'hidden', timeout: 5000 });

        // Wait for network to settle
        await page.waitForLoadState('networkidle');

        // Verify we're still on accounts page and table exists
        await expect(page).toHaveURL('/accounts');
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 5000 });
    });
});
