#!/usr/bin/env node

/**
 * Generate 50 maker/designer quotes for each language
 * Uses Google Cloud Translation API to translate English quotes
 * 
 * USAGE: 
 *   node generate-50-quotes.js [GOOGLE_API_KEY]
 * 
 * Get API key from: https://console.cloud.google.com/
 * Enable Translation API: https://console.cloud.google.com/apis/api/translate.googleapis.com
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Check for API key
const API_KEY = process.argv[2];
if (!API_KEY) {
  console.log('❌ ERROR: Google Cloud API key required');
  console.log('Usage: node generate-50-quotes.js YOUR_API_KEY');
  console.log('\nTo get an API key:');
  console.log('1. Go to: https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Translation API');
  console.log('4. Create API key in Credentials section');
  process.exit(1);
}

// Base English quotes (50 quotes)
const englishQuotes = [
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
  "I void warranties.",
  "Duct tape fixes everything. Except relationships.",
  "Coffee: Because adulting is hard.",
  "I'm not procrastinating, I'm prototyping.",
  "This is a feature, not a bug.",
  "Works on my machine.",
  "It's not a bug, it's a feature.",
  "There's no place like 127.0.0.1.",
  "sudo make me a sandwich.",
  "Have you tried turning it off and on again?"
];

// Language codes for all supported languages (excluding English)
const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'jv', name: 'Javanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ur', name: 'Urdu' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Farsi' },
  { code: 'el', name: 'Greek' },
  { code: 'ha', name: 'Hausa' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'fil', name: 'Filipino' },
  { code: 'am', name: 'Amharic' },
  { code: 'my', name: 'Burmese' },
  { code: 'th', name: 'Thai' }
];

// Function to translate text using Google Translate API
function translateText(text, targetLanguage) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      q: text,
      target_language: targetLanguage,
      source_language: 'en'
    });

    const options = {
      hostname: 'translation.googleapis.com',
      port: 443,
      path: `/language/translate/v2?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Goog-Api-Client': 'gapic/1.0.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data.translations && response.data.translations[0]) {
            resolve(response.data.translations[0].translatedText);
          } else if (response.error) {
            reject(new Error(response.error.message || JSON.stringify(response.error)));
          } else {
            reject(new Error('Unexpected response format: ' + JSON.stringify(response)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Function to translate all quotes for a language
async function translateQuotesForLanguage(langCode, langName) {
  console.log(`\n📝 Translating quotes for ${langName}...`);
  const translatedQuotes = [];

  for (let i = 0; i < englishQuotes.length; i++) {
    try {
      const translated = await translateText(englishQuotes[i], langCode);
      translatedQuotes.push(translated);
      process.stdout.write(`\r  ${i + 1}/${englishQuotes.length} quotes translated`);
    } catch (error) {
      console.error(`\n❌ Error translating quote ${i + 1}:`, error.message);
      // Fall back to English if translation fails
      translatedQuotes.push(englishQuotes[i]);
    }
  }

  console.log(`\n✅ ${langName}: ${translatedQuotes.length} quotes ready`);
  return translatedQuotes;
}

// Main function
async function generateAllQuotes() {
  console.log('🌍 Generating 50 quotes for each language...\n');
  console.log(`Using API Key: ${API_KEY.substring(0, 20)}...`);

  const quotesDir = path.join(__dirname, 'src/utils/quotes');

  // Process each language
  for (const lang of LANGUAGES) {
    try {
      const translatedQuotes = await translateQuotesForLanguage(lang.code, lang.name);

      // Generate TypeScript file
      const tsContent = `// ${lang.code.toUpperCase()} - 50 maker/designer quotes
// Generated for PanHandler i18n

export const quotes_${lang.code}: string[] = [
${translatedQuotes.map((q) => `  "${q.replace(/"/g, '\\"')}",`).join('\n')}
];
`;

      const filePath = path.join(quotesDir, `${lang.code}.ts`);
      fs.writeFileSync(filePath, tsContent, 'utf8');
      console.log(`  ✅ Wrote: ${lang.code}.ts`);

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to generate quotes for ${lang.name}:`, error.message);
    }
  }

  console.log('\n✅ Quote generation complete!');
  console.log('📊 Files updated in: src/utils/quotes/');
}

// Run the generator
generateAllQuotes().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

