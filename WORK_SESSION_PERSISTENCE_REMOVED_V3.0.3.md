# Performance Fix - Work Session Not Persisted (v3.0.3)

## Critical Change

**Removed persistence of current work session data to fix slow app startup and photo capture freezing.**

---

## The Problem

**Symptoms**:
- Opening quote typing was slow/frozen
- Taking photos did nothing (both table and wall)
- App felt sluggish overall

**Root Cause**:
When the app starts, Zustand's persist middleware reads ALL persisted data from MMKV. We were persisting:
- Current photo URI
- All measurements
- All points
- Calibration data
- Zoom state
- Completed measurements

If a user had been working on a complex session with many measurements, this data could be 100KB+ of JSON that needs to be:
1. Read from MMKV
2. Parsed as JSON
3. Loaded into state

This blocked the main thread, causing the opening quote to freeze and photo capture to fail.

---

## The Fix

**File**: `src/state/measurementStore.ts` (lines 307-338)

### What We Still Persist (Settings):
- ✅ Unit system preferences
- ✅ Magnetic declination
- ✅ Last selected coin
- ✅ User email
- ✅ Session count
- ✅ Review prompt data
- ✅ Tutorial state
- ✅ Donor status

### What We NO LONGER Persist (Work Session):
- ❌ currentImageUri
- ❌ isAutoCaptured
- ❌ imageOrientation
- ❌ calibration
- ❌ coinCircle
- ❌ measurements
- ❌ completedMeasurements
- ❌ currentPoints
- ❌ measurementMode
- ❌ savedZoomState

---

## Impact

### ✅ Benefits:
1. **Instant app startup** - No large JSON parsing
2. **Fast opening quote** - Main thread not blocked
3. **Photos work immediately** - No storage blocking
4. **Snappy UI** - Every interaction is faster

### ⚠️ Trade-off:
**Work sessions are NOT saved between app restarts**

If user:
1. Takes a photo
2. Does calibration
3. Makes measurements
4. Force-closes the app (swipes away)
5. Reopens app

**Result**: All work is lost, starts fresh on camera screen

---

## Why This Is Acceptable

1. **Most users complete sessions in one go**
   - Take photo → calibrate → measure → done
   - Typical session is 2-5 minutes
   
2. **iOS keeps apps in memory**
   - Unless user force-closes or device reboots, app stays in memory
   - Work persists in RAM between home screen visits
   
3. **Performance > Persistence**
   - Fast, responsive app is better than slow, persistent one
   - Users can always retake photo if needed

4. **Critical data IS persisted**
   - User preferences (units, declination)
   - Their calibration history (last coin)
   - App settings

---

## Alternative Solutions Considered

### 1. Selective Persistence
**Idea**: Only persist when user explicitly saves
**Problem**: Requires UI changes, user training

### 2. Background Thread Hydration  
**Idea**: Load persisted data on background thread
**Problem**: Zustand persist doesn't support this

### 3. Smaller Chunks
**Idea**: Split into multiple stores
**Problem**: Complex, error-prone, still has overhead

### 4. Debounced Writes
**Idea**: Only write every N seconds
**Problem**: Doesn't fix startup hydration

---

## Testing

- [x] App starts instantly
- [x] Opening quote types smoothly
- [x] Table photos work (auto coin calibration)
- [x] Wall photos work (show photo type modal)
- [x] Settings persist (units, last coin, etc.)
- [x] Force-close app → Work lost (expected)
- [x] Home button → Return → Work still there (RAM persistence)

---

## Version

**v3.0.3** - Work session persistence removed for performance

---

## Future Enhancement

If users complain about lost work:
1. Add "Save Session" button in measurement mode
2. Explicitly save to MMKV only when user taps it
3. On startup, check for saved session and offer to restore

This gives us best of both worlds:
- Fast startup (no auto-hydration)
- Optional persistence (user-triggered)

---

**Result**: App is now blazing fast! 🚀
