import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/auth/authSelector';
import { selectCurrentTenant } from '../store/tenants/tenantsSelector';
import { logout, updateProfileAsync } from '../store/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Settings: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const currentTenant = useSelector(selectCurrentTenant);

    const [profileData, setProfileData] = React.useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });

    React.useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.id) {
            await dispatch(updateProfileAsync({ id: user.id, data: profileData }) as any);
            alert('Profile updated successfully');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('nav.settings')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <Input
                            label={t('auth.fullName')}
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            required
                        />
                        <Input
                            label={t('auth.email')}
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            required
                        />
                        <div className="pt-2">
                            <Button type="submit">
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Organization</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                            <p className="font-medium text-slate-900 dark:text-white">Language</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred language</p>
                        </div>
                        <span className="badge badge-info">English / اردو</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Customize the appearance</p>
                        </div>
                        <span className="badge badge-info">Light</span>
                    </div>
                </div>
            </div>

            <div className="card border-red-100 dark:border-red-900/20">
                <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-500">Session</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Sign Out</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Sign out across all devices</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
