import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';
import { selectAllAccounts, selectAccountsLoading } from '../store/accounts/accountsSelector';
import { selectAllJournals, selectJournalsLoading } from '../store/journal/journalSelector';
import { fetchAccountsAsync } from '../store/accounts/accountsSlice';
import { fetchJournalsAsync } from '../store/journal/journalSlice';
import { AccountType } from '../store/accounts/accountsTypes';
import PageHeader from '../components/common/PageHeader';
import Skeleton from '../components/common/Skeleton';
import Table from '../components/common/Table';
import EmptyState from '../components/common/EmptyState';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, Variants } from 'framer-motion';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const currentTenant = useSelector(selectCurrentTenant);
    const accounts = useSelector(selectAllAccounts);
    const journals = useSelector(selectAllJournals);
    const accountsLoading = useSelector(selectAccountsLoading);
    const journalsLoading = useSelector(selectJournalsLoading);

    const isLoading = accountsLoading || journalsLoading;

    useEffect(() => {
        if (currentTenant) {
            dispatch(fetchAccountsAsync() as any);
            dispatch(fetchJournalsAsync() as any);
        }
    }, [currentTenant, dispatch]);

    const stats = [
        {
            title: t('nav.accounts'),
            value: accounts.length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            ),
            color: 'primary',
            gradient: 'from-primary-500 to-primary-600',
            light: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
        },
        {
            title: t('nav.journal'),
            value: journals.length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            ),
            color: 'success',
            gradient: 'from-success-500 to-success-600',
            light: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
        },
        {
            title: t('journal.statuses.posted'),
            value: journals.filter((j) => j.status === 'posted').length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            color: 'warning',
            gradient: 'from-warning-500 to-warning-600',
            light: 'bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400',
        },
        {
            title: t('journal.statuses.draft'),
            value: journals.filter((j) => j.status === 'draft').length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            ),
            color: 'secondary',
            gradient: 'from-gray-500 to-gray-600',
            light: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400',
        },
    ];

    // Mock data for Recharts
    const revenueData = [
        { name: 'Jan', revenue: 4000, expenses: 2400 },
        { name: 'Feb', revenue: 3000, expenses: 1398 },
        { name: 'Mar', revenue: 2000, expenses: 9800 },
        { name: 'Apr', revenue: 2780, expenses: 3908 },
        { name: 'May', revenue: 1890, expenses: 4800 },
        { name: 'Jun', revenue: 2390, expenses: 3800 },
        { name: 'Jul', revenue: 3490, expenses: 4300 },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <PageHeader
                title={t('nav.dashboard')}
                description={`Welcome back! Overview for ${currentTenant ? currentTenant.name : 'your business'}.`}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="card p-0 overflow-hidden">
                            <div className="p-6 space-y-3">
                                <Skeleton width="40%" height="1.25rem" />
                                <Skeleton width="60%" height="2rem" />
                            </div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="card group relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200">{stat.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.light} transition-colors duration-200`}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {stat.icon}
                                    </svg>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                        </motion.div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart Section */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue vs Expenses</h3>
                        <div className="flex gap-2">
                            <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">2024</div>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Account List */}
                <motion.div variants={itemVariants} className="card p-0 overflow-hidden flex flex-col h-full">
                    <div className="p-6 pb-2 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                            {t('nav.accounts')}
                        </h2>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">View All</button>
                    </div>
                    <div className="p-4 flex-1">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                            </div>
                        ) : accounts.length > 0 ? (
                            <Table
                                data={accounts.slice(0, 5)}
                                columns={[
                                    { key: 'name', header: 'Name', render: (a: any) => <span className="font-medium text-gray-900 dark:text-white">{a.name}</span> },
                                    { key: 'code', header: 'Code', render: (a: any) => <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{a.code}</span> },
                                    { key: 'type', header: 'Type', render: (a: any) => <span className={`badge badge-${a.type === AccountType.ASSET ? 'success' : 'info'}`}>{a.type}</span> }
                                ]}
                                loading={false}
                                emptyMessage="No accounts found"
                                className="shadow-none"
                            />
                        ) : (
                            <EmptyState
                                title="No Accounts Yet"
                                description="Start by creating your first account to track finances."
                                actionLabel="Create Account"
                                onAction={() => { }}
                            />
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="card p-0 overflow-hidden">
                <div className="p-6 pb-2 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-warning-500 rounded-full"></span>
                        {t('nav.journal')}
                    </h2>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">View All</button>
                </div>
                <div className="p-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                        </div>
                    ) : journals.length > 0 ? (
                        <Table
                            data={journals.slice(0, 5)}
                            columns={[
                                { key: 'date', header: 'Date', render: (j: any) => new Date(j.date).toLocaleDateString() },
                                { key: 'description', header: 'Description', render: (j: any) => <span className="font-medium truncate max-w-[200px] block">{j.description}</span> },
                                { key: 'amount', header: 'Amount', render: (j: any) => <span className="font-mono">{Number(j.totalAmount).toFixed(2)}</span> },
                                { key: 'status', header: 'Status', render: (j: any) => <span className={`badge badge-${j.status === 'posted' ? 'success' : 'warning'}`}>{j.status}</span> }
                            ]}
                            loading={false}
                            emptyMessage="No recent journals"
                            className="shadow-none"
                        />
                    ) : (
                        <EmptyState
                            title="No Journal Entries"
                            description="Record your first financial transaction."
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
