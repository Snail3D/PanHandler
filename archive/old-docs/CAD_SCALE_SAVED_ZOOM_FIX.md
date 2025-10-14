# CAD Canvas Scale - Using Saved Zoom State

## The Problem
Canvas Scale was using `zoomScale` from props (which defaults to 1), not the **actual zoom used during calibration**.

### What Was Happening:
1. User zooms 14.7x during calibration
2. Zoom state is saved: `savedZoomState.scale = 14.7`
3. CAD canvas export formula used: `scale × zoomScale` (from props)
4. But `zoomScale` prop = 1 (default) ❌
5. Result: Canvas Scale was only 1.5625 instead of 23 mm/px

## The Fix

### Changes Made:

#### 1. Added `savedZoomState` to component (Line ~103)
```typescript
const savedZoomState = useStore((s) => s.savedZoomState);
```

#### 2. Updated Canvas Scale Calculation (Line ~1006)
**Before:**
```typescript
const fusionScale = (1 / calibration.pixelsPerUnit) * zoomScale; // Wrong - uses prop
```

**After:**
```typescript
const calibrationZoom = savedZoomState?.scale || 1;
const fusionScale = (1 / calibration.pixelsPerUnit) * calibrationZoom; // Correct!
```

#### 3. Updated CAD Canvas Transform (Line ~3174)
**Before:**
```typescript
transform: [
  { translateX: zoomTranslateX },  // From props
  { translateY: zoomTranslateY },  // From props  
  { scale: zoomScale },             // From props
  ...
]
```

**After:**
```typescript
transform: [
  { translateX: savedZoomState?.translateX || 0 },  // From saved state
  { translateY: savedZoomState?.translateY || 0 },  // From saved state
  { scale: savedZoomState?.scale || 1 },            // From saved state!
  ...
]
```

#### 4. Updated Display Overlays (Lines ~2335 & ~3224)
Now use `savedZoomState?.scale` instead of `zoomScale` prop

## How It Works Now

### Example with your measurement:
1. **Calibration**: Zoom 14.7x, coin = 13.56px original
2. **pixelsPerUnit**: 0.64 px/mm (original image)
3. **savedZoomState.scale**: 14.7 (stored during calibration)
4. **Canvas Scale**: (1 / 0.64) × 14.7 = 1.5625 × 14.7 = **23 mm/px**

### In Fusion 360:
- Import CAD Canvas (zoomed 14.7x, light/washed out)
- Set Scale X/Y = 23 mm/px
- **Your 55mm measurement should now show as 55mm!** ✅

## Status
✅ **FIXED** - Canvas Scale now uses the correct saved zoom state from calibration
