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
  mode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand';
  radius?: number; // For circles
  width?: number;  // For rectangles  
  height?: number; // For rectangles
  totalLength?: number; // For freehand - total path length
  area?: number; // For closed non-intersecting freehand loops (lasso mode)
  isClosed?: boolean; // For freehand - indicates if it's a closed loop
  perimeter?: string; // For closed freehand loops - just the perimeter for inline display
}

export type AppOrientation = 'PORTRAIT' | 'LANDSCAPE' | null;

interface MeasurementStore {
  currentImageUri: string | null;
  isAutoCaptured: boolean; // Flag to indicate auto-capture
  imageOrientation: AppOrientation; // Track image orientation
  measurements: Measurement[];
  completedMeasurements: CompletedMeasurement[]; // For DimensionOverlay
  currentPoints: Array<{ x: number; y: number; id: string }>; // For DimensionOverlay
  tempPoints: Point[];
  measurementMode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand';
  calibration: {
    pixelsPerUnit: number;
    unit: 'mm' | 'cm' | 'in';
    referenceDistance: number;
  } | null;
  coinCircle: CoinCircle | null;
  unitSystem: UnitSystem;
  lastSelectedCoin: string | null; // Store coin name
  userEmail: string | null; // User's email for auto-population
  isProUser: boolean; // Pro user status for paywall
  savedZoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null; // Restore zoom/pan/rotation
  sessionCount: number; // Track app sessions for rating prompt
  hasRatedApp: boolean; // Track if user has been prompted/rated
  lastRatingPromptDate: string | null; // Track when user was last prompted
  monthlySaveCount: number; // Track saves this month for free users
  monthlyEmailCount: number; // Track emails this month for free users
  lastResetDate: string | null; // Track when counters were last reset
  globalDownloads: number; // Global download count (fetched from backend)
  
