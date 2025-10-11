export interface Point {
  id: string;
  x: number;
  y: number;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'angle';
  points: Point[];
  value?: number;
  label?: string;
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
