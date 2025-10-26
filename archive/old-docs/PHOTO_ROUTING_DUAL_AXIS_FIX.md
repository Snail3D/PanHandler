# Photo Routing: Dual-Axis Detection Fix

## Problem
User reported two issues with photo orientation routing:

1. **Crosshairs appearing when phone upright (wall mode)**: When pulling phone up to look at wall and turning sideways, the leveling crosshairs still appeared when they shouldn't

2. **Sideways orientation incorrectly routing to coin calibration**: When turning phone sideways while looking at wall, it was incorrectly going to coin zoom/calibration instead of showing the photo type menu. However, pulling phone straight up (vertical) worked correctly.

## Root Cause
The detection logic only checked **beta (forward/backward tilt)** but not **gamma (left/right tilt)**.

When user turned phone sideways while looking at a wall:
- Beta could be ~0° (flat)
- But gamma was high (sideways tilt)
- System incorrectly thought: "beta < 45° = looking at table"

This caused:
1. Crosshairs to appear (thinking phone was horizontal/flat)
2. Photo routing to coin calibration (thinking it was a table shot)

## Solution
Changed detection logic to check **BOTH beta AND gamma**:

### Before:
```typescript
const nowHorizontal = absBeta < 45; // Only checking forward/backward tilt
const isLookingAtTable = absBeta < 45; // Only checking forward/backward tilt
```

### After:
```typescript
// For crosshairs visibility (line 601-607)
const absGamma = Math.abs(gamma);
const nowHorizontal = absBeta < 45 && absGamma < 45; // Both axes must be within 45° of flat

// For photo routing (line 1084-1089)
const absBeta = Math.abs(currentBeta);
const absGamma = Math.abs(currentGamma);
const isLookingAtTable = absBeta < 45 && absGamma < 45; // Both axes must be within 45° of flat
```

## Expected Behavior Now

### Looking at Table (Auto Coin Calibration):
- Beta < 45° AND Gamma < 45° ✅
- Phone relatively flat/horizontal
- Crosshairs visible
- Photo → Auto coin calibration

### Looking at Wall (Photo Type Menu):
- Beta >= 45° OR Gamma >= 45° ✅
- Phone upright, sideways, or any non-flat orientation
- Crosshairs hidden
- Photo → Photo type selection menu

### Edge Cases Now Handled:
1. ✅ Phone upright looking at wall → Menu (beta ~90°)
2. ✅ Phone sideways looking at wall → Menu (gamma ~90°)
3. ✅ Phone flat looking at table → Auto coin (beta ~0°, gamma ~0°)
4. ✅ Phone slightly tilted on table → Auto coin (both < 45°)

## Files Modified
- `/src/screens/MeasurementScreen.tsx` (lines 601-607, 1084-1089)

## Testing
Test these scenarios:
1. **Table shot horizontal**: Hold phone flat → Take photo → Should auto-go to coin calibration ✅
2. **Wall shot vertical**: Hold phone upright → Take photo → Should show photo type menu ✅
3. **Wall shot sideways**: Hold phone sideways while looking at wall → Take photo → Should show photo type menu (NOW FIXED) ✅
4. **Crosshairs when sideways**: Turn phone sideways → Crosshairs should disappear (NOW FIXED) ✅
