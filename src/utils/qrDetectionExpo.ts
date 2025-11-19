import { Platform, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { scanFromURLAsync, BarcodeScanningResult } from 'expo-camera';
import { Point, QRResult, parseCalibrationURL } from './qrDetection';

/**
 * Detect QR code using expo-camera's scanFromURLAsync
 * This works at full resolution and provides accurate corner points
 */
export async function detectQRWithExpo(imageUri: string): Promise<QRResult | null> {
  try {
    // Convert to a file URI that expo-camera can process
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

    // Get actual image dimensions to ensure correct scaling
    let imageWidth = 0;
    let imageHeight = 0;
    try {
      await new Promise<void>((resolve) => {
        Image.getSize(
          fileUri,
          (width, height) => {
            imageWidth = width;
            imageHeight = height;
            resolve();
          },
          () => resolve()
        );
      });
    } catch (e) {
      // Ignore error, will default to 0
    }
    
    // Use expo-camera to scan the image
    // scanFromURLAsync returns an array of detected barcodes
    const results = await scanFromURLAsync(fileUri, ['qr']);
    
    if (!results || results.length === 0) {
      return null;
    }
    
    // Process all QR codes and find PanHandler ones
    const panHandlerQRs: Array<{
      barcode: BarcodeScanningResult;
      calibration: ReturnType<typeof parseCalibrationURL>;
      distanceToCenter: number;
    }> = [];
    
    // Use actual image dimensions for center calculation if available
    // Otherwise estimate from bounds (less accurate)
    let maxX = imageWidth;
    let maxY = imageHeight;
    
    if (maxX === 0 || maxY === 0) {
      for (const barcode of results) {
        if (barcode.cornerPoints && barcode.cornerPoints.length >= 4) {
          maxX = Math.max(maxX, ...barcode.cornerPoints.map(p => p.x));
          maxY = Math.max(maxY, ...barcode.cornerPoints.map(p => p.y));
        } else if (barcode.bounds) {
          maxX = Math.max(maxX, barcode.bounds.origin.x + barcode.bounds.size.width);
          maxY = Math.max(maxY, barcode.bounds.origin.y + barcode.bounds.size.height);
        }
      }
    }
    
    const imageCenterX = maxX / 2;
    const imageCenterY = maxY / 2;
    
    for (const barcode of results) {
      if (!barcode.data) continue;
      
      const calibrationData = parseCalibrationURL(barcode.data);
      if (!calibrationData) continue;
      
      // Use corner points if available (most accurate), otherwise use bounds
      let corners: Point[] = [];
      let centerX = 0;
      let centerY = 0;
      
      if (barcode.cornerPoints && barcode.cornerPoints.length >= 4) {
        // Use actual corner points (most accurate)
        corners = barcode.cornerPoints.map(p => ({ x: p.x, y: p.y }));
        centerX = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
        centerY = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
      } else if (barcode.bounds) {
        // Fallback to bounds if corner points not available
        const { x, y } = barcode.bounds.origin;
        const { width, height } = barcode.bounds.size;
        
        corners = [
          { x: x, y: y },
          { x: x + width, y: y },
          { x: x + width, y: y + height },
          { x: x, y: y + height }
        ];
        
        centerX = x + width / 2;
        centerY = y + height / 2;
      }
      
      if (corners.length < 4) {
        continue;
      }
      
      const dx = centerX - imageCenterX;
      const dy = centerY - imageCenterY;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      
      panHandlerQRs.push({
        barcode,
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
    
    // Build QRResult using corner points (most accurate)
    let corners: Point[] = [];
    let centerX = 0;
    let centerY = 0;
    
    if (selected.barcode.cornerPoints && selected.barcode.cornerPoints.length >= 4) {
      // Use actual corner points (most accurate for measurement)
      corners = selected.barcode.cornerPoints.map(p => ({ x: p.x, y: p.y }));
      centerX = corners.reduce((sum, p) => sum + p.x, 0) / corners.length;
      centerY = corners.reduce((sum, p) => sum + p.y, 0) / corners.length;
    } else if (selected.barcode.bounds) {
      // Fallback to bounds
      const { x, y } = selected.barcode.bounds.origin;
      const { width, height } = selected.barcode.bounds.size;
      
      corners = [
        { x: x, y: y },
        { x: x + width, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height }
      ];
      
      centerX = x + width / 2;
      centerY = y + height / 2;
    }
    
    return {
      url: selected.barcode.data,
      size: selected.calibration.size,
      format: selected.calibration.format,
      corners,
      centerX,
      centerY,
      rawWidth: imageWidth || maxX || undefined,
      rawHeight: imageHeight || maxY || undefined
    };
    
  } catch (error) {
    return null;
  }
}
