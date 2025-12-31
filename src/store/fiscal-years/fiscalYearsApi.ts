import { apiClient } from '../common/apiHelper';
import { CreateFiscalYearDto, FiscalYear, UpdateFiscalYearDto } from './fiscalYearsTypes';

export const fetchFiscalYears = async (): Promise<FiscalYear[]> => {
    return await apiClient.get('/fiscal-years');
};

export const fetchCurrentFiscalYear = async (): Promise<FiscalYear> => {
    return await apiClient.get('/fiscal-years/current');
};

export const createFiscalYear = async (data: CreateFiscalYearDto): Promise<FiscalYear> => {
    return await apiClient.post('/fiscal-years', data);
};

export const updateFiscalYear = async (id: string, data: UpdateFiscalYearDto): Promise<FiscalYear> => {
    return await apiClient.patch(`/fiscal-years/${id}`, data);
};

export const closeFiscalYear = async (id: string): Promise<FiscalYear> => {
    return await apiClient.patch(`/fiscal-years/${id}/close`);
};

export const openFiscalYear = async (id: string): Promise<FiscalYear> => {
    return await apiClient.patch(`/fiscal-years/${id}/open`);
};


export const deleteFiscalYear = async (id: string): Promise<void> => {
    await apiClient.delete(`/fiscal-years/${id}`);
};
