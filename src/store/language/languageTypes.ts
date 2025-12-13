export type Language = 'en' | 'ur';
export type Direction = 'ltr' | 'rtl';

export interface LanguageState {
    currentLanguage: Language;
    direction: Direction;
}
