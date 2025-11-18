import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Generate 4 iOS QR codes with cut lines (2mm padding)
function generateIOSQRGrid(): string {
  const qrURL = 'https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-30mm';
  const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrURL)}`;
  return Array(4).fill(0).map(() => `
    <div class="grid-qr-item">
      <div class="grid-qr-code">
        <img src="${qrCodeImageURL}" alt="QR Code" />
      </div>
    </div>
  `).join('');
}

// Generate 4 Android QR codes with cut lines (2mm padding)
function generateAndroidQRGrid(): string {
  const qrURL = 'https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-30mm';
  const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrURL)}`;
  return Array(4).fill(0).map(() => `
    <div class="grid-qr-item">
      <div class="grid-qr-code">
        <img src="${qrCodeImageURL}" alt="QR Code" />
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
  @page {
    size: A4;
    margin: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 16px;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.3;
    color: #1C1C1E;
    font-size: 9pt;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #E5E5EA;
    padding-bottom: 12px;
  }
  .header h1 {
    margin: 0;
    font-size: 20px;
    color: #667eea;
  }
  .header p {
    margin: 4px 0 0 0;
    color: #8E8E93;
    font-size: 10pt;
  }
  .section {
    margin: 16px 0;
    padding: 12px;
    background: #F9F9F9;
    border-radius: 8px;
    border-left: 3px solid #667eea;
    page-break-inside: avoid;
  }
  .section h3 {
    margin-top: 0;
    color: #667eea;
    font-size: 12px;
    font-weight: 700;
  }
  .section h2 {
    margin-top: 0;
    color: #667eea;
    font-size: 14px;
    font-weight: 700;
  }
  .section p {
    margin: 4px 0;
    font-size: 9pt;
  }
  .section ul, .section ol {
    margin: 4px 0;
    padding-left: 18px;
    font-size: 9pt;
  }
  .section li {
    margin: 3px 0;
  }
  .tip-box {
    background: rgba(52, 199, 89, 0.08);
    border: 1px solid rgba(52, 199, 89, 0.2);
    border-radius: 6px;
    padding: 8px;
    margin: 8px 0;
    font-size: 8.5pt;
  }
  .step-number {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #667eea;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-size: 11px;
    font-weight: bold;
    margin-right: 8px;
  }
  .footer {
    text-align: center;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #E5E5EA;
    font-size: 8pt;
    color: #8E8E93;
  }
  .full-page-qr {
    page-break-before: always;
    page-break-after: always;
    width: 210mm;
    min-height: 297mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20pt;
    box-sizing: border-box;
    overflow: hidden;
  }
  .qr-container {
    text-align: center;
    width: 100%;
  }
  .qr-code-large {
    width: 180mm;
    height: 180mm;
    max-width: 100%;
    margin: 0 auto;
    display: block;
  }
  .qr-label {
    font-size: 14pt;
    font-weight: 700;
    color: #1C1C1E;
    margin: 12pt 0;
    text-align: center;
  }
  .qr-instructions {
    margin-top: 16pt;
    padding: 12pt;
    background: #FFF3CD;
    border: 2px solid #FFC107;
    border-radius: 8px;
    font-size: 10pt;
    text-align: center;
    max-width: 500pt;
    margin-left: auto;
    margin-right: auto;
  }
  .qr-instructions p {
    margin: 4px 0;
    font-size: 9pt;
    color: #3C3C43;
    line-height: 1.4;
  }
  /* Grid page styles for 30mm QR codes */
  .qr-grid-page {
    page-break-before: always;
    width: 210mm;
    min-height: 297mm;
    padding: 24pt;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .qr-grid-header {
    text-align: center;
    margin-bottom: 16pt;
  }
  .qr-grid-header h2 {
    font-size: 16px;
    color: #1C1C1E;
    margin-bottom: 6px;
  }
  .qr-grid-header p {
    font-size: 10pt;
    color: #8E8E93;
  }
  .qr-grid-warning {
    font-size: 9pt;
    font-weight: 700;
    color: #FF3B30;
    text-align: center;
    margin-top: 6px;
    padding: 6px;
    background: rgba(255, 59, 48, 0.1);
    border-radius: 4px;
  }
  .qr-grid-combined {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10pt;
    width: 100%;
    margin-bottom: 12pt;
  }
  .grid-qr-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 2mm;
    border: 0.5pt dashed #000;
  }
  .grid-qr-code {
    width: 30mm;
    height: 30mm;
    /* QR code pattern itself is exactly 30mm - 2mm padding around it for cut lines */
  }
  .grid-qr-code img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .cut-line-separator {
    width: 100%;
    height: 0;
    border-top: 1pt dashed #000;
    margin: 12pt 0;
  }
  .back-to-back-page {
    page-break-before: always;
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .page-title {
    font-size: 18pt;
    font-weight: 700;
    color: #1C1C1E;
    text-align: center;
    margin-bottom: 16pt;
  }
  .qr-row-30mm {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8mm;
    width: 100%;
    margin-bottom: 16pt;
  }
  .qr-section-180mm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 16pt;
  }
  .qr-code-180mm {
    width: 180mm;
    height: 180mm;
    max-width: calc(100% - 0mm);
    margin: 0 auto;
    display: block;
  }
  .qr-code-180mm img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .qr-label-180mm {
    font-size: 14pt;
    font-weight: 700;
    color: #1C1C1E;
    margin-top: 12pt;
    text-align: center;
  }
  .calibration-ruler {
    width: 30mm;
    height: 3mm;
    border: 1px solid #000;
    background: repeating-linear-gradient(
      to right,
      #000 0mm,
      #000 1mm,
      transparent 1mm,
      transparent 2mm
    );
    margin: 6pt auto;
    position: relative;
  }
  .calibration-ruler::before {
    content: '30mm';
    position: absolute;
    top: -10pt;
    left: 50%;
    transform: translateX(-50%);
    font-size: 7pt;
    font-weight: bold;
    color: #000;
  }
  strong {
    color: #1C1C1E;
  }
</style>
</head>
<body>

<!-- Page 1: Header and Instructions -->
<div class="header">
  <h1>📐 PanHandler Guide</h1>
  <p>Complete Reference for Precise Measurements from Photos</p>
</div>

<div class="section">
  <h3><span class="step-number">1</span>Take a Perfect Photo</h3>
  <p><strong>Hold camera perpendicular (90°)</strong></p>
  <ul>
    <li>Flat surfaces: Look straight down</li>
    <li>Vertical surfaces: Face directly at walls/objects</li>
    <li>Keep camera level - watch crosshairs for alignment</li>
  </ul>
</div>

<div class="section">
  <h3><span class="step-number">2</span>Calibrate with Coin or QR Code</h3>
  <p><strong>Coin Calibration:</strong></p>
  <ul>
    <li>Place coin in photo, select type from dropdown</li>
    <li>Align colored circle with coin edge, tap "Lock in"</li>
  </ul>
  <p><strong>QR Code Calibration (Automatic!):</strong></p>
  <ul>
    <li>PanHandler auto-detects QR codes - no manual steps!</li>
    <li>Generate QR codes from Help menu → "PDF Guide and QR codes"</li>
    <li>Print at 100% scale for accurate 30mm calibration</li>
  </ul>
</div>

<div class="section">
  <h3><span class="step-number">3</span>Place Measurements</h3>
  <p><strong>📏 Distance</strong> - Tap two points for lines</p>
  <p><strong>📐 Angle</strong> - Tap vertex, then two arms</p>
  <p><strong>⭕ Circle</strong> - Tap center, then edge</p>
  <p><strong>▭ Rectangle</strong> - Tap two opposite corners</p>
  <p><strong>✏️ Freehand</strong> - Draw custom paths</p>
  <div class="tip-box">
    🔺 <strong>Tip:</strong> Connect distance lines to auto-calculate areas!
  </div>
</div>

<div class="section">
  <h3>📊 View & Export Results</h3>
  <ul>
    <li>Measurements shown in Imperial and Metric</li>
    <li>Tap measurements to edit labels</li>
    <li>Export to DWG (CAD format) or save images</li>
  </ul>
</div>

<div class="footer">
  <p><strong>PanHandler</strong> - Precise measurements from photos</p>
  <p>© 2025 PanHandler • github.com/Snail3D/PanHandler</p>
</div>

<!-- Page 2: QR Code Explanation -->
<div class="section" style="page-break-before: always; margin-top: 0;">
  <h2>📱 QR Code Calibration - Automatic & Easy!</h2>
  <p><strong>How it works:</strong> PanHandler QR codes contain embedded calibration data. When you take or import a photo, the app automatically detects and calibrates - no buttons to press!</p>
  
  <div class="tip-box">
    <strong>✨ Automatic Detection</strong>
    <p>PanHandler scans for QR codes when you capture or import photos. If detected, calibration happens instantly!</p>
  </div>
  
  <p><strong>Dual Purpose:</strong></p>
  <ol>
    <li><strong>Calibration:</strong> Auto-calibrates when scanned by PanHandler</li>
    <li><strong>App Download:</strong> Opens App Store/Play Store for others without the app</li>
  </ol>
  
  <p><strong>Distance Guidelines:</strong></p>
  <ul>
    <li><strong>30mm QR codes:</strong> ~1.5 feet away from object</li>
    <li><strong>180mm QR codes:</strong> At least 6 feet away</li>
  </ul>
  
  <div class="tip-box">
    <strong>💡 Pro Tips</strong>
    <ul style="margin-top: 4px;">
      <li>Place QR code in same plane as your object</li>
      <li>Keep near center of photo for best detection</li>
      <li>Ensure good lighting for clear visibility</li>
    </ul>
  </div>
</div>

<!-- Page 3: Android Back-to-Back Page (Front) -->
<div class="back-to-back-page">
  <div class="page-title">30MM Android</div>
  
  <div class="qr-row-30mm">
    ${generateAndroidQRGrid()}
  </div>
  
  <div class="cut-line-separator"></div>
  
  <div class="qr-section-180mm">
    <div class="qr-code-180mm">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-180mm')}" 
        alt="PanHandler QR Code - 180mm Android" 
      />
    </div>
    <div class="qr-label-180mm">180MM Android</div>
  </div>
</div>

<!-- Page 4: iPhone Back-to-Back Page (Back) -->
<div class="back-to-back-page">
  <div class="page-title">30MM Iphone</div>
  
  <div class="qr-row-30mm">
    ${generateIOSQRGrid()}
  </div>
  
  <div class="cut-line-separator"></div>
  
  <div class="qr-section-180mm">
    <div class="qr-code-180mm">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-180mm')}" 
        alt="PanHandler QR Code - 180mm iOS" 
      />
    </div>
    <div class="qr-label-180mm">180MM Iphone</div>
  </div>
</div>

</body>
</html>`;

// QR Code pages only (for quick printing)
const QR_CODE_PAGES_ONLY = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PanHandler QR Codes</title>
<style>
  @page {
    size: A4;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .grid-qr-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 2mm;
    border: 0.5pt dashed #000;
  }
  .grid-qr-code {
    width: 30mm;
    height: 30mm;
  }
  .grid-qr-code img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .cut-line-separator {
    width: 100%;
    height: 0;
    border-top: 1pt dashed #000;
    margin: 12pt 0;
  }
  .back-to-back-page {
    page-break-before: always;
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .page-title {
    font-size: 18pt;
    font-weight: 700;
    color: #1C1C1E;
    text-align: center;
    margin-bottom: 16pt;
  }
  .qr-row-30mm {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8mm;
    width: 100%;
    margin-bottom: 16pt;
  }
  .qr-section-180mm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 16pt;
  }
  .qr-code-180mm {
    width: 180mm;
    height: 180mm;
    max-width: calc(100% - 0mm);
    margin: 0 auto;
    display: block;
  }
  .qr-code-180mm img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .qr-label-180mm {
    font-size: 14pt;
    font-weight: 700;
    color: #1C1C1E;
    margin-top: 12pt;
    text-align: center;
  }
</style>
</head>
<body>

<!-- Page 1: Android Back-to-Back Page (Front) -->
<div class="back-to-back-page">
  <div class="page-title">30MM Android</div>
  
  <div class="qr-row-30mm">
    ${generateAndroidQRGrid()}
  </div>
  
  <div class="cut-line-separator"></div>
  
  <div class="qr-section-180mm">
    <div class="qr-code-180mm">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-180mm')}" 
        alt="PanHandler QR Code - 180mm Android" 
      />
    </div>
    <div class="qr-label-180mm">180MM Android</div>
  </div>
</div>

<!-- Page 2: iPhone Back-to-Back Page (Back) -->
<div class="back-to-back-page">
  <div class="page-title">30MM Iphone</div>
  
  <div class="qr-row-30mm">
    ${generateIOSQRGrid()}
  </div>
  
  <div class="cut-line-separator"></div>
  
  <div class="qr-section-180mm">
    <div class="qr-code-180mm">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent('https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-180mm')}" 
        alt="PanHandler QR Code - 180mm iOS" 
      />
    </div>
    <div class="qr-label-180mm">180MM Iphone</div>
  </div>
</div>

</body>
</html>`;

export async function generateQRCodePagesOnly(): Promise<void> {
  try {
    const result = await Print.printToFileAsync({
      html: QR_CODE_PAGES_ONLY,
      base64: false,
    });

    if (result.uri) {
      const fileName = 'PanHandler_QR_Codes.pdf';
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: result.uri,
        to: newPath,
      });

      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PanHandler QR Codes PDF',
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.error('Error generating QR code PDF:', error);
    Alert.alert('Error', 'Failed to generate QR code PDF. Please try again.');
  }
}

export async function generatePdfGuide(): Promise<void> {
  try {
    const result = await Print.printToFileAsync({
      html: PDF_CONTENT,
      base64: false,
    });

    if (result.uri) {
      const fileName = 'PanHandler_Guide.pdf';
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: result.uri,
        to: newPath,
      });

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
