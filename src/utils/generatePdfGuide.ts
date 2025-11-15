import { printToFileAsync } from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Generates a comprehensive PDF guide from the help modal content
 * Includes all sections, styling, and QR codes for external resources
 */
export async function generatePdfGuide(): Promise<void> {
  const currentYear = new Date().getFullYear();
  
  // App icon as base64 (embedded for offline PDF viewing)
  const appIconBase64 = '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';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            padding: 20px;
            background: #fff;
          }
          
          h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1C1C1E;
            margin-bottom: 10px;
            text-align: center;
          }
          
          .subtitle {
            text-align: center;
            color: #8E8E93;
            font-size: 14px;
            margin-bottom: 30px;
          }
          
          .section {
            margin: 20px 0;
            padding: 16px;
            background: #F9F9F9;
            border-radius: 12px;
            border: 1px solid #E5E5EA;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1C1C1E;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          }
          
          .section-content {
            font-size: 14px;
            color: #1C1C1E;
            line-height: 1.5;
            margin-left: 4px;
          }
          
          .subsection {
            margin: 12px 0;
          }
          
          .bullet-point {
            margin: 6px 0 6px 20px;
          }
          
          .highlight {
            font-weight: 600;
            color: #007AFF;
          }
          
          .tip-box {
            background: rgba(52, 199, 89, 0.08);
            border: 1px solid rgba(52, 199, 89, 0.2);
            border-radius: 8px;
            padding: 12px;
            margin: 12px 0;
          }
          
          .warning-box {
            background: rgba(255, 149, 0, 0.08);
            border: 1px solid rgba(255, 149, 0, 0.2);
            border-radius: 8px;
            padding: 12px;
            margin: 12px 0;
          }
          
          .code-box {
            background: #F5F5F7;
            border: 1px solid #D1D1D6;
            border-radius: 6px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 8px 0;
          }
          
          .qr-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E5E5EA;
            text-align: center;
          }
          
          .qr-container {
            display: inline-block;
            margin: 20px;
            text-align: center;
          }
          
          .qr-label {
            font-weight: 600;
            margin-top: 10px;
            font-size: 13px;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E5EA;
            text-align: center;
            color: #8E8E93;
            font-size: 12px;
          }
          
          a {
            color: #007AFF;
            text-decoration: none;
          }
          
          strong {
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="data:image/jpeg;base64,${appIconBase64}" 
               alt="PanHandler Icon" 
               style="width: 80px; height: 80px; border-radius: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin: 0 auto 16px auto; display: block;" />
          <h1 style="margin: 0;">PanHandler Guide</h1>
          <p class="subtitle" style="margin: 8px 0 0 0;">Complete Reference for Precise Measurements</p>
        </div>
        
        <!-- QR Codes Section - Top of Document -->
        <div style="margin: 30px 0; padding: 20px; background: #F9F9F9; border-radius: 12px; border: 1px solid #E5E5EA;">
          <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 40px;">
            <div style="text-align: center; flex: 1;">
              <div style="margin-bottom: 8px; font-weight: 700; font-size: 15px; color: #1C1C1E;">Android Phones/Tablets</div>
              <div style="background: white; padding: 10px; border-radius: 8px; display: inline-block; border: 2px solid #E5E5EA;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://github.com/Snail3D/PanHandler/releases/latest" 
                     alt="GitHub QR Code" 
                     style="width: 150px; height: 150px; display: block;" />
              </div>
              <div style="margin-top: 12px; font-weight: 600; font-size: 14px;">GitHub Latest Release</div>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">
                <a href="https://github.com/Snail3D/PanHandler">github.com/Snail3D/PanHandler</a>
              </div>
            </div>
            
            <div style="text-align: center; flex: 1;">
              <div style="margin-bottom: 8px; font-weight: 700; font-size: 15px; color: #1C1C1E;">iPhones and iPads</div>
              <div style="background: white; padding: 10px; border-radius: 8px; display: inline-block; border: 2px solid #E5E5EA;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id6754727828" 
                     alt="App Store QR Code" 
                     style="width: 150px; height: 150px; display: block;" />
              </div>
              <div style="margin-top: 12px; font-weight: 600; font-size: 14px;">Apple App Store</div>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">
                Download PanHandler
              </div>
            </div>
          </div>
        </div>
        
        <!-- Video Courses Section -->
        <div class="section">
          <div class="section-title">🎬 Video Courses</div>
          <div class="section-content">
            <p><strong>Watch our complete video tutorial series</strong></p>
            <p>Learn how to use PanHandler with step-by-step video guides and real-world workflow examples.</p>
            <div class="tip-box">
              <p><strong>✨ Course includes:</strong></p>
              <div class="bullet-point">• Getting started tutorials</div>
              <div class="bullet-point">• Advanced measurement techniques</div>
              <div class="bullet-point">• Real-world workflow examples</div>
              <div class="bullet-point">• Tips & tricks for best results</div>
            </div>
            <p style="margin-top: 12px;">🔗 <a href="https://www.youtube.com/playlist?list=PLJB4l6OZ0E3HRdPaJn8dJPZrEu4dPBDJi">YouTube Course Playlist</a></p>
          </div>
        </div>

        <!-- Step 1: Take a Perfect Photo -->
        <div class="section">
          <div class="section-title">📸 Step 1: Take a Perfect Photo</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>📐 Hold camera perpendicular (90°)</strong></p>
              <div class="bullet-point">• Flat surfaces: Look straight down</div>
              <div class="bullet-point">• Vertical surfaces: Face directly at walls/objects</div>
            </div>
            
            <div class="subsection">
              <p><strong>🎯 Level Alignment</strong></p>
              <div class="bullet-point">• Watch the <strong>crosshairs</strong> - align with gray reference lines</div>
              <div class="bullet-point">• <strong>Horizontal crosshair</strong>: Shows if camera is tilted (pitch)</div>
              <div class="bullet-point">• <strong>Vertical crosshair</strong>: Shows if camera is rotated (roll)</div>
            </div>
            
            <div class="tip-box">
              <p><strong>💡 Pro Tip</strong></p>
              <p>Horizontal mode (phone looking down) allows <strong>Hold to Auto-Capture</strong> - the app takes the photo automatically when aligned!</p>
            </div>
            
            <div class="subsection">
              <p><strong>📏 Distance Matters</strong></p>
              <div class="bullet-point">• Closer = more precise measurements</div>
              <div class="bullet-point">• Fill frame with your subject</div>
              <div class="bullet-point">• Avoid extreme angles or very distant shots</div>
            </div>
            
            <div class="subsection">
              <p><strong>💡 Lighting</strong></p>
              <div class="bullet-point">• Use good lighting - avoid harsh shadows</div>
              <div class="bullet-point">• Tap flash icon to toggle torch if needed</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Calibrate with Coin -->
        <div class="section">
          <div class="section-title">🪙 Step 2: Calibrate with Coin</div>
          <div class="section-content">
            <p><strong>Why calibrate?</strong> The app needs a reference object of known size to calculate real-world measurements.</p>
            
            <div class="subsection">
              <p><strong>📐 How to Calibrate:</strong></p>
              <div class="bullet-point">1. Place a coin somewhere in your photo</div>
              <div class="bullet-point">2. Select the coin type from the list</div>
              <div class="bullet-point">3. Match the outside edge of the coin with the outside edge of the colored circle</div>
              <div class="bullet-point">4. Tap Lock in when aligned</div>
            </div>
            
            <div class="tip-box">
              <p><strong>✨ Best Practices:</strong></p>
              <div class="bullet-point">• Place coin on same plane as objects you want to measure</div>
              <div class="bullet-point">• Use a flat coin (no bent edges)</div>
              <div class="bullet-point">• Common coins: US Quarter (24.26mm), US Penny (19.05mm), €1 Coin (23.25mm)</div>
            </div>
            
            <div class="warning-box">
              <p><strong>⚠️ Accuracy Notes:</strong></p>
              <div class="bullet-point">• Objects not on same plane as coin may have slight inaccuracy</div>
              <div class="bullet-point">• Accuracy depends on photo perpendicularity and coin alignment</div>
            </div>
          </div>
        </div>

        <!-- Step 3: Place Measurements -->
        <div class="section">
          <div class="section-title">📏 Step 3: Place Measurements</div>
          <div class="section-content">
            <p><strong>Measurement Modes:</strong></p>
            
            <div class="subsection">
              <p><strong>📏 Distance</strong></p>
              <p>Tap two points to measure straight-line distance</p>
              <div class="tip-box" style="margin-top: 8px;">
                <p><strong>🔺 Pro Tip: Triangles & Polygons</strong></p>
                <p>Connect multiple lines by placing endpoints together to create triangles and polygons. Areas are automatically calculated and shown in the legend!</p>
              </div>
            </div>
            
            <div class="subsection">
              <p><strong>📐 Angle</strong></p>
              <p>Tap three points: vertex (middle) first, then two arms</p>
            </div>
            
            <div class="subsection">
              <p><strong>⭕ Circle</strong></p>
              <p>Tap center, then edge. Shows diameter and area.</p>
            </div>
            
            <div class="subsection">
              <p><strong>▭ Rectangle</strong></p>
              <p>Tap two opposite corners. Shows width × height and area.</p>
            </div>
            
            <div class="subsection">
              <p><strong>✏️ Freehand</strong></p>
              <p>Draw custom paths. Shows length. Close the loop for area calculation.</p>
            </div>
            
            <div class="tip-box">
              <p><strong>📱 Controls:</strong></p>
              <div class="bullet-point">• <strong>Pan/Edit Toggle</strong>: Switch between pan mode (move/zoom image) and edit mode (select/move measurements)</div>
              <div class="bullet-point">• <strong>Double-tap measurement</strong>: Add custom label</div>
              <div class="bullet-point">• <strong>Trash icon</strong>: Delete measurement</div>
              <div class="bullet-point">• <strong>Undo button</strong>: Remove last placed point</div>
            </div>
          </div>
        </div>

        <!-- Volume Calculation -->
        <div class="section">
          <div class="section-title">📦 Volume Calculation</div>
          <div class="section-content">
            <p>For any area measurement (rectangles, circles, closed freehand paths), you can add depth to calculate volume:</p>
            
            <div class="subsection">
              <p><strong>How to add volume:</strong></p>
              <div class="bullet-point">1. Double-tap the measurement to open label modal</div>
              <div class="bullet-point">2. Enter depth value and select unit</div>
              <div class="bullet-point">3. Volume will show as <code>V:</code> next to area</div>
            </div>
            
            <div class="tip-box">
              <p><strong>Example:</strong></p>
              <p>Rectangle: 50mm × 30mm (A: 1500mm²) with 20mm depth → (A: 1500mm² | V: 30000mm³)</p>
            </div>
          </div>
        </div>

        <!-- Navigation & Controls -->
        <div class="section">
          <div class="section-title">🎮 Navigation & Controls</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>Camera Screen:</strong></p>
              <div class="bullet-point">• <strong>Photo Library</strong> (bottom-left): Import existing photo</div>
              <div class="bullet-point">• <strong>Scale Mode Button</strong> (bottom-left, three icons): Choose Map/Blueprint (choose 2 known points)</div>
              <div class="bullet-point">• <strong>Shutter Button</strong>: Tap to capture, or hold for auto-capture when aligned</div>
              <div class="bullet-point">• <strong>Flash</strong> (top-right): Toggle torch light</div>
              <div class="bullet-point">• <strong>Help</strong> (top-right): Open this guide</div>
            </div>
            
            <div class="subsection">
              <p><strong>Measurement Screen:</strong></p>
              <div class="bullet-point">• <strong>Pan/Edit Toggle</strong>: Switch between moving image and editing measurements</div>
              <div class="bullet-point">• <strong>Measure Button</strong>: Place new measurements</div>
              <div class="bullet-point">• <strong>Legend</strong> (left): Shows all measurements, tap to collapse/expand</div>
              <div class="bullet-point">• <strong>Unit Toggle</strong>: Switch between Metric/Imperial</div>
            </div>
            
            <div class="tip-box">
              <p><strong>Pinch & Zoom:</strong></p>
              <p>Use two fingers to zoom and pan the image for precise point placement</p>
            </div>
          </div>
        </div>

        <!-- Move & Edit Measurements -->
        <div class="section">
          <div class="section-title">✏️ Move & Edit Measurements</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>Moving Measurement Points:</strong></p>
              <div class="bullet-point">1. Tap <strong>Pan/Edit</strong> button (shows "Edit" when points exist)</div>
              <div class="bullet-point">2. Drag any point to reposition</div>
              <div class="bullet-point">3. Values update in real-time</div>
            </div>
            
            <div class="subsection">
              <p><strong>Adding Labels:</strong></p>
              <div class="bullet-point">• Double-tap any measurement</div>
              <div class="bullet-point">• Enter measurement name/description</div>
              <div class="bullet-point">• For areas: optionally add depth for volume</div>
            </div>
            
            <div class="subsection">
              <p><strong>Deleting:</strong></p>
              <div class="bullet-point">• Tap <strong>Undo</strong> button to remove last placed point</div>
              <div class="bullet-point">• Or tap 4 times on a line/object when in edit mode to delete it</div>
            </div>
          </div>
        </div>

        <!-- Save & Share -->
        <div class="section">
          <div class="section-title">💾 Save & Share</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>📧 Email Export:</strong></p>
              <p>Tap <strong>Email</strong> button to generate professional report with:</p>
              <div class="bullet-point">• Full measurements photo with legend</div>
              <div class="bullet-point">• Transparent CAD overlay (50% opacity)</div>
              <div class="bullet-point">• Text list of all measurements with colors</div>
              <div class="bullet-point">• Calibration reference details</div>
            </div>
            
            <div class="subsection">
              <p><strong>📱 Save to Photos:</strong></p>
              <p>Tap <strong>Save</strong> to export images to your photo library</p>
              <div class="tip-box">
                <p><strong>Permissions Required:</strong></p>
                <div class="bullet-point">• <strong>Camera</strong> — to capture photos</div>
                <div class="bullet-point">• <strong>Motion & Orientation</strong> — for auto-level (tilt detection)</div>
                <div class="bullet-point">• <strong>Photo Library</strong> — to save measurements</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Workflow Guide -->
        <div class="section">
          <div class="section-title">📧 Email Workflow Guide</div>
          <div class="section-content">
            <p>Tap <strong>Email</strong> to generate a report with 2 photos and a detailed measurement table.</p>
            
            <div class="code-box">
              <strong>Example Email Format:</strong><br><br>
              Subject: Arduino Case - Measurements<br><br>
              Arduino Case - Measurements by PanHandler<br><br>
              <strong>Calibration Reference:</strong> 24.26mm (the coin you selected)<br>
              <strong>Unit System:</strong> Metric<br><br>
              <strong>Measurements:</strong><br>
              Distance: 145.2mm (Blue)<br>
              Angle: 87.5° (Green)<br>
              Circle: Ø 52.3mm (Red)<br><br>
              Attached: 2 photos<br>
              • Full measurements photo<br>
              • Transparent CAD canvas (50% opacity)
            </div>
          </div>
        </div>

        <!-- Advanced Features -->
        <div class="section">
          <div class="section-title">🔧 Advanced Features</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>Alternative Calibration Methods:</strong></p>
              <div class="bullet-point">• <strong>Map Mode</strong>: Use map scale (e.g., "1 inch = 10 miles")</div>
              <div class="bullet-point">• <strong>Blueprint Mode</strong>: Enter known distance between two points</div>
            </div>
            
            <div class="tip-box">
              <p><strong>Switching Calibration:</strong></p>
              <p>Tap the three-icon button (bottom-left on camera screen) to choose different calibration modes before taking photo</p>
            </div>
          </div>
        </div>

        <!-- Map Mode -->
        <div class="section">
          <div class="section-title">🗺️ Map Mode</div>
          <div class="section-content">
            <p>Perfect for measuring from maps, floor plans, or any image with a scale.</p>
            
            <div class="subsection">
              <p><strong>How to use:</strong></p>
              <div class="bullet-point">1. Take photo of map (or import existing image)</div>
              <div class="bullet-point">2. Enter the map scale (e.g., "1 cm = 5 km")</div>
              <div class="bullet-point">3. Place measurements - they'll show in real-world units</div>
            </div>
            
            <div class="tip-box">
              <p><strong>Supported Units:</strong></p>
              <p>mm, cm, m, km, in, ft, mi - mix and match as needed!</p>
            </div>
          </div>
        </div>

        <!-- Pro Tips -->
        <div class="section">
          <div class="section-title">💡 Pro Tips</div>
          <div class="section-content">
            <div class="bullet-point">✅ <strong>Level is critical</strong> - take time to align crosshairs for best accuracy</div>
            <div class="bullet-point">✅ <strong>Coin placement</strong> - put it on same surface/plane as measurement objects</div>
            <div class="bullet-point">✅ <strong>Good lighting</strong> - avoid harsh shadows and glare</div>
            <div class="bullet-point">✅ <strong>Perpendicular shots</strong> - face subject directly for minimal distortion</div>
            <div class="bullet-point">✅ <strong>Use labels</strong> - double-tap measurements to add custom names</div>
            <div class="bullet-point">✅ <strong>Export early</strong> - save or email your work before starting new measurements</div>
          </div>
        </div>

        <!-- Troubleshooting -->
        <div class="section">
          <div class="section-title">🔧 Troubleshooting</div>
          <div class="section-content">
            <div class="subsection">
              <p><strong>❓ Camera won't align / Auto-capture not working?</strong></p>
              <p>• Check phone orientation - auto-capture only works in horizontal mode (looking down)</p>
              <p>• For vertical surfaces, use manual shutter tap</p>
            </div>
            
            <div class="subsection">
              <p><strong>❓ Measurements seem inaccurate?</strong></p>
              <div class="bullet-point">• Verify coin alignment during calibration</div>
              <div class="bullet-point">• Ensure photo was taken perpendicular to surface</div>
              <div class="bullet-point">• Check that coin is on same plane as measured objects</div>
            </div>
            
            <div class="subsection">
              <p><strong>❓ Can't place measurements?</strong></p>
              <p>• Make sure you're in "Measure" mode (blue button should be highlighted)</p>
              <p>• Try switching between Pan/Edit to reset gesture handlers</p>
            </div>
            
            <div class="subsection">
              <p><strong>❓ Image rotated wrong?</strong></p>
              <p>• Some phones embed rotation data incorrectly - try rotating and re-exporting from Photos app</p>
            </div>
          </div>
        </div>

        <!-- Export & CAD Integration -->
        <div class="section">
          <div class="section-title">📐 Export & CAD Integration</div>
          <div class="section-content">
            <p>PanHandler exports include both full measurements and transparent overlays perfect for CAD workflows:</p>
            
            <div class="subsection">
              <p><strong>Email Export Contains:</strong></p>
              <div class="bullet-point">1. <strong>Full Photo</strong>: Complete image with measurements and legend</div>
              <div class="bullet-point">2. <strong>Transparent Overlay</strong>: 50% opacity - perfect for importing into CAD software</div>
            </div>
            
            <div class="tip-box">
              <p><strong>CAD Workflow:</strong></p>
              <div class="bullet-point">• Import transparent overlay as reference layer</div>
              <div class="bullet-point">• Use measurement values to create precise CAD drawings</div>
              <div class="bullet-point">• Values include area and volume where applicable</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>PanHandler</strong> - Precise measurements from photos</p>
          <p style="margin-top: 8px;">Generated from latest app version • Visit our YouTube channel for video tutorials</p>
          <p style="margin-top: 8px;">© ${currentYear} PanHandler • Open Source Project</p>
        </div>
      </body>
    </html>
  `;

  try {
    // Generate PDF from HTML
    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Share/open the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'PanHandler Guide',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

