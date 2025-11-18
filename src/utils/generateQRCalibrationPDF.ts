import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/**
 * Generate a printable QR code calibration PDF
 * QR code is 30mm × 30mm with cut lines and instructions
 */
export async function generateQRCalibrationPDF(): Promise<void> {
  try {
    // QR code URL - Universal link format that works on both iOS and Android
    // This URL will:
    // - Open the PanHandler app if installed (via deep linking)
    // - Open App Store (iOS) or Play Store (Android) if app not installed
    // - Preserve calibration data in the URL fragment
    // 
    // Using a smart link format: App Store/Play Store URLs with calibration fragment
    // iOS: https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-30mm
    // Android: https://play.google.com/store/apps/details?id=com.snail.panhandler#panhandler-paper-30mm
    //
    // Universal QR code URL that opens app if installed, or store if not
    // Using App Store URL format - works on both platforms:
    // - iOS: Opens App Store (or app via universal links if configured)
    // - Android: Opens in browser, which can redirect to Play Store
    // 
    // The calibration data is in the URL fragment. Note: App Store URLs don't preserve
    // fragments perfectly, but the app can be configured to handle these URLs via
    // universal links (iOS) or app links (Android) when the app is installed.
    //
    // For a single QR code that works perfectly on both platforms with store fallback,
    // you would need a web page that detects platform and redirects appropriately.
    // For now, using App Store URL which works well on iOS and reasonably on Android.
    const qrURL = 'https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-paper-30mm';
    
    // Generate QR code SVG
    // Note: react-native-qrcode-svg generates SVG, but we need to convert to base64 image
    // For PDF generation, we'll use an HTML-based QR code generator
    
    // Create HTML content with QR code
    const htmlContent = generatePDFHTML(qrURL);
    
    // Generate PDF using expo-print
    const result = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (result.uri) {
      // Copy to a file with a proper name
      const fileName = 'PanHandler_QR_Calibration_30mm.pdf';
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: result.uri,
        to: newPath,
      });

      // Share the renamed PDF
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PanHandler QR Calibration',
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.error('Error generating QR calibration PDF:', error);
    Alert.alert('Error', 'Failed to generate QR calibration PDF. Please try again.');
  }
}

/**
 * Generate HTML content for PDF
 */
function generatePDFHTML(qrURL: string): string {
  // Use a QR code API to generate the QR code image
  // We'll use a free QR code API service
  const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrURL)}`;
  
  // 30mm = 85 PDF points (30mm × 2.83465 points/mm)
  const qrSizePoints = 85;
  const cutAreaWidth = 113; // ~40mm for cut area
  const cutAreaHeight = 142; // ~50mm for cut area including text
  
  // Calculate grid layout for QR codes page(s)
  // 4 columns, fit as many rows as possible on each page
  const columns = 4;
  const pageWidth = 612; // Standard US Letter width in points
  const pageHeight = 792; // Standard US Letter height in points
  const margin = 36; // 0.5 inch margins
  const availableWidth = pageWidth - (margin * 2);
  const availableHeight = pageHeight - (margin * 2);
  const spacing = 8; // Space between QR codes
  
  // Calculate how many QR codes fit per page
  // Each QR item: QR code (85pt) + text (~20pt) + padding (16pt) + border (4pt) = ~125pt
  const qrItemHeight = qrSizePoints + 30; // QR size + text + padding
  const headerHeight = 60; // Header space
  const rowsPerPage = Math.floor((availableHeight - headerHeight) / (qrItemHeight + spacing));
  const qrCodesPerPage = columns * rowsPerPage;
  
  // Generate enough QR codes to fill at least one full page, preferably more
  const totalQRCodes = Math.max(qrCodesPerPage, 24); // At least 24 (6 rows × 4 cols) or more
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PanHandler QR Calibration</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #1C1C1E;
    }
    .page {
      page-break-after: always;
      width: 100%;
      min-height: 100vh;
      padding: 40px;
      box-sizing: border-box;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 24px;
      color: #1C1C1E;
      margin-bottom: 8px;
    }
    .cut-instruction {
      text-align: center;
      font-size: 16px;
      margin-bottom: 20px;
      color: #8E8E93;
    }
    .cut-area {
      width: ${cutAreaWidth}pt;
      height: ${cutAreaHeight}pt;
      margin: 0 auto 30px;
      border: 2px dashed #333;
      border-radius: 4px;
      padding: 10pt;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .qr-code {
      width: ${qrSizePoints}pt;
      height: ${qrSizePoints}pt;
      margin-bottom: 8pt;
    }
    .qr-code img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .size-text {
      font-size: 12pt;
      font-weight: 600;
      color: #1C1C1E;
      text-align: center;
      line-height: 1.4;
    }
    .instructions {
      background: #F9F9F9;
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;
    }
    .instructions h3 {
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 12px;
      color: #1C1C1E;
    }
    .instructions ul {
      margin: 0;
      padding-left: 20px;
    }
    .instructions li {
      margin-bottom: 6px;
      font-size: 12px;
      color: #3C3C43;
    }
    .makerworld-link {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #E5E5EA;
      text-align: center;
      font-size: 11px;
      color: #8E8E93;
    }
    .makerworld-link a {
      color: #007AFF;
      text-decoration: none;
    }
    /* Grid page styles */
    .grid-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: ${margin}pt;
      min-height: ${pageHeight}pt;
      box-sizing: border-box;
    }
    .grid-header {
      text-align: center;
      margin-bottom: ${spacing * 2}pt;
    }
    .grid-header h2 {
      font-size: 20px;
      color: #1C1C1E;
      margin-bottom: 8px;
    }
    .grid-header p {
      font-size: 12px;
      color: #8E8E93;
    }
    .grid-warning {
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
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${spacing}pt;
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
      width: ${qrSizePoints}pt;
      height: ${qrSizePoints}pt;
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
  </style>
</head>
<body>
  <!-- Page 1: Instructions -->
  <div class="page">
    <div class="header">
      <h1>PanHandler QR Calibration</h1>
    </div>
    
    <div class="cut-instruction">
      ✂️ Cut on dotted line
    </div>
    
    <div class="cut-area">
      <div class="qr-code">
        <img src="${qrCodeImageURL}" alt="QR Code" />
      </div>
      <div class="size-text">
        PanHandler - 30mm<br>
        side to side
      </div>
    </div>
    
    <div class="instructions">
      <h3>Print Instructions:</h3>
      <ul>
        <li>Print at 100% scale (no scaling)</li>
        <li>Do not scale to fit page</li>
        <li>Cut along dotted lines</li>
        <li>Verify: 30mm edge to edge</li>
      </ul>
    </div>
    
    <div class="makerworld-link">
      Or get the 3D printable version:<br>
      <a href="https://makerworld.com/en/models/1991923">makerworld.com/en/models/1991923</a>
    </div>
  </div>
  
  <!-- Last Page(s): Grid of QR codes for sharing - fills entire page(s) -->
  <div class="page grid-page" style="page-break-before: always;">
    <div class="grid-header">
      <h2>PanHandler QR Calibration Codes</h2>
      <p>Cut out and share these QR codes for easy calibration</p>
      <div class="grid-warning">
        ⚠️ Print at 100% scale (no scaling) - Verify: 30mm edge to edge
      </div>
    </div>
    
    <div class="qr-grid">
      ${Array(totalQRCodes).fill(0).map(() => `
        <div class="grid-qr-item">
          <div class="grid-qr-code">
            <img src="${qrCodeImageURL}" alt="QR Code" />
          </div>
          <div class="grid-size-text">
            PanHandler - 30mm<br>
            side to side
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
}

