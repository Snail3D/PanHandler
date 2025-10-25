import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Point, Measurement } from '../types/measurement';

// Use MMKV instead of AsyncStorage - 10-100x faster, non-blocking
const storage = new MMKV();

// ONE-TIME FIX: Clear old persisted session data (v3.0.3)
// This removes the huge persisted work sessions that were causing slowness
try {
  const oldData = storage.getString('measurement-settings');
  if (oldData) {
    const parsed = JSON.parse(oldData);
    // If it has currentImageUri, it's old format - clear and rebuild with just settings
    if (parsed?.state?.currentImageUri !== undefined) {
      console.log('🧹 Clearing old work session data from MMKV...');
      storage.delete('measurement-settings');
      console.log('✅ Old data cleared - app will be fast now!');
    }
  }
} catch (e) {
  // Ignore errors, just making sure we clear if needed
}

const mmkvStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

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
  mode: 'distance' | 'angle' | 'circle' | 'rectangle' | 'freehand' | 'polygon';
  calibrationMode?: 'coin' | 'map'; // Track which calibration mode was used when creating this measurement
  mapScaleData?: {screenDistance: number, screenUnit: 'cm' | 'in', realDistance: number, realUnit: 'km' | 'mi' | 'm' | 'ft'}; // Store map scale if created in map mode
  radius?: number; // For circles
  width?: number;  // For rectangles
  height?: number; // For rectangles
  totalLength?: number; // For freehand - total path length
  area?: number; // For closed non-intersecting freehand loops (lasso mode)
  isClosed?: boolean; // For freehand - indicates if it's a closed loop
  perimeter?: string; // For closed freehand loops - just the perimeter for inline display
  label?: string | null; // Optional text label for the measurement
  depth?: number; // For volume calculations (stored in base unit)
  depthUnit?: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi'; // Unit used when entering depth
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
    unit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi';
    referenceDistance: number;
    calibrationType?: 'coin' | 'verbal' | 'blueprint';
    verbalScale?: VerbalScale;
    blueprintScale?: { distance: number; unit: 'mm' | 'cm' | 'in' | 'm' | 'ft' | 'km' | 'mi' }; // Store for display
  } | null;
  coinCircle: CoinCircle | null;
  unitSystem: UnitSystem; // Current session unit system (changes mid-session)
  defaultUnitSystem: UnitSystem; // User's preferred default for NEW sessions
  magneticDeclination: number; // Magnetic declination in degrees for maps (positive = east, negative = west)
  lastSelectedCoin: string | null; // Store coin name
  userEmail: string | null; // User's email for auto-population
  savedZoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null; // Restore zoom/pan/rotation
  sessionCount: number; // Track app opens (incremented each time app becomes active)
  reviewPromptCount: number; // Track how many times we've asked (max 2)
  hasReviewedApp: boolean; // True if user tapped "Rate" button
  lastReviewPromptDate: string | null; // Track when user was last prompted
  globalDownloads: number; // Global download count (fetched from backend)
  hasSeenPinchTutorial: boolean; // Track if user has seen pinch-zoom tutorial
  hasSeenPanTutorial: boolean; // Track if user has seen pan tutorial on measurement screen
  isDonor: boolean; // True if user clicked "Support Snail" button (donation tracking)
  lastDonationSession: number; // Which session they donated at (for 40-session timer)
  isFirstTimeDonor: boolean; // True only for the FIRST donation (to show special badge animation)
  asteroidsHighScore: number; // Persistent high score for Asteroids easter egg game
  panButtonTapCount: number; // Track taps on Pan button for Asteroids trigger (10 taps)
  lastPanButtonTapTime: number; // Timestamp of last tap (reset if > 3 seconds)
  
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
  setDefaultUnitSystem: (system: UnitSystem) => void; // Set preferred default for new sessions
  setMagneticDeclination: (degrees: number) => void; // Set magnetic declination for maps
  setUserEmail: (email: string | null) => void;
  setSavedZoomState: (state: { scale: number; translateX: number; translateY: number; rotation?: number } | null) => void;
  setHasSeenPinchTutorial: (hasSeen: boolean) => void;
  setHasSeenPanTutorial: (hasSeen: boolean) => void;
  setIsDonor: (isDonor: boolean, sessionNumber?: number) => void; // Mark user as donor and set donation session
  setIsFirstTimeDonor: (isFirst: boolean) => void; // Control first-time donor badge animation
  setAsteroidsHighScore: (score: number) => void; // Update Asteroids high score
  incrementPanButtonTap: () => void; // Increment tap count for Asteroids trigger
  resetPanButtonTaps: () => void; // Reset tap counter
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
      defaultUnitSystem: 'metric', // Default preference for new sessions
      magneticDeclination: 0, // Default: no declination adjustment
      lastSelectedCoin: null,
      userEmail: null,
      savedZoomState: null,
      sessionCount: 0,
      reviewPromptCount: 0,
      hasReviewedApp: false,
      lastReviewPromptDate: null,
      globalDownloads: 1247,
      hasSeenPinchTutorial: false,
      hasSeenPanTutorial: false,
      isDonor: false,
      lastDonationSession: 0,
      isFirstTimeDonor: false,
      asteroidsHighScore: 0,
      panButtonTapCount: 0,
      lastPanButtonTapTime: 0,

      setImageUri: (uri, isAutoCaptured = false) => set((state) => { 
        // If setting a NEW image (not null), clear all measurements/calibration
        if (uri !== null) {
          return {
            currentImageUri: uri,
            isAutoCaptured,
            // Clear everything for new photo
            measurements: [],
            completedMeasurements: [],
            currentPoints: [],
            tempPoints: [],
            coinCircle: null,
            calibration: null,
            savedZoomState: null,
            imageOrientation: null,
            // Apply default unit system for new session
            unitSystem: state.defaultUnitSystem,
          };
        }
        
        // If setting to null (going back to camera), just clear calibration
        return {
          currentImageUri: null,
          isAutoCaptured: false,
          coinCircle: null,
          calibration: null,
          imageOrientation: null,
          savedZoomState: null,
        };
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

      setDefaultUnitSystem: (system: UnitSystem) => set({ defaultUnitSystem: system }),

      setMagneticDeclination: (degrees: number) => set({ magneticDeclination: degrees }),

      setUserEmail: (email: string | null) => set({ userEmail: email }),

      // ⚠️ WARNING: This writes to AsyncStorage via persist middleware
      // NEVER call this in high-frequency callbacks (onUpdate, onTransformChange, etc.)
      // ALWAYS debounce this with 500ms+ delay to prevent JS thread blocking
      // See: NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md
      setSavedZoomState: (zoomState: { scale: number; translateX: number; translateY: number; rotation?: number } | null) => set({ savedZoomState: zoomState }),
      
      setHasSeenPinchTutorial: (hasSeen: boolean) => set({ hasSeenPinchTutorial: hasSeen }),
      
      setHasSeenPanTutorial: (hasSeen: boolean) => set({ hasSeenPanTutorial: hasSeen }),
      
      setIsDonor: (isDonor: boolean, sessionNumber?: number) => set((state) => ({
        isDonor,
        lastDonationSession: sessionNumber !== undefined ? sessionNumber : state.sessionCount,
        isFirstTimeDonor: !state.isDonor && isDonor, // True only if transitioning from non-donor to donor
      })),
      
      setIsFirstTimeDonor: (isFirst: boolean) => set({ isFirstTimeDonor: isFirst }),
      
      setAsteroidsHighScore: (score: number) => set({ asteroidsHighScore: score }),
      
      incrementPanButtonTap: () => set((state) => {
        const now = Date.now();
        const timeSinceLastTap = now - state.lastPanButtonTapTime;
        
        // Reset counter if more than 3 seconds since last tap
        if (timeSinceLastTap > 3000) {
          return {
            panButtonTapCount: 1,
            lastPanButtonTapTime: now,
          };
        }
        
        // Increment counter
        return {
          panButtonTapCount: state.panButtonTapCount + 1,
          lastPanButtonTapTime: now,
        };
      }),
      
      resetPanButtonTaps: () => set({ panButtonTapCount: 0, lastPanButtonTapTime: 0 }),
    }),
    {
      name: 'measurement-settings',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ 
        unitSystem: state.unitSystem,
        defaultUnitSystem: state.defaultUnitSystem, // Persist default preference
        magneticDeclination: state.magneticDeclination, // Persist declination setting
        lastSelectedCoin: state.lastSelectedCoin,
        userEmail: state.userEmail, // Persist user email
        sessionCount: state.sessionCount, // Persist session count
        reviewPromptCount: state.reviewPromptCount, // Persist review prompt count
        hasReviewedApp: state.hasReviewedApp, // Persist review status
        lastReviewPromptDate: state.lastReviewPromptDate, // Persist last prompt date
        hasSeenPinchTutorial: state.hasSeenPinchTutorial, // Persist tutorial state
        isDonor: state.isDonor, // Persist donor status
        lastDonationSession: state.lastDonationSession, // Persist donation session number
        isFirstTimeDonor: state.isFirstTimeDonor, // Persist first-time donor flag
        // asteroidsHighScore: REMOVED - asteroids feature not working
        // panButtonTapCount: DON'T persist - resets each session
        // lastPanButtonTapTime: DON'T persist - resets each session
        // hasSeenPanTutorial: DON'T persist - resets each new photo session
        
        // ⚠️ DON'T PERSIST CURRENT WORK SESSION - causes slow startup
        // currentImageUri: state.currentImageUri,
        // isAutoCaptured: state.isAutoCaptured,
        // imageOrientation: state.imageOrientation,
        // calibration: state.calibration,
        // coinCircle: state.coinCircle,
        // measurements: state.measurements,
        // completedMeasurements: state.completedMeasurements,
        // currentPoints: state.currentPoints,
        // measurementMode: state.measurementMode,
        // savedZoomState: state.savedZoomState,
      }),
    }
  )
);

export default useStore;
