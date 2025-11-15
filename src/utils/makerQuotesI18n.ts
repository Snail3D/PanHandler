// Multi-language maker/designer quotes for PanHandler
// Supports 32 languages with 50 quotes each
// English quotes are curated from historical figures
// Other languages use translated quotes

import i18n from 'i18next';

// Import quote arrays from quotes directory
import { quotes_en } from './quotes/en';
import { quotes_es } from './quotes/es';
import { quotes_fr } from './quotes/fr';
import { quotes_de } from './quotes/de';
import { quotes_it } from './quotes/it';
import { quotes_pt } from './quotes/pt';
import { quotes_ru } from './quotes/ru';
import { quotes_pl } from './quotes/pl';
import { quotes_tr } from './quotes/tr';
import { quotes_uk } from './quotes/uk';
import { quotes_vi } from './quotes/vi';
import { quotes_id } from './quotes/id';
import { quotes_jv } from './quotes/jv';
import { quotes_sw } from './quotes/sw';
import { quotes_zh } from './quotes/zh';
import { quotes_ja } from './quotes/ja';
import { quotes_ko } from './quotes/ko';
import { quotes_hi } from './quotes/hi';
import { quotes_bn } from './quotes/bn';
import { quotes_mr } from './quotes/mr';
import { quotes_ta } from './quotes/ta';
import { quotes_te } from './quotes/te';
import { quotes_ar } from './quotes/ar';
import { quotes_ur } from './quotes/ur';
import { quotes_he } from './quotes/he';
import { quotes_fa } from './quotes/fa';
import { quotes_el } from './quotes/el';
import { quotes_ha } from './quotes/ha';
import { quotes_pa } from './quotes/pa';
import { quotes_fil } from './quotes/fil';
import { quotes_am } from './quotes/am';
import { quotes_my } from './quotes/my';
import { quotes_th } from './quotes/th';

export interface MakerQuote {
  text: string;
  author?: string;
  year?: string;
}

// Map of language codes to quote arrays
const quotesByLanguage: Record<string, string[]> = {
  'en': quotes_en,
  'es': quotes_es,
  'fr': quotes_fr,
  'de': quotes_de,
  'it': quotes_it,
  'pt': quotes_pt,
  'ru': quotes_ru,
  'pl': quotes_pl,
  'tr': quotes_tr,
  'uk': quotes_uk,
  'vi': quotes_vi,
  'id': quotes_id,
  'jv': quotes_jv,
  'sw': quotes_sw,
  'zh': quotes_zh,
  'ja': quotes_ja,
  'ko': quotes_ko,
  'hi': quotes_hi,
  'bn': quotes_bn,
  'mr': quotes_mr,
  'ta': quotes_ta,
  'te': quotes_te,
  'ar': quotes_ar,
  'ur': quotes_ur,
  'he': quotes_he,
  'fa': quotes_fa,
  'el': quotes_el,
  'ha': quotes_ha,
  'pa': quotes_pa,
  'fil': quotes_fil,
  'am': quotes_am,
  'my': quotes_my,
  'th': quotes_th,
};

/**
 * Get a random quote in the user's current language
 * Falls back to English if language not supported
 * 
 * @returns Random quote text (string) in the current language
 */
export const getRandomQuoteI18n = (): MakerQuote => {
  const currentLang = i18n.language.split('-')[0]; // Get base language code
  const quoteArray = quotesByLanguage[currentLang] || quotes_en;
  const randomText = quoteArray[Math.floor(Math.random() * quoteArray.length)];
  
  return {
    text: randomText,
    // Note: Author info only available for English quotes
    author: currentLang === 'en' ? 'PanHandler' : undefined,
  };
};

/**
 * Get a random quote in a specific language
 * 
 * @param languageCode - ISO 639-1 language code (e.g., 'es', 'fr', 'de')
 * @returns Random quote text in the specified language
 */
export const getRandomQuoteForLanguage = (languageCode: string): MakerQuote => {
  const quoteArray = quotesByLanguage[languageCode] || quotes_en;
  const randomText = quoteArray[Math.floor(Math.random() * quoteArray.length)];
  
  return {
    text: randomText,
    author: languageCode === 'en' ? 'PanHandler' : undefined,
  };
};

/**
 * Get all available quote arrays
 * Useful for statistics or debugging
 */
export const getAllQuoteArrays = () => quotesByLanguage;

/**
 * Get supported languages for quotes
 */
export const getSupportedQuoteLanguages = (): string[] => {
  return Object.keys(quotesByLanguage);
};

