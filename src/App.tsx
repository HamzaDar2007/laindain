import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser } from './store/auth/authSelector';
import { selectDirection } from './store/language/languageSelector';
import { selectTheme } from './store/ui/uiSelector';
import { fetchTenantsAsync } from './store/tenants/tenantsSlice';

// Layout Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import JournalEntries from './pages/JournalEntries';
import VoucherTypes from './pages/VoucherTypes';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import TenantUsers from './pages/TenantUsers';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Integrations from './pages/Integrations';
import FiscalYears from './pages/FiscalYears';
import AuditLogs from './pages/AuditLogs';
import Roles from './pages/Roles';
import Constants from './pages/Constants';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main Layout Component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
    const { i18n } = useTranslation();
    const direction = useSelector(selectDirection);
    const theme = useSelector(selectTheme);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    // Set document direction based on language
    useEffect(() => {
        document.documentElement.dir = direction;
        document.documentElement.lang = direction === 'rtl' ? 'ur' : 'en';
        i18n.changeLanguage(direction === 'rtl' ? 'ur' : 'en');
    }, [direction, i18n]);

    // Apply theme class to document element
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Fetch tenants only when authenticated and is super_admin
    useEffect(() => {
        if (isAuthenticated && user?.roles?.includes('super_admin')) {
            dispatch(fetchTenantsAsync() as any);
        }
    }, [isAuthenticated, user, dispatch]);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/accounts"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Accounts />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/journal"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <JournalEntries />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/voucher-types"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <VoucherTypes />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/invoices"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Invoices />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Payments />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Reports />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <TenantUsers />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Settings />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/billing"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Billing />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/integrations"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Integrations />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/fiscal-years"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <FiscalYears />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/audit-logs"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <AuditLogs />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roles"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Roles />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/constants"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Constants />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
