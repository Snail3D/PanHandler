# Supporter Badge Moved to Bottom

## Problem
The "Official PanHandler Supporter" badge was positioned at the top-right of the screen (`top: insets.top + 16`), covering coin size labels (Penny, 10-mm, etc.) in the upper area.

## Solution
Moved the supporter badge to the **bottom center** of the screen where there's plenty of free space.

### Changes Made:

**1. Badge Position:**
- **Before**: `top: insets.top + 16, right: 12` (top-right corner)
- **After**: `bottom: insets.bottom + 200, left: 0, right: 0, alignItems: 'center'` (bottom center, above toolbar)

**2. Badge Structure:**
- Wrapped in an outer View for positioning (centering)
- Inner View contains the actual badge styling (pink background, rounded corners, shadow)
- Positioned 200px above bottom safe area to stay clear of the toolbar

**3. AUTO LEVEL Badge:**
- Simplified positioning logic since donor badge is no longer at top
- Now always positioned at `top: insets.top + 16` regardless of donor status

### New Layout:
```
TOP:
├── Vibecode header
├── AUTO LEVEL badge (if auto-captured)
├── Coin labels (Penny, 10-mm, etc.) - NOW CLEAR ✅
└── ...

BOTTOM:
├── ... (measurement area)
├── Official PanHandler Supporter badge ❤️ (NEW LOCATION)
└── Bottom toolbar (Edit/Measure buttons)
```

## Benefits:
✅ Clears coin labels at top
✅ Uses empty space at bottom
✅ Centered and visually balanced
✅ Still prominent and visible
✅ Doesn't interfere with any UI elements

## Files Modified:
- `/src/components/DimensionOverlay.tsx` (lines 5841-5882, 5884-5890)
