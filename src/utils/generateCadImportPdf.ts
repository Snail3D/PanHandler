import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const CAD_IMPORT_PDF_CONTENT = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PanHandler - CAD Import Instructions</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 30px;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
    color: #1C1C1E;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #667eea;
    padding-bottom: 20px;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    color: #667eea;
  }
  .section {
    margin: 24px 0;
    padding: 20px;
    background: #F9F9F9;
    border-left: 4px solid #667eea;
    border-radius: 12px;
  }
  .section h2 {
    margin-top: 0;
    color: #667eea;
    font-size: 20px;
  }
  .section h3 {
    margin-top: 16px;
    color: #1C1C1E;
    font-size: 16px;
    font-weight: 600;
  }
  .section p, .section li {
    margin: 8px 0;
    color: #3C3C43;
  }
  .section ul, .section ol {
    margin: 12px 0;
    padding-left: 25px;
  }
  .section li {
    margin: 8px 0;
  }
  .tip-box {
    background: rgba(52, 199, 89, 0.08);
    border: 1px solid rgba(52, 199, 89, 0.2);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    font-size: 14px;
  }
  .tip-box strong {
    color: #10B981;
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
  }
  .code-block {
    background: #1C1C1E;
    color: #FFFFFF;
    padding: 12px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    margin: 12px 0;
    overflow-x: auto;
  }
  .step-number {
    display: inline-block;
    background: #667eea;
    color: white;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    text-align: center;
    line-height: 26px;
    margin-right: 10px;
    font-weight: bold;
    font-size: 14px;
  }
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #E5E5EA;
    text-align: center;
    color: #8E8E93;
    font-size: 12px;
  }
</style>
</head>
<body>

<div class="header">
  <h1>📐 PanHandler CAD Import Guide</h1>
  <p style="color: #8E8E93; margin-top: 8px;">Import your measurements into CAD software</p>
</div>

<div class="section">
  <h2>📥 Importing Measurements into CAD</h2>
  <p>Your PanHandler measurements are included in the email body as text. Here's how to import them into popular CAD software:</p>

  <h3>AutoCAD / Fusion 360</h3>
  <ol>
    <li>Open your CAD software</li>
    <li>Create a new drawing or open an existing project</li>
    <li>Set your units to match the PanHandler measurements (Metric or Imperial)</li>
    <li>Use the measurement values from the email to draw your geometry:
      <ul>
        <li>For distances: Use the LINE or DISTANCE tool with the exact values</li>
        <li>For angles: Use the ANGLE tool and input the degree values</li>
        <li>For circles: Use the CIRCLE tool with the radius/diameter values</li>
        <li>For rectangles: Use the RECTANGLE tool with width and height values</li>
      </ul>
    </li>
    <li>Reference the attached photos for visual context and proportions</li>
  </ol>

  <h3>SketchUp</h3>
  <ol>
    <li>Open SketchUp and set your template units (Window → Model Info → Units)</li>
    <li>Match the unit system from your PanHandler measurements</li>
    <li>Use the Tape Measure tool to mark reference points</li>
    <li>Draw geometry using the measurement values:
      <ul>
        <li>Type exact dimensions while drawing (e.g., type "24in" for a 24-inch line)</li>
        <li>Use the Protractor tool for angles</li>
        <li>Use the Circle tool and type the radius when prompted</li>
      </ul>
    </li>
    <li>Import the attached photos as reference images (File → Import)</li>
  </ol>

  <h3>SolidWorks / Inventor</h3>
  <ol>
    <li>Create a new sketch in your part or assembly</li>
    <li>Set document units (Tools → Options → Document Properties → Units)</li>
    <li>Use Smart Dimension to apply the PanHandler measurements:
      <ul>
        <li>Draw approximate geometry first</li>
        <li>Add dimensions using the exact values from the email</li>
        <li>The geometry will automatically adjust to match the dimensions</li>
      </ul>
    </li>
    <li>Use the attached photos as reference for feature placement</li>
  </ol>

  <h3>Rhino / Blender</h3>
  <ol>
    <li>Set your units in Document Properties (Rhino) or Scene Properties (Blender)</li>
    <li>Match the unit system from PanHandler</li>
    <li>Use the measurement values to create geometry:
      <ul>
        <li>Rhino: Use command line input for exact dimensions (e.g., type "24" for 24 units)</li>
        <li>Blender: Use the N-panel to input exact dimensions in Edit Mode</li>
      </ul>
    </li>
    <li>Import the attached photos as background images for reference</li>
  </ol>
</div>

<div class="tip-box">
  <strong>💡 Pro Tip: Workflow Optimization</strong>
  <p>For best results:</p>
  <ol style="margin-top: 8px;">
    <li>Start with the largest measurements to establish overall scale</li>
    <li>Use the attached photos to verify proportions and relationships</li>
    <li>Add smaller details after the main geometry is in place</li>
    <li>Double-check critical dimensions against the original measurements</li>
  </ol>
</div>

<div class="section">
  <h2>📊 Understanding the Measurement Format</h2>
  <p>PanHandler measurements are formatted as:</p>
  <div class="code-block">
    1. 24.5 in (Length) (Blue)<br>
    2. 45° (Angle) (Green)<br>
    3. 12.3 cm (Radius) (Red)
  </div>
  <p>Where:</p>
  <ul>
    <li><strong>Number:</strong> The measurement value</li>
    <li><strong>Unit:</strong> Inches (in), centimeters (cm), degrees (°), etc.</li>
    <li><strong>Type:</strong> What was measured (Length, Angle, Radius, etc.)</li>
    <li><strong>Color:</strong> The color used in the PanHandler overlay (for reference)</li>
  </ul>
</div>

<div class="section">
  <h2>🖼️ Using the Attached Photos</h2>
  <p>Two photos are included with your measurements:</p>
  <ol>
    <li><strong>Measurements.jpg:</strong> The original photo with measurement overlays - use this to see the context and relationships between measurements</li>
    <li><strong>Label.png:</strong> A clean overlay showing just the measurement labels - use this as a reference when placing dimensions in CAD</li>
  </ol>
  <p>Import these images into your CAD software as reference images or background images to help guide your modeling.</p>
</div>

<div class="tip-box">
  <strong>⚠️ Important Notes</strong>
  <ul style="margin-top: 8px;">
    <li>Always verify critical dimensions with physical measurements when possible</li>
    <li>PanHandler measurements are accurate to the calibration reference (coin or QR code)</li>
    <li>For best accuracy, ensure the calibration reference was placed flat and in the same plane as your object</li>
    <li>Angles are measured in degrees, distances in your selected unit system</li>
  </ul>
</div>

<div class="footer">
  <p>Generated by PanHandler - Precise CAD measurements from photos</p>
  <p style="margin-top: 8px;">For more help, visit the Help menu in the PanHandler app</p>
</div>

</body>
</html>`;

/**
 * Generate a PDF with CAD import instructions
 * @returns Promise<string> - Path to the generated PDF file
 */
export async function generateCadImportPdf(): Promise<string> {
  try {
    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html: CAD_IMPORT_PDF_CONTENT,
      base64: false,
    });

    // Copy to cache directory with a fixed name
    const pdfFilename = 'PanHandler_CAD_Import_Guide.pdf';
    const pdfDest = `${FileSystem.cacheDirectory}${pdfFilename}`;
    await FileSystem.copyAsync({ from: uri, to: pdfDest });

    return pdfDest;
  } catch (error) {
    console.error('Error generating CAD import PDF:', error);
    throw error;
  }
}







