export interface Point {
  id: string;
  x: number;
  y: number;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand';
  points: Point[];
  value?: number;
  label?: string;
  radius?: number; // For circles
  width?: number;  // For rectangles
  height?: number; // For rectangles
  totalLength?: number; // For freehand paths
  depth?: number; // For volume calculations (stored in base unit)
  depthUnit?: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi'; // Unit used when entering depth
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
