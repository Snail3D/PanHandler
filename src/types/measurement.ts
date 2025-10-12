export interface Point {
  id: string;
  x: number;
  y: number;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'angle' | 'circle' | 'rectangle';
  points: Point[];
  value?: number;
  label?: string;
  radius?: number; // For circles
  width?: number;  // For rectangles
  height?: number; // For rectangles
}

export interface MeasurementData {
  imageUri: string;
  measurements: Measurement[];
  calibration?: {
    pixelsPerUnit: number;
    unit: 'mm' | 'cm' | 'in';
    referenceDistance: number;
  };
}
