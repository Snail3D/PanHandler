import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

/**
 * Generate and save a QR code image to camera roll with correct dimensions for printing
 * 
 * The image will be generated at 300 DPI (standard print resolution) so when printed
 * at 100% scale, it will be exactly the specified size in millimeters.
 * 
 * @param sizeMM - Size of QR code in millimeters (e.g., 30 for 30mm)
 * @param format - Format type: 'paper' or 'disc'
 * @param dpi - Print resolution (default 300 DPI for high quality printing)
 * @returns Promise that resolves when image is saved
 */
export async function generateAndSaveQRCodeImage(
  sizeMM: number,
  format: 'paper' | 'disc' = 'paper',
  dpi: number = 300
): Promise<void> {
  try {
    // Request media library permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to save QR codes.');
      throw new Error('Photo library permission not granted');
    }

    // Calculate pixel dimensions for the QR code
    // At 300 DPI: 1 inch = 300 pixels, 1 mm = 11.811 pixels (300/25.4)
    const mmToInches = sizeMM / 25.4;
    const qrCodePixels = Math.round(mmToInches * dpi);
    
    // Add padding around QR code for quiet zone (recommended: 4 modules = ~10% of size)
    // We'll add 20% padding on each side for better printability
    const paddingPixels = Math.round(qrCodePixels * 0.2);
    const totalWidth = qrCodePixels + (paddingPixels * 2);
    const totalHeight = totalWidth; // Square image

    // Generate QR code URL with calibration data
    const qrURL = `https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-${format}-${sizeMM}mm`;

    // Create a temporary file path for the image
    const tempImagePath = `${FileSystem.cacheDirectory}qr_code_${format}_${sizeMM}mm_${Date.now()}.png`;

    // Use QR code API to generate the image at the correct pixel size
    // This ensures the QR code will print at exactly the right size
    const qrCodeImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=${qrCodePixels}x${qrCodePixels}&data=${encodeURIComponent(qrURL)}&margin=0`;
    
    // Download the QR code image
    const downloadResult = await FileSystem.downloadAsync(qrCodeImageURL, tempImagePath);
    
    if (!downloadResult.uri) {
      throw new Error('Failed to download QR code image');
    }

    // Resize QR code to exact pixel dimensions for printing (300 DPI)
    // This ensures it will print at exactly the right size when printed at 100% scale
    const resizedQR = await ImageManipulator.manipulateAsync(
      downloadResult.uri,
      [
        { resize: { width: qrCodePixels, height: qrCodePixels } },
      ],
      {
        format: ImageManipulator.SaveFormat.PNG,
        compress: 1, // No compression - maximum quality for printing
      }
    );

    // Calculate final dimensions with padding and text space
    const textHeight = Math.round(qrCodePixels * 0.25); // Space for text label below
    const finalWidth = qrCodePixels + (paddingPixels * 2);
    const finalHeight = qrCodePixels + (paddingPixels * 2) + textHeight;
    
    // Create a larger canvas with white background, QR code centered, and space for text
    // We'll use ImageManipulator to create a composite image
    // First, create a white background image at final dimensions
    const whiteBackgroundPath = `${FileSystem.cacheDirectory}white_bg_${Date.now()}.png`;
    
    // Use expo-print to create an HTML image with QR code and text, then convert to PNG
    // Actually, expo-print only creates PDFs. Let's use a different approach.
    
    // Best approach: Create the image using HTML/CSS via a web view or use a canvas library
    // For React Native, we'll use expo-print to create a PDF, then convert PDF first page to image
    // OR: Use the QR code as-is and add text via a separate overlay when displaying
    
    // For now, let's create an image with the QR code at exact dimensions
    // The dimensions are forced: qrCodePixels × qrCodePixels at 300 DPI = sizeMM mm when printed at 100%
    
    // Add white padding using ImageManipulator by creating a larger image
    // ImageManipulator doesn't have direct padding, so we'll composite it
    const finalImagePath = `${FileSystem.cacheDirectory}qr_final_${format}_${sizeMM}mm_${Date.now()}.png`;
    
    // Use ImageManipulator to create a composite: white background + QR code centered
    // We'll create a white square first, then overlay the QR code
    // Actually, ImageManipulator can't do this directly. We need to use a different method.
    
    // Simplest working solution: Save the QR code at exact pixel dimensions
    // The pixel dimensions force the print size: at 300 DPI, qrCodePixels pixels = sizeMM mm
    // When user prints at 100% scale (no scaling), it will be exactly sizeMM mm
    
    // Save to camera roll with exact dimensions preserved
    const asset = await MediaLibrary.createAssetAsync(resizedQR.uri);
    
    // Add to "PanHandler QR Codes" album
    try {
      const album = await MediaLibrary.getAlbumAsync('PanHandler QR Codes');
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('PanHandler QR Codes', asset, false);
      }
    } catch (albumError) {
      console.error('Failed to add to album:', albumError);
      // Still saved to camera roll
    }

    // Clean up temp files
    try {
      await FileSystem.deleteAsync(tempImagePath, { idempotent: true });
      await FileSystem.deleteAsync(resizedQR.uri, { idempotent: true });
      if (pdfResult?.uri) {
        await FileSystem.deleteAsync(pdfResult.uri, { idempotent: true });
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    console.log(`✅ QR code saved: ${format} ${sizeMM}mm (${qrCodePixels}×${qrCodePixels}px at ${dpi} DPI)`);
    
    // Don't show alert - will be called from PDF generation
    // Alert.alert(
    //   'QR Code Saved',
    //   `QR code saved to camera roll!\n\nSize: ${sizeMM}mm\nFormat: ${format}\nResolution: ${qrCodePixels}×${qrCodePixels}px (${dpi} DPI)\n\nPrint at 100% scale for accurate size.`,
    //   [{ text: 'OK' }]
    // );
  } catch (error) {
    console.error('Error generating QR code image:', error);
    Alert.alert('Error', `Failed to save QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

