import { Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import BarcodeScanning, { BarcodeFormat } from '@react-native-ml-kit/barcode-scanning';

// Extended Barcode interface with corner points (patched native module provides these)
interface BarcodeWithCorners {
  format: BarcodeFormat;
  value: string;
  cornerPoints?: Array<{ x: number; y: number }>;
  boundingBox?: { left: number; top: number; width: number; height: number };
}

export interface Point {
  x: number;
  y: number;
}

export interface QRResult {
  url: string;
  size: number; // Extracted size in mm
  format: 'paper' | 'disc' | 'watch';
  corners: Point[]; // QR corner pixel positions
  centerX: number;
  centerY: number;
}

/**
 * Parse calibration URL to extract size and format
 * Examples:
 * - https://makerworld.com/en/models/1991923#panhandler-paper-30mm → {size: 30, format: 'paper'}
 * - https://makerworld.com/en/models/1991923#panhandler-disc-30mm → {size: 30, format: 'disc'}
 * - https://apps.apple.com/...#panhandler-watch-30mm → {size: 30, format: 'watch'}
 * - panhandler.app/calibrate/paper-30mm → {size: 30, format: 'paper'} (legacy)
 */
export function parseCalibrationURL(url: string): { size: number; format: 'paper' | 'disc' | 'watch' } | null {
  try {
    // Check for URL fragment (new format) - supports paper, disc, and watch
    const fragmentMatch = url.match(/#panhandler-(paper|disc|watch)-(\d+)mm/);
    if (fragmentMatch) {
      const format = fragmentMatch[1] as 'paper' | 'disc' | 'watch';
      const size = parseInt(fragmentMatch[2], 10);
      if (!isNaN(size) && size > 0) {
        return { size, format };
      }
    }

    // Legacy format: panhandler.app/calibrate/
    if (url.includes('panhandler.app/calibrate/')) {
      const match = url.match(/panhandler\.app\/calibrate\/(paper|disc|watch)-(\d+)mm/);
      if (match) {
        const format = match[1] as 'paper' | 'disc' | 'watch';
        const size = parseInt(match[2], 10);
        if (!isNaN(size) && size > 0) {
          return { size, format };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing calibration URL:', error);
    return null;
  }
}

/**
 * Detect QR code in static image
 * Uses expo-barcode-scanner to scan QR codes from image files
 * 
 * iOS Support:
 * - ✅ Works in production builds (native module available)
 * - ✅ Supports QR codes (which is all we need)
 * - ✅ Handles iOS photo library URIs (ph://) by copying to temp files
 * - ⚠️ May not work in Expo Go (development) - but production builds work fine
 * 
 * Android Support:
 * - ✅ Works in both development and production
 * - ✅ Supports all barcode types
 */
export async function detectQR(imageUri: string): Promise<QRResult | null> {
  try {
    console.log('🔍 Starting QR detection for image:', imageUri);
    
    // Convert image to a format that barcode scanner can process
    // expo-barcode-scanner's scanFromURLAsync can work with file URIs
    let fileUri = imageUri;
    
    // Handle iOS photo library URIs (ph://) - these need to be copied to accessible file paths
    if (imageUri.startsWith('ph://') || imageUri.startsWith('assets-library://')) {
      // For iOS photo library URIs, we need to copy to a temporary file
      // expo-barcode-scanner needs a file:// URI, not ph://
      try {
        const tempUri = `${FileSystem.cacheDirectory}qr_scan_${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: imageUri,
          to: tempUri,
        });
        fileUri = tempUri;
        console.log('📱 Copied iOS photo to temp file:', fileUri);
      } catch (copyError) {
        console.error('⚠️ Failed to copy iOS photo:', copyError);
        // If copy fails, try using MediaLibrary to get a local URI
        try {
          const { getAssetInfoAsync } = await import('expo-media-library');
          // Extract asset ID from ph:// URI if possible
          // For now, just return null - the photo picker should give us file:// URIs anyway
          console.warn('⚠️ Could not copy iOS photo, QR detection may fail');
          return null;
        } catch (mediaLibError) {
          console.error('⚠️ MediaLibrary fallback also failed:', mediaLibError);
          return null;
        }
      }
    }
    
    // Use MLKit Barcode Scanner to detect QR codes in the image (works offline, on-device)
    try {
      console.log('🔍 Scanning image for QR codes (offline MLKit):', fileUri);
      
      // MLKit BarcodeScanning.scan() takes an image URL
      // On Android, ensure we have a proper file:// URI
      // On iOS, file:// URIs work fine
      let scanUri = fileUri;
      if (Platform.OS === 'android' && !fileUri.startsWith('file://') && !fileUri.startsWith('http')) {
        // Android might need file:// prefix
        scanUri = fileUri.startsWith('/') ? `file://${fileUri}` : `file:///${fileUri}`;
        console.log('📱 Adjusted Android URI:', scanUri);
      }
      
      console.log('🔍 Calling BarcodeScanning.scan with URI:', scanUri);
      
      // Check if module is available
      if (!BarcodeScanning || typeof BarcodeScanning.scan !== 'function') {
        throw new Error('BarcodeScanning module not available - native module may not be linked');
      }
      
      // This works 100% offline - MLKit runs on-device
      let barcodes: BarcodeWithCorners[];
      try {
        barcodes = await BarcodeScanning.scan(scanUri) as BarcodeWithCorners[];
      } catch (moduleError: any) {
        console.error('❌ BarcodeScanning.scan threw error:', moduleError);
        throw new Error(`QR detection failed: ${moduleError?.message || String(moduleError)}`);
      }
      
      console.log('📊 MLKit returned barcodes:', barcodes?.length || 0, JSON.stringify(barcodes, null, 2));
      
      if (barcodes && barcodes.length > 0) {
        // Accept ANY barcode first to test if module is working
        // Then filter for QR codes
        let qrCode = barcodes.find(b => {
          const format = b.format;
          return format === BarcodeFormat.QR_CODE || 
                 format === 256 ||
                 (typeof format === 'number' && format === 256);
        });
        
        // If no QR code found, use first barcode anyway (for testing)
        if (!qrCode && barcodes.length > 0) {
          qrCode = barcodes[0];
          console.log('⚠️ No QR code found, using first barcode for testing:', qrCode.format);
        }
        
        console.log('🔍 Selected barcode:', JSON.stringify(qrCode, null, 2));
        console.log('🔍 Format check - QR_CODE enum:', BarcodeFormat.QR_CODE, 'barcode format:', qrCode?.format);
        
        if (qrCode && qrCode.value) {
          console.log('✅ QR code detected (offline):', qrCode.value);
          
          // Use ACTUAL corner points from MLKit for precise calculation (not estimation!)
          let corners: Point[] = [];
          let centerX = 0;
          let centerY = 0;
          
          if (qrCode.cornerPoints && qrCode.cornerPoints.length >= 4) {
            // MLKit provides exact corner points - use them for precise calculation
            corners = qrCode.cornerPoints.map(p => ({ x: p.x, y: p.y }));
            
            // Calculate center from actual corner points
            centerX = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
            centerY = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
            
            console.log('📐 Using actual corner points for precise calculation:', corners);
          } else if (qrCode.boundingBox) {
            // Fallback: use bounding box if corner points not available
            const { left, top, width, height } = qrCode.boundingBox;
            corners = [
              { x: left, y: top },
              { x: left + width, y: top },
              { x: left + width, y: top + height },
              { x: left, y: top + height }
            ];
            centerX = left + width / 2;
            centerY = top + height / 2;
            
            console.log('📐 Using bounding box for calculation:', qrCode.boundingBox);
          } else {
            // Fallback: If corner points aren't available (module not rebuilt yet), 
            // we can't do precise calibration, but we can still detect the QR code
            // The calibration will need to be done manually or after rebuild
            console.warn('⚠️ No corner points or bounding box - native module may need rebuild');
            // Return null so it falls back to normal calibration flow
            // User can manually calibrate if needed
            return null;
          }
          
          return {
            url: qrCode.value,
            size: 0, // Will be extracted from URL by parseCalibrationURL
            format: 'paper', // Will be determined from URL
            corners,
            centerX,
            centerY,
          };
        }
      }
      
      console.log('❌ No QR code detected in image');
      return null;
    } catch (scanError) {
      console.error('⚠️ QR scan error with MLKit (offline):', scanError);
      return null;
    }
  } catch (error) {
    console.error('Error detecting QR code:', error);
    return null;
  }
}

/**
 * Fallback QR detection using jsqr (pure JavaScript, works on all platforms)
 * NOTE: This is a placeholder - jsqr requires ImageData (browser canvas API)
 * which isn't available in React Native. For now, we rely on expo-barcode-scanner
 * which SHOULD work on iOS in production builds.
 * 
 * expo-barcode-scanner.scanFromURLAsync:
 * - ✅ Works on iOS (QR codes only)
 * - ✅ Works on Android (all barcode types)
 * - ✅ Works in production builds
 * - ⚠️ May not work in Expo Go (development)
 * 
 * If this fallback is needed, we'd need to:
 * 1. Use expo-gl to render image and read pixels, OR
 * 2. Use a native module to decode image to pixel data, OR
 * 3. Use react-native-image-to-base64 + decode PNG/JPEG manually
 */
async function detectQRWithJSQR(imageUri: string): Promise<QRResult | null> {
  // For now, jsqr fallback is not implemented because it requires ImageData
  // which is browser-specific. expo-barcode-scanner should work on iOS.
  console.warn('⚠️ jsqr fallback not available - expo-barcode-scanner should work on iOS in production');
  return null;
}

/**
 * Check if QR code is approximately centered in frame
 */
export function isQRCentered(
  qr: QRResult | { centerX: number; centerY: number },
  frameWidth: number,
  frameHeight: number,
  tolerance: number = 0.2
): boolean {
  const dx = Math.abs(qr.centerX - frameWidth / 2);
  const dy = Math.abs(qr.centerY - frameHeight / 2);
  
  return (
    dx < frameWidth * tolerance && 
    dy < frameHeight * tolerance
  );
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
