# Map Scale Badge Persistence Fix

## Date
October 15, 2025

## Issue Reported
> "When I clear all the points, the map verbal scale memory also clears. I only want that verbal scale memory to clear upon a new picture coming in."

**Expected Behavior**:
- Verbal scale (map scale) should persist when clearing measurements
- Verbal scale should ONLY clear when taking a new photo

**Actual Behavior**:
- Badge wasn't showing for map mode calibrations
- Made it appear like the verbal scale was clearing

---

## Root Cause

The calibrated badge had a conditional that only showed it when `coinCircle` existed:

```typescript
{coinCircle && !showLockedInAnimation && (
  <Pressable>
    {/* Badge content */}
  </Pressable>
)}
```

**Problem**: 
- Coin calibrations set `coinCircle`
- Verbal scale (map mode) calibrations set `mapScale`
- Badge only checked for `coinCircle`, NOT `mapScale`
- Result: Badge never showed for map mode, making it seem like the calibration was lost

---

## The Fix

### Updated Badge Condition
Changed the condition to show badge for BOTH coin and map calibrations:

```typescript
{(coinCircle || (isMapMode && mapScale)) && !showLockedInAnimation && (
  <Pressable>
    {/* Badge content */}
  </Pressable>
)}
```

Now the badge shows when:
- ✅ `coinCircle` exists (coin calibration), OR
- ✅ `isMapMode && mapScale` (verbal scale calibration)

---

## How It Works Now

### Scenario 1: Clear All Measurements
1. User sets verbal scale in map mode
2. Badge appears: "Calibrated" with verbal scale info
3. User places measurements
4. User clears all measurements (Undo button)
5. ✅ **Badge stays visible** - verbal scale is preserved
6. User can continue measuring with same scale

### Scenario 2: New Photo
1. User sets verbal scale in map mode
2. Badge appears with verbal scale info
3. User takes new photo
4. ✅ **Badge disappears** - verbal scale is cleared
5. User needs to set new verbal scale for new photo

---

## Existing Logic (Already Correct)

### Map Scale Persistence
The map scale state is managed separately from measurements:

**State Variables**:
```typescript
const [mapScale, setMapScale] = useState<{...} | null>(null);
const [isMapMode, setIsMapMode] = useState(false);
```

**Clear Measurements (Undo Button)**:
```typescript
const handleClear = () => {
  // Only removes measurements
  setMeasurements(measurements.slice(0, -1));
  // Does NOT touch mapScale or isMapMode ✅
};
```

**New Photo (Clears Everything)**:
```typescript
useEffect(() => {
  // Clear map scale when image URI changes (new photo)
  setMapScale(null);
  setIsMapMode(false);
  setShowMapScaleModal(false);
}, [currentImageUri]); // ✅ Triggers on new photo
```

---

## Badge Display Logic

### What Shows on Badge

**With Coin Calibration**:
```
✓ Calibrated
Nickel • 21.2mm
```

**With Map Calibration** (NEW - now visible):
```
✓ Calibrated
Nickel • 21.2mm    [if there's also a coin]
━━━━━━━━━━━━━━
Verbal scale
5cm = 1km          [the actual scale]
Locked in
```

---

## Files Modified
- `src/components/DimensionOverlay.tsx` (line 2198)
  - Changed: `{coinCircle && ...}`
  - To: `{(coinCircle || (isMapMode && mapScale)) && ...}`

---

## Testing Checklist

### Map Mode with Verbal Scale
- [ ] Set verbal scale in map mode
- [ ] ✅ Badge appears showing verbal scale info
- [ ] Place measurements
- [ ] Clear all measurements with Undo button
- [ ] ✅ Badge still visible
- [ ] Can place new measurements with same scale
- [ ] ✅ Verbal scale still applied to measurements

### New Photo Clears Scale
- [ ] Set verbal scale in map mode
- [ ] Badge visible with scale info
- [ ] Take new photo
- [ ] ✅ Badge disappears
- [ ] ✅ Map mode turned off
- [ ] ✅ Need to set new verbal scale

### Coin + Map Mode
- [ ] Calibrate with coin
- [ ] Badge shows coin info
- [ ] Turn on map mode and set verbal scale
- [ ] ✅ Badge shows both coin AND verbal scale info
- [ ] Clear measurements
- [ ] ✅ Badge persists with both pieces of info
- [ ] Take new photo
- [ ] ✅ Everything clears

---

## Why This Matters

### User Experience
**Before**: 
- User sets verbal scale
- No visual confirmation after clearing measurements
- Feels like calibration was lost
- Confusing and frustrating

**After**:
- User sets verbal scale
- Badge always visible until new photo
- Clear visual confirmation calibration is locked in
- Confidence to clear and remeasure

### Data Integrity
The underlying data was ALWAYS correct - `mapScale` was never being cleared by the Undo button. The issue was purely visual - the badge wasn't showing, making users THINK the calibration was lost.

This fix provides the visual feedback users need to trust the system.

---

## Related Features

### Calibrated Badge Content
The badge shows different info based on calibration type:

**Coin Only**:
- Coin name and diameter

**Verbal Scale Only** (Map Mode):
- "Verbal scale" header
- Scale ratio (e.g., "5cm = 1km")
- "Locked in" footer

**Both**:
- Coin info on top
- Verbal scale info below
- Complete calibration context

---

## Version History
- **v1.69** - Fixed button stickiness
- **v1.70** - Fixed label unit switching
- **v1.71 (This fix)** - Fixed map scale badge visibility

---

**Status**: ✅ FIXED - Badge now shows for map mode calibrations and persists when clearing measurements
