import { test, expect } from '@playwright/test';

test('Debug Voucher Types Modal HTML', async ({ browser }) => {
    // Try to reuse existing auth if valid
    const context = await browser.newContext({ storageState: 'playwright/.auth/manual_user.json' });
    const page = await context.newPage();

    try {
        await page.goto('/voucher-types', { timeout: 60000 });
        await page.waitForLoadState('networkidle');

        // Open modal
        await page.click('button:has-text("Create")');
        await expect(page.locator('form')).toBeVisible({ timeout: 10000 });

        console.log('--- ALL SELECTS ---');
        const selects = page.locator('select');
        const count = await selects.count();
        console.log(`Found ${count} selects`);

        for (let i = 0; i < count; i++) {
            console.log(`Select ${i}:`, await selects.nth(i).evaluate(el => el.outerHTML));
        }

        console.log('--- FORM HTML ---');
        console.log(await page.locator('form').innerHTML());

    } catch (e) {
        console.error('Debug test failed:', e);
        // Take screenshot
        await page.screenshot({ path: 'debug-voucher-fail.png' });
    }
});
