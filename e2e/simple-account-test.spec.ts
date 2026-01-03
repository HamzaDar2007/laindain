import { test, expect } from '@playwright/test';

// Simple test to verify basic account creation works
test.describe('Account Creation Test', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('Create single L1 account', async ({ page }) => {
        await page.goto('/accounts');
        await page.waitForLoadState('networkidle');

        // Click Create Account button
        await page.click('text=Create Account');

        // Wait for modal
        await page.waitForSelector('h3:text("Create Account")', { state: 'visible', timeout: 10000 });

        // Fill name
        await page.locator('input[name="name"]').fill('Test Asset Account');

        // The Level select should default to 1, and Type select should be visible
        // Type is the 2nd select (index 1)
        const selects = await page.locator('select').all();
        console.log(`Found ${selects.length} select elements`);

        // Select Asset type (first option)
        await page.locator('select').nth(1).selectOption({ index: 0 });

        // Submit
        await page.locator('button[type="submit"]').click();

        // Verify account appears
        await expect(page.locator('text=Test Asset Account')).toBeVisible({ timeout: 10000 });
    });
});
