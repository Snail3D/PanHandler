import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './translations/en.json';
// Import other languages when ready
// import es from './translations/es.json';
// etc...

const LANGUAGE_KEY = '@panhandler_language';

// Language to default coin mapping
export const DEFAULT_COINS_BY_LANGUAGE: Record<string, string> = {
  'en': 'US Quarter',
  'es': '€1 Euro',
  'zh': '1 Yuan',
  'hi': '₹10 Rupee',
  'bn': '₹10 Rupee',
  'mr': '₹10 Rupee',
  'te': '₹10 Rupee',
  'ta': '₹10 Rupee',
  'ur': '₹10 Rupee',
  'fr': '€1 Euro',
  'ar': 'Saudi Riyal',
  'ru': '10 Ruble',
  'pt': '€1 Euro',
  'id': '1000 Rupiah',
  'de': '€1 Euro',
  'ja': '500 Yen',
  'pl': '1 Złoty',
  'el': '€1 Euro',
  'sw': 'Kenyan 20 Shilling',
  'tr': '1 Lira',
  'ko': '500 Won',
  'vi': '5000 Dong'
};

// Initialize i18n
const initI18n = async () => {
  // Try to load saved language preference
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  // If no saved preference, detect device language
  if (!savedLanguage) {
    const deviceLanguage = Localization.locale.split('-')[0]; // e.g., 'en-US' -> 'en'
    
    // Check if we support this language
    const supportedLanguages = Object.keys(DEFAULT_COINS_BY_LANGUAGE);
    savedLanguage = supportedLanguages.includes(deviceLanguage) 
      ? deviceLanguage 
      : 'en'; // Default to English
  }
  
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        en: { translation: en },
        // Add other languages as they're translated
        // es: { translation: es },
        // zh: { translation: zh },
        // etc...
      },
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Change language and persist preference
export const changeLanguage = async (languageCode: string) => {
  await i18n.changeLanguage(languageCode);
  await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
};

// Get default coin for current language
export const getDefaultCoin = (): string => {
  const currentLang = i18n.language.split('-')[0];
  return DEFAULT_COINS_BY_LANGUAGE[currentLang] || 'US Quarter';
};

initI18n();

export default i18n;

