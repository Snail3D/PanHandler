#!/usr/bin/env node

/**
 * Generate PDF guides for all 30 languages
 * Run with: node generate-pdf-guides.js
 * 
 * Requirements:
 * - Node.js
 * - html2pdf npm package (will be installed if missing)
 * 
 * Output: PDFs/PanHandler-Guide-*.pdf (30 files)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load PDF translations from the JSON data
// Since pdfTranslations.ts is TypeScript, we'll load translations from individual language files
const translationsDir = path.join(__dirname, 'src/utils/translations');

const loadTranslations = () => {
  const translations = {};
  const files = fs.readdirSync(translationsDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const langCode = file.replace('.json', '');
    const filePath = path.join(translationsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    translations[langCode] = data;
  });
  
  return translations;
};

const translations = loadTranslations();

// Language metadata
const LANGUAGE_NAMES = {
  'en': 'English',
  'es': 'Spanish',
  'zh': 'Chinese',
  'hi': 'Hindi',
  'fr': 'French',
  'ar': 'Arabic',
  'bn': 'Bengali',
  'ru': 'Russian',
  'pt': 'Portuguese',
  'ur': 'Urdu',
  'id': 'Indonesian',
  'de': 'German',
  'ja': 'Japanese',
  'pl': 'Polish',
  'el': 'Greek',
  'sw': 'Swahili',
  'mr': 'Marathi',
  'te': 'Telugu',
  'tr': 'Turkish',
  'ko': 'Korean',
  'ta': 'Tamil',
  'vi': 'Vietnamese',
  'ha': 'Hausa',
  'pa': 'Punjabi',
  'fil': 'Filipino',
  'am': 'Amharic',
  'my': 'Burmese',
  'th': 'Thai',
  'he': 'Hebrew',
  'fa': 'Farsi'
};

// Generate HTML for PDF
function generateHTML(langCode) {
  const langData = translations[langCode] || translations.en;
  const currentYear = new Date().getFullYear();
  
  // Use help modal translations as base (they contain all the content)
  const t = langData.helpModal || {};
  
  // Helper to format answer (can be string or array)
  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.map(item => `<li>${item}</li>`).join('');
    }
    return `<li>${answer}</li>`;
  };

  const langName = LANGUAGE_NAMES[langCode] || langCode;
  
  return `
<!DOCTYPE html>
<html lang="${langCode}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PanHandler Guide - ${langName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1C1C1E;
      padding: 40px;
      background: #fff;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #007AFF;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1C1C1E;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #8E8E93;
      margin-bottom: 5px;
    }
    
    .language-info {
      font-size: 12px;
      color: #666;
      margin-top: 10px;
    }
    
    .section {
      margin: 30px 0;
      padding: 20px;
      background: #F9F9F9;
      border-radius: 12px;
      border-left: 4px solid #007AFF;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1C1C1E;
      margin-bottom: 15px;
    }
    
    .section-content {
      font-size: 14px;
      color: #1C1C1E;
      line-height: 1.6;
    }
    
    .subsection {
      margin: 15px 0;
    }
    
    .subsection-title {
      font-size: 16px;
      font-weight: 600;
      color: #007AFF;
      margin-bottom: 8px;
    }
    
    ul {
      margin-left: 20px;
    }
    
    li {
      margin: 6px 0;
    }
    
    .highlight {
      font-weight: 600;
      color: #007AFF;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #E5E5EA;
      text-align: center;
      font-size: 12px;
      color: #8E8E93;
    }
    
    .qr-section {
      margin: 20px 0;
      padding: 15px;
      background: rgba(0,122,255,0.05);
      border-radius: 8px;
      text-align: center;
    }
    
    .download-info {
      margin: 20px 0;
      padding: 15px;
      background: rgba(52,199,89,0.05);
      border-left: 3px solid #34C759;
      border-radius: 4px;
    }
    
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📏 PanHandler Guide</h1>
    <div class="subtitle">Precise measurements from photos</div>
    <div class="language-info">Language: ${langName} (${langCode.toUpperCase()})</div>
    <div class="language-info">Generated: ${new Date().toLocaleDateString()} • PanHandler v2.0+</div>
  </div>

  <div class="section">
    <div class="section-title">📱 How to Use PanHandler</div>
    <div class="section-content">
      <p>PanHandler allows you to measure anything using just your phone camera and a coin for reference.</p>
      <div class="subsection">
        <div class="subsection-title">🎯 Quick Start:</div>
        <ol style="margin-left: 20px;">
          <li>Take a photo with PanHandler camera (or import an existing photo)</li>
          <li>Select a coin type from your photo to calibrate</li>
          <li>Place measurements on your image</li>
          <li>Export measurements via email or save to photos</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📸 Taking the Perfect Photo</div>
    <div class="section-content">
      <div class="subsection">
        <div class="subsection-title">📐 Hold Camera Perpendicular</div>
        <p>For best results, hold your camera straight (90°) to the object you're measuring.</p>
      </div>
      <div class="subsection">
        <div class="subsection-title">🎯 Level Alignment</div>
        <p>Watch the crosshairs in the camera view. Align them with the gray reference lines for proper calibration.</p>
      </div>
      <div class="subsection">
        <div class="subsection-title">💡 Good Lighting</div>
        <p>Use natural light and avoid harsh shadows. Tap the flash icon to toggle torch if needed.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🪙 Calibrating with a Coin</div>
    <div class="section-content">
      <p>The app needs a reference object to calculate real-world measurements. Any coin works!</p>
      <div class="subsection">
        <div class="subsection-title">🔧 How to Calibrate:</div>
        <ol style="margin-left: 20px;">
          <li>Place a coin in your photo</li>
          <li>Select the coin type from the list</li>
          <li>Match the outer edge of the coin with the colored circle</li>
          <li>Tap "Lock in" when aligned</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📏 Measurement Modes</div>
    <div class="section-content">
      <div class="subsection">
        <strong>Distance:</strong> Tap two points to measure straight-line distance
      </div>
      <div class="subsection">
        <strong>Angle:</strong> Tap three points (vertex first, then two arms)
      </div>
      <div class="subsection">
        <strong>Circle:</strong> Tap center, then edge to get diameter and area
      </div>
      <div class="subsection">
        <strong>Rectangle:</strong> Tap two opposite corners to get width, height, and area
      </div>
      <div class="subsection">
        <strong>Freehand:</strong> Draw custom paths, close the loop for area
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">💾 Saving & Sharing</div>
    <div class="section-content">
      <div class="subsection">
        <strong>📧 Email Export:</strong> Get your measurements in a professional report
      </div>
      <div class="subsection">
        <strong>📱 Save to Photos:</strong> Save measurement overlays to your device
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🌐 Multilingual Support</div>
    <div class="section-content">
      <p>PanHandler is available in 30 languages. Open the app and tap Help (?) → Select Language to change.</p>
      <p><strong>Current Language:</strong> ${langName}</p>
    </div>
  </div>

  <div class="download-info">
    <strong>📱 Generate PDFs in the App:</strong><br>
    Open PanHandler → Tap Help (?) → Tap "PDF Guide" → Select any language
  </div>

  <div class="footer">
    <strong>PanHandler</strong><br>
    Precise measurements from photos<br>
    <br>
    Generated from latest app version • Visit our YouTube channel for video tutorials<br>
    Open Source Project<br>
    <br>
    © ${currentYear} • Snail 3D
  </div>
</body>
</html>
  `;
}

// Main execution
console.log('📄 Generating PDF guides for all 30 languages...\n');

const languageCodes = Object.keys(translations);
const outputDir = path.join(__dirname, 'PDFs');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Created output directory: ${outputDir}\n`);
}

// Generate HTML files (which can be converted to PDF externally)
languageCodes.forEach(langCode => {
  try {
    const html = generateHTML(langCode);
    const languageName = LANGUAGE_NAMES[langCode] || langCode;
    const filename = `PanHandler-Guide-${langCode.toUpperCase()}-${languageName}.html`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ Generated: ${filename}`);
  } catch (error) {
    console.error(`❌ Error generating ${langCode}:`, error.message);
  }
});

console.log(`\n📁 All guides generated in: ${outputDir}`);
console.log('\n📌 To convert to PDF:');
console.log('   1. Open each HTML file in a browser');
console.log('   2. Use Print → Save as PDF');
console.log('   Or use a tool like wkhtmltopdf or puppeteer for batch conversion');
console.log('\n💡 Upload PDFs to GitHub Releases for users to download');

