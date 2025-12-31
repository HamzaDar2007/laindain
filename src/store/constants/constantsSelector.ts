import { RootState } from '../index';

export const selectConstants = (state: RootState) => state.constants.constants;
export const selectConstantsLoading = (state: RootState) => state.constants.loading;
export const selectConstantsError = (state: RootState) => state.constants.error;

export const selectConstantsByType = (type: string) => (state: RootState) =>
    state.constants.constants.filter(constant => constant.type === type);