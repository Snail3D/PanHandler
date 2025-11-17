import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Generate QR code grid HTML for iOS
function generateIOSQRGrid(): string {
  const qrURL = 'https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-30mm';
  const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrURL)}`;
  return Array(24).fill(0).map(() => `
    <div class="grid-qr-item">
      <div class="grid-qr-code">
        <img src="${qrCodeImageURL}" alt="QR Code" />
      </div>
      <div class="grid-size-text">
        PanHandler - 30mm<br>
        side to side<br>
        <span style="font-size: 7pt; color: #8E8E93;">iOS</span>
      </div>
    </div>
  `).join('');
}

// Generate QR code grid HTML for Android
function generateAndroidQRGrid(): string {
  const qrURL = 'https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-30mm';
  const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrURL)}`;
  return Array(24).fill(0).map(() => `
    <div class="grid-qr-item">
      <div class="grid-qr-code">
        <img src="${qrCodeImageURL}" alt="QR Code" />
      </div>
      <div class="grid-size-text">
        PanHandler - 30mm<br>
        side to side<br>
        <span style="font-size: 7pt; color: #8E8E93;">Android</span>
      </div>
    </div>
  `).join('');
}

const PDF_CONTENT = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PanHandler Guide</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.6;
    color: #1C1C1E;
  }
  .header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 2px solid #E5E5EA;
    padding-bottom: 20px;
  }
  .header h1 {
    margin: 0;
    font-size: 32px;
    color: #667eea;
  }
  .header p {
    margin: 8px 0 0 0;
    color: #8E8E93;
  }
  .section {
    margin: 24px 0;
    padding: 16px;
    background: #F9F9F9;
    border-radius: 12px;
    border-left: 4px solid #667eea;
  }
  .section h3 {
    margin-top: 0;
    color: #667eea;
    font-size: 18px;
  }
  .section p {
    margin: 8px 0;
  }
  .section ul, .section ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  .section li {
    margin: 6px 0;
  }
  .tip-box {
    background: rgba(52, 199, 89, 0.08);
    border: 1px solid rgba(52, 199, 89, 0.2);
    border-radius: 8px;
    padding: 12px;
    margin: 12px 0;
    font-size: 14px;
  }
  .step-number {
    display: inline-block;
    background: #667eea;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    text-align: center;
    line-height: 28px;
    margin-right: 8px;
    font-weight: bold;
  }
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #E5E5EA;
    text-align: center;
    color: #8E8E93;
    font-size: 12px;
  }
  .full-page-qr {
    page-break-before: always;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    box-sizing: border-box;
    background: white;
  }
  .full-page-qr h2 {
    font-size: 24px;
    color: #1C1C1E;
    margin-bottom: 16px;
    text-align: center;
  }
  .full-page-qr .qr-container {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }
  .full-page-qr .qr-code-large {
    width: 100%;
    max-width: 600px;
    height: auto;
    aspect-ratio: 1;
    border: 4px solid #1C1C1E;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
  .full-page-qr .qr-label {
    margin-top: 24px;
    font-size: 18px;
    font-weight: 700;
    color: #1C1C1E;
    text-align: center;
  }
  .full-page-qr .qr-instructions {
    margin-top: 16px;
    padding: 16px;
    background: rgba(255, 59, 48, 0.1);
    border: 2px solid rgba(255, 59, 48, 0.3);
    border-radius: 12px;
    text-align: center;
    max-width: 500px;
  }
  .full-page-qr .qr-instructions strong {
    color: #FF3B30;
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
  }
  .full-page-qr .qr-instructions p {
    font-size: 12px;
    color: #3C3C43;
    margin: 4px 0;
    line-height: 1.5;
  }
  /* Grid page styles for 30mm QR codes */
  .qr-grid-page {
    page-break-before: always;
    width: 100%;
    min-height: 100vh;
    padding: 36pt;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .qr-grid-header {
    text-align: center;
    margin-bottom: 24pt;
  }
  .qr-grid-header h2 {
    font-size: 20px;
    color: #1C1C1E;
    margin-bottom: 8px;
  }
  .qr-grid-header p {
    font-size: 12px;
    color: #8E8E93;
  }
  .qr-grid-warning {
    font-size: 11px;
    font-weight: 700;
    color: #FF3B30;
    text-align: center;
    margin-top: 8px;
    padding: 8px;
    background: rgba(255, 59, 48, 0.1);
    border-radius: 4px;
  }
  .qr-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8pt;
    width: 100%;
    flex: 1;
    align-content: start;
  }
  .grid-qr-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #333;
    border-radius: 4px;
    padding: 8pt;
    box-sizing: border-box;
  }
  .grid-qr-code {
    width: 85pt;
    height: 85pt;
    margin-bottom: 4pt;
  }
  .grid-qr-code img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .grid-size-text {
    font-size: 9pt;
    font-weight: 600;
    color: #1C1C1E;
    text-align: center;
    line-height: 1.2;
  }
  .download-box {
    background: #f0f4ff;
    border: 2px solid #667eea;
    border-radius: 12px;
    padding: 16px;
    margin: 16px 0;
    text-align: center;
  }
  strong {
    color: #1C1C1E;
  }
