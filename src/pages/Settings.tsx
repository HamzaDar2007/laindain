import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSelector';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';

const Settings: React.FC = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const currentTenant = useSelector(selectCurrentTenant);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('nav.settings')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.fullName')}
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={user?.fullName || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                className="input"
                                value={user?.email || ''}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Organization</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('tenant.name')}
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={currentTenant?.name || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('tenant.description')}
                            </label>
                            <textarea
                                className="input"
                                rows={3}
                                value={currentTenant?.description || ''}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <p className="font-medium text-gray-900">Language</p>
                            <p className="text-sm text-gray-500">Choose your preferred language</p>
                        </div>
                        <span className="badge badge-info">English / اردو</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <p className="font-medium text-gray-900">Theme</p>
                            <p className="text-sm text-gray-500">Customize the appearance</p>
                        </div>
                        <span className="badge badge-info">Light</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
