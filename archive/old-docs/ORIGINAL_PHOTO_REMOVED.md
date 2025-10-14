# Original Photo Removed from Exports

## Change Summary
Removed the original (unzoomed) photo from both Save and Email exports.

## Why?
The original photo was causing confusion with CAD scaling because:
1. Users calibrate with the zoomed/panned image
2. Measurements are made on the zoomed/panned image  
3. But the "original" photo attachment was the raw, unzoomed image
4. This created a mismatch between calibration and the exported canvas

## What's Now Included

### Save to Photos:
- ✅ **Labeled Photo** - Full measurements with color-coded dimensions
- ✅ **CAD Canvas Photo** - 50% opacity, perfect for CAD tracing

### Email Attachments:
- ✅ **Labeled Photo** - Full measurements with color-coded dimensions  
- ✅ **CAD Canvas Photo** - 50% opacity with scale info overlay

### Removed:
- ❌ **Original Photo** - No longer included in exports

## Files Modified

### `/src/components/DimensionOverlay.tsx`
- **Line 853**: Removed save function for original photo (28 lines removed)
- **Line 1057**: Removed email attachment for original photo (45 lines removed)

### `/src/components/HelpModal.tsx`
- **Line 814**: Updated text from "3 photos" to "2 photos (labeled + CAD canvas)"

## User Benefit
- **Cleaner exports** - Only the 2 essential photos
- **Less confusion** - No mismatch between calibrated view and exported image
- **Smaller email size** - One less attachment to send

## Status
✅ Complete - Original photo no longer part of Save or Email workflows
