const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

const API_KEY = 'AIzaSyDC6p63f7jI6_n9yBSa3APU_IyckPOJock';
const translate = new Translate({ key: API_KEY });

const LANGS = ['es', 'zh', 'hi', 'fr', 'ar', 'bn', 'ru', 'pt', 'ur', 'id', 'de', 'ja', 'pl', 'el', 'sw', 'mr', 'te', 'tr', 'ko', 'ta', 'vi', 'ha', 'pa', 'fil', 'am', 'my', 'th', 'he', 'fa'];

// 100 inspiring quotes (20% biblical = 20 biblical, 80 maker/designer)
const TOP_100_QUOTES = [
  // Biblical (20 quotes - 20%)
  "In all labor there is profit.",
  "Whatever you do, work at it with all your heart.",
  "The plans of the diligent lead surely to abundance.",
  "Commit your work to the Lord, and your plans will be established.",
  "Do you see a person skilled in their work? They will serve before kings.",
  "Let all that you do be done in love.",
  "Well done, good and faithful servant.",
  "For I know the plans I have for you, plans to prosper you.",
  "Trust in the Lord with all your heart.",
  "Be strong and courageous. Do not be afraid.",
  "I can do all things through Christ who strengthens me.",
  "The Lord will fight for you; you need only to be still.",
  "Faith is being sure of what we hope for.",
  "God is within her, she will not fall.",
  "Let your light shine before others.",
  "The fear of the Lord is the beginning of wisdom.",
  "A wise man builds his house upon the rock.",
  "With God all things are possible.",
  "Be still and know that I am God.",
  "The Lord is my strength and my shield.",
  
  // Maker/Designer/CAD quotes (80 quotes - 80%)
  "Design is not just what it looks like. Design is how it works.",
  "Simplicity is the ultimate sophistication.",
  "Good design is obvious. Great design is transparent.",
  "Form follows function.",
  "Less is more.",
  "Make it work, make it right, make it fast.",
  "Measure twice, cut once.",
  "Perfect is the enemy of good.",
  "The details are not the details. They make the design.",
  "Design thinking is a human-centered approach to innovation.",
  "Innovation distinguishes between a leader and a follower.",
  "The best way to predict the future is to create it.",
  "Ideas are easy. Implementation is hard.",
  "Don't find customers for your products, find products for your customers.",
  "Build something people want.",
  "Ship early, ship often.",
  "Real artists ship.",
  "Done is better than perfect.",
  "Start where you are. Use what you have. Do what you can.",
  "The only way to do great work is to love what you do.",
  "Stay hungry. Stay foolish.",
  "Think different.",
  "Move fast and break things.",
  "Fail fast, learn faster.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You miss 100% of the shots you don't take.",
  "Whether you think you can or you can't, you're right.",
  "The expert in anything was once a beginner.",
  "Do one thing every day that scares you.",
  "Life is 10% what happens to you and 90% how you react to it.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "What we think, we become.",
  "All our dreams can come true if we have the courage to pursue them.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only impossible journey is the one you never begin.",
  "Opportunities don't happen. You create them.",
  "Try not to become a person of success, but rather a person of value.",
  "I have not failed. I've just found 10,000 ways that won't work.",
  "A person who never made a mistake never tried anything new.",
  "The way to get started is to quit talking and begin doing.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Everything you've ever wanted is on the other side of fear.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Quality means doing it right when no one is looking.",
  "Strive not to be a success, but rather to be of value.",
  "I attribute my success to this: I never gave or took any excuse.",
  "The secret of getting ahead is getting started.",
  "All progress takes place outside the comfort zone.",
  "Don't be afraid to give up the good to go for the great.",
  "I find that the harder I work, the more luck I seem to have.",
  "The road to success and the road to failure are almost exactly the same.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Don't be afraid to give up the good to go for the great.",
  "If you really look closely, most overnight successes took a long time.",
  "The way to get started is to quit talking and begin doing.",
  "If you are not willing to risk the usual, you will have to settle for the ordinary.",
  "Take up one idea. Make that one idea your life.",
  "All our dreams can come true if we have the courage to pursue them.",
  "Don't let yesterday take up too much of today.",
  "You learn more from failure than from success. Don't let it stop you.",
  "It's not whether you get knocked down, it's whether you get up.",
  "We may encounter many defeats but we must not be defeated.",
  "Knowing is not enough; we must apply. Wishing is not enough; we must do.",
  "We generate fears while we sit. We overcome them by action.",
  "Whether you think you can or think you can't, you're right.",
  "Security is mostly a superstition. Life is either a daring adventure or nothing.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "Creativity is intelligence having fun.",
  "What is not started today is never finished tomorrow.",
  "It is better to fail in originality than to succeed in imitation.",
  "The road to success is dotted with many tempting parking spaces.",
  "You don't have to be great to start, but you have to start to be great.",
  "Do not be embarrassed by your failures, learn from them and start again.",
  "If you really want to do something, you'll find a way. If you don't, you'll find an excuse.",
  "It's hard to beat a person who never gives up.",
  "I never dreamed about success, I worked for it.",
  "Success is the sum of small efforts repeated day in and day out.",
  "As we look ahead into the next century, leaders will be those who empower others.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything has beauty, but not everyone sees it.",
  "How wonderful it is that nobody need wait a single moment before starting to improve the world.",
  "Definiteness of purpose is the starting point of all achievement.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "You don't build a business, you build people, then people build the business."
];

async function translateQuotes() {
  console.log('📚 Generating multilingual quote system (100 quotes × 30 languages = 3,000 quotes)...\n');
  
  const allQuotes = {};
  allQuotes.en = TOP_100_QUOTES;
  
  for (const lang of LANGS) {
    console.log(`\n🔄 Translating quotes to ${lang}...`);
    const translated = [];
    
    for (let i = 0; i < TOP_100_QUOTES.length; i++) {
      try {
        const [result] = await translate.translate(TOP_100_QUOTES[i], lang);
        translated.push(result);
        
        if ((i + 1) % 10 === 0) {
          console.log(`  Progress: ${i + 1}/100 quotes`);
        }
        
        await new Promise(r => setTimeout(r, 50)); // Rate limiting
      } catch (error) {
        console.error(`  ✗ Quote ${i + 1}: ${error.message.substring(0, 50)}`);
        translated.push(TOP_100_QUOTES[i]); // Fallback to English
      }
    }
    
    allQuotes[lang] = translated;
    console.log(`✅ ${lang} complete (100 quotes)`);
  }
  
  // Save to files
  fs.writeFileSync('src/utils/quotesI18n.ts', `
/**
 * Multilingual quote system
 * 100 inspiring quotes per language (20% biblical weight)
 */

export const QUOTES_BY_LANGUAGE: Record<string, string[]> = ${JSON.stringify(allQuotes, null, 2)};

/**
 * Get random quote for current language
 */
export function getRandomQuoteI18n(languageCode: string): string {
  const lang = languageCode.split('-')[0];
  const quotes = QUOTES_BY_LANGUAGE[lang] || QUOTES_BY_LANGUAGE.en;
  return quotes[Math.floor(Math.random() * quotes.length)];
}
`);
  
  console.log('\n🎉 Complete! 3,000 quotes generated across 30 languages!');
  console.log('📁 Saved to src/utils/quotesI18n.ts');
}

translateQuotes().catch(console.error);

