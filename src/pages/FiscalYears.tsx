import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchFiscalYearsAsync, createFiscalYearAsync, closeFiscalYearAsync, openFiscalYearAsync } from '../store/fiscal-years/fiscalYearsSlice';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const FiscalYears: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { years, isLoading } = useSelector((state: RootState) => state.fiscalYears);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        yearName: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        dispatch(fetchFiscalYearsAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createFiscalYearAsync(formData) as any);
        setShowModal(false);
        setFormData({ yearName: '', startDate: '', endDate: '' });
    };

    const handleCloseYear = async (id: string) => {
        if (window.confirm(t('common.confirmClose'))) {
            await dispatch(closeFiscalYearAsync(id) as any);
        }
    };

    const handleOpenYear = async (id: string) => {
        if (window.confirm(t('common.confirmOpen'))) {
            await dispatch(openFiscalYearAsync(id) as any);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('fiscalYears.title')}</h1>
                <Button onClick={() => setShowModal(true)}>
                    {t('fiscalYears.create')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('fiscalYears.name')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('fiscalYears.startDate')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('fiscalYears.endDate')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {years.map((year) => (
                                <tr key={year.id}>
                                    <td className="font-medium">{year.yearName}</td>
                                    <td>{new Date(year.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(year.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${!year.isClosed ? 'badge-success' : 'badge-danger'}`}>
                                            {!year.isClosed ? t('common.open') : t('common.closed')}
                                        </span>
                                        {year.isCurrent && (
                                            <span className="ml-2 badge badge-info">Current</span>
                                        )}
                                    </td>
                                    <td>
                                        {!year.isClosed ? (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleCloseYear(year.id)}
                                            >
                                                {t('common.close')}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => handleOpenYear(year.id)}
                                            >
                                                {t('common.open')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('fiscalYears.create')}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('fiscalYears.name')}
                        name="yearName"
                        data-testid="yearName"
                        placeholder="e.g. FY 2024-25"
                        value={formData.yearName}
                        onChange={(e) => setFormData({ ...formData, yearName: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            name="startDate"
                            data-testid="startDate"
                            label={t('fiscalYears.startDate')}
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                        <Input
                            type="date"
                            name="endDate"
                            data-testid="endDate"
                            label={t('fiscalYears.endDate')}
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {t('common.save')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FiscalYears;
