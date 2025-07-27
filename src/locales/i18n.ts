import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// Import translation files
import de from './de.json';
import en from './en.json';

const resources = {
  de: {
    translation: de,
  },
  en: {
    translation: en,
  },
};

// Get device language
const deviceLanguage = getLocales()[0]?.languageCode || 'de';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // Use device language or fallback to German
    fallbackLng: 'de', // Fallback language
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Enable debugging in development
    debug: __DEV__,
    
    // React options
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
