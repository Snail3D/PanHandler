/**
 * Apple Watch Connectivity Utility
 * 
 * This module handles communication with the Apple Watch companion app.
 * Requires native WatchConnectivity framework integration.
 * 
 * TODO: Add native module for WatchConnectivity:
 * - iOS: Use WCSession framework
 * - Check if Watch is paired and app is installed
 * - Send messages to Watch app to display QR code
 * - Receive confirmation from Watch
 * - Handle remote shutter trigger from Watch
 * - Send haptic feedback to Watch
 */

import { Platform, NativeModules, NativeEventEmitter } from 'react-native';

const { WatchConnectivityModule } = NativeModules;
const watchEventEmitter = Platform.OS === 'ios' && WatchConnectivityModule 
  ? new NativeEventEmitter(WatchConnectivityModule) 
  : null;

// Callback for remote shutter trigger from Watch
let remoteShutterCallback: (() => void) | null = null;

// Initialize event listeners
if (Platform.OS === 'ios' && watchEventEmitter) {
  watchEventEmitter.addListener('onRemoteShutter', () => {
    console.log('📸 Remote shutter triggered from Watch');
    if (remoteShutterCallback) {
      remoteShutterCallback();
    }
  });
  
  watchEventEmitter.addListener('onWatchMessage', (message) => {
    console.log('⌚ Received message from Watch:', message);
  });
}

/**
 * Set callback for remote shutter trigger from Watch
 * When user taps Watch screen while QR code is showing, this callback is called
 */
export function setRemoteShutterCallback(callback: (() => void) | null): void {
  remoteShutterCallback = callback;
}

/**
 * Trigger remote shutter (called by native module when Watch screen is tapped)
 */
export function triggerRemoteShutter(): void {
  if (remoteShutterCallback) {
    remoteShutterCallback();
  }
}

export interface WatchInfo {
  isPaired: boolean;
  isWatchAppInstalled: boolean;
  isReachable: boolean;
  watchModel?: string;
  watchSize?: number; // in mm
}

/**
 * Check if Apple Watch is available and connected
 * 
 * @returns Promise<WatchInfo> - Watch connection status
 */
export async function checkWatchAvailability(): Promise<WatchInfo> {
  if (Platform.OS !== 'ios' || !WatchConnectivityModule) {
    return {
      isPaired: false,
      isWatchAppInstalled: false,
      isReachable: false,
    };
  }

  try {
    const info = await WatchConnectivityModule.checkAvailability();
    return {
      isPaired: info.isPaired,
      isWatchAppInstalled: info.isWatchAppInstalled,
      isReachable: info.isReachable,
      // watchSize will be populated by native module when Watch responds
      // Example sizes: 38mm, 40mm, 42mm, 44mm, 41mm, 45mm, 49mm (Ultra)
    };
  } catch (error) {
    console.error('Error checking Watch availability:', error);
    return {
      isPaired: false,
      isWatchAppInstalled: false,
      isReachable: false,
    };
  }
}

/**
 * Send message to Watch app to display QR code
 * Also triggers long vibrate when app comes up
 * 
 * @param qrSize - Size of QR code in mm (e.g., 30)
 * @param format - Format type: 'paper' | 'disc' | 'watch'
 * @returns Promise<boolean> - Success status
 */
export async function requestWatchQRCode(
  qrSize: number,
  format: 'paper' | 'disc' | 'watch' = 'watch'
): Promise<boolean> {
  if (Platform.OS !== 'ios' || !WatchConnectivityModule) {
    return false;
  }

  try {
    // The Watch app will detect its own screen size and use that for the QR code
    // The QR code URL will be generated with the actual Watch screen size
    await WatchConnectivityModule.sendMessage({
      action: 'displayQRCode',
      size: qrSize, // Fallback size, but Watch will use its actual screen size
      format: format,
      // url: `https://apps.apple.com/us/app/panhandler/id6754727828#panhandler-${format}-${watchScreenSize}mm`,
      vibrateOnShow: true, // Long vibrate when QR code appears
      enableRemoteShutter: true, // Enable tap-to-capture on Watch screen
      useWatchScreenSize: true // Tell Watch to use its detected screen size
    });
    
    console.log(`📱 Sent to Watch: Display QR code ${format} ${qrSize}mm with long vibrate`);
    return true;
  } catch (error) {
    console.error('Error sending message to Watch:', error);
    return false;
  }
}

/**
 * Stop displaying QR code on Watch
 * 
 * @returns Promise<boolean> - Success status
 */
