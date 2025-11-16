import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Alert } from 'react-native';

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
  <h1>📱 PanHandler Guide</h1>
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
  <h3><span class="step-number">2</span>Calibrate with a Coin</h3>
  <p><strong>How to Calibrate:</strong></p>
  <ol>
    <li>Place a coin somewhere visible in your photo</li>
    <li>Select the coin type from the dropdown list</li>
    <li>Align the colored circle with the coin's edge</li>
    <li>Tap "Lock in" when perfectly aligned</li>
  </ol>
  <div class="tip-box">
    <strong>Common coins:</strong>
    <ul style="margin: 6px 0; padding-left: 18px;">
      <li>US Quarter: 24.26mm</li>
      <li>€1 Euro: 23.25mm</li>
      <li>£1 Pound: 22.50mm</li>
    </ul>
  </div>
  <p><strong>Why coins?</strong> They have standardized sizes, making them perfect calibration references!</p>
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
  <h3>🖨️ Get PanHandler Printed</h3>
  <p>Love PanHandler? You can now get it printed as a physical guide and merchandise!</p>
  <p><strong>MakerWorld Print:</strong> High-quality printed guides, t-shirts, and more featuring PanHandler</p>
  <div style="text-align: center; margin: 16px 0;">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.makerworld.com/en/users/vibecode" width="200" height="200" alt="MakerWorld QR Code" />
  </div>
  <p style="text-align: center; margin-top: 12px;">
    <strong>Scan to visit:</strong><br>
    www.makerworld.com/en/users/vibecode
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

</body>
</html>`;

export async function generatePdfGuide(): Promise<void> {
  try {
    // Generate PDF using expo-print
    const result = await Print.printToFileAsync({
      html: PDF_CONTENT,
      base64: false,
    });

    if (result.uri) {
      // Share the generated PDF
      await Sharing.shareAsync(result.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PanHandler Guide PDF',
        UTI: 'com.adobe.pdf',
        filename: 'PanHandler Guide.pdf',
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Error', 'Failed to generate PDF guide. Please try again.');
  }
}
