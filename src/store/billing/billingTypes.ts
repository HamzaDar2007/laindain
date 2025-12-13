export enum SubscriptionStatus {
    ACTIVE = 'active',
    TRIAL = 'trial',
    PAST_DUE = 'past_due',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

export enum TransactionType {
    CHARGE = 'charge',
    REFUND = 'refund',
    CREDIT = 'credit',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum TenantPlan {
    FREE = 'free',
    BASIC = 'basic',
    PROFESSIONAL = 'professional',
    ENTERPRISE = 'enterprise',
}

export interface Subscription {
    id: string;
    tenantId: string;
    plan: TenantPlan;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string | null;
    trialEndDate: string | null;
    monthlyPrice: number;
    yearlyPrice: number;
    billingCycle: 'monthly' | 'yearly';
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    nextBillingDate: string | null;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BillingTransaction {
    id: string;
    subscriptionId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    stripePaymentIntentId: string | null;
    stripeChargeId: string | null;
    description: string | null;
    failureReason: string | null;
    metadata: Record<string, any> | null;
    createdAt: string;
}

export interface UpdateSubscriptionDto {
    plan?: TenantPlan;
    endDate?: string;
    autoRenew?: boolean;
}

export interface BillingState {
    subscription: Subscription | null;
    transactions: BillingTransaction[];
    isLoading: boolean;
    error: string | null;
}