</style>
</head>
<body>

<div class="header">
  <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
    <img src="data:image/jpeg;base64,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
" style="width: 48px; height: 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="PanHandler Icon" />
    <h1 style="margin: 0;">PanHandler Guide</h1>
  </div>
  <p>Complete Reference for Precise Measurements from Photos</p>
</div>

<div style="display: flex; justify-content: space-around; margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 12px;">
  <div style="text-align: center;">
    <strong style="display: block; margin-bottom: 8px;">📱 iPhone & iPad</strong>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/us/app/panhandler/id6754727828" width="150" height="150" alt="App Store QR" style="border-radius: 8px;" />
    <div style="margin-top: 8px; font-size: 12px;">App Store</div>
  </div>
  <div style="text-align: center;">
    <strong style="display: block; margin-bottom: 8px;">🤖 Android</strong>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=com.snail.panhandler" width="150" height="150" alt="Play Store QR" style="border-radius: 8px;" />
    <div style="margin-top: 8px; font-size: 12px;">Google Play Store</div>
  </div>
</div>

<div class="section">
  <h3><span class="step-number">1</span>Take a Perfect Photo</h3>
  <p><strong>Hold camera perpendicular (90°)</strong></p>
  <ul>
    <li>Flat surfaces: Look straight down</li>
    <li>Vertical surfaces: Face directly at walls/objects</li>
    <li>Keep the camera level - watch for tilting</li>
  </ul>
  <p><strong>Level Alignment</strong></p>
  <ul>
    <li>Watch the crosshairs - align with gray reference lines</li>
    <li>Horizontal crosshair: Shows if camera is tilted</li>
    <li>Vertical crosshair: Shows if camera is rotated</li>
  </ul>
  <div class="tip-box">
    💡 <strong>Pro Tip:</strong> The better your photo alignment, the more accurate your measurements!
  </div>
</div>

<div class="section">
  <h3><span class="step-number">2</span>Calibrate with a Coin or QR Code</h3>
  <p><strong>How to Calibrate:</strong></p>
  <ol>
    <li>Place a coin or QR code somewhere visible in your photo</li>
    <li>For coins: Select the coin type from the dropdown list</li>
    <li>For QR codes: PanHandler automatically detects and calibrates!</li>
    <li>Align the colored circle with the coin's edge (if using coin)</li>
    <li>Tap "Lock in" when perfectly aligned (if using coin)</li>
  </ol>
  <div class="tip-box">
    <strong>Common coins:</strong>
    <ul style="margin: 6px 0; padding-left: 18px;">
      <li>US Quarter: 24.26mm</li>
      <li>€1 Euro: 23.25mm</li>
      <li>£1 Pound: 22.50mm</li>
    </ul>
  </div>
  <p><strong>QR Code Calibration (Automatic!):</strong></p>
  <ul>
    <li>PanHandler automatically detects QR codes in your photos</li>
    <li>No manual calibration needed - it's instant!</li>
    <li>Generate QR codes from the Help menu → "PDF Guide and QR codes"</li>
    <li>Print at 100% scale for accurate 30mm calibration</li>
    <li>Perfect for workshops, construction sites, or anywhere you need quick calibration</li>
  </ul>
  <p><strong>Why coins or QR codes?</strong> Both have standardized sizes, making them perfect calibration references! QR codes offer automatic detection for even faster workflow.</p>
