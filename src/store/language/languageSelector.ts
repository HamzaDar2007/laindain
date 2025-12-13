import { RootState } from '../index';

export const selectCurrentLanguage = (state: RootState) => state.language.currentLanguage;
export const selectDirection = (state: RootState) => state.language.direction;
export const selectIsRTL = (state: RootState) => state.language.direction === 'rtl';
