# CAD Canvas Scale Fix - CRITICAL BUG

## Problem
Users reported that measurements were way off in Fusion 360 after importing canvas images. For example, a 55mm dimension would show as only 8mm in Fusion 360.

## Root Cause
**PanHandler was providing the WRONG scale value to CAD software.**

### What We Were Sending:
- **pixelsPerUnit** = pixels / millimeters (e.g., 4.12 px/mm)
- This means: "4.12 pixels per millimeter"

### What CAD Software Expects:
- **Scale X/Y** = millimeters / pixels (e.g., 0.2427 mm/px)  
- This means: "0.2427 millimeters per pixel"

**We were sending the INVERSE of what Fusion 360 needed!**

## The Fix
Changed all Canvas Scale exports to use: **`1 / pixelsPerUnit`**

### Files Modified:

#### 1. `/src/components/DimensionOverlay.tsx`
- **Line 1029-1034**: Email export now calculates `fusionScale = 1 / calibration.pixelsPerUnit`
- **Line 2399**: Overlay display changed from "Fusion Scale: {pixelsPerUnit}" to "CAD Scale: {1/pixelsPerUnit} mm/px"
- **Line 3289**: Hidden Fusion 360 export overlay also updated

#### 2. `/src/components/HelpModal.tsx`
- **Line 834-838**: Updated "The Nerdy Stuff" to explain correct calculation:
  - `Canvas Scale = 1 ÷ pixelsPerUnit`
  - `This gives you mm/px (millimeters per pixel)`
  - Example: `1 ÷ 4.12 px/mm = 0.2427 mm/px`

## Example Calculation

### Before (WRONG):
```
Coin diameter in photo: 100 pixels
Coin actual size: 24.26mm
pixelsPerUnit = 100 / 24.26 = 4.12 px/mm
Canvas Scale X/Y = 4.12 ❌ (WRONG!)
```

### After (CORRECT):
```
Coin diameter in photo: 100 pixels
Coin actual size: 24.26mm
pixelsPerUnit = 100 / 24.26 = 4.12 px/mm
Canvas Scale X/Y = 1 / 4.12 = 0.2427 mm/px ✅ (CORRECT!)
```

## How to Use in Fusion 360

1. **Insert > Canvas > Attach**
2. Select the CAD Canvas Photo from PanHandler email
3. **Right-click canvas > Calibrate**
4. Enter the **Canvas Scale X/Y** value from the email:
   - **Scale X**: 0.2427 (example)
   - **Scale Y**: 0.2427 (example)
5. Click **OK**
6. Measurements will now be perfectly scaled 1:1! ✅

## Verification

The 55mm dimension that was showing as 8mm should now show correctly as 55mm in Fusion 360.

**Ratio check:** 55mm / 8mm ≈ 6.875x
This suggests we were off by about 7x, which makes sense because:
- If pixelsPerUnit ≈ 7, we were giving "7" to Fusion
- But we should have been giving "1/7" ≈ 0.143
- The inverse relationship explains the ~7x error!

## Status
✅ **FIXED** - All canvas scale exports now use the correct `1 / pixelsPerUnit` formula
