import { RootState } from '../index';

export const selectAllVoucherTypes = (state: RootState) => state.voucherTypes.voucherTypes;
export const selectCurrentVoucherType = (state: RootState) => state.voucherTypes.currentVoucherType;
export const selectVoucherTypesLoading = (state: RootState) => state.voucherTypes.isLoading;
export const selectVoucherTypesError = (state: RootState) => state.voucherTypes.error;

export const selectActiveVoucherTypes = (state: RootState) =>
    state.voucherTypes.voucherTypes.filter(vt => vt.isActive);

export const selectVoucherTypeById = (state: RootState, id: string) =>
    state.voucherTypes.voucherTypes.find(vt => vt.id === id);
