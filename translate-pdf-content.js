const translate = require('@vitalets/google-translate-api').translate;
const fs = require('fs');

const languages = [
  { code: 'zh-CN', name: 'Chinese', coins: '1 Yuan (25mm), 5 Jiao (20.5mm)' },
  { code: 'hi', name: 'Hindi', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'fr', name: 'French', coins: '€1 Euro (23.25mm), €2 Euro (25.75mm)' },
  { code: 'ar', name: 'Arabic', coins: 'Saudi Riyal, UAE Dirham' },
  { code: 'bn', name: 'Bengali', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'ru', name: 'Russian', coins: '10 Ruble (22mm), 5 Ruble (25mm)' },
  { code: 'pt', name: 'Portuguese', coins: '€1 Euro (23.25mm), €2 Euro (25.75mm)' },
  { code: 'ur', name: 'Urdu', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'id', name: 'Indonesian', coins: '1000 Rupiah (24mm), 500 Rupiah (24mm)' },
  { code: 'de', name: 'German', coins: '€1 Euro (23.25mm), €2 Euro (25.75mm)' },
  { code: 'ja', name: 'Japanese', coins: '500 Yen (26.5mm), 100 Yen (22.6mm)' },
  { code: 'sw', name: 'Swahili', coins: 'Kenyan Shilling, Tanzanian Shilling' },
  { code: 'mr', name: 'Marathi', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'te', name: 'Telugu', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'tr', name: 'Turkish', coins: '1 Lira (23.15mm), 50 Kuruş (23.85mm)' },
  { code: 'ko', name: 'Korean', coins: '500 Won (26.5mm), 100 Won (24mm)' },
  { code: 'ta', name: 'Tamil', coins: '₹5 Rupee (23mm), ₹10 Rupee (27mm)' },
  { code: 'vi', name: 'Vietnamese', coins: '5000 Dong (27mm), 2000 Dong (25.75mm)' }
];

const sampleText = {
  title: 'PanHandler Guide',
  subtitle: 'Complete Reference for Precise Measurements',
  step1Title: 'Step 1: Take a Perfect Photo',
  step2Title: 'Step 2: Calibrate with Coin',
  step3Title: 'Step 3: Place Measurements'
};

async function translateAll() {
  console.log('🌍 Starting translation of PDF content to 18 languages...\n');
  
  const results = {};
  
  for (const lang of languages) {
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    
    try {
      const titleRes = await translate(sampleText.title, { to: lang.code });
      const subtitleRes = await translate(sampleText.subtitle, { to: lang.code });
      const step1Res = await translate(sampleText.step1Title, { to: lang.code });
      const step2Res = await translate(sampleText.step2Title, { to: lang.code });
      const step3Res = await translate(sampleText.step3Title, { to: lang.code });
      
      results[lang.code] = {
        name: lang.name,
        title: titleRes.text,
        subtitle: subtitleRes.text,
        coinExamples: lang.coins,
        step1: step1Res.text,
        step2: step2Res.text,
        step3: step3Res.text
      };
      
      console.log(`✅ ${lang.name} complete`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error translating ${lang.name}:`, error.message);
      results[lang.code] = { name: lang.name, error: error.message };
    }
  }
  
  console.log('\n📄 Translation Results:\n');
  console.log(JSON.stringify(results, null, 2));
  
  fs.writeFileSync('translation-results.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Results saved to translation-results.json');
}

translateAll().catch(console.error);