export async function stopWatchQRCode(): Promise<boolean> {
  if (Platform.OS !== 'ios' || !WatchConnectivityModule) {
    return false;
  }

  try {
    await WatchConnectivityModule.sendMessage({
      action: 'stopQRCode'
    });
    
    console.log('📱 Sent to Watch: Stop displaying QR code');
    return true;
  } catch (error) {
    console.error('Error sending stop message to Watch:', error);
    return false;
  }
}

/**
 * Auto-detect Watch and open QR code display
 * This is called automatically when QR calibration is detected
 * Uses the Watch's actual screen size if available, otherwise uses provided qrSize
 * 
 * @param qrSize - Fallback size of QR code in mm (used if Watch size not detected)
 * @param format - Format type
 * @returns Promise<boolean> - Success status
 */
export async function autoOpenWatchQRCode(
  qrSize: number,
  format: 'paper' | 'disc' | 'watch' = 'watch'
): Promise<boolean> {
  try {
    // Check if Watch is available
    const watchInfo = await checkWatchAvailability();
    
    if (!watchInfo.isPaired || !watchInfo.isWatchAppInstalled) {
      console.log('⌚ Watch not available or app not installed');
      return false;
    }

    if (!watchInfo.isReachable) {
      console.log('⌚ Watch not reachable (may be out of range)');
      return false;
    }

    // Use Watch's actual screen size if available, otherwise use provided qrSize
    // The Watch app will detect its own screen size and send it back
    // For now, we'll request the Watch to use its detected size
    const actualSize = watchInfo.watchSize || qrSize;
    
    // Send message to Watch to display QR code with its actual screen size
    // The Watch app should detect its screen size and use that for calibration
    const success = await requestWatchQRCode(actualSize, format);
    
    if (success) {
      console.log(`✅ Watch QR code displayed: ${format} ${actualSize}mm (Watch screen size: ${watchInfo.watchSize || 'auto-detected'})`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error auto-opening Watch QR code:', error);
    return false;
  }
}

/**
 * Notify Watch that photo was captured
 * Triggers hard double tap haptic, screen blink, and closes Watch app
 */
export async function notifyWatchPhotoCaptured(): Promise<void> {
  if (Platform.OS !== 'ios' || !WatchConnectivityModule) {
    return;
  }

  try {
    await WatchConnectivityModule.sendMessage({
      action: 'photoCaptured',
      hapticType: 'doubleTap', // Hard double tap
      blinkScreen: true, // Blink the Watch screen
      closeApp: true // Close Watch app and return to watch face
    });
    
    console.log('📱 Notified Watch: Photo captured (hard double tap + screen blink + close app)');
  } catch (error) {
    console.error('Error notifying Watch of photo capture:', error);
  }
}

/**
 * Notify Watch about calibration status
 * Displays success or failure message on Watch before closing
 * 
 * @param success - true if calibration succeeded, false if failed
 */
export async function notifyWatchCalibrationStatus(success: boolean): Promise<void> {
  if (Platform.OS !== 'ios' || !WatchConnectivityModule) {
    return;
  }

  try {
    await WatchConnectivityModule.sendMessage({
      action: 'calibrationStatus',
      success: success,
      message: success ? 'Watch Calibration Success' : 'Watch Calibration Failed',
      displayDuration: 2000, // Show message for 2 seconds
      closeApp: true // Close Watch app after displaying message
    });
    
    const message = success ? 'Watch Calibration Success' : 'Watch Calibration Failed';
    console.log(`📱 Notified Watch: ${message}`);
  } catch (error) {
    console.error('Error notifying Watch of calibration status:', error);
  }
}

/**
 * Automatically show/hide Watch QR code based on camera mode
 * Called when camera screen opens/closes
 * Automatically detects Watch screen size and uses that for calibration
 * 
 * @param show - true to show QR code, false to hide
 * @param qrSize - Fallback size in mm (default: 30, only used if Watch size not detected)
 * @returns Promise<boolean> - Success status
 */
export async function toggleWatchQRCode(
  show: boolean,
  qrSize: number = 30
): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    if (show) {
      // Show QR code on Watch (triggers long vibrate)
      // Watch app will automatically detect its screen size and use that for calibration
      // The QR code URL will include the actual Watch screen size (e.g., 40mm, 44mm, 45mm, 49mm)
      return await autoOpenWatchQRCode(qrSize, 'watch');
    } else {
      // Hide QR code on Watch
      return await stopWatchQRCode();
    }
  } catch (error) {
    console.error('Error toggling Watch QR code:', error);
    return false;
  }
}

