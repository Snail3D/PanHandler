const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

// 6 new languages
const NEW_LANGUAGES = [
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'my', name: 'Burmese', flag: '🇲🇲' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' }
];

const englishTranslations = JSON.parse(
  fs.readFileSync('src/utils/translations/en.json', 'utf8')
);

async function translateObject(obj, targetLang) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.includes('PLACEHOLDER') || key.includes('ARRAY')) {
      translated[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      try {
        const [result] = await translate.translate(value, targetLang);
        translated[key] = result;
      } catch (error) {
        console.error(`  ✗ ${key}: ${error.message.substring(0, 100)}`);
        translated[key] = value;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function translateNewLanguages() {
  console.log('🌍 Translating 6 new languages for developing regions...\n');
  
  for (const lang of NEW_LANGUAGES) {
    console.log(`🔄 Translating to ${lang.name} (${lang.code})...`);
    
    try {
      const translated = await translateObject(englishTranslations, lang.code);
      const outputPath = `src/utils/translations/${lang.code}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
      console.log(`✅ ${lang.name} complete!\n`);
    } catch (error) {
      console.error(`❌ Failed: ${error.message}\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 All 6 new languages translated!');
  console.log('📊 Total languages now: 28 (English + 27 translations)');
}

translateNewLanguages().catch(console.error);

