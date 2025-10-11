import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Point, Measurement } from '../types/measurement';

export type UnitSystem = 'metric' | 'imperial';

interface MeasurementStore {
  currentImageUri: string | null;
  measurements: Measurement[];
  tempPoints: Point[];
  measurementMode: 'distance' | 'angle';
  calibration: {
    pixelsPerUnit: number;
    unit: 'mm' | 'cm' | 'in';
    referenceDistance: number;
  } | null;
  unitSystem: UnitSystem;
  
  setImageUri: (uri: string) => void;
  addTempPoint: (point: Point) => void;
  clearTempPoints: () => void;
  completeMeasurement: () => void;
  setMeasurementMode: (mode: 'distance' | 'angle') => void;
  deleteMeasurement: (id: string) => void;
  clearAll: () => void;
  setCalibration: (calibration: MeasurementStore['calibration']) => void;
  updatePointPosition: (pointId: string, x: number, y: number) => void;
  setUnitSystem: (system: UnitSystem) => void;
}

const useStore = create<MeasurementStore>()(
  persist(
    (set) => ({
      currentImageUri: null,
      measurements: [],
      tempPoints: [],
      measurementMode: 'distance',
      calibration: null,
      unitSystem: 'metric',

      setImageUri: (uri) => set({ currentImageUri: uri, measurements: [], tempPoints: [] }),

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

      clearAll: () => set({ measurements: [], tempPoints: [], currentImageUri: null }),

      setCalibration: (calibration) => set({ calibration }),

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
      partialize: (state) => ({ unitSystem: state.unitSystem }),
    }
  )
);

export default useStore;
