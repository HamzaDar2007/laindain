import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import languageReducer from './language/languageSlice';
import uiReducer from './ui/uiSlice';
import tenantsReducer from './tenants/tenantsSlice';
import accountsReducer from './accounts/accountsSlice';
import journalReducer from './journal/journalSlice';
import voucherTypesReducer from './voucher-types/voucherTypesSlice';
import invoicesReducer from './invoices/invoicesSlice';
import paymentsReducer from './payments/paymentsSlice';
import reportsReducer from './reports/reportsSlice';
import tenantUsersReducer from './tenant-users/tenantUsersSlice';
import settingsReducer from './settings/settingsSlice';
import billingReducer from './billing/billingSlice';
import integrationsReducer from './integrations/integrationsSlice';
import fiscalYearsReducer from './fiscal-years/fiscalYearsSlice';
import auditLogsReducer from './audit-logs/auditLogsSlice';
import rolesReducer from './roles/rolesSlice';
import constantsReducer from './constants/constantsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        language: languageReducer,
        ui: uiReducer,
        tenants: tenantsReducer,
        accounts: accountsReducer,
        journal: journalReducer,
        voucherTypes: voucherTypesReducer,
        invoices: invoicesReducer,
        payments: paymentsReducer,
        reports: reportsReducer,
        tenantUsers: tenantUsersReducer,
        settings: settingsReducer,
        billing: billingReducer,
        integrations: integrationsReducer,
        fiscalYears: fiscalYearsReducer,
        auditLogs: auditLogsReducer,
        roles: rolesReducer,
        constants: constantsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
