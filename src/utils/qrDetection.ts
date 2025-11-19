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
  rawWidth?: number;
  rawHeight?: number;
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
    return null;
  }
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