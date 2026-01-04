import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '../context/ToastContext';
import {
    selectTrialBalance,
    selectProfitLoss,
    selectBalanceSheet,
    selectCashFlow,
    selectReportsLoading,
    selectReportsError,
} from '../store/reports/reportsSelector';
import {
    fetchTrialBalanceAsync,
    fetchProfitLossAsync,
    fetchBalanceSheetAsync,
    fetchCashFlowAsync,
} from '../store/reports/reportsSlice';
import * as api from '../store/reports/reportsApi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

type ReportType = 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'cash-flow';

const Reports: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { success, error, info } = useToast();

    const trialBalance = useSelector(selectTrialBalance);
    const profitLoss = useSelector(selectProfitLoss);
    const balanceSheet = useSelector(selectBalanceSheet);
    const cashFlow = useSelector(selectCashFlow);
    const isLoading = useSelector(selectReportsLoading);
    const reportError = useSelector(selectReportsError);

    const [reportType, setReportType] = useState<ReportType>('trial-balance');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    const [hasGenerated, setHasGenerated] = useState(false);

    const reports = [
        { id: 'trial-balance', name: t('reports.trialBalance'), icon: '📊', description: t('reports.trialBalanceDesc') },
        { id: 'profit-loss', name: t('reports.profitLoss'), icon: '💰', description: t('reports.profitLossDesc') },
        { id: 'balance-sheet', name: t('reports.balanceSheet'), icon: '📈', description: t('reports.balanceSheetDesc') },
        { id: 'cash-flow', name: t('reports.cashFlow'), icon: '💵', description: t('reports.cashFlowDesc') },
    ];

    const handleGenerate = () => {
        setHasGenerated(true);
        const filter = {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        };

        switch (reportType) {
            case 'trial-balance':
                dispatch(fetchTrialBalanceAsync(filter) as any);
                break;
            case 'profit-loss':
                dispatch(fetchProfitLossAsync(filter) as any);
                break;
            case 'balance-sheet':
                dispatch(fetchBalanceSheetAsync(dateRange.endDate) as any);
                break;
            case 'cash-flow':
                dispatch(fetchCashFlowAsync(filter) as any);
                break;
        }
    };

    const handleExport = async () => {
        try {
            info(t('reports.messages.exportStarted'));
            const params = {
                ...dateRange,
                language: 'en',
            };

            let blob: Blob;

            switch (reportType) {
                case 'profit-loss':
                    blob = await api.exportProfitLossExcel(params);
                    downloadBlob(blob, `profit-loss-${dateRange.startDate}-${dateRange.endDate}.xlsx`);
                    break;
                case 'balance-sheet':
                    blob = await api.exportBalanceSheetExcel({ asOfDate: dateRange.endDate, language: 'en' });
                    downloadBlob(blob, `balance-sheet-${dateRange.endDate}.xlsx`);
                    break;
                case 'cash-flow':
                    error('Cash Flow export coming soon!');
                    return;
                default:
                    error('Export not supported for this report type yet.');
                    return;
            }

            success('Report exported successfully!');
        } catch (err) {
            console.error('Export error:', err);
            error(t('reports.messages.exportError'));
        }
    };

    const downloadBlob = (blob: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const renderTrialBalance = () => (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>{t('reports.trialBalanceTable.accountCode')}</th>
                        <th>{t('reports.trialBalanceTable.accountName')}</th>
                        <th className="text-right">{t('reports.trialBalanceTable.debit')}</th>
                        <th className="text-right">{t('reports.trialBalanceTable.credit')}</th>
                        <th className="text-right">{t('reports.trialBalanceTable.balance')}</th>
                    </tr>
                </thead>
                <tbody>
                    {trialBalance.map((item, index) => (
                        <tr key={index}>
                            <td className="font-mono">{item.accountCode}</td>
                            <td>{item.accountName}</td>
                            <td className="text-right font-mono">{Number(item.debit).toFixed(2)}</td>
                            <td className="text-right font-mono">{Number(item.credit).toFixed(2)}</td>
                            <td className="text-right font-mono font-semibold">{Number(item.balance).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold bg-slate-50 dark:bg-slate-900/50">
                        <td colSpan={2}>{t('reports.trialBalanceTable.total')}</td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + Number(item.debit), 0).toFixed(2)}
                        </td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + Number(item.credit), 0).toFixed(2)}
                        </td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + Number(item.balance), 0).toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    const renderProfitLoss = () => {
        if (!profitLoss) return <div className="text-center py-8 text-slate-500">No data available</div>;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Summary */}
                    <Card variant="flat" className="bg-green-50 dark:bg-green-900/10">
                        <h3 className="text-lg font-semibold mb-3 text-green-700">{t('reports.profitLossSummary.income')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>{t('reports.profitLossSummary.revenue')}</span>
                                <span className="font-mono font-semibold text-green-600">${Number(profitLoss.income?.revenue || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('reports.profitLossSummary.totalInvoiced')}</span>
                                <span className="font-mono">${Number(profitLoss.income?.totalInvoiced || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>{t('reports.profitLossSummary.collectionRate')}</span>
                                <span>{Number(profitLoss.income?.collectionRate || 0).toFixed(1)}%</span>
                            </div>
                        </div>
                    </Card>

                    {/* Expenses Summary */}
                    <Card variant="flat" className="bg-red-50 dark:bg-red-900/10">
                        <h3 className="text-lg font-semibold mb-3 text-red-700">{t('reports.profitLossSummary.expenses')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>{t('reports.profitLossSummary.totalExpenses')}</span>
                                <span className="font-mono font-semibold text-red-600">${Number(profitLoss.expenses?.total || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('reports.profitLossSummary.vatPaid')}</span>
                                <span className="font-mono">${Number(profitLoss.expenses?.vatPaid || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>{t('reports.profitLossSummary.count')}</span>
                                <span>{profitLoss.expenses?.count || 0}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Profit/Loss Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                        <p className="text-sm text-blue-700">{t('reports.profitLossSummary.grossProfit')}</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            ${Number(profitLoss.profitLoss?.grossProfit || 0).toFixed(2)}
                        </p>
                    </div>
                    <div className={`p-4 rounded-lg ${(profitLoss.profitLoss?.netProfit || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className={`text-sm ${(profitLoss.profitLoss?.netProfit || 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>{t('reports.profitLossSummary.netProfit')}</p>
                        <p className={`text-2xl font-bold ${(profitLoss.profitLoss?.netProfit || 0) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                            ${Number(profitLoss.profitLoss?.netProfit || 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                        <p className="text-sm text-purple-700">{t('reports.profitLossSummary.profitMargin')}</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {Number(profitLoss.profitLoss?.profitMargin || 0).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Taxes Section */}
                <Card variant="flat" className="bg-slate-50 dark:bg-slate-900/20">
                    <h3 className="text-lg font-semibold mb-3">{t('reports.profitLossSummary.vatSummary')}</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-slate-500">{t('reports.profitLossSummary.vatCollected')}</p>
                            <p className="font-mono font-semibold">${Number(profitLoss.taxes?.vatCollected || 0).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{t('reports.profitLossSummary.vatPaid')}</p>
                            <p className="font-mono font-semibold">${Number(profitLoss.taxes?.vatPaid || 0).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{t('reports.profitLossSummary.netVat')}</p>
                            <p className="font-mono font-semibold text-blue-600">${Number(profitLoss.taxes?.netVat || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const renderBalanceSheet = () => {
        if (!balanceSheet) return <div className="text-center py-8 text-gray-500">No data available</div>;

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Assets */}
                    <Card variant="flat" className="border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">{t('reports.balanceSheetSummary.assets')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">{t('reports.balanceSheetSummary.cash')}</span>
                                <span className="font-mono font-semibold">${Number(balanceSheet.assets?.currentAssets?.cash || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">{t('reports.balanceSheetSummary.accountsReceivable')}</span>
                                <span className="font-mono font-semibold">${Number(balanceSheet.assets?.currentAssets?.accountsReceivable || 0).toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center font-bold">
                                <span>{t('reports.balanceSheetSummary.totalAssets')}</span>
                                <span className="text-lg text-blue-600">${Number(balanceSheet.assets?.currentAssets?.total || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Liabilities */}
                    <Card variant="flat" className="border-l-4 border-orange-500">
                        <h3 className="text-lg font-semibold mb-4 text-orange-700">{t('reports.balanceSheetSummary.liabilities')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">{t('reports.balanceSheetSummary.vatPayable')}</span>
                                <span className="font-mono font-semibold">${Number(balanceSheet.liabilities?.currentLiabilities?.vatPayable || 0).toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center font-bold">
                                <span>{t('reports.balanceSheetSummary.totalLiabilities')}</span>
                                <span className="text-lg text-orange-600">${Number(balanceSheet.liabilities?.currentLiabilities?.vatPayable || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Equity */}
                    <Card variant="flat" className="border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold mb-4 text-purple-700">{t('reports.balanceSheetSummary.equity')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">{t('reports.balanceSheetSummary.retainedEarnings')}</span>
                                <span className="font-mono font-semibold">${Number(balanceSheet.equity?.retainedEarnings || 0).toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center font-bold">
                                <span>{t('reports.balanceSheetSummary.totalEquity')}</span>
                                <span className="text-lg text-purple-600">${Number(balanceSheet.equity?.retainedEarnings || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                    <span className="text-lg font-bold">{t('reports.balanceSheetSummary.accountingEquation')}</span>
                    <span className="font-mono text-xl">
                        ${Number(balanceSheet.assets?.currentAssets?.total || 0).toFixed(2)} = {' '}
                        ${(Number(balanceSheet.liabilities?.currentLiabilities?.vatPayable || 0) + Number(balanceSheet.equity?.retainedEarnings || 0)).toFixed(2)}
                    </span>
                </div>
            </div>
        );
    };

    const renderCashFlow = () => {
        if (!cashFlow) return <div className="text-center py-8 text-gray-500">No data available</div>;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Operating Activities */}
                    <Card variant="flat">
                        <h3 className="font-semibold mb-3">{t('reports.cashFlowSummary.operating')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{t('reports.cashFlowSummary.cashFromCustomers')}</span>
                                <span>${Number(cashFlow.operatingActivities?.cashFromCustomers || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>{t('reports.cashFlowSummary.netOperating')}</span>
                                <span className="text-green-600">${Number(cashFlow.operatingActivities?.netCashFromOperating || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Investing Activities */}
                    <Card variant="flat">
                        <h3 className="font-semibold mb-3">{t('reports.cashFlowSummary.investing')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>{t('reports.cashFlowSummary.netInvesting')}</span>
                                <span>${Number(cashFlow.investingActivities?.netCashFromInvesting || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Financing Activities */}
                    <Card variant="flat">
                        <h3 className="font-semibold mb-3">{t('reports.cashFlowSummary.financing')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>{t('reports.cashFlowSummary.netFinancing')}</span>
                                <span>${Number(cashFlow.financingActivities?.netCashFromFinancing || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Net Change */}
                <div className={`p-6 rounded-lg text-center ${Number(cashFlow.netCashFlow || 0) >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    <p className="text-sm uppercase tracking-wider font-semibold opacity-70">{t('reports.cashFlowSummary.netChange')}</p>
                    <p className={`text-4xl font-bold ${Number(cashFlow.netCashFlow || 0) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        ${Number(cashFlow.netCashFlow || 0).toFixed(2)}
                    </p>
                </div>
            </div>
        );
    };

    const renderReportContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">{t('reports.messages.generating')}</p>
                </div>
            );
        }

        if (reportError) {
            return (
                <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg text-center">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">{t('reports.messages.error')}</h3>
                    <p className="text-red-600 dark:text-red-300">{reportError}</p>
                    <Button variant="secondary" onClick={handleGenerate} className="mt-4">{t('reports.messages.tryAgain')}</Button>
                </div>
            );
        }

        switch (reportType) {
            case 'trial-balance':
                return trialBalance.length > 0 ? renderTrialBalance() :
                    <div className="text-center py-12 text-slate-500">
                        {hasGenerated ? t('reports.messages.noData') : t('reports.messages.clickGenerate')}
                    </div>;
            case 'profit-loss':
                return renderProfitLoss();
            case 'balance-sheet':
                return renderBalanceSheet();
            case 'cash-flow':
                return renderCashFlow();
            default:
                return <div className="text-center py-12 text-slate-500">Select a report type</div>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('reports.title')}</h1>
                <p className="text-gray-600 mt-1">{t('reports.description')}</p>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reports.map((report) => (
                    <button
                        key={report.id}
                        onClick={() => setReportType(report.id as ReportType)}
                        className={`card text-left hover:shadow-lg transition-all ${reportType === report.id ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/10' : ''
                            }`}
                    >
                        <div className="flex items-start space-x-3">
                            <span className="text-3xl">{report.icon}</span>
                            <div>
                                <div className="font-semibold">{report.name}</div>
                                <div className="text-sm text-gray-600">{report.description}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Date Range Filter */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">{t('reports.parameters')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {reportType === 'balance-sheet' ? t('reports.asOfDate') : t('reports.startDate')}
                        </label>
                        <input
                            type="date"
                            className="input"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            disabled={reportType === 'balance-sheet'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('reports.endDate')}
                        </label>
                        <input
                            type="date"
                            className="input"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        />
                    </div>
                    <div className="flex items-end space-x-3">
                        <Button onClick={handleGenerate} className="flex-1">
                            {t('reports.generate')}
                        </Button>
                        <Button variant="secondary" onClick={handleExport}>
                            {t('reports.export')}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Report Content */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {reports.find((r) => r.id === reportType)?.name}
                </h2>
                {renderReportContent()}
            </Card>
        </div>
    );
};

export default Reports;