</div>

<div class="section">
  <h3><span class="step-number">3</span>Place Measurements</h3>
  <p>Choose your measurement tool:</p>
  
  <p><strong>📏 Distance</strong> - Tap two points to measure straight lines</p>
  <ul>
    <li>Great for: distances, heights, widths</li>
    <li>Connect multiple lines to auto-calculate areas!</li>
  </ul>
  
  <p><strong>📐 Angle</strong> - Tap three points: vertex first, then two arms</p>
  <ul>
    <li>Perfect for: slopes, corners, roof angles</li>
  </ul>
  
  <p><strong>⭕ Circle</strong> - Tap center, then edge</p>
  <ul>
    <li>Measures: diameter and area automatically</li>
  </ul>
  
  <p><strong>▭ Rectangle</strong> - Tap two opposite corners</p>
  <ul>
    <li>Great for: rooms, windows, flat surfaces</li>
  </ul>
  
  <p><strong>✏️ Freehand</strong> - Draw custom measurement paths</p>
  <ul>
    <li>Perfect for: irregular shapes, custom areas</li>
  </ul>
  
  <div class="tip-box">
    🔺 <strong>Polygon Magic:</strong> Connect multiple distance lines to create complex shapes. PanHandler automatically calculates the total area!
  </div>
</div>

<div class="section">
  <h3>📊 View Your Results</h3>
  <ul>
    <li>All measurements are shown in both Imperial and Metric</li>
    <li>Tap on any measurement to edit labels or values</li>
    <li>Export measurements directly to DWG (CAD format)</li>
    <li>Save photos with measurement overlays to your library</li>
  </ul>
</div>

<div class="section">
  <h3>💡 Pro Tips</h3>
  <ul>
    <li><strong>Accuracy:</strong> The more perpendicular your camera angle, the more accurate your measurements</li>
    <li><strong>Lighting:</strong> Use good lighting to get clear, sharp photos</li>
    <li><strong>Reference:</strong> Always include a calibration coin in the frame</li>
    <li><strong>Scale:</strong> Larger coins give more precise calibration</li>
    <li><strong>Export:</strong> Generate PDFs, save images, and export to CAD software</li>
  </ul>
</div>

<div class="section">
  <h3>🖨️ 3D Printable QR codes HERE</h3>
  <p>Love PanHandler? You can now get it printed as a physical guide and merchandise!</p>
  <p><strong>MakerWorld Print:</strong> High-quality printed guides, t-shirts, and more featuring PanHandler</p>
  <div style="text-align: center; margin: 16px 0;">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://makerworld.com/en/models/1991923-most-useful-fidget-reference-photo-super-toy%23profileId-2146622" width="200" height="200" alt="MakerWorld QR Code" />
  </div>
  <p style="text-align: center; margin-top: 12px;">
    <strong>Scan to visit:</strong><br>
    makerworld.com/en/models/1991923
  </p>
  <div class="tip-box">
    Support the development of PanHandler and get awesome merchandise at the same time! 🎁
  </div>
</div>

<div class="footer">
  <p><strong>PanHandler</strong> - Precise measurements from photos</p>
  <p>© 2025 PanHandler • Open Source Project</p>
  <p style="margin-top: 8px; font-size: 11px;">For the latest updates, visit: github.com/Snail3D/PanHandler</p>
</div>

