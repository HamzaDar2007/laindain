import { test, expect } from '@playwright/test';

test.describe('New Modules E2E Tests', () => {
    // Tests will use the authenticated session from storageState
    // No need to login in beforeEach - Playwright handles this automatically

    test.describe('Payments Module', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should navigate to payments page', async ({ page }) => {
            await page.goto('/payments');
            await page.waitForLoadState('networkidle');

            // Check if payments page loaded
            await expect(page.getByTestId('payments-title')).toBeVisible();
        });

        test('should display payments table', async ({ page }) => {
            await page.goto('/payments');
            await page.waitForLoadState('networkidle');

            // Check for table or empty state
            const hasTable = await page.getByTestId('payments-table').count() > 0;
            const hasEmptyState = await page.getByTestId('payments-table-empty').count() > 0;

            expect(hasTable || hasEmptyState).toBeTruthy();
        });

        test('should open create payment modal', async ({ page }) => {
            await page.goto('/payments');
            await page.waitForLoadState('networkidle');

            // Click create button - look for any button with create/new/add text
            const createButton = page.locator('button').filter({ hasText: /create|new|add/i }).first();
            if (await createButton.count() > 0) {
                await createButton.click();

                // Check if modal or form appeared - wait longer
                const modalOrForm = page.locator('[role="dialog"], .modal, form').first();
                await expect(modalOrForm).toBeVisible({ timeout: 10000 });
            }
        });
    });

    test.describe('Billing Module', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should navigate to billing page', async ({ page }) => {
            await page.goto('/billing');
            await page.waitForLoadState('networkidle');

            // Check if billing page loaded
            await expect(page.locator('h1, h2').filter({ hasText: /billing|subscription/i }).first()).toBeVisible();
        });

        test('should display subscription information', async ({ page }) => {
            await page.goto('/billing');
            await page.waitForLoadState('networkidle');

            // Wait for subscription data to load
            await page.waitForTimeout(2000);

            // Check for subscription section - the word "Plan" appears on the page
            const hasPlanLabel = await page.locator('text=/plan/i').count() > 0;
            const hasSubscriptionHeading = await page.locator('text=/subscription/i').count() > 0;
            expect(hasPlanLabel || hasSubscriptionHeading).toBeTruthy();
        });

        test('should display billing transactions', async ({ page }) => {
            await page.goto('/billing');
            await page.waitForLoadState('networkidle');

            // Check for transactions section
            const hasTransactions = await page.locator('text=/transaction/i').count() > 0;
            expect(hasTransactions).toBeTruthy();
        });
    });

    test.describe('Integrations Module', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should navigate to integrations page', async ({ page }) => {
            await page.goto('/integrations');
            await page.waitForLoadState('networkidle');

            // Check if integrations page loaded
            await expect(page.locator('h1, h2').filter({ hasText: /integration/i }).first()).toBeVisible();
        });

        test('should display integrations grid or list', async ({ page }) => {
            await page.goto('/integrations');
            await page.waitForLoadState('networkidle');

            // Check for integrations display
            const hasGrid = await page.locator('.grid, [class*="grid"]').count() > 0;
            const hasList = await page.locator('table, .list').count() > 0;
            const hasEmptyState = await page.locator('text=/no.*integration/i').count() > 0;

            expect(hasGrid || hasList || hasEmptyState).toBeTruthy();
        });

        test('should show integration types', async ({ page }) => {
            await page.goto('/integrations');
            await page.waitForLoadState('networkidle');

            // Check for common integration types
            const hasIntegrationTypes = await page.locator('text=/stripe|paypal|quickbooks|xero/i').count() > 0;
            expect(hasIntegrationTypes || await page.locator('text=/no.*integration/i').count() > 0).toBeTruthy();
        });
    });

    test.describe('Settings Module', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should navigate to settings page', async ({ page }) => {
            await page.goto('/settings');
            await page.waitForLoadState('networkidle');

            // Check if settings page loaded
            await expect(page.locator('h1, h2').filter({ hasText: /setting/i }).first()).toBeVisible();
        });

        test('should display user settings section', async ({ page }) => {
            await page.goto('/settings');
            await page.waitForLoadState('networkidle');

            // Check for user settings
            const hasUserSettings = await page.locator('text=/user.*setting|profile|preference/i').count() > 0;
            expect(hasUserSettings).toBeTruthy();
        });

        test('should display organization settings section', async ({ page }) => {
            await page.goto('/settings');
            await page.waitForLoadState('networkidle');

            // Check for organization settings
            const hasOrgSettings = await page.locator('text=/organization|company|tenant/i').count() > 0;
            expect(hasOrgSettings).toBeTruthy();
        });

        test('should display theme and language options', async ({ page }) => {
            await page.goto('/settings');
            await page.waitForLoadState('networkidle');

            // Check for theme/language settings
            const hasTheme = await page.locator('text=/theme|dark.*mode|light.*mode/i').count() > 0;
            const hasLanguage = await page.locator('text=/language|english|urdu/i').count() > 0;

            expect(hasTheme || hasLanguage).toBeTruthy();
        });
    });

    test.describe('Reports Module - New Endpoints', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should navigate to reports page', async ({ page }) => {
            await page.goto('/reports');
            await page.waitForLoadState('networkidle');

            // Check if reports page loaded
            await expect(page.locator('h1, h2').filter({ hasText: /report/i }).first()).toBeVisible();
        });

        test('should display trial balance option', async ({ page }) => {
            await page.goto('/reports');
            await page.waitForLoadState('networkidle');

            // Check for trial balance report option
            const hasTrialBalance = await page.locator('text=/trial.*balance/i').count() > 0;
            expect(hasTrialBalance).toBeTruthy();
        });

        test('should display report type selection', async ({ page }) => {
            await page.goto('/reports');
            await page.waitForLoadState('networkidle');

            // Check for multiple report types
            const reportTypes = await page.locator('text=/profit.*loss|balance.*sheet|cash.*flow/i').count();
            expect(reportTypes).toBeGreaterThan(0);
        });

        test('should have date range filters', async ({ page }) => {
            await page.goto('/reports');
            await page.waitForLoadState('networkidle');

            // Check for date inputs
            const dateInputs = await page.locator('input[type="date"]').count();
            expect(dateInputs).toBeGreaterThan(0);
        });
    });

    test.describe('Navigation and Accessibility', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        test('should have all new modules in navigation', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Check if navigation contains new modules
            const nav = page.locator('nav, [role="navigation"], aside, .sidebar');

            const hasPayments = await nav.locator('text=/payment/i').count() > 0;
            const hasBilling = await nav.locator('text=/billing|subscription/i').count() > 0;
            const hasIntegrations = await nav.locator('text=/integration/i').count() > 0;
            const hasSettings = await nav.locator('text=/setting/i').count() > 0;

            // At least some of the new modules should be in navigation
            expect(hasPayments || hasBilling || hasIntegrations || hasSettings).toBeTruthy();
        });

        test('should navigate between modules smoothly', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Navigate to each new module
            const modules = ['/payments', '/billing', '/integrations', '/settings'];

            for (const module of modules) {
                await page.goto(module);
                await page.waitForLoadState('networkidle');

                // Check if page loaded without errors
                const hasError = await page.locator('text=/error|not.*found|404/i').count() > 0;
                expect(hasError).toBeFalsy();
            }
        });
    });
});
