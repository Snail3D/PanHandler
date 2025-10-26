# Blueprint Modal Pan/Zoom Fix

## Issue
When entering Known Scale/Blueprint mode, the placement modal was visible but users couldn't pan or zoom the image to position it before placing pins. The modal was "locked up" and blocked all touches to the image underneath.

## Root Cause
The `BlueprintPlacementModal` used React Native's `Modal` component, which creates a separate window layer that captures ALL touches by default. Even with `pointerEvents="box-none"` on the inner containers, the Modal itself prevented touches from reaching the underlying `ZoomableImage`.

## The Fix

### Changed: `src/components/BlueprintPlacementModal.tsx`

**Before:**
```typescript
<Modal visible={visible} transparent animationType="fade">
  <View style={{ flex: 1 }} pointerEvents="box-none">
    {/* Modal content */}
  </View>
</Modal>
```

**After:**
```typescript
if (!visible) return null;

return (
  <View 
    style={{ 
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100,
    }} 
    pointerEvents="box-none"
  >
    {/* Modal content */}
  </View>
);
```

### Key Changes:
1. **Removed `Modal` component** - No longer creates blocking window layer
2. **Changed to positioned `View`** - Renders in the same view hierarchy
3. **Added conditional render** - `if (!visible) return null` 
4. **Added `pointerEvents="box-none"`** - Passes touches through to image
5. **High z-index** - Ensures it appears above other UI elements

## How It Works Now

### User Flow:
1. User selects "Known Scale/Blueprint" from photo type menu
2. **BlueprintPlacementModal appears** with instructions
3. **✅ User can NOW pan/zoom the image** to frame it correctly
4. Modal stays visible while user adjusts view
5. User clicks "PLACE PINS" when ready
6. Modal disappears, pin placement mode activates

### Touch Behavior:
- **Modal content (card)**: Captures touches (buttons work)
- **Empty space around modal**: Touches pass through to image
- **Result**: User can pan/zoom by touching anywhere outside the modal card

## Technical Details

### Why `pointerEvents="box-none"`?
- The outer container has `pointerEvents="box-none"`
- This means: "I don't capture touches, but my children do"
- Touches outside the modal card → pass through to ZoomableImage
- Touches on the modal card → captured by buttons/text

### Z-Index Strategy
```typescript
zIndex: 100  // Blueprint modal - above everything
zIndex: 15   // DimensionOverlay UI
zIndex: -1   // ZoomableImage gestures
```

### Comparison: Modal vs Positioned View

**React Native Modal:**
- ✅ Built-in animations
- ✅ Automatic backdrop
- ❌ Creates separate window (blocks touches)
- ❌ Can't pass touches through to underlying content

**Positioned View:**
- ✅ Renders in same hierarchy
- ✅ Full control over touch handling
- ✅ Can pass touches through with `pointerEvents`
- ❌ Need to manually handle visibility
- ❌ Need to manually position

## Files Modified
- `src/components/BlueprintPlacementModal.tsx`
  - Removed: `Modal` component, `animationType`, `onRequestClose`
  - Added: Conditional render, absolute positioning, z-index
  - Changed: Container from `Modal` to `View` with `pointerEvents="box-none"`

## Testing

### ✅ Verified Working:
1. Enter Known Scale mode
2. Modal appears with instructions
3. Pan/zoom the image (two-finger gestures work)
4. Modal stays visible during pan/zoom
5. Click "PLACE PINS" button
6. Modal dismisses, pin placement begins

### Expected Behavior:
- Modal is visible but doesn't block image gestures
- Menu stays hidden (as requested)
- User can frame the image perfectly before placing pins
- Smooth workflow with no interruptions

## Status
✅ Fixed and ready for v2.5.0
✅ User can now pan/zoom before placing blueprint pins
✅ Modal instructions remain visible during adjustment
