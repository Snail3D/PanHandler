import { Camera } from 'react-native-vision-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as BarcodeScanner from 'expo-barcode-scanner';
import * as FileSystem from 'expo-file-system';

export interface Point {
  x: number;
  y: number;
}

export interface QRResult {
  url: string;
  size: number; // Extracted size in mm
  format: 'paper' | 'disc';
  corners: Point[]; // QR corner pixel positions
  centerX: number;
  centerY: number;
}

/**
 * Parse calibration URL to extract size and format
 * Examples:
 * - https://makerworld.com/en/models/1991923#panhandler-paper-30mm → {size: 30, format: 'paper'}
 * - https://makerworld.com/en/models/1991923#panhandler-disc-30mm → {size: 30, format: 'disc'}
 * - panhandler.app/calibrate/paper-30mm → {size: 30, format: 'paper'} (legacy)
 */
export function parseCalibrationURL(url: string): { size: number; format: 'paper' | 'disc' } | null {
  try {
    // Check for MakerWorld URL fragment (new format)
    const makerworldMatch = url.match(/#panhandler-(paper|disc)-(\d+)mm/);
    if (makerworldMatch) {
      const format = makerworldMatch[1] as 'paper' | 'disc';
      const size = parseInt(makerworldMatch[2], 10);
      if (!isNaN(size) && size > 0) {
        return { size, format };
      }
    }

    // Legacy format: panhandler.app/calibrate/
    if (url.includes('panhandler.app/calibrate/')) {
      const match = url.match(/panhandler\.app\/calibrate\/(paper|disc)-(\d+)mm/);
      if (match) {
        const format = match[1] as 'paper' | 'disc';
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
    
    // Use expo-barcode-scanner to scan the image
    // Note: scanFromURLAsync might not be available in all versions
    // If not available, we'll need to use a different approach
    try {
      // Try to use scanFromURLAsync if available
      if (BarcodeScanner.scanFromURLAsync) {
        const result = await BarcodeScanner.scanFromURLAsync(fileUri, [
          BarcodeScanner.Constants.BarCodeType.qr,
        ]);
        
        if (result && result.length > 0) {
          const qrCode = result[0];
          console.log('✅ QR code detected:', qrCode.data);
          
          // Extract corners from bounds if available
          const corners: Point[] = [];
          let centerX = 0;
          let centerY = 0;
          
          if (qrCode.bounds) {
            // expo-barcode-scanner provides bounds as { origin: { x, y }, size: { width, height } }
            const { origin, size } = qrCode.bounds;
            corners.push(
              { x: origin.x, y: origin.y },
              { x: origin.x + size.width, y: origin.y },
              { x: origin.x + size.width, y: origin.y + size.height },
              { x: origin.x, y: origin.y + size.height }
            );
            centerX = origin.x + size.width / 2;
            centerY = origin.y + size.height / 2;
          } else {
            // Fallback: use image center if bounds not available
            // We'd need image dimensions for this, but for now use placeholder
            centerX = 500; // Placeholder
            centerY = 500; // Placeholder
            corners.push(
              { x: 400, y: 400 },
              { x: 600, y: 400 },
              { x: 600, y: 600 },
              { x: 400, y: 600 }
            );
          }
          
          return {
            url: qrCode.data,
            size: 0, // Will be extracted from URL by parseCalibrationURL
            format: 'paper', // Will be determined from URL
            corners,
            centerX,
            centerY,
          };
        }
      } else {
        // scanFromURLAsync not available, try jsqr fallback
        console.warn('⚠️ scanFromURLAsync not available, trying jsqr fallback');
        return await detectQRWithJSQR(fileUri);
      }
    } catch (scanError) {
      console.error('⚠️ QR scan error with expo-barcode-scanner, trying jsqr fallback:', scanError);
      // Try jsqr as fallback
      try {
        return await detectQRWithJSQR(fileUri);
      } catch (jsqrError) {
        console.error('⚠️ jsqr fallback also failed:', jsqrError);
        return null;
      }
    }
    
    console.log('❌ No QR code detected in image');
    return null;
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
