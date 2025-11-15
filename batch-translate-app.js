/**
 * Batch Translation Script for PanHandler
 * Translates all app content to 22 languages using Google Cloud Translation API
 * 
 * SETUP:
 * 1. Get API key from: https://console.cloud.google.com/apis/credentials
 * 2. Enable Cloud Translation API
 * 3. Set API_KEY below
 * 4. Run: node batch-translate-app.js
 */

const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

// ⚠️ SET YOUR API KEY HERE
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || 'YOUR_API_KEY_HERE';

if (API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('❌ Please set your Google Cloud Translation API key!');
  console.error('   Set GOOGLE_TRANSLATE_API_KEY environment variable or edit this file');
  process.exit(1);
}

const translate = new Translate({ key: API_KEY });

// 22 target languages with metadata
const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', coin: '€1 Euro' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', coin: '1 Yuan' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', coin: '₹10 Rupee' },
  { code: 'fr', name: 'French', flag: '🇫🇷', coin: '€1 Euro' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', coin: 'Saudi Riyal', rtl: true },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', coin: '₹10 Rupee' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', coin: '10 Ruble' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', coin: '€1 Euro' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', coin: '₹10 Rupee', rtl: true },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', coin: '1000 Rupiah' },
  { code: 'de', name: 'German', flag: '🇩🇪', coin: '€1 Euro' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', coin: '500 Yen' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', coin: '1 Złoty' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', coin: '€1 Euro' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', coin: 'Kenyan 20 Shilling' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', coin: '₹10 Rupee' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', coin: '₹10 Rupee' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', coin: '1 Lira' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', coin: '500 Won' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', coin: '₹10 Rupee' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', coin: '5000 Dong' }
];

// Load English template
const englishTranslations = JSON.parse(
  fs.readFileSync('src/utils/translations/en.json', 'utf8')
);

async function translateObject(obj, targetLang, path = '') {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Skip placeholder keys
    if (key.includes('PLACEHOLDER') || key.includes('ARRAY')) {
      translated[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      try {
        const [result] = await translate.translate(value, targetLang);
        translated[key] = result;
        console.log(`  ✓ ${currentPath}`);
      } catch (error) {
        console.error(`  ✗ ${currentPath}: ${error.message}`);
        translated[key] = value; // Keep English as fallback
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      translated[key] = await translateObject(value, targetLang, currentPath);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function batchTranslate() {
  console.log('🌍 Starting batch translation of PanHandler to 21 languages...\n');
  console.log(`📊 Estimated strings to translate: ~${countStrings(englishTranslations)} per language\n`);
  
  const startTime = Date.now();
  
  for (const lang of LANGUAGES) {
    console.log(`\n🔄 Translating to ${lang.name} (${lang.code})...`);
    
    try {
      const translated = await translateObject(englishTranslations, lang.code);
      
      // Save to file
      const outputPath = `src/utils/translations/${lang.code.split('-')[0]}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
      
      console.log(`✅ ${lang.name} complete! Saved to ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to translate ${lang.name}:`, error.message);
    }
    
    // Delay between languages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n🎉 Batch translation complete!`);
  console.log(`⏱️  Total time: ${elapsed} minutes`);
  console.log(`📁 Translation files saved to src/utils/translations/`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review translations for accuracy`);
  console.log(`   2. Update src/utils/i18n.ts to import all language files`);
  console.log(`   3. Test language switching in app`);
}

function countStrings(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') {
      count++;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      count += countStrings(value);
    }
  }
  return count;
}

// Check if google-cloud/translate is installed
try {
  require('@google-cloud/translate');
} catch (e) {
  console.error('❌ @google-cloud/translate not installed!');
  console.error('   Run: npm install @google-cloud/translate');
  process.exit(1);
}

batchTranslate().catch(console.error);

