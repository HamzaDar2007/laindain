import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../store/auth/authSelector';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';
import { logout } from '../store/auth/authSlice';
import { selectTheme } from '../store/ui/uiSelector';
import { setTheme } from '../store/ui/uiSlice';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const currentTenant = useSelector(selectCurrentTenant);
    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-10 glass border-b border-gray-200 dark:border-gray-700/50 px-6 py-4 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-primary-600">
                        {t('app.title')}
                    </h1>
                    {currentTenant && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full border border-primary-100 dark:border-primary-800 transition-colors">
                            <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                {currentTenant.name}
                            </span>
                        </div>
                    )}
                </div>


                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all active:scale-95"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                    <LanguageSwitcher />

                    {user && (
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
                            >
                                {t('auth.logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
