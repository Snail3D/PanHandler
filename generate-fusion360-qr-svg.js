/**
 * Generate SVG QR codes properly sized for Fusion 360 import
 * 
 * Fusion 360 interprets SVG files at 96 DPI (pixels per inch)
 * For a 30mm QR code: 30mm = 1.181 inches = 113.4 pixels at 96 DPI
 * 
 * Usage: node generate-fusion360-qr-svg.js
 */

const fs = require('fs');
const path = require('path');

// Use qrcode-svg which generates vector paths (required for Fusion 360)
const QRCodeSVG = require('qrcode-svg');

// QR code configurations: platform and size
const qrConfigs = [
  { platform: 'Android', size: 30, url: 'https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-30mm' },
  { platform: 'iPhone', size: 30, url: 'https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-30mm' },
  { platform: 'iPhone', size: 180, url: 'https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-180mm' },
  { platform: 'Android', size: 180, url: 'https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-180mm' },
];

// Convert mm to pixels at 96 DPI (Fusion 360's default)
function mmToPixels(mm) {
  const inches = mm / 25.4;
  return Math.round(inches * 96);
}

// Generate SVG with proper dimensions for Fusion 360 using vector paths
async function generateFusion360QR(sizeMM, platform, qrURL) {
  
  // Calculate pixel dimensions at 96 DPI (Fusion 360's interpretation)
  // Fusion 360 uses 96 DPI, so: pixels = (mm / 25.4) * 96
  const pixels = mmToPixels(sizeMM);
  
  // Use qrcode-svg to get the QR code matrix, then generate individual rectangles
  const qr = new QRCodeSVG({
    content: qrURL,
    padding: 0, // No quiet zone - QR code pattern itself is exactly the size
    width: pixels,
    height: pixels,
    color: '#000000',
    background: '#FFFFFF',
    ecl: 'M', // Error correction level
  });
  
  // Get the QR code matrix data
  const qrMatrix = qr.qrcode.modules;
  const moduleCount = qrMatrix.length;
  const moduleSize = pixels / moduleCount; // Size of each module in pixels
  
  // Combine all black modules into a single path element
  // This makes all black squares one selectable unit in Fusion 360
  const pathCommands = [];
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrMatrix[row][col]) {
        // This is a black module - add rectangle to path
        const x = col * moduleSize;
        const y = row * moduleSize;
        // Use path commands: M (move), L (line), Z (close)
        pathCommands.push(`M ${x} ${y} L ${x + moduleSize} ${y} L ${x + moduleSize} ${y + moduleSize} L ${x} ${y + moduleSize} Z`);
      }
    }
  }
  
  // Create SVG with white background and single combined path for all black modules
  // All black squares are one path element - select as one unit
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${sizeMM}mm" height="${sizeMM}mm" viewBox="0 0 ${pixels} ${pixels}" 
     xmlns="http://www.w3.org/2000/svg">
  <!-- White background -->
  <rect x="0" y="0" width="${pixels}" height="${pixels}" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.2"/>
  <!-- All black modules as one combined path - select as one unit -->
  <path id="qr-black-modules" fill="#000000" d="${pathCommands.join(' ')}"/>
</svg>`;
  
  return svgContent;
}

// Main function
async function main() {
  const desktopPath = path.join(require('os').homedir(), 'Desktop');
  
  console.log('Generating Fusion 360-compatible QR code SVGs...');
  console.log('Saving to:', desktopPath);
  
  for (const config of qrConfigs) {
    try {
      const svg = await generateFusion360QR(config.size, config.platform, config.url);
      const filename = `${config.platform}_${config.size}mm.svg`;
      const filepath = path.join(desktopPath, filename);
      
      fs.writeFileSync(filepath, svg, 'utf8');
      console.log(`✅ Generated: ${filename}`);
    } catch (error) {
      console.error(`❌ Error generating ${config.platform} ${config.size}mm:`, error);
    }
  }
  
  console.log('\n📐 Fusion 360 Import Instructions:');
  console.log('1. Insert → Canvas → Select SVG file');
  console.log('2. The QR code should import at exactly the specified size (30mm or 180mm)');
  console.log('3. If it\'s still wrong, manually calibrate:');
  console.log('   - Right-click canvas → Calibrate');
  console.log('   - Measure the QR code');
  console.log('   - Enter: 30mm (or 180mm for large)');
}

// Run the script
main().catch(console.error);

