import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Point, Measurement } from '../types/measurement';

export type UnitSystem = 'metric' | 'imperial';

export interface CoinCircle {
  centerX: number;
  centerY: number;
  radius: number;
  coinName: string;
  coinDiameter: number; // in mm
}

export interface CompletedMeasurement {
  id: string;
  points: Array<{ x: number; y: number }>;
  value: string;
  mode: 'distance' | 'angle';
}

export type AppOrientation = 'PORTRAIT' | 'LANDSCAPE' | null;

interface MeasurementStore {
  currentImageUri: string | null;
  imageOrientation: AppOrientation; // Track image orientation
  measurements: Measurement[];
  completedMeasurements: CompletedMeasurement[]; // For DimensionOverlay
  currentPoints: Array<{ x: number; y: number; id: string }>; // For DimensionOverlay
  tempPoints: Point[];
  measurementMode: 'distance' | 'angle';
  calibration: {
    pixelsPerUnit: number;
    unit: 'mm' | 'cm' | 'in';
    referenceDistance: number;
  } | null;
  coinCircle: CoinCircle | null;
  unitSystem: UnitSystem;
  lastSelectedCoin: string | null; // Store coin name
  
  setImageUri: (uri: string | null) => void;
  setImageOrientation: (orientation: AppOrientation) => void;
  setCompletedMeasurements: (measurements: CompletedMeasurement[]) => void;
  setCurrentPoints: (points: Array<{ x: number; y: number; id: string }>) => void;
  addTempPoint: (point: Point) => void;
  clearTempPoints: () => void;
  completeMeasurement: () => void;
  setMeasurementMode: (mode: 'distance' | 'angle') => void;
  deleteMeasurement: (id: string) => void;
  clearAll: () => void;
  setCalibration: (calibration: MeasurementStore['calibration']) => void;
  setCoinCircle: (circle: CoinCircle | null) => void;
  setLastSelectedCoin: (coinName: string) => void;
  updatePointPosition: (pointId: string, x: number, y: number) => void;
  setUnitSystem: (system: UnitSystem) => void;
}

const useStore = create<MeasurementStore>()(
  persist(
    (set) => ({
      currentImageUri: null,
      imageOrientation: null,
      measurements: [],
      completedMeasurements: [],
      currentPoints: [],
      tempPoints: [],
      measurementMode: 'distance',
      calibration: null,
      coinCircle: null,
      unitSystem: 'metric',
      lastSelectedCoin: null,

      setImageUri: (uri) => set({ 
        currentImageUri: uri,
        // Only clear measurements if setting to null
        ...(uri === null ? { measurements: [], completedMeasurements: [], currentPoints: [], tempPoints: [], coinCircle: null, calibration: null, imageOrientation: null } : {})
      }),

      setImageOrientation: (orientation) => set({ imageOrientation: orientation }),

      setCompletedMeasurements: (completedMeasurements) => set({ completedMeasurements }),
      
      setCurrentPoints: (currentPoints) => set({ currentPoints }),

      addTempPoint: (point) => set((state) => {
        const newTempPoints = [...state.tempPoints, point];
        return { tempPoints: newTempPoints };
      }),

      clearTempPoints: () => set({ tempPoints: [] }),

      completeMeasurement: () => set((state) => {
        if (state.tempPoints.length < 2) return state;

        const newMeasurement: Measurement = {
          id: Date.now().toString(),
          type: state.measurementMode,
          points: state.tempPoints,
        };

        return {
          measurements: [...state.measurements, newMeasurement],
          tempPoints: [],
        };
      }),

      setMeasurementMode: (mode) => set({ measurementMode: mode, tempPoints: [] }),

      deleteMeasurement: (id) => set((state) => ({
        measurements: state.measurements.filter((m) => m.id !== id),
      })),

      clearAll: () => set({ measurements: [], tempPoints: [], currentImageUri: null, coinCircle: null }),

      setCalibration: (calibration) => set({ calibration }),

      setCoinCircle: (circle) => set({ coinCircle: circle }),

      setLastSelectedCoin: (coinName) => set({ lastSelectedCoin: coinName }),

      updatePointPosition: (pointId, x, y) => set((state) => {
        const measurements = state.measurements.map((measurement) => ({
          ...measurement,
          points: measurement.points.map((point) =>
            point.id === pointId ? { ...point, x, y } : point
          ),
        }));

        const tempPoints = state.tempPoints.map((point) =>
          point.id === pointId ? { ...point, x, y } : point
        );

        return { measurements, tempPoints };
      }),

      setUnitSystem: (system) => set({ unitSystem: system }),
    }),
    {
      name: 'measurement-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        unitSystem: state.unitSystem,
        lastSelectedCoin: state.lastSelectedCoin,
        // Persist current work session
        currentImageUri: state.currentImageUri,
        imageOrientation: state.imageOrientation,
        calibration: state.calibration,
        coinCircle: state.coinCircle,
        measurements: state.measurements,
        completedMeasurements: state.completedMeasurements,
        currentPoints: state.currentPoints,
        measurementMode: state.measurementMode,
      }),
    }
  )
);

export default useStore;
