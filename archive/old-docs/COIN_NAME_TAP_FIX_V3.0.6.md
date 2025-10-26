# Coin Name Tap Not Working - FIXED ✅ (v3.0.6)

**Date**: Oct 20, 2025  
**Status**: RESOLVED

---

## The Bug

In the ZoomCalibration screen, the coin name text displayed inside the reference circle showed "(Tap to Change Coin)" hint, but tapping it didn't open the coin selector modal. Only the "LOCK IN" button worked.

**User Report**: "I wasn't able to click on that text in the coin in the Zoom calibration screen and have the menu come up to choose a new coin... the button still works next to lock in but that text inside the coin should also bring up that menu."

---

## Root Cause Analysis

### The Problem

The coin name `Pressable` was inside a parent `View` that had `pointerEvents="none"`:

```javascript
// OLD STRUCTURE - BUG!
{selectedCoin && (
  <View
    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    pointerEvents="none"  // ← This disables ALL touches in this View
  >
    <Svg>
      {/* SVG circle overlay */}
    </Svg>
    
    {/* Coin name Pressable - can't receive touches! */}
    <View pointerEvents="box-none">
      <Pressable onPress={() => setShowCoinSelector(true)}>
        <Text>{selectedCoin.name}</Text>
        <Text>(Tap to Change Coin)</Text>
      </Pressable>
    </View>
  </View>
)}
```

**Why It Didn't Work**:
1. The parent `View` has `pointerEvents="none"` to let pan/zoom gestures pass through the SVG overlay
2. However, this **disables pointer events for ALL children**, including the coin name `Pressable`
3. Even though the child had `pointerEvents="box-none"`, the parent's `pointerEvents="none"` took precedence
4. Result: The coin name text was visible but completely untappable

### Why "LOCK IN" Button Worked

The "LOCK IN" button was rendered **outside** this View hierarchy, so it had normal pointer events enabled.

---

## The Fix

### Move Coin Name Outside `pointerEvents="none"` Container

Changed the structure to separate the SVG overlay (which needs `pointerEvents="none"`) from the interactive coin name:

```javascript
// NEW STRUCTURE - FIXED! ✅
{selectedCoin && (
  <>
    {/* SVG overlay with pointer events disabled */}
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"  // Only affects SVG, not coin name
    >
      <Svg>
        {/* SVG circle overlay */}
      </Svg>
    </View>
    
    {/* Coin name - OUTSIDE pointerEvents="none" View, fully tappable! */}
    <View
      style={{
        position: 'absolute',
        left: referenceCenterX - 120,
        top: referenceCenterY - 40,
        width: 240,
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowCoinSelector(true);
        }}
        style={({ pressed }) => ({
          transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
          alignItems: 'center',
          padding: 8, // ✅ Added padding for larger tap area
        })}
      >
        <Text>{selectedCoin.name}</Text>
        <Text>(Tap to Change Coin)</Text>
      </Pressable>
    </View>
  </>
)}
```

### Key Changes

1. **Wrapped both in React Fragment (`<>`)** to return multiple children
2. **SVG overlay stays in `pointerEvents="none"` View** so gestures pass through
3. **Coin name moved to separate View** without pointer event restrictions
4. **Added `padding: 8`** to Pressable for easier tapping
5. **Removed `pointerEvents="box-none"`** since it's no longer needed

---

## Files Modified

**src/components/ZoomCalibration.tsx** (lines 428-594):
- Changed `selectedCoin &&` conditional from single View to Fragment (`<>`)
- Separated SVG overlay and coin name into sibling Views
- SVG overlay: Keeps `pointerEvents="none"` for gesture passthrough
- Coin name: Has normal pointer events, fully tappable
- Added padding to Pressable for better tap target size

---

## Testing Checklist

✅ **Coin name tap**:
1. Take photo → Calibration screen loads
2. Tap on coin name (e.g., "Quarter") → Coin selector modal opens ✅
3. Select different coin → Modal closes, new coin name displays ✅
4. Tap hint text "(Tap to Change Coin)" → Modal opens ✅

✅ **Visual feedback**:
1. Tap and hold coin name → Scales to 0.95 (pressed state) ✅
2. Release → Scales back to 1.0 ✅

✅ **Pan/Zoom still works**:
1. Pinch to zoom → Works as before ✅
2. Pan around image → Works as before ✅
3. SVG overlay doesn't block gestures ✅

✅ **LOCK IN button**:
1. Still works as before ✅

---

## Technical Notes

### `pointerEvents` Hierarchy Rules

In React Native, `pointerEvents` follows these rules:

1. **`none`**: Component and ALL children can't receive touches
2. **`box-none`**: Component itself can't receive touches, but children can
3. **`box-only`**: Only component can receive touches, children can't
4. **`auto`** (default): Normal touch handling

**Parent's `pointerEvents="none"` overrides all children**, even if children try to enable pointer events. The only solution is to move interactive elements outside that parent.

### Why We Need `pointerEvents="none"` on SVG

The SVG overlay covers the entire screen but should be "transparent" to touches so that:
- Pan/zoom gestures work on the underlying ZoomableImage
- Users can interact with controls below the SVG

Without `pointerEvents="none"`, the SVG would block all gestures.

---

## Related Components

This pattern is used throughout the app wherever we have:
- Overlay graphics that shouldn't block interaction
- Interactive elements that need to be clickable despite overlays

Make sure to check similar patterns if adding new overlay UI in the future.

---

**Status**: Coin name is now fully tappable and opens the selector modal! 🎉
