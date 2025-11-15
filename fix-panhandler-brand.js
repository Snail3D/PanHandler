const fs = require('fs');

const langs = ['es', 'zh', 'hi', 'fr', 'ar', 'bn', 'ru', 'pt', 'ur', 'id', 'de', 'ja', 'pl', 'el', 'sw', 'mr', 'te', 'tr', 'ko', 'ta', 'vi', 'ha', 'pa', 'fil', 'am', 'my', 'th'];

console.log('🔧 Fixing PanHandler brand name across all languages...\n');

for (const lang of langs) {
  const filePath = `src/utils/translations/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add brandName as untranslated
  if (data.dimensionOverlay) {
    data.dimensionOverlay.brandName = 'PanHandler';
  }
  
  // Fix panhandlerSupporter to preserve brand name
  if (data.dimensionOverlay && data.dimensionOverlay.panhandlerSupporter) {
    const current = data.dimensionOverlay.panhandlerSupporter;
    const supporterWord = data.dimensionOverlay.supporter || 'Supporter';
    
    // Replace with "PanHandler" + translated "Supporter"
    data.dimensionOverlay.panhandlerSupporter = `PanHandler ${supporterWord}`;
    
    console.log(`${lang}: "${current}" → "PanHandler ${supporterWord}"`);
  }
  
  // Fix subtitle to preserve brand name
  if (data.battlingBots && data.battlingBots.subtitle) {
    // Keep PanHandler in English, translate rest
    if (!data.battlingBots.subtitle.includes('PanHandler')) {
      // If it was transliterated, fix it
      const parts = data.battlingBots.subtitle.split(' ');
      if (parts.length > 0) {
        // Reconstruct with English PanHandler
        const rest = data.battlingBots.subtitle.substring(data.battlingBots.subtitle.indexOf(' '));
        data.battlingBots.subtitle = 'PanHandler' + rest;
      }
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log('\n✅ All languages fixed - PanHandler brand name preserved!');

