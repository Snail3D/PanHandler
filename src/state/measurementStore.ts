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

export interface VerbalScale {
  screenDistance: number;
  screenUnit: 'cm' | 'in';
  realDistance: number;
  realUnit: 'km' | 'mi' | 'm' | 'ft';
}

export interface CompletedMeasurement {
  id: string;
  points: Array<{ x: number; y: number }>;
  value: string;
  mode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand';
  calibrationMode?: 'coin' | 'map'; // Track which calibration mode was used when creating this measurement
  mapScaleData?: {screenDistance: number, screenUnit: 'cm' | 'in', realDistance: number, realUnit: 'km' | 'mi' | 'm' | 'ft'}; // Store map scale if created in map mode
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
    calibrationType?: 'coin' | 'verbal';
    verbalScale?: VerbalScale;
  } | null;
  coinCircle: CoinCircle | null;
  unitSystem: UnitSystem;
  lastSelectedCoin: string | null; // Store coin name
  userEmail: string | null; // User's email for auto-population
  isProUser: boolean; // Pro user status for paywall (only for Freehand tool)
  savedZoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null; // Restore zoom/pan/rotation
  sessionCount: number; // Track app opens (incremented each time app becomes active)
  reviewPromptCount: number; // Track how many times we've asked (max 2)
  hasReviewedApp: boolean; // True if user tapped "Rate" button
  lastReviewPromptDate: string | null; // Track when user was last prompted
  globalDownloads: number; // Global download count (fetched from backend)
  hasSeenPinchTutorial: boolean; // Track if user has seen pinch-zoom tutorial
  hasSeenPanTutorial: boolean; // Track if user has seen pan tutorial on measurement screen
  
  setImageUri: (uri: string | null, isAutoCaptured?: boolean) => void;
  incrementSessionCount: () => void;
  incrementReviewPromptCount: () => void;
  setHasReviewedApp: (hasReviewed: boolean) => void;
  setLastReviewPromptDate: (date: string) => void;
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
  setHasSeenPinchTutorial: (hasSeen: boolean) => void;
  setHasSeenPanTutorial: (hasSeen: boolean) => void;
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
      reviewPromptCount: 0,
      hasReviewedApp: false,
      lastReviewPromptDate: null,
      globalDownloads: 1247,
      hasSeenPinchTutorial: false,
      hasSeenPanTutorial: false,

      setImageUri: (uri, isAutoCaptured = false) => set({ 
        currentImageUri: uri,
        isAutoCaptured,
        // Only clear measurements if setting to null
        ...(uri === null ? { measurements: [], completedMeasurements: [], currentPoints: [], tempPoints: [], coinCircle: null, calibration: null, imageOrientation: null, savedZoomState: null, isAutoCaptured: false } : {})
      }),

      incrementSessionCount: () => set((state) => ({ sessionCount: state.sessionCount + 1 })),

      incrementReviewPromptCount: () => set((state) => ({ reviewPromptCount: state.reviewPromptCount + 1 })),

      setHasReviewedApp: (hasReviewed) => set({ hasReviewedApp: hasReviewed }),

      setLastReviewPromptDate: (date) => set({ lastReviewPromptDate: date }),

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

      // ⚠️ WARNING: This writes to AsyncStorage via persist middleware
      // NEVER call this in high-frequency callbacks (onUpdate, onTransformChange, etc.)
      // ALWAYS debounce this with 500ms+ delay to prevent JS thread blocking
      // See: NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md
      setSavedZoomState: (zoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null) => set({ savedZoomState: zoomState }),
      
      setHasSeenPinchTutorial: (hasSeen: boolean) => set({ hasSeenPinchTutorial: hasSeen }),
      
      setHasSeenPanTutorial: (hasSeen: boolean) => set({ hasSeenPanTutorial: hasSeen }),
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
        reviewPromptCount: state.reviewPromptCount, // Persist review prompt count
        hasReviewedApp: state.hasReviewedApp, // Persist review status
        lastReviewPromptDate: state.lastReviewPromptDate, // Persist last prompt date
        hasSeenPinchTutorial: state.hasSeenPinchTutorial, // Persist tutorial state
        // hasSeenPanTutorial: DON'T persist - resets each new photo session
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
