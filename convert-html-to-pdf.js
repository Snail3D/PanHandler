#!/usr/bin/env node

/**
 * Convert all HTML PDF guides to actual PDF files
 * Uses Puppeteer to render HTML and save as PDF
 * Run with: node convert-html-to-pdf.js
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PDFs_DIR = path.join(__dirname, 'PDFs');
const OUTPUT_DIR = path.join(__dirname, 'PDFs');

async function convertHtmlToPdf() {
  console.log('📄 Converting HTML files to PDF...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const files = fs.readdirSync(PDFs_DIR)
      .filter(f => f.endsWith('.html'))
      .sort();

    console.log(`Found ${files.length} HTML files to convert\n`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const htmlPath = path.join(PDFs_DIR, file);
      const pdfPath = path.join(OUTPUT_DIR, file.replace('.html', '.pdf'));
      
      try {
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 1600 });
        
        // Load the HTML file
        await page.goto(`file://${htmlPath}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // Generate PDF
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          margin: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in'
          },
          printBackground: true
        });
        
        await page.close();
        
        const sizeKB = (fs.statSync(pdfPath).size / 1024).toFixed(1);
        console.log(`✅ [${i + 1}/${files.length}] ${file.replace('.html', '.pdf')} (${sizeKB} KB)`);
        
      } catch (error) {
        console.error(`❌ Error converting ${file}: ${error.message}`);
      }
    }

    console.log(`\n✨ All PDF files generated successfully!`);
    console.log(`📁 Location: ${OUTPUT_DIR}\n`);
    
    // List all PDFs
    const pdfFiles = fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.endsWith('.pdf'))
      .sort();
    
    console.log(`📊 Summary:`);
    console.log(`   Total PDFs: ${pdfFiles.length}`);
    const totalSize = pdfFiles.reduce((sum, f) => {
      return sum + fs.statSync(path.join(OUTPUT_DIR, f)).size;
    }, 0);
    console.log(`   Total Size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
    console.log(`\n🚀 Next Steps:`);
    console.log(`   1. Verify PDFs look correct`);
    console.log(`   2. Create GitHub release: git tag -a pdf-guides-v1 -m "PDF Guides for all 30 languages"`);
    console.log(`   3. Push tag: git push origin pdf-guides-v1`);
    console.log(`   4. Upload PDFs to GitHub release`);
    console.log(`   5. Test download links in README`);

  } finally {
    await browser.close();
  }
}

convertHtmlToPdf().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

