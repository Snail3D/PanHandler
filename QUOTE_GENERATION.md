# Quote Generation for PanHandler i18n

This guide explains how to generate 50 maker/designer quotes for each of the 32 supported languages.

## Quick Start

### Option 1: Using Google Cloud Translation API (Recommended)

1. **Get a Google Cloud API Key:**
   - Go to: https://console.cloud.google.com/
   - Create a new project (or select existing)
   - Enable the "Translation API" (Cloud Translation API)
   - Go to "Credentials" and create an API Key
   - Copy your API key

2. **Run the quote generator:**
   ```bash
   node generate-50-quotes.js YOUR_API_KEY_HERE
   ```

3. **What it does:**
   - Translates 50 English maker/designer quotes into each language
   - Generates TypeScript files in `src/utils/quotes/`
   - Each file exports `quotes_XX` array with 50 translated quotes

4. **Cost:**
   - Translation API: ~$15-20 per 1M characters
   - 32 languages × 50 quotes ≈ 8-10K characters total
   - Estimated cost: <$0.01 (very cheap!)

### Option 2: Manual Translation (If no API access)

Pre-translated quotes are available for these languages:
- English (en) - 50 quotes ✅
- Spanish (es) - Available
- French (fr) - Available
- German (de) - Available
- [Add more as needed]

### Files Generated

```
src/utils/quotes/
  ├── en.ts    (50 quotes in English)
  ├── es.ts    (50 quotes in Spanish)
  ├── fr.ts    (50 quotes in French)
  ├── de.ts    (50 quotes in German)
  ├── it.ts    (50 quotes in Italian)
  ├── pt.ts    (50 quotes in Portuguese)
  ├── ru.ts    (50 quotes in Russian)
  ├── pl.ts    (50 quotes in Polish)
  ├── tr.ts    (50 quotes in Turkish)
  ├── uk.ts    (50 quotes in Ukrainian)
  ├── vi.ts    (50 quotes in Vietnamese)
  ├── id.ts    (50 quotes in Indonesian)
  ├── jv.ts    (50 quotes in Javanese)
  ├── sw.ts    (50 quotes in Swahili)
  ├── zh.ts    (50 quotes in Chinese)
  ├── ja.ts    (50 quotes in Japanese)
  ├── ko.ts    (50 quotes in Korean)
  ├── hi.ts    (50 quotes in Hindi)
  ├── bn.ts    (50 quotes in Bengali)
  ├── mr.ts    (50 quotes in Marathi)
  ├── ta.ts    (50 quotes in Tamil)
  ├── te.ts    (50 quotes in Telugu)
  ├── ar.ts    (50 quotes in Arabic)
  ├── ur.ts    (50 quotes in Urdu)
  ├── he.ts    (50 quotes in Hebrew)
  ├── fa.ts    (50 quotes in Farsi)
  ├── el.ts    (50 quotes in Greek)
  ├── ha.ts    (50 quotes in Hausa)
  ├── pa.ts    (50 quotes in Punjabi)
  ├── fil.ts   (50 quotes in Filipino)
  ├── am.ts    (50 quotes in Amharic)
  ├── my.ts    (50 quotes in Burmese)
  ├── th.ts    (50 quotes in Thai)
  └── index.ts (exports all quote arrays)
```

## Implementation in App

The quotes are used in the `QuoteScreen` component:

```typescript
import { quotes_en } from '../utils/quotes/en';
import { quotes_es } from '../utils/quotes/es';
// ... etc

const getRandomQuote = (languageCode: string) => {
  const quoteMap: Record<string, string[]> = {
    'en': quotes_en,
    'es': quotes_es,
    'fr': quotes_fr,
    // ... all languages
  };
  
  const quotes = quoteMap[languageCode] || quotes_en;
  return quotes[Math.floor(Math.random() * quotes.length)];
};
```

## Quote Content

The 50 maker/designer quotes cover:
- Design principles (20 quotes)
- Motivation & perseverance (20 quotes)
- Programmer humor (10 quotes)

Topics include:
- Measurement & precision
- Design philosophy
- Engineering mindset
- Prototyping & iteration
- Failing fast & learning
- Developer jokes & culture

## Troubleshooting

### "Method doesn't allow unregistered callers"
- Make sure you've enabled the Translation API in Google Cloud Console
- The API key needs to be created specifically for Translation API

### "Cannot find module quotes_XX"
- Run the generator to create the missing quote files
- Make sure quote files are in `src/utils/quotes/`
- Update the index.ts to export all languages

### "API quota exceeded"
- Google Cloud free tier includes $300 credit
- Translations are very cheap (~$15 per 1M chars)
- Wait a moment and retry

## Next Steps

1. ✅ Generate quotes using the API key
2. ✅ Update `src/utils/quotes/index.ts` to export all languages
3. ✅ Import quotes in QuoteScreen component
4. ✅ Test in app - quotes should appear in app's language
5. ✅ Commit: `git add src/utils/quotes && git commit -m "🌍 Add 50 quotes for all 32 languages"`

## More Information

- [Google Cloud Translation API](https://cloud.google.com/translate)
- [Translation API Pricing](https://cloud.google.com/translate/pricing)
- [API Documentation](https://cloud.google.com/translate/docs)

