import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectUser } from '../store/auth/authSelector';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';
import { selectTheme } from '../store/ui/uiSelector';
import { setTheme, toggleSidebar } from '../store/ui/uiSlice';

const Header: React.FC = () => {
    const { i18n } = useTranslation();
    const user = useSelector(selectUser);
    const currentTenant = useSelector(selectCurrentTenant);
    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200 dark:border-gray-800 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    {/* Burger Menu Button */}
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                        aria-label="Toggle Sidebar"
                    >
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {currentTenant && (
                        <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {currentTenant.name}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200 group relative overflow-hidden"
                        aria-label="Toggle Theme"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-all group-hover:rotate-180 duration-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {theme === 'dark' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            )}
                        </svg>
                    </button>

                    {/* Language Selector */}
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="px-4 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    >
                        <option value="en">English</option>
                        <option value="ur">اردو</option>
                    </select>

                    {/* User Menu */}
                    {user && (
                        <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="text-white text-sm font-bold">
                                    {user.fullName?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <span data-testid="user-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {user.fullName || 'User'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
