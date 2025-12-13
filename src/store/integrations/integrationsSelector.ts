import { RootState } from '../index';
import { IntegrationStatus } from './integrationsTypes';

export const selectAllIntegrations = (state: RootState) => state.integrations.integrations;
export const selectCurrentIntegration = (state: RootState) => state.integrations.currentIntegration;
export const selectIntegrationsLoading = (state: RootState) => state.integrations.isLoading;
export const selectIntegrationsError = (state: RootState) => state.integrations.error;

export const selectIntegrationById = (state: RootState, id: string) =>
    state.integrations.integrations.find(i => i.id === id);

export const selectIntegrationsByStatus = (state: RootState, status: IntegrationStatus) =>
    state.integrations.integrations.filter(i => i.status === status);

export const selectActiveIntegrations = (state: RootState) =>
    state.integrations.integrations.filter(i => i.status === 'active');

export const selectInactiveIntegrations = (state: RootState) =>
    state.integrations.integrations.filter(i => i.status === 'inactive');
