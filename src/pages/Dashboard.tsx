import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';
import { selectAllAccounts } from '../store/accounts/accountsSelector';
import { selectAllJournals } from '../store/journal/journalSelector';
import { fetchAccountsAsync } from '../store/accounts/accountsSlice';
import { fetchJournalsAsync } from '../store/journal/journalSlice';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    const currentTenant = useSelector(selectCurrentTenant);
    const accounts = useSelector(selectAllAccounts);
    const journals = useSelector(selectAllJournals);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            ),
            color: 'primary',
        },
        {
            title: t('nav.journal'),
            value: journals.length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            ),
            color: 'success',
        },
        {
            title: t('journal.statuses.posted'),
            value: journals.filter((j) => j.status === 'posted').length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            color: 'warning',
        },
        {
            title: t('journal.statuses.draft'),
            value: journals.filter((j) => j.status === 'draft').length,
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            ),
            color: 'secondary',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('nav.dashboard')}</h1>
                <p className="mt-2 text-gray-600">
                    {currentTenant ? `${t('tenant.select')}: ${currentTenant.name}` : t('tenant.noTenant')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                                <svg className={`w-8 h-8 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {stat.icon}
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nav.accounts')}</h2>
                    <div className="space-y-2">
                        {accounts.slice(0, 5).map((account) => (
                            <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">{account.name}</p>
                                    <p className="text-sm text-gray-500">{account.code}</p>
                                </div>
                                <span className={`badge badge-${account.type === 'asset' ? 'success' : 'info'}`}>
                                    {account.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nav.journal')}</h2>
                    <div className="space-y-2">
                        {journals.slice(0, 5).map((journal) => (
                            <div key={journal.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">{journal.description}</p>
                                    <p className="text-sm text-gray-500">{journal.entryNumber}</p>
                                </div>
                                <span className={`badge badge-${journal.status === 'posted' ? 'success' : 'warning'}`}>
                                    {journal.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
