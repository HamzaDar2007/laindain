import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    setup.setTimeout(120000); // Increased to 2 minutes
    // Generate unique email
    const timestamp = Date.now();
    const email = `e2e_user_${timestamp}@example.com`;
    const password = 'Password123!';

    // 1. Register
    console.log('Navigating to /register...');
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    console.log('Filling registration form...');
    await expect(page.locator('input[name="firstName"]')).toBeVisible({ timeout: 15000 });
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.selectOption('select[name="countryCode"]', 'AE');

    await page.click('button[type="submit"]');

    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 20000 });

    // 2. Login
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Check for login error
    const errorElement = page.locator('[class*="border-danger"]');
    try {
        await expect(errorElement).toBeVisible({ timeout: 2000 });
        const errorText = await errorElement.innerText();
        console.error('Login failed with error:', errorText);
        throw new Error(`Login failed: ${errorText}`);
    } catch (e) {
        // Error element not visible, continue
    }

    // Wait for navigation to dashboard
    await page.waitForURL('/', { timeout: 20000 });
    await page.waitForLoadState('networkidle');

    // Verify we are logged in
    const dashboardElement = page.locator('h1, h2, [class*="dashboard"]').first();
    await expect(dashboardElement).toBeVisible({ timeout: 20000 });

    // Wait for user info to be in the DOM (ensures Redux state is updated)
    await expect(page.getByTestId('user-name')).toHaveText('E2E Test', { timeout: 20000 });

    // 3. Save storage state
    await page.context().storageState({ path: authFile });
});
