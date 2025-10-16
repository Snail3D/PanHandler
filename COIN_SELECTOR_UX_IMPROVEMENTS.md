# Coin Selector UX Improvements

**Date**: October 16, 2025  
**Status**: ✅ Complete

## Changes Made

### 1. Help Button Fine-Tuned ✅
- Moved from `right: 16` to `right: 70`
- Now fully visible with proper breathing room
- Won't get cut off by screen edge

### 2. Coin List Enhanced ✅

#### Alternating Row Colors
- **Even rows** (0, 2, 4): Light white `rgba(255, 255, 255, 0.85)`
- **Odd rows** (1, 3): Slightly darker gray `rgba(240, 240, 245, 0.85)`
- Makes it crystal clear which row you're tapping
- Better visual separation between coins

#### Larger Tap Targets
- **Vertical padding**: Increased to 18px (was 16px)
- **Horizontal padding**: 16px (maintained)
- **Margin between rows**: 6px for clean separation
- Easier to tap the coin you want

#### Better Press States
- **Pressed state**: Dark highlight `rgba(0, 0, 0, 0.12)`
- Clear visual feedback when tapping
- Smooth transition

#### Improved Typography
- **Coin name**: Larger (16px), bolder (700 weight), darker color
- **Details**: 13px, 600 weight for readability
- Better contrast throughout

#### Slightly Taller List
- Max height increased from 240px to 280px
- More coins visible at once
- Less scrolling needed

## Files Modified
- **`src/components/ZoomCalibration.tsx`** (lines 509-564)
  - Added `index` parameter to map function
  - Implemented alternating background colors
  - Increased padding and spacing
  - Enhanced press state styling

## Visual Design

### Row Pattern
```
Row 0: Light white (even)
Row 1: Light gray (odd)
Row 2: Light white (even)
Row 3: Light gray (odd)
Row 4: Light white (even)
```

### Color Palette
- **Light rows**: `rgba(255, 255, 255, 0.85)` - Bright white
- **Dark rows**: `rgba(240, 240, 245, 0.85)` - Subtle gray
- **Pressed**: `rgba(0, 0, 0, 0.12)` - Dark highlight
- **Border**: `rgba(0, 0, 0, 0.06)` - Subtle separation

## User Experience Impact

**Before**:
- Hard to tell where one coin ends and another begins
- Small tap targets made selection finicky
- Unclear which row you're about to tap

**After**:
- Alternating colors make each row distinct
- Larger tap areas = easier, more confident taps
- Clear visual hierarchy
- Professional, polished feel

## Testing Checklist
- [ ] Open calibration screen
- [ ] Tap coin selector to open search
- [ ] Type to search for coins
- [ ] Verify alternating row colors (white, gray, white, gray...)
- [ ] Tap on various rows - confirm good tap targets
- [ ] Check press state darkens on tap
- [ ] Verify text is easy to read
- [ ] Confirm 5 results display properly

---

Ready for camera screen improvements! 🎬
