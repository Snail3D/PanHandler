import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all translation files
import en from './translations/en.json';
import es from './translations/es.json';
import zh from './translations/zh.json';
import hi from './translations/hi.json';
import fr from './translations/fr.json';
import ar from './translations/ar.json';
import bn from './translations/bn.json';
import ru from './translations/ru.json';
import pt from './translations/pt.json';
import ur from './translations/ur.json';
import id from './translations/id.json';
import de from './translations/de.json';
import ja from './translations/ja.json';
import pl from './translations/pl.json';
import el from './translations/el.json';
import sw from './translations/sw.json';
import mr from './translations/mr.json';
import te from './translations/te.json';
import tr from './translations/tr.json';
import ko from './translations/ko.json';
import ta from './translations/ta.json';
import vi from './translations/vi.json';
import ha from './translations/ha.json';
import pa from './translations/pa.json';
import fil from './translations/fil.json';
import am from './translations/am.json';
import my from './translations/my.json';
import th from './translations/th.json';

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
  'vi': '5000 Dong',
  'ha': 'Nigerian 50 Naira',
  'pa': '₹10 Rupee',
  'fil': '5 Peso',
  'am': 'Ethiopian 1 Birr',
  'my': 'Kyat',
  'th': '10 Baht'
};

// Languages that use RTL (right-to-left) layout
export const RTL_LANGUAGES = ['ar', 'ur'];

// Check if current language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// All supported languages with native names
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rtl: false },
  { code: 'es', name: 'Spanish', native: 'Español', rtl: false },
  { code: 'zh', name: 'Chinese', native: '中文', rtl: false },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', rtl: false },
  { code: 'fr', name: 'French', native: 'Français', rtl: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', rtl: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', rtl: false },
  { code: 'ru', name: 'Russian', native: 'Русский', rtl: false },
  { code: 'pt', name: 'Portuguese', native: 'Português', rtl: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', rtl: true },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', rtl: false },
  { code: 'de', name: 'German', native: 'Deutsch', rtl: false },
  { code: 'ja', name: 'Japanese', native: '日本語', rtl: false },
  { code: 'pl', name: 'Polish', native: 'Polski', rtl: false },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', rtl: false },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', rtl: false },
  { code: 'mr', name: 'Marathi', native: 'मराठी', rtl: false },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', rtl: false },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', rtl: false },
  { code: 'ko', name: 'Korean', native: '한국어', rtl: false },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', rtl: false },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', rtl: false },
  { code: 'ha', name: 'Hausa', native: 'Hausa', rtl: false },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', rtl: false },
  { code: 'fil', name: 'Filipino', native: 'Filipino', rtl: false },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', rtl: false },
  { code: 'my', name: 'Burmese', native: 'မြန်မာ', rtl: false },
  { code: 'th', name: 'Thai', native: 'ไทย', rtl: false }
];

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
        es: { translation: es },
        zh: { translation: zh },
        hi: { translation: hi },
        fr: { translation: fr },
        ar: { translation: ar },
        bn: { translation: bn },
        ru: { translation: ru },
        pt: { translation: pt },
        ur: { translation: ur },
        id: { translation: id },
        de: { translation: de },
        ja: { translation: ja },
        pl: { translation: pl },
        el: { translation: el },
        sw: { translation: sw },
        mr: { translation: mr },
        te: { translation: te },
        tr: { translation: tr },
        ko: { translation: ko },
        ta: { translation: ta },
        vi: { translation: vi },
        ha: { translation: ha },
        pa: { translation: pa },
        fil: { translation: fil },
        am: { translation: am },
        my: { translation: my },
        th: { translation: th }
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

// Get RTL status for current language
export const getCurrentRTL = (): boolean => {
  const currentLang = i18n.language.split('-')[0];
  return isRTL(currentLang);
};

initI18n();

export default i18n;

