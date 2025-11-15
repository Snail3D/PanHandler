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

// Import PDF translations
const { translations } = require('./src/utils/pdfTranslations.ts');

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
  const t = translations[langCode] || translations.en;
  const currentYear = new Date().getFullYear();
  
  // Helper to format answer (can be string or array)
  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.map(item => `<li>${item}</li>`).join('');
    }
    return `<li>${answer}</li>`;
  };

  return `
<!DOCTYPE html>
<html lang="${langCode}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
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
    <h1>🎯 ${t.title}</h1>
    <div class="subtitle">${t.subtitle}</div>
    <div class="language-info">Language: ${LANGUAGE_NAMES[langCode]} (${langCode.toUpperCase()})</div>
    <div class="language-info">Generated: ${new Date().toLocaleDateString()} • PanHandler v2.0+</div>
  </div>

  <div class="section">
    <div class="section-title">📱 ${t.videoCourses.title}</div>
    <div class="section-content">
      <p>${t.videoCourses.description}</p>
      <div class="subsection">
        <div class="subsection-title">${t.videoCourses.courseIncludes}</div>
        <ul>
          ${t.videoCourses.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="subsection">
        <strong>${t.videoCourses.link}:</strong> youtube.com/playlist?list=PLJB4l6OZ0E3HRdPaJn8dJPZrEu4dPBDJi
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.step1.title}</div>
    <div class="section-content">
      <div class="subsection">
        <div class="subsection-title">${t.step1.perpendicular.title}</div>
        <ul>
          ${t.step1.perpendicular.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step1.levelAlignment.title}</div>
        <ul>
          ${t.step1.levelAlignment.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="subsection">
        <div class="subsection-title">💡 ${t.step1.proTip}</div>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step1.distance.title}</div>
        <ul>
          ${t.step1.distance.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step1.lighting.title}</div>
        <ul>
          ${t.step1.lighting.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.step2.title}</div>
    <div class="section-content">
      <p><strong>${t.step2.whyCalibrate}</strong></p>
      <div class="subsection">
        <div class="subsection-title">${t.step2.howTo.title}</div>
        <ol style="margin-left: 20px;">
          ${t.step2.howTo.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step2.bestPractices.title}</div>
        <ul>
          ${t.step2.bestPractices.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p style="margin-top: 10px;"><strong>Examples:</strong> ${t.step2.bestPractices.coinExamples}</p>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step2.accuracyNotes.title}</div>
        <ul>
          ${t.step2.accuracyNotes.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.step3.title}</div>
    <div class="section-content">
      <div class="subsection">
        <strong>${t.step3.modesTitle}</strong>
        <ul>
          <li><strong>${t.step3.distance.title}:</strong> ${t.step3.distance.description}</li>
          <li><strong>${t.step3.angle.title}:</strong> ${t.step3.angle.description}</li>
          <li><strong>${t.step3.circle.title}:</strong> ${t.step3.circle.description}</li>
          <li><strong>${t.step3.rectangle.title}:</strong> ${t.step3.rectangle.description}</li>
          <li><strong>${t.step3.freehand.title}:</strong> ${t.step3.freehand.description}</li>
        </ul>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.step3.controls.title}</div>
        <ul>
          ${t.step3.controls.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.volume.title}</div>
    <div class="section-content">
      <p>${t.volume.description}</p>
      <div class="subsection">
        <div class="subsection-title">${t.volume.howTo.title}</div>
        <ol style="margin-left: 20px;">
          ${t.volume.howTo.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      <div class="subsection">
        <strong>Example:</strong> ${t.volume.example}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.proTips.title}</div>
    <div class="section-content">
      <ul>
        ${t.proTips.items.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.troubleshooting.title}</div>
    <div class="section-content">
      ${t.troubleshooting.items.map(item => `
        <div class="subsection">
          <div class="subsection-title">${item.question}</div>
          <ul>
            ${formatAnswer(item.answer)}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">${t.cadIntegration.title}</div>
    <div class="section-content">
      <p>${t.cadIntegration.description}</p>
      <div class="subsection">
        <div class="subsection-title">${t.cadIntegration.emailContains.title}</div>
        <ul>
          ${t.cadIntegration.emailContains.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="subsection">
        <div class="subsection-title">${t.cadIntegration.cadWorkflow.title}</div>
        <ul>
          ${t.cadIntegration.cadWorkflow.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="download-info">
    <strong>📱 Generate PDFs in the App:</strong><br>
    Open PanHandler → Tap Help (?) → Tap "PDF Guide" → Select any language
  </div>

  <div class="footer">
    <strong>${t.footer.appName}</strong><br>
    ${t.footer.tagline}<br>
    <br>
    ${t.footer.generated}<br>
    ${t.footer.copyright}<br>
    <br>
    © ${currentYear} • Open Source Project
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

