import { printToFileAsync } from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Generates a comprehensive PDF guide from the help modal content
 * Includes all sections, styling, and QR codes for external resources
 */
export async function generatePdfGuide(): Promise<void> {
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
        <h1>📱 PanHandler Guide</h1>
        <p class="subtitle">Complete Reference for Precise Measurements</p>
        
        <!-- QR Codes Section - Top of Document -->
        <div style="margin: 30px 0; padding: 20px; background: #F9F9F9; border-radius: 12px; border: 1px solid #E5E5EA;">
          <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 40px;">
            <div style="text-align: center; flex: 1;">
              <div style="background: white; padding: 10px; border-radius: 8px; display: inline-block; border: 2px solid #E5E5EA;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://github.com/Snail3D/PanHandler/releases/latest" 
                     alt="GitHub QR Code" 
                     style="width: 150px; height: 150px; display: block;" />
              </div>
              <div style="margin-top: 12px; font-weight: 600; font-size: 14px;">GitHub Latest Release</div>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">
                github.com/Snail3D/PanHandler
              </div>
            </div>
            
            <div style="text-align: center; flex: 1;">
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
              <div class="bullet-point">• Watch the <strong>red crosshairs</strong> - align with gray reference lines</div>
              <div class="bullet-point">• <strong>Horizontal crosshair</strong>: Shows if camera is tilted (pitch)</div>
              <div class="bullet-point">• <strong>Vertical crosshair</strong>: Shows if camera is rotated (roll)</div>
              <div class="bullet-point">• <strong>Bubble indicator</strong>: Shows combined tilt status</div>
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
              <div class="bullet-point">3. Align the blue circle with the coin's edge using pinch-zoom</div>
              <div class="bullet-point">4. Tap ✓ when perfectly aligned</div>
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
              <div class="bullet-point">• <strong>Scale Mode Button</strong> (bottom-left, three icons): Choose Map/Blueprint/Aerial calibration</div>
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
              <div class="bullet-point">2. Tap a measurement to select it (turns yellow)</div>
              <div class="bullet-point">3. Drag any point to reposition</div>
              <div class="bullet-point">4. Values update in real-time</div>
            </div>
            
            <div class="subsection">
              <p><strong>Adding Labels:</strong></p>
              <div class="bullet-point">• Double-tap any measurement</div>
              <div class="bullet-point">• Enter custom label (e.g., "Width", "Height")</div>
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
              <div class="bullet-point">• <strong>Aerial/Drone Mode</strong>: Use altitude data from drone photos (reads XMP metadata)</div>
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
          <p style="margin-top: 8px;">© 2024 PanHandler • Open Source Project</p>
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

