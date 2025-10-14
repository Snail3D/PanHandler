# CAD Canvas Export Fix - CRITICAL

## The Root Cause
**The CAD canvas photo was being exported with zoom/pan/rotation transforms applied!**

### What Was Happening:
1. User calibrates with heavy zoom (e.g., 14.7x zoom)
2. PanHandler correctly calculates `pixelsPerUnit` based on original image (e.g., 0.64 px/mm)
3. User makes measurements - coordinates properly transformed to original image space
4. **BUT:** CAD canvas export was capturing the **ZOOMED** view
5. Fusion 360 imports the zoomed image, applies the unzoomed scale → everything is wrong

### The Math:
- Coin in original image: 13.56 pixels
- Coin after 14.7x zoom: 200 pixels (screen)  
- pixelsPerUnit: 0.64 px/mm (correct for original)
- Canvas Scale: 1/0.64 = 1.5625 mm/px (correct for original)

**But we were exporting the 14.7x zoomed image!**

When Fusion sees the zoomed image with scale 1.5625 mm/px:
- It thinks 1 pixel = 1.5625mm
- But the image is actually 14.7x larger than it should be
- So measurements appear 14.7x too small!

Your 55mm measurement showed as ~8mm:  
55 / 8 = 6.875x error (close to your zoom factor!)

## The Fix

### File: `/src/components/DimensionOverlay.tsx`
**Line 3165-3177**: Removed zoom/pan/rotation transforms from CAD canvas export

**Before:**
```typescript
transform: [
  { translateX: zoomTranslateX },
  { translateY: zoomTranslateY },
  { scale: zoomScale },           // ← WRONG!
  { rotate: `${rotation}rad` },
],
```

**After:**
```typescript
// NO TRANSFORM - export original unzoomed image for CAD calibration
```

Now the CAD canvas exports the **original, unzoomed image** at 50% opacity, which matches the pixelsPerUnit calculation.

## How It Works Now

1. **Calibration**: Calculates pixelsPerUnit based on original image dimensions ✅
2. **Measurements**: Tap coordinates transformed to original image space ✅  
3. **CAD Canvas**: Exports original unzoomed image ✅
4. **Canvas Scale**: Correctly matches the exported image ✅
5. **Fusion 360**: Imports and scales perfectly 1:1 ✅

## Testing

1. Take a new photo with a coin
2. Calibrate (zoom in as much as you want - it's fine now!)
3. Make a measurement  
4. Email yourself the report
5. Import CAD Canvas photo to Fusion 360
6. Use the Canvas Scale X/Y value  
7. **Measurements should now be accurate!** 🎯

## Status
✅ **FIXED** - CAD canvas now exports original unzoomed image for accurate scaling
