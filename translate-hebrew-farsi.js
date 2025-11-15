const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

const NEW_LANGUAGES = [
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Farsi' }
];

const englishTranslations = JSON.parse(
  fs.readFileSync('src/utils/translations/en.json', 'utf8')
);

async function translateObject(obj, targetLang) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.includes('PLACEHOLDER') || key.includes('ARRAY') || key === 'brandName') {
      translated[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      try {
        const [result] = await translate.translate(value, targetLang);
        translated[key] = result;
      } catch (error) {
        console.error(`  ✗ ${key}`);
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
  console.log('🌍 Translating Hebrew and Farsi...\n');
  
  for (const lang of NEW_LANGUAGES) {
    console.log(`🔄 Translating to ${lang.name} (${lang.code})...`);
    
    try {
      const translated = await translateObject(englishTranslations, lang.code);
      
      // Ensure brand name stays English
      if (translated.dimensionOverlay) {
        translated.dimensionOverlay.brandName = 'PanHandler';
        if (translated.dimensionOverlay.panhandlerSupporter) {
          const supporter = translated.dimensionOverlay.supporter;
          translated.dimensionOverlay.panhandlerSupporter = `PanHandler ${supporter}`;
        }
      }
      
      const outputPath = `src/utils/translations/${lang.code}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
      console.log(`✅ ${lang.name} complete!\n`);
    } catch (error) {
      console.error(`❌ Failed: ${error.message}\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Hebrew and Farsi translations complete!');
  console.log('📊 Total languages now: 30 (English + 29 translations)');
}

translateNewLanguages().catch(console.error);

