import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as BarCodeScanner from 'expo-barcode-scanner';
import { Point, QRResult, parseCalibrationURL } from './qrDetection';

/**
 * Detect QR code using expo-barcode-scanner
 * This should work at full resolution without the 4x scaling issue
 */
export async function detectQRWithExpo(imageUri: string): Promise<QRResult | null> {
  try {
    // Convert to a file URI that expo-barcode-scanner can process
    let fileUri = imageUri;
    
    // Handle iOS photo library URIs
    if (imageUri.startsWith('ph://') || imageUri.startsWith('assets-library://')) {
      try {
        const tempUri = `${FileSystem.cacheDirectory}qr_scan_expo_${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: imageUri,
          to: tempUri,
        });
        fileUri = tempUri;
      } catch (copyError) {
        return null;
      }
    }
    
    // Use expo-barcode-scanner to scan the image
    // scanFromURLAsync returns an array of detected barcodes
    const results = await BarCodeScanner.scanFromURLAsync(fileUri, [
      BarCodeScanner.Constants.BarCodeType.qr
    ]);
    
    if (!results || results.length === 0) {
      return null;
    }
    
    // Process all QR codes and find PanHandler ones
    const panHandlerQRs: Array<{
      data: typeof results[0];
      calibration: ReturnType<typeof parseCalibrationURL>;
      distanceToCenter: number;
    }> = [];
    
    // Estimate image dimensions from the bounds
    // Expo scanner returns bounds as { x, y, width, height }
    let maxX = 0;
    let maxY = 0;
    
    for (const barcode of results) {
      // Expo scanner returns: { type, data, bounds }
      // bounds has: { origin: {x, y}, size: {width, height} }
      const bounds = barcode.bounds || barcode.cornerPoints;
      
      if (bounds) {
        if ('origin' in bounds && 'size' in bounds) {
          // Expo format
          maxX = Math.max(maxX, bounds.origin.x + bounds.size.width);
          maxY = Math.max(maxY, bounds.origin.y + bounds.size.height);
        } else if (Array.isArray(bounds) && bounds.length >= 4) {
          // Corner points format
          maxX = Math.max(maxX, ...bounds.map(p => p.x));
          maxY = Math.max(maxY, ...bounds.map(p => p.y));
        }
      }
    }
    
    const imageCenterX = maxX / 2;
    const imageCenterY = maxY / 2;
    
    for (const barcode of results) {
      if (!barcode.data) continue;
      
      const calibrationData = parseCalibrationURL(barcode.data);
      if (!calibrationData) continue;
      
      // Calculate center and distance
      let centerX = 0;
      let centerY = 0;
      let corners: Point[] = [];
      
      const bounds = barcode.bounds || barcode.cornerPoints;
      
      if (bounds) {
        if ('origin' in bounds && 'size' in bounds) {
          // Expo format - convert to corners
          const { x, y } = bounds.origin;
          const { width, height } = bounds.size;
          
          corners = [
            { x: x, y: y },
            { x: x + width, y: y },
            { x: x + width, y: y + height },
            { x: x, y: y + height }
          ];
          
          centerX = x + width / 2;
          centerY = y + height / 2;
        } else if (Array.isArray(bounds) && bounds.length >= 4) {
          // Corner points format
          corners = bounds.map(p => ({ x: p.x, y: p.y }));
          centerX = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
          centerY = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
        }
      }
      
      if (corners.length < 4) {
        continue;
      }
      
      const dx = centerX - imageCenterX;
      const dy = centerY - imageCenterY;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      
      panHandlerQRs.push({
        data: barcode,
        calibration: calibrationData,
        distanceToCenter
      });
    }
    
    if (panHandlerQRs.length === 0) {
      return null;
    }
    
    // Use the PanHandler QR closest to center
    panHandlerQRs.sort((a, b) => a.distanceToCenter - b.distanceToCenter);
    const selected = panHandlerQRs[0];
    
    // Build QRResult
    const bounds = selected.data.bounds || selected.data.cornerPoints;
    let corners: Point[] = [];
    let centerX = 0;
    let centerY = 0;
    
    if (bounds) {
      if ('origin' in bounds && 'size' in bounds) {
        const { x, y } = bounds.origin;
        const { width, height } = bounds.size;
        
        corners = [
          { x: x, y: y },
          { x: x + width, y: y },
          { x: x + width, y: y + height },
          { x: x, y: y + height }
        ];
        
        centerX = x + width / 2;
        centerY = y + height / 2;
      } else if (Array.isArray(bounds) && bounds.length >= 4) {
        corners = bounds.map(p => ({ x: p.x, y: p.y }));
        centerX = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
        centerY = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
      }
    }
    
    return {
      url: selected.data.data,
      size: selected.calibration.size,
      format: selected.calibration.format,
      corners,
      centerX,
      centerY
    };
    
  } catch (error) {
    return null;
  }
}
