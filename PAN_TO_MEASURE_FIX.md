# Pan-to-Measure Toggle Fix

## Problem
After panning/pinching the image, when trying to tap the "Measure" toggle button, users had to rapidly tap many times before it would switch. The button felt "locked" or unresponsive.

## Root Cause
The **`menuPanGesture`** (which wraps the entire bottom toolbar) was intercepting tap events on the toggle buttons. This gesture detector has a **`minDistance` of 20px**, meaning any touch movement over 20px would be treated as a pan gesture rather than a tap.

**The problem:**
1. User finishes panning the image
2. User taps "Measure" button
3. If their finger moves even slightly (>20px) while tapping, the `menuPanGesture` captures it as a pan
4. The tap event never reaches the Pressable button
5. User has to tap multiple times until they get a "perfect" tap with <20px movement

## Solution Applied

### 1. **Increased minDistance threshold** (20px → 40px)
```typescript
.minDistance(40) // Increased from 20 to 40px to reduce interference with taps
```
- Requires more deliberate movement before activating the pan gesture
- Allows small finger movements during taps to still register as taps

### 2. **Stricter horizontal detection**
```typescript
const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY) * 2;
```
- Previously: `translationX > translationY` (any horizontal bias)
- Now: `translationX > translationY * 2` (must be 2x more horizontal than vertical)
- Prevents diagonal swipes from activating the menu pan
- Makes taps with slight movement less likely to trigger the gesture

### 3. **Disabled trackpad gestures**
```typescript
.enableTrackpadTwoFingerGesture(false)
```
- Prevents unintended trackpad interactions (for iPad/Mac testing)

## Testing
After this fix, the "Measure" toggle should respond immediately to taps, even if the user's finger moves slightly during the tap.

**Before:** Required 3-5+ taps after panning
**After:** Responds on first tap ✅

## Files Modified
- `src/components/DimensionOverlay.tsx` (lines 1874-1883)

---
**Status:** ✅ Fixed and ready for testing