<!-- Grid Page: Multiple 30mm QR codes for iOS -->
<div class="qr-grid-page">
  <div class="qr-grid-header">
    <h2>📱 PanHandler QR Calibration Codes (30mm) - iOS</h2>
    <p>Cut out and share these QR codes for easy calibration on iPhone/iPad</p>
    <div class="qr-grid-warning">
      ⚠️ Print at 100% scale (no scaling) - Verify: 30mm edge to edge
    </div>
  </div>
  
  <div class="qr-grid">
    ${generateIOSQRGrid()}
  </div>
</div>

<!-- Grid Page: Multiple 30mm QR codes for Android -->
<div class="qr-grid-page">
  <div class="qr-grid-header">
    <h2>🤖 PanHandler QR Calibration Codes (30mm) - Android</h2>
    <p>Cut out and share these QR codes for easy calibration on Android devices</p>
    <div class="qr-grid-warning">
      ⚠️ Print at 100% scale (no scaling) - Verify: 30mm edge to edge
    </div>
  </div>
  
  <div class="qr-grid">
    ${generateAndroidQRGrid()}
  </div>
</div>

<!-- Full-Page QR Code for Wall Hanging - iOS -->
<div class="full-page-qr">
  <h2>📱 PanHandler Calibration QR Code - iOS (180mm)</h2>
  <div class="qr-container">
    <img 
      src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-180mm')}" 
      class="qr-code-large"
      alt="PanHandler QR Code - 180mm iOS" 
    />
    <div class="qr-label">
      PanHandler - 180mm side to side (iOS)
    </div>
    <div class="qr-instructions">
      <strong>⚠️ Print at 100% scale (no scaling)</strong>
      <p>Perfect for hanging on walls or keeping as a reference</p>
      <p style="margin-top: 8px; font-size: 11px; color: #8E8E93;">
        This large QR code is easy to scan from a distance!<br>
        When printed at 100% scale, measure the QR code - it should be exactly 180mm × 180mm.<br>
        PanHandler will automatically detect and calibrate using this 180mm reference.<br>
        <strong>Maximum size:</strong> This is the largest QR code that fits on standard US Letter paper (8.5" × 11") with comfortable margins.<br>
        <strong>Platform:</strong> iOS (iPhone/iPad)
      </p>
    </div>
  </div>
</div>

<!-- Full-Page QR Code for Wall Hanging - Android -->
<div class="full-page-qr">
  <h2>🤖 PanHandler Calibration QR Code - Android (180mm)</h2>
  <div class="qr-container">
    <img 
      src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-180mm')}" 
      class="qr-code-large"
      alt="PanHandler QR Code - 180mm Android" 
    />
    <div class="qr-label">
      PanHandler - 180mm side to side (Android)
    </div>
    <div class="qr-instructions">
      <strong>⚠️ Print at 100% scale (no scaling)</strong>
      <p>Perfect for hanging on walls or keeping as a reference</p>
      <p style="margin-top: 8px; font-size: 11px; color: #8E8E93;">
        This large QR code is easy to scan from a distance!<br>
        When printed at 100% scale, measure the QR code - it should be exactly 180mm × 180mm.<br>
        PanHandler will automatically detect and calibrate using this 180mm reference.<br>
        <strong>Maximum size:</strong> This is the largest QR code that fits on standard US Letter paper (8.5" × 11") with comfortable margins.<br>
        <strong>Platform:</strong> Android
      </p>
    </div>
  </div>
</div>

</body>
</html>`;

export async function generatePdfGuide(): Promise<void> {
  try {
    // Generate PDF using expo-print
    // Note: PDF_CONTENT is a template literal that calls generateIOSQRGrid() and generateAndroidQRGrid()
    // These functions execute at module load time, so the HTML is already generated
    const result = await Print.printToFileAsync({
      html: PDF_CONTENT,
      base64: false,
    });

    if (result.uri) {
      // Copy to a file with a proper name
      const fileName = 'PanHandler_Guide.pdf';
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: result.uri,
        to: newPath,
      });

      // Share the renamed PDF
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PanHandler Guide PDF',
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Error', 'Failed to generate PDF guide. Please try again.');
  }
}
