// Quote imports for all 30 languages
// Each language has 50 maker/designer quotes

import { quotes_en } from './en';
import { quotes_es } from './es';
import { quotes_zh } from './zh';
import { quotes_hi } from './hi';
import { quotes_ar } from './ar';
import { quotes_ur } from './ur';
import { quotes_bn } from './bn';
import { quotes_pt } from './pt';
import { quotes_ru } from './ru';
import { quotes_ja } from './ja';
import { quotes_pa } from './pa';
import { quotes_de } from './de';
import { quotes_jv } from './jv';
import { quotes_ko } from './ko';
import { quotes_fr } from './fr';
import { quotes_te } from './te';
import { quotes_mr } from './mr';
import { quotes_ta } from './ta';
import { quotes_vi } from './vi';
import { quotes_it } from './it';
import { quotes_tr } from './tr';
import { quotes_id } from './id';
import { quotes_th } from './th';
import { quotes_pl } from './pl';
import { quotes_uk } from './uk';
import { quotes_sw } from './sw';
import { quotes_ha } from './ha';
import { quotes_fil } from './fil';
import { quotes_am } from './am';
import { quotes_my } from './my';
import { quotes_he } from './he';
import { quotes_fa } from './fa';

export const quotesByLanguage: Record<string, string[]> = {
  'en': quotes_en,
  'es': quotes_es,
  'zh': quotes_zh,
  'hi': quotes_hi,
  'ar': quotes_ar,
  'ur': quotes_ur,
  'bn': quotes_bn,
  'pt': quotes_pt,
  'ru': quotes_ru,
  'ja': quotes_ja,
  'pa': quotes_pa,
  'de': quotes_de,
  'jv': quotes_jv,
  'ko': quotes_ko,
  'fr': quotes_fr,
  'te': quotes_te,
  'mr': quotes_mr,
  'ta': quotes_ta,
  'vi': quotes_vi,
  'it': quotes_it,
  'tr': quotes_tr,
  'id': quotes_id,
  'th': quotes_th,
  'pl': quotes_pl,
  'uk': quotes_uk,
  'sw': quotes_sw,
  'ha': quotes_ha,
  'fil': quotes_fil,
  'am': quotes_am,
  'my': quotes_my,
  'he': quotes_he,
  'fa': quotes_fa,
};

// Get a random quote for a specific language
export function getRandomQuote(languageCode: string = 'en'): string {
  const quotes = quotesByLanguage[languageCode] || quotesByLanguage['en'];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
