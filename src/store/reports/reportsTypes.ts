export interface ReportFilter {
    startDate?: string;
    endDate?: string;
    asOfDate?: string;
}

export interface TrialBalanceItem {
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface GeneralLedgerItem {
    date: string;
    entryNumber: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface ProfitLossSection {
    name: string;
    accounts: {
        code: string;
        name: string;
        amount: number;
    }[];
    total: number;
}

export interface BalanceSheetSection {
    name: string;
    accounts: {
        code: string;
        name: string;
        amount: number;
    }[];
    total: number;
}

export interface CashFlowSection {
    name: string;
    items: {
        description: string;
        amount: number;
    }[];
    total: number;
}

export interface ReportState {
    trialBalance: TrialBalanceItem[];
    generalLedger: GeneralLedgerItem[];
    profitLoss: {
        income: ProfitLossSection;
        expenses: ProfitLossSection;
        netProfit: number;
    } | null;
    balanceSheet: {
        assets: BalanceSheetSection;
        liabilities: BalanceSheetSection;
        equity: BalanceSheetSection;
    } | null;
    cashFlow: {
        operating: CashFlowSection;
        investing: CashFlowSection;
        financing: CashFlowSection;
        netChange: number;
    } | null;
    isLoading: boolean;
    error: string | null;
}
