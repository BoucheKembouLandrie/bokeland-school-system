import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fr: {
                translation: frTranslations,
            },
            en: {
                translation: enTranslations,
            },
        },
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// Update date format when language changes
i18n.on('languageChanged', (lng) => {
    const dateFormat = lng === 'en' ? 'MM-DD-YYYY' : 'DD-MM-YYYY';
    localStorage.setItem('date_format', dateFormat);
    localStorage.setItem('language', lng);
});

export default i18n;
