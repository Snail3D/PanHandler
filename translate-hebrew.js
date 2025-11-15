const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

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

async function translateHebrew() {
  console.log('🇮🇱 Translating to Hebrew...\n');
  
  try {
    const translated = await translateObject(englishTranslations, 'he');
    
    // Ensure brand name stays English
    if (translated.dimensionOverlay) {
      translated.dimensionOverlay.brandName = 'PanHandler';
      if (translated.dimensionOverlay.panhandlerSupporter) {
        translated.dimensionOverlay.panhandlerSupporter = `PanHandler ${translated.dimensionOverlay.supporter || 'תומך'}`;
      }
    }
    
    fs.writeFileSync('src/utils/translations/he.json', JSON.stringify(translated, null, 2));
    console.log('\n✅ Hebrew translation complete!');
    console.log('📁 Saved to src/utils/translations/he.json');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

translateHebrew().catch(console.error);

