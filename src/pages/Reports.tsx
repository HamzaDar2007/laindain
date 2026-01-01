import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectTrialBalance,
    selectProfitLoss,
    selectBalanceSheet,
    selectCashFlow,
    selectReportsLoading,
} from '../store/reports/reportsSelector';
import {
    fetchTrialBalanceAsync,
    fetchProfitLossAsync,
    fetchBalanceSheetAsync,
    fetchCashFlowAsync,
} from '../store/reports/reportsSlice';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

type ReportType = 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'cash-flow';

const Reports: React.FC = () => {
    // const { t } = useTranslation();
    const dispatch = useDispatch();

    const trialBalance = useSelector(selectTrialBalance);
    const profitLoss = useSelector(selectProfitLoss);
    const balanceSheet = useSelector(selectBalanceSheet);
    const cashFlow = useSelector(selectCashFlow);
    const isLoading = useSelector(selectReportsLoading);

    const [reportType, setReportType] = useState<ReportType>('trial-balance');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    const reports = [
        { id: 'trial-balance', name: 'Trial Balance', icon: '📊', description: 'List of all accounts with balances' },
        { id: 'profit-loss', name: 'Profit & Loss', icon: '💰', description: 'Income and expenses summary' },
        { id: 'balance-sheet', name: 'Balance Sheet', icon: '📈', description: 'Assets, liabilities, and equity' },
        { id: 'cash-flow', name: 'Cash Flow', icon: '💵', description: 'Cash movement analysis' },
    ];

    const handleGenerate = () => {
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

    const handleExport = () => {
        // Export functionality - could export to CSV/PDF
        alert('Export functionality coming soon!');
    };

    const renderTrialBalance = () => (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th className="text-right">Debit</th>
                        <th className="text-right">Credit</th>
                        <th className="text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {trialBalance.map((item, index) => (
                        <tr key={index}>
                            <td className="font-mono">{item.accountCode}</td>
                            <td>{item.accountName}</td>
                            <td className="text-right font-mono">{item.debit.toFixed(2)}</td>
                            <td className="text-right font-mono">{item.credit.toFixed(2)}</td>
                            <td className="text-right font-mono font-semibold">{item.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold bg-slate-50 dark:bg-slate-900/50">
                        <td colSpan={2}>Total</td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + item.debit, 0).toFixed(2)}
                        </td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + item.credit, 0).toFixed(2)}
                        </td>
                        <td className="text-right">
                            {trialBalance.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}
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
                {/* Income Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-700">Income</h3>
                    <table className="table">
                        <tbody>
                            {profitLoss.income.accounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td className="font-mono">{acc.code}</td>
                                    <td>{acc.name}</td>
                                    <td className="text-right font-mono">{acc.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-green-50">
                                <td colSpan={2}>Total Income</td>
                                <td className="text-right">{profitLoss.income.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Expenses Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Expenses</h3>
                    <table className="table">
                        <tbody>
                            {profitLoss.expenses.accounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td className="font-mono">{acc.code}</td>
                                    <td>{acc.name}</td>
                                    <td className="text-right font-mono">{acc.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-red-50">
                                <td colSpan={2}>Total Expenses</td>
                                <td className="text-right">{profitLoss.expenses.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Net Profit */}
                <div className={`p-4 rounded-lg ${profitLoss.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                            {profitLoss.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                        </span>
                        <span className="text-2xl font-bold">
                            {Math.abs(profitLoss.netProfit).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderBalanceSheet = () => {
        if (!balanceSheet) return <div className="text-center py-8 text-gray-500">No data available</div>;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Assets</h3>
                    <table className="table">
                        <tbody>
                            {balanceSheet.assets.accounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td className="font-mono text-sm">{acc.code}</td>
                                    <td>{acc.name}</td>
                                    <td className="text-right font-mono">{acc.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-blue-50">
                                <td colSpan={2}>Total Assets</td>
                                <td className="text-right">{balanceSheet.assets.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Liabilities & Equity */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-orange-700">Liabilities</h3>
                        <table className="table">
                            <tbody>
                                {balanceSheet.liabilities.accounts.map((acc, idx) => (
                                    <tr key={idx}>
                                        <td className="font-mono text-sm">{acc.code}</td>
                                        <td>{acc.name}</td>
                                        <td className="text-right font-mono">{acc.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-orange-50">
                                    <td colSpan={2}>Total Liabilities</td>
                                    <td className="text-right">{balanceSheet.liabilities.total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-purple-700">Equity</h3>
                        <table className="table">
                            <tbody>
                                {balanceSheet.equity.accounts.map((acc, idx) => (
                                    <tr key={idx}>
                                        <td className="font-mono text-sm">{acc.code}</td>
                                        <td>{acc.name}</td>
                                        <td className="text-right font-mono">{acc.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-purple-50">
                                    <td colSpan={2}>Total Equity</td>
                                    <td className="text-right">{balanceSheet.equity.total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderCashFlow = () => {
        if (!cashFlow) return <div className="text-center py-8 text-gray-500">No data available</div>;

        return (
            <div className="space-y-6">
                {/* Operating Activities */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Operating Activities</h3>
                    <table className="table">
                        <tbody>
                            {cashFlow.operating.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td className="text-right font-mono">{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                                <td>Net Cash from Operating</td>
                                <td className="text-right">{cashFlow.operating.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Investing Activities */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Investing Activities</h3>
                    <table className="table">
                        <tbody>
                            {cashFlow.investing.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td className="text-right font-mono">{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                                <td>Net Cash from Investing</td>
                                <td className="text-right">{cashFlow.investing.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Financing Activities */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Financing Activities</h3>
                    <table className="table">
                        <tbody>
                            {cashFlow.financing.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td className="text-right font-mono">{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                                <td>Net Cash from Financing</td>
                                <td className="text-right">{cashFlow.financing.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Net Change */}
                <div className={`p-4 rounded-lg ${cashFlow.netChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">Net Change in Cash</span>
                        <span className="text-2xl font-bold">{cashFlow.netChange.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderReportContent = () => {
        if (isLoading) {
            return <div className="text-center py-12">Loading report...</div>;
        }

        switch (reportType) {
            case 'trial-balance':
                return trialBalance.length > 0 ? renderTrialBalance() :
                    <div className="text-center py-12 text-slate-500">No data available. Click "Generate Report" to load data.</div>;
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
                <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
                <p className="text-gray-600 mt-1">Generate and view financial statements</p>
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
                <h2 className="text-xl font-semibold mb-4">Report Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="input"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
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
                            Generate Report
                        </Button>
                        <Button variant="secondary" onClick={handleExport}>
                            Export
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
