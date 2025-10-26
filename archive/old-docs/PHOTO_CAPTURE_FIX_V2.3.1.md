# Photo Capture Fix v2.3.1

## Issues Fixed

### 1. Photo Capture "Nothing Happens" Bug
**Problem**: When taking photos, sometimes nothing would happen - no transition to calibration or menu.

**Root Cause**: 
- Dual-axis detection (`absBeta < 45 && absGamma < 45`) was too strict
- If sensors hadn't initialized yet (both values = 0), the condition would pass but other logic might fail
- Threshold of 45° was too restrictive for normal use

**Solution**:
- Simplified detection to only use beta (forward/backward tilt)
- Increased threshold from 45° to 60° for more lenient detection
- Added sensor initialization check - if sensors are uninitialized (both exactly 0), default to table mode
- More robust fallback behavior

### 2. Supporter Badge Repositioned
**Problem**: "Official PanHandler Supporter" badge was covering coin size labels at top

**Solution**: Moved badge to bottom center of screen (200px above toolbar)

## Changes Made

### Photo Routing Logic (`MeasurementScreen.tsx` line ~1084):
```typescript
// Before:
const isLookingAtTable = absBeta < 45 && absGamma < 45;

// After:
const sensorsInitialized = currentBeta !== 0 || currentGamma !== 0;
const isLookingAtTable = !sensorsInitialized || absBeta < 60;
```

### Crosshair Visibility (`MeasurementScreen.tsx` line ~606):
```typescript
// Before:
const nowHorizontal = absBeta < 45 && absGamma < 45;

// After:
const nowHorizontal = absBeta < 60;
```

### Supporter Badge (`DimensionOverlay.tsx` line ~5845):
```typescript
// Before: top: insets.top + 16 (top-right)
// After: bottom: insets.bottom + 200 (bottom-center)
```

## Expected Behavior Now

**Taking Photos:**
- ✅ Beta < 60° (phone tilted down) → Auto coin calibration
- ✅ Beta >= 60° (phone upright) → Show photo type menu
- ✅ If sensors uninitialized → Default to coin calibration (better UX)
- ✅ More lenient thresholds = fewer edge cases

**UI:**
- ✅ Supporter badge at bottom center
- ✅ Crosshairs show when phone tilted down (<60°)
- ✅ Smoother, more reliable experience

## Files Modified
- `/src/screens/MeasurementScreen.tsx` (lines 601-607, 1084-1098)
- `/src/components/DimensionOverlay.tsx` (lines 5840-5882, 5890)

## Version
**v2.3.1** - Photo Capture Fix & Badge Repositioning
