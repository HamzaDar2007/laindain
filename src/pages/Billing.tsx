import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectSubscription,
    selectTransactions,
    selectBillingLoading,
} from '../store/billing/billingSelector';
import {
    fetchSubscriptionAsync,
    fetchTransactionsAsync,
    updateSubscriptionAsync,
    cancelSubscriptionAsync,
} from '../store/billing/billingSlice';
import { UpdateSubscriptionDto, TenantPlan } from '../store/billing/billingTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Card from '../components/common/Card';

const Billing: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const subscription = useSelector(selectSubscription);
    const transactions = useSelector(selectTransactions);
    const isLoading = useSelector(selectBillingLoading);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<UpdateSubscriptionDto>({
        plan: undefined,
        autoRenew: undefined,
    });

    useEffect(() => {
        dispatch(fetchSubscriptionAsync() as any);
        dispatch(fetchTransactionsAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(updateSubscriptionAsync(formData) as any);
        setShowModal(false);
        setFormData({ plan: undefined, autoRenew: undefined });
    };

    const handleCancelSubscription = async () => {
        if (window.confirm('Are you sure you want to cancel your subscription?')) {
            await dispatch(cancelSubscriptionAsync() as any);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active': return 'badge-success';
            case 'trial': return 'badge-info';
            case 'past_due': return 'badge-warning';
            case 'cancelled': return 'badge-danger';
            case 'expired': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    const getTransactionStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'completed': return 'badge-success';
            case 'pending': return 'badge-warning';
            case 'failed': return 'badge-danger';
            case 'refunded': return 'badge-info';
            default: return 'badge-secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                {subscription && subscription.status !== 'cancelled' && (
                    <Button onClick={() => setShowModal(true)}>
                        Update Subscription
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <>
                    {/* Subscription Details */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
                        {subscription ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Plan</p>
                                        <p className="font-semibold capitalize">{subscription.plan}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`badge ${getStatusBadgeClass(subscription.status)}`}>
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Billing Cycle</p>
                                        <p className="font-semibold capitalize">{subscription.billingCycle}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-semibold">
                                            ${subscription.billingCycle === 'monthly'
                                                ? subscription.monthlyPrice
                                                : subscription.yearlyPrice}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Start Date</p>
                                        <p className="font-semibold">
                                            {new Date(subscription.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {subscription.nextBillingDate && (
                                        <div>
                                            <p className="text-sm text-gray-600">Next Billing Date</p>
                                            <p className="font-semibold">
                                                {new Date(subscription.nextBillingDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {subscription.trialEndDate && (
                                        <div>
                                            <p className="text-sm text-gray-600">Trial End Date</p>
                                            <p className="font-semibold">
                                                {new Date(subscription.trialEndDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Auto Renew</p>
                                        <p className="font-semibold">
                                            {subscription.autoRenew ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                </div>
                                {subscription.status !== 'cancelled' && (
                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="danger"
                                            onClick={handleCancelSubscription}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600">No active subscription</p>
                        )}
                    </Card>

                    {/* Transaction History */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                        {transactions.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="capitalize">{transaction.type}</td>
                                            <td className="font-mono">
                                                {transaction.currency} {transaction.amount.toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`badge ${getTransactionStatusBadgeClass(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td>{transaction.description || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-600">No transactions yet</p>
                        )}
                    </Card>
                </>
            )}

            {/* Update Subscription Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Update Subscription"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Plan"
                        value={formData.plan || subscription?.plan || ''}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value as TenantPlan })}
                    >
                        <option value={TenantPlan.FREE}>Free</option>
                        <option value={TenantPlan.BASIC}>Basic</option>
                        <option value={TenantPlan.PROFESSIONAL}>Professional</option>
                        <option value={TenantPlan.ENTERPRISE}>Enterprise</option>
                    </Select>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="autoRenew"
                            checked={formData.autoRenew ?? subscription?.autoRenew ?? false}
                            onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="autoRenew" className="text-sm font-medium text-gray-700">
                            Auto Renew
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Billing;
