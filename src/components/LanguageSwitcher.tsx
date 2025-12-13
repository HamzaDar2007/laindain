import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../store/language/languageSlice';
import { selectCurrentLanguage } from '../store/language/languageSelector';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentLanguage = useSelector(selectCurrentLanguage);

    const handleToggle = () => {
        dispatch(toggleLanguage());
        const newLang = currentLanguage === 'en' ? 'ur' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={handleToggle}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Switch Language"
        >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
                {currentLanguage === 'en' ? 'English' : 'اردو'}
            </span>
        </button>
    );
};

export default LanguageSwitcher;
