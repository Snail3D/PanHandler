// Generate 50 maker/designer quotes for each language (excluding English)
// English already has 200+ quotes in the codebase

const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');
const path = require('path');

// Initialize Google Cloud Translate
const translate = new Translate({
  projectId: 'panhandler-i18n',
});

// 30 languages (English source + 29 translations)
const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ur', name: 'Urdu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'de', name: 'German' },
  { code: 'jv', name: 'Javanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'it', name: 'Italian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Indonesian' },
  { code: 'th', name: 'Thai' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'fil', name: 'Filipino' },
  { code: 'am', name: 'Amharic' },
  { code: 'my', name: 'Burmese' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Farsi' },
];

// 50 maker/designer quotes (mix of technical, inspirational, and humorous)
const ENGLISH_QUOTES = [
  // Technical/Engineering (15)
  "Measure twice, cut once.",
  "Precision is the difference between amateur and professional.",
  "Good design is invisible.",
  "Form follows function.",
  "Simplicity is the ultimate sophistication.",
  "The best designs are the ones you don't notice.",
  "Engineering is the art of organizing technology.",
  "A good craftsman never blames their tools.",
  "Prototype early, prototype often.",
  "Iteration is the key to perfection.",
  "Constraints breed creativity.",
  "Design is not just what it looks like, it's how it works.",
  "The details are not the details. They make the design.",
  "Less is more.",
  "If you can't explain it simply, you don't understand it well enough.",
  
  // Maker/DIY Culture (15)
  "If you can dream it, you can build it.",
  "The best time to start was yesterday. The second best time is now.",
  "Build something that matters.",
  "Every expert was once a beginner.",
  "Fail fast, learn faster.",
  "Your first version doesn't have to be perfect.",
  "Done is better than perfect.",
  "The only way to do great work is to love what you do.",
  "Make something people want.",
  "Creativity is intelligence having fun.",
  "Innovation distinguishes between a leader and a follower.",
  "Ideas are cheap. Execution is everything.",
  "The best way to predict the future is to create it.",
  "Build, measure, learn.",
  "Start where you are. Use what you have. Do what you can.",
  
  // Inspirational/Motivational (10)
  "Dream big, start small.",
  "Progress, not perfection.",
  "Every master was once a disaster.",
  "Believe in yourself and all that you are.",
  "Small steps every day.",
  "You are capable of amazing things.",
  "Create the future you want to see.",
  "Don't wait for opportunity. Create it.",
  "Be fearless in the pursuit of what sets your soul on fire.",
  "The journey of a thousand miles begins with a single step.",
  
  // Humorous/Light (10)
  "I void warranties.",
  "Duct tape fixes everything. Except relationships.",
  "Coffee: Because adulting is hard.",
  "I'm not procrastinating, I'm prototyping.",
  "This is a feature, not a bug.",
  "Works on my machine.",
  "It's not broken, it's just... redesigned.",
  "I didn't choose the maker life. The maker life chose me.",
  "My other project is also unfinished.",
  "Powered by caffeine and stubbornness.",
];

// Helper function to delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Translate quotes to a target language
async function translateQuotes(quotes, targetLang) {
  console.log(`\n📝 Translating 50 quotes to ${targetLang.name}...`);
  
  const translatedQuotes = [];
  
  // Translate in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < quotes.length; i += batchSize) {
    const batch = quotes.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(quotes.length / batchSize)}...`);
    
    try {
      const [translations] = await translate.translate(batch, targetLang.code);
      const translationArray = Array.isArray(translations) ? translations : [translations];
      translatedQuotes.push(...translationArray);
      
      // Delay between batches
      if (i + batchSize < quotes.length) {
        await delay(1000); // 1 second delay
      }
    } catch (error) {
      console.error(`  ❌ Error translating batch: ${error.message}`);
      // Add fallback English quotes for failed batch
      translatedQuotes.push(...batch);
    }
  }
  
  console.log(`  ✅ Completed ${targetLang.name}`);
  return translatedQuotes;
}

// Generate quotes file for a language
function generateQuotesFile(langCode, quotes) {
  const filePath = path.join(__dirname, 'src', 'utils', 'quotes', `${langCode}.ts`);
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const content = `// ${langCode.toUpperCase()} - 50 maker/designer quotes
// Generated for PanHandler i18n

export const quotes_${langCode}: string[] = [
${quotes.map(q => `  "${q.replace(/"/g, '\\"')}",`).join('\n')}
];
`;
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  💾 Saved: ${filePath}`);
}

// Main translation process
async function main() {
  console.log('🌍 PanHandler Quote Translation');
  console.log('================================');
  console.log(`📊 50 quotes × 29 languages = 1,450 quotes`);
  console.log(`⏱️  Estimated time: ~15 minutes\n`);
  
  // Create quotes directory
  const quotesDir = path.join(__dirname, 'src', 'utils', 'quotes');
  if (!fs.existsSync(quotesDir)) {
    fs.mkdirSync(quotesDir, { recursive: true });
    console.log(`📁 Created directory: ${quotesDir}\n`);
  }
  
  // Generate English quotes file first
  console.log('📝 Generating English quotes file...');
  generateQuotesFile('en', ENGLISH_QUOTES);
  
  // Translate to all other languages
  for (const lang of LANGUAGES) {
    try {
      const translatedQuotes = await translateQuotes(ENGLISH_QUOTES, lang);
      generateQuotesFile(lang.code, translatedQuotes);
      await delay(2000); // 2 second delay between languages
    } catch (error) {
      console.error(`\n❌ Error with ${lang.name}: ${error.message}`);
      // Generate file with English fallback
      generateQuotesFile(lang.code, ENGLISH_QUOTES);
    }
  }
  
  // Generate index file
  console.log('\n📝 Generating index file...');
  const indexContent = `// Quote imports for all 30 languages
// Each language has 50 maker/designer quotes

${['en', ...LANGUAGES.map(l => l.code)].map(code => 
  `import { quotes_${code} } from './${code}';`
).join('\n')}

export const quotesByLanguage: Record<string, string[]> = {
${['en', ...LANGUAGES.map(l => l.code)].map(code => 
  `  '${code}': quotes_${code},`
).join('\n')}
};

// Get a random quote for a specific language
export function getRandomQuote(languageCode: string = 'en'): string {
  const quotes = quotesByLanguage[languageCode] || quotesByLanguage['en'];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
`;
  
  const indexPath = path.join(quotesDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`  💾 Saved: ${indexPath}`);
  
  console.log('\n✅ Quote generation complete!');
  console.log(`📊 Total files: ${LANGUAGES.length + 2} (29 translations + English + index)`);
  console.log(`📝 Total quotes: ${(LANGUAGES.length + 1) * 50} across 30 languages`);
  console.log('\n🎉 Ready to integrate into QuoteScreen!');
}

// Run
main().catch(console.error);

