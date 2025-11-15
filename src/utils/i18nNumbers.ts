/**
 * i18n Number Formatting
 * Handles locale-specific number formatting (Arabic numerals, Hindi numerals, etc.)
 */

// Languages that use non-Western numerals
export const NUMERAL_SYSTEMS: Record<string, string> = {
  'ar': 'arab',      // Arabic: ١٢٣٤٥٦٧٨٩٠
  'hi': 'deva',      // Hindi: १२३४५६७८९०
  'bn': 'beng',      // Bengali: ১২৩৪৫৬৭৮৯০
  'mr': 'deva',      // Marathi: १२३४५६७८९०
  'te': 'telu',      // Telugu: ౧౨౩౪౫౬౭౮౯౦
  'ta': 'taml',      // Tamil: ௧௨௩௪௫௬௭௮௯௦
  'ur': 'arabext',   // Urdu: ۱۲۳۴۵۶۷۸۹۰
  'th': 'thai',      // Thai: ๑๒๓๔๕๖๗๘๙๐
  'my': 'mymr',      // Burmese: ၁၂၃၄၅၆၇၈၉၀
  'am': 'ethi',      // Amharic: ፩፪፫፬፭፮፯፰፱፲
  'pa': 'guru',      // Punjabi: ੧੨੩੪੫੬੭੮੯੦
};

/**
 * Format number based on current language
 * Uses locale-appropriate numerals (Arabic, Hindi, Thai, etc.)
 */
export function formatNumber(
  value: number,
  languageCode: string,
  options?: Intl.NumberFormatOptions
): string {
  try {
    // Map language codes to locale identifiers
    const localeMap: Record<string, string> = {
      'zh': 'zh-CN',
      'fil': 'fil-PH',
      'pa': 'pa-IN',
      'sw': 'sw-KE'
    };
    
    const locale = localeMap[languageCode] || languageCode;
    
    // Use Intl.NumberFormat for locale-specific formatting
    const formatter = new Intl.NumberFormat(locale, {
      ...options,
      numberingSystem: NUMERAL_SYSTEMS[languageCode]
    });
    
    return formatter.format(value);
  } catch (error) {
    // Fallback to standard Western numerals
    console.warn(`Number formatting failed for ${languageCode}, using fallback`);
    return value.toString();
  }
}

/**
 * Format measurement value with units based on language
 * E.g., "24.5 mm" in Arabic shows as "٢٤٫٥ mm"
 */
export function formatMeasurementValue(
  value: number,
  unit: string,
  languageCode: string,
  decimals: number = 2
): string {
  const formattedNumber = formatNumber(value, languageCode, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return `${formattedNumber} ${unit}`;
}

/**
 * Format large numbers with K/M/B based on language
 * Some languages use different abbreviations
 */
export function formatLargeNumber(
  value: number,
  languageCode: string,
  t: (key: string) => string
): string {
  if (value >= 1000000000) {
    return `${formatNumber(value / 1000000000, languageCode, { maximumFractionDigits: 2 })}${t('units.billion')}`;
  } else if (value >= 1000000) {
    return `${formatNumber(value / 1000000, languageCode, { maximumFractionDigits: 2 })}${t('units.million')}`;
  } else if (value >= 1000) {
    return `${formatNumber(value / 1000, languageCode, { maximumFractionDigits: 2 })}${t('units.thousand')}`;
  }
  return formatNumber(value, languageCode);
}

