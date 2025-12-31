import { test, expect } from '@playwright/test';

// Store test user data in a file-scoped variable so both tests can access it
const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: '',
    password: 'Password123!',
    countryCode: 'AE'
};

// Use .serial to ensure tests run in order
test.describe.serial('Authentication Flow', () => {
    test.beforeAll(() => {
        // Generate unique email for this test run
        const timestamp = Date.now();
        testUser.email = `testuser_${timestamp}@example.com`;
    });

    test('should register a new user', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        await page.fill('input[name="firstName"]', testUser.firstName);
        await page.fill('input[name="lastName"]', testUser.lastName);
        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', testUser.password);
        await page.fill('input[name="confirmPassword"]', testUser.password);

        // Select country
        await page.selectOption('select[name="countryCode"]', testUser.countryCode);

        await page.click('button[type="submit"]');

        // Should redirect to login - increase timeout for slower responses
        await expect(page).toHaveURL('/login', { timeout: 20000 });
    });

    test('should login with the registered user', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', testUser.password);

        await page.click('button[type="submit"]');

        // Wait for navigation to complete
        await page.waitForURL('/', { timeout: 15000 });

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check if we're on the dashboard by looking for any dashboard element
        const dashboardElement = page.locator('h1, h2, [class*="dashboard"]').first();
        await expect(dashboardElement).toBeVisible({ timeout: 10000 });
    });
});
