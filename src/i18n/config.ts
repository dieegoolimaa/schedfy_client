import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ptBR from './pt-BR.json';

// Configuração do i18next
i18n
    .use(LanguageDetector) // Detecta idioma do navegador
    .use(initReactI18next) // Integração com React
    .init({
        resources: {
            en: {
                translation: en
            },
            'pt-BR': {
                translation: ptBR
            }
        },
        fallbackLng: 'en', // Idioma padrão se não encontrar tradução
        debug: false, // Ative para desenvolvimento: true

        interpolation: {
            escapeValue: false // React já faz escape
        },

        // Detector de idioma - ordem de detecção
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        }
    });

export default i18n;
