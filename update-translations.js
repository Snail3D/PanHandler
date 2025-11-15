const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

const LANGS = ['es', 'zh', 'hi', 'fr', 'ar', 'bn', 'ru', 'pt', 'ur', 'id', 'de', 'ja', 'pl', 'el', 'sw', 'mr', 'te', 'tr', 'ko', 'ta', 'vi', 'ha', 'pa', 'fil', 'am', 'my', 'th'];

const newStrings = {
  'dimensionOverlay.supporter': 'Supporter',
  'dimensionOverlay.panhandlerSupporter': 'PanHandler Supporter',
  'dimensionOverlay.newPhoto': 'New Photo',
  'dimensionOverlay.mapMode': 'Map Mode',
  'dimensionOverlay.blueprintMode': 'Blueprint Mode',
  'cameraScreen.holdStill': 'Hold still',
  'cameraScreen.tiltBackward': 'Tilt backward',
  'cameraScreen.tiltForward': 'Tilt forward',
  'cameraScreen.tiltLeft': 'Tilt left',
  'cameraScreen.tiltRight': 'Tilt right'
};

async function updateAll() {
  for (const lang of LANGS) {
    console.log(`Updating ${lang}...`);
    const filePath = `src/utils/translations/${lang}.json`;
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    for (const [key, value] of Object.entries(newStrings)) {
      const [section, subkey] = key.split('.');
      if (!existing[section]) existing[section] = {};
      
      try {
        const [result] = await translate.translate(value, lang);
        existing[section][subkey] = result;
        console.log(`  ✓ ${key}: ${result}`);
      } catch (e) {
        console.error(`  ✗ ${key}`);
        existing[section][subkey] = value;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  }
  console.log('\n✅ All languages updated!');
}

updateAll().catch(console.error);