  setImageUri: (uri: string | null, isAutoCaptured?: boolean) => void;
  incrementSessionCount: () => void;
  setHasRatedApp: (hasRated: boolean) => void;
  setLastRatingPromptDate: (date: string) => void;
  incrementSaveCount: () => void;
  incrementEmailCount: () => void;
  canSave: () => boolean;
  canEmail: () => boolean;
  resetMonthlyLimits: () => void;
  setImageOrientation: (orientation: AppOrientation) => void;
  setCompletedMeasurements: (measurements: CompletedMeasurement[]) => void;
  setCurrentPoints: (points: Array<{ x: number; y: number; id: string }>) => void;
  addTempPoint: (point: Point) => void;
  clearTempPoints: () => void;
  completeMeasurement: () => void;
  setMeasurementMode: (mode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand') => void;
  deleteMeasurement: (id: string) => void;
  clearAll: () => void;
  setCalibration: (calibration: MeasurementStore['calibration']) => void;
  setCoinCircle: (circle: CoinCircle | null) => void;
  setLastSelectedCoin: (coinName: string) => void;
  updatePointPosition: (pointId: string, x: number, y: number) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setUserEmail: (email: string | null) => void;
  setIsProUser: (isPro: boolean) => void;
  setSavedZoomState: (state: { scale: number; translateX: number; translateY: number; rotation?: number } | null) => void;
}

const useStore = create<MeasurementStore>()(
  persist(
    (set, get) => ({
      currentImageUri: null,
      isAutoCaptured: false,
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
      userEmail: null,
      isProUser: false,
      savedZoomState: null,
      sessionCount: 0,
      hasRatedApp: false,
      lastRatingPromptDate: null,
      monthlySaveCount: 0,
      monthlyEmailCount: 0,
      lastResetDate: null,
      globalDownloads: 1247, // TODO: Fetch from backend API

      setImageUri: (uri, isAutoCaptured = false) => set({ 
        currentImageUri: uri,
        isAutoCaptured,
        // Only clear measurements if setting to null
        ...(uri === null ? { measurements: [], completedMeasurements: [], currentPoints: [], tempPoints: [], coinCircle: null, calibration: null, imageOrientation: null, savedZoomState: null, isAutoCaptured: false } : {})
      }),

      incrementSessionCount: () => set((state) => ({ sessionCount: state.sessionCount + 1 })),

      setHasRatedApp: (hasRated) => set({ hasRatedApp: hasRated }),

      setLastRatingPromptDate: (date) => set({ lastRatingPromptDate: date }),

      incrementSaveCount: () => set((state) => ({ monthlySaveCount: state.monthlySaveCount + 1 })),

      incrementEmailCount: () => set((state) => ({ monthlyEmailCount: state.monthlyEmailCount + 1 })),

      canSave: () => {
        const state = get();
        if (state.isProUser) return true;
        
        // Check if we need to reset monthly counters
        const now = new Date();
        const lastReset = state.lastResetDate ? new Date(state.lastResetDate) : null;
        if (!lastReset || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          get().resetMonthlyLimits();
          return true;
        }
        
        return state.monthlySaveCount < 10;
      },

      canEmail: () => {
        const state = get();
        if (state.isProUser) return true;
        
        // Check if we need to reset monthly counters
        const now = new Date();
        const lastReset = state.lastResetDate ? new Date(state.lastResetDate) : null;
        if (!lastReset || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          get().resetMonthlyLimits();
          return true;
        }
        
        return state.monthlyEmailCount < 10;
      },

      resetMonthlyLimits: () => set({ 
        monthlySaveCount: 0, 
        monthlyEmailCount: 0, 
        lastResetDate: new Date().toISOString() 
      }),

      setImageOrientation: (orientation: AppOrientation) => set({ imageOrientation: orientation }),

      setCompletedMeasurements: (completedMeasurements: CompletedMeasurement[]) => set({ completedMeasurements }),
      
      setCurrentPoints: (currentPoints: Array<{ x: number; y: number; id: string }>) => set({ currentPoints }),

      addTempPoint: (point: Point) => set((state) => {
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

      setMeasurementMode: (mode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand') => set({ measurementMode: mode, tempPoints: [] }),

      deleteMeasurement: (id: string) => set((state) => ({
        measurements: state.measurements.filter((m) => m.id !== id),
      })),

      clearAll: () => set({ measurements: [], tempPoints: [], currentImageUri: null, coinCircle: null }),

      setCalibration: (calibration: MeasurementStore['calibration']) => set({ calibration }),

      setCoinCircle: (circle: CoinCircle | null) => set({ coinCircle: circle }),

      setLastSelectedCoin: (coinName: string) => set({ lastSelectedCoin: coinName }),

      updatePointPosition: (pointId: string, x: number, y: number) => set((state) => {
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

      setUnitSystem: (system: UnitSystem) => set({ unitSystem: system }),

      setUserEmail: (email: string | null) => set({ userEmail: email }),

      setIsProUser: (isPro: boolean) => set({ isProUser: isPro }),

      setSavedZoomState: (zoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null) => set({ savedZoomState: zoomState }),
    }),
    {
      name: 'measurement-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        unitSystem: state.unitSystem,
        lastSelectedCoin: state.lastSelectedCoin,
        userEmail: state.userEmail, // Persist user email
        isProUser: state.isProUser, // Persist pro status
        sessionCount: state.sessionCount, // Persist session count
        hasRatedApp: state.hasRatedApp, // Persist rating status
        lastRatingPromptDate: state.lastRatingPromptDate, // Persist last prompt date
        monthlySaveCount: state.monthlySaveCount, // Persist monthly save count
        monthlyEmailCount: state.monthlyEmailCount, // Persist monthly email count
        lastResetDate: state.lastResetDate, // Persist last reset date
        // Persist current work session
        currentImageUri: state.currentImageUri,
        isAutoCaptured: state.isAutoCaptured, // Persist auto-capture flag
        imageOrientation: state.imageOrientation,
        calibration: state.calibration,
        coinCircle: state.coinCircle,
        measurements: state.measurements,
        completedMeasurements: state.completedMeasurements,
        currentPoints: state.currentPoints,
        measurementMode: state.measurementMode,
        savedZoomState: state.savedZoomState, // Persist zoom/pan state
      }),
    }
  )
);

export default useStore;
