const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

const LANGS = ['es', 'zh', 'hi', 'fr', 'ar', 'bn', 'ru', 'pt', 'ur', 'id', 'de', 'ja', 'pl', 'el', 'sw', 'mr', 'te', 'tr', 'ko', 'ta', 'vi', 'ha', 'pa', 'fil', 'am', 'my', 'th', 'he', 'fa'];

const englishFile = JSON.parse(fs.readFileSync('src/utils/translations/en.json', 'utf8'));

async function updateLanguage(lang, existing, englishData, path = '') {
  for (const [key, value] of Object.entries(englishData)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (key.includes('PLACEHOLDER') || key === 'brandName') {
      if (!existing[key]) existing[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      if (!existing[key] || existing[key] === value) {
        try {
          const [result] = await translate.translate(value, lang);
          existing[key] = result;
          console.log(`  ✓ ${currentPath}`);
        } catch (e) {
          existing[key] = value;
        }
        await new Promise(r => setTimeout(r, 80));
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      if (!existing[key]) existing[key] = {};
      await updateLanguage(lang, existing[key], value, currentPath);
    }
  }
}

async function updateAll() {
  console.log('🌍 Updating all 29 languages with tonight\'s new keys...\n');
  
  for (const lang of LANGS) {
    console.log(`Updating ${lang}...`);
    const filePath = `src/utils/translations/${lang}.json`;
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    await updateLanguage(lang, existing, englishFile);
    
    // Fix brand name
    if (existing.dimensionOverlay) {
      existing.dimensionOverlay.brandName = 'PanHandler';
      if (existing.dimensionOverlay.supporter && existing.dimensionOverlay.panhandlerSupporter) {
        existing.dimensionOverlay.panhandlerSupporter = `PanHandler ${existing.dimensionOverlay.supporter}`;
      }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    console.log(`✅ ${lang} complete\n`);
  }
  
  console.log('\n🎉 All 29 languages updated with tonight\'s new translations!');
}

updateAll().catch(console.error);

