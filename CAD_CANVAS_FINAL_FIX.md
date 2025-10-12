# CAD Canvas Final Fix - Opacity & Zoom Adjustment

## Changes Made

### 1. Background Color: Black → White
**Line 3161**: Changed `backgroundColor: 'black'` to `backgroundColor: 'white'`

**Why:** With a white background, lower opacity makes the image appear **lighter/washed out** (not darker). Perfect for CAD tracing!

### 2. Opacity Adjustment: 50% → 35%
**Line 3170**: Changed `opacity: 0.5` to `opacity: 0.35`

**Result:** Image appears light and ghosted on white background, easy to trace over in CAD software.

### 3. Restored Zoom Transforms
**Lines 3171-3176**: Put back the zoom/pan/rotation transforms

```typescript
transform: [
  { translateX: zoomTranslateX },
  { translateY: zoomTranslateY },
  { scale: zoomScale },
  { rotate: `${rotation}rad` },
],
```

**Why:** User needs to see the same zoomed view they're measuring on. The CAD canvas should match what they see.

### 4. Adjusted Canvas Scale Calculation
**Line 1006**: Changed formula to account for zoom

**Before:**
```typescript
const fusionScale = 1 / calibration.pixelsPerUnit;
```

**After:**
```typescript
const fusionScale = (1 / calibration.pixelsPerUnit) / zoomScale;
```

**Why:** Since we're exporting the zoomed image, the Canvas Scale needs to be divided by the zoom factor.

### 5. Updated Display Overlays
**Lines 2333 & 3223**: Updated CAD Scale display to show zoom-adjusted value

```typescript
CAD Scale: {((1 / calibration.pixelsPerUnit) / zoomScale).toFixed(6)} mm/px
```

## How It Works Now

### Example Scenario:
1. **Original Image**: Coin is 13.56 pixels
2. **User Zooms**: 14.7x zoom
3. **pixelsPerUnit**: 0.64 px/mm (original image space)
4. **Exported Image**: 14.7x zoomed view
5. **Canvas Scale**: (1 / 0.64) / 14.7 = 1.5625 / 14.7 = **0.1063 mm/px**

### In Fusion 360:
- Import the CAD Canvas (zoomed, light/washed out image)
- Set Scale X/Y to 0.1063 mm/px
- Measurements are now accurate 1:1! ✅

## Visual Result

**CAD Canvas Export:**
- ✅ Light, washed-out appearance (35% opacity on white)
- ✅ Zoomed view matching what user measured
- ✅ Easy to trace over in CAD
- ✅ Scale correctly accounts for zoom

## Status
✅ **COMPLETE** - CAD canvas is now light/transparent and correctly scaled for zoom
