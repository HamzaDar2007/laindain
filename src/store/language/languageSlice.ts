import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageState, Language, Direction } from './languageTypes';
import { languageApi } from './languageApi';

const getInitialLanguage = (): Language => {
    return (localStorage.getItem('language') as Language) || 'en';
};

const getDirection = (language: Language): Direction => {
    return language === 'ur' ? 'rtl' : 'ltr';
};

const initialState: LanguageState = {
    currentLanguage: getInitialLanguage(),
    direction: getDirection(getInitialLanguage()),
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
            state.direction = getDirection(action.payload);
            languageApi.setLanguage(action.payload);
        },
        toggleLanguage: (state) => {
            const newLanguage: Language = state.currentLanguage === 'en' ? 'ur' : 'en';
            state.currentLanguage = newLanguage;
            state.direction = getDirection(newLanguage);
            languageApi.setLanguage(newLanguage);
        },
    },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
