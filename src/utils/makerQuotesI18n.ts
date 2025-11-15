// Multi-language maker/designer quotes for PanHandler
// English: Full curated collection from historical figures (with authors & years)
// Other languages: 50 translated quotes (simple text strings)

import i18n from 'i18next';
import { makerQuotes, MakerQuote } from './makerQuotes';

// Import 50-quote translated arrays from quotes directory
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

// Map of language codes to 50-quote arrays (non-English only)
const translatedQuotesByLanguage: Record<string, string[]> = {
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
 * 
 * For ENGLISH users:
 * - Returns full curated quotes with authors, years, and rich history
 * - Uses the complete makerQuotes collection
 * 
 * For OTHER LANGUAGE users:
 * - Returns 50 translated quotes (simple text strings)
 * - No author/year info (to keep files lightweight)
 * 
 * Falls back to English if language not supported
 * 
 * @returns Random quote in the current language
 */
export const getRandomQuoteI18n = (): MakerQuote => {
  const currentLang = i18n.language.split('-')[0]; // Get base language code
  
  // For English: Use full makerQuotes collection
  if (currentLang === 'en') {
    const randomIndex = Math.floor(Math.random() * makerQuotes.length);
    return makerQuotes[randomIndex];
  }
  
  // For other languages: Use 50 translated quotes
  const translatedQuotes = translatedQuotesByLanguage[currentLang];
  if (translatedQuotes && translatedQuotes.length > 0) {
    const randomText = translatedQuotes[Math.floor(Math.random() * translatedQuotes.length)];
    return {
      text: randomText,
      author: undefined, // Translated quotes don't have author info
    };
  }
  
  // Fallback: If language not supported, use English
  const randomIndex = Math.floor(Math.random() * makerQuotes.length);
  return makerQuotes[randomIndex];
};

/**
 * Get a random quote in a specific language
 * 
 * @param languageCode - ISO 639-1 language code (e.g., 'en', 'es', 'fr', 'de')
 * @returns Random quote in the specified language
 */
export const getRandomQuoteForLanguage = (languageCode: string): MakerQuote => {
  // For English: Use full makerQuotes collection
  if (languageCode === 'en') {
    const randomIndex = Math.floor(Math.random() * makerQuotes.length);
    return makerQuotes[randomIndex];
  }
  
  // For other languages: Use 50 translated quotes
  const translatedQuotes = translatedQuotesByLanguage[languageCode];
  if (translatedQuotes && translatedQuotes.length > 0) {
    const randomText = translatedQuotes[Math.floor(Math.random() * translatedQuotes.length)];
    return {
      text: randomText,
      author: undefined,
    };
  }
  
  // Fallback: Use English if language not supported
  const randomIndex = Math.floor(Math.random() * makerQuotes.length);
  return makerQuotes[randomIndex];
};

/**
 * Get quote count for a language
 * English has full collection, others have 50 quotes
 */
export const getQuoteCountForLanguage = (languageCode: string): number => {
  if (languageCode === 'en') {
    return makerQuotes.length;
  }
  return translatedQuotesByLanguage[languageCode]?.length || 0;
};

/**
 * Get all supported languages for quotes
 */
export const getSupportedQuoteLanguages = (): string[] => {
  return ['en', ...Object.keys(translatedQuotesByLanguage)];
};

