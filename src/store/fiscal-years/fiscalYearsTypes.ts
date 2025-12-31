export interface FiscalYear {
    id: string;
    companyId: string;
    yearName: string;
    startDate: string;
    endDate: string;
    isClosed: boolean;
    status?: 'open' | 'closed';
    isCurrent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFiscalYearDto {
    yearName: string;
    startDate: string;
    endDate: string;
}

export interface UpdateFiscalYearDto {
    yearName?: string;
    startDate?: string;
    endDate?: string;
}

export interface FiscalYearsState {
    years: FiscalYear[];
    currentYear: FiscalYear | null;
    isLoading: boolean;
    error: string | null;
}
