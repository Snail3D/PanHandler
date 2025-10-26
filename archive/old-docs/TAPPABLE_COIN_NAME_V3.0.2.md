# Tappable Coin Name Feature (v3.0.2)

## Status: ✅ COMPLETE

---

## New Feature

**Tap the coin name in the center of the circle to change coins!**

---

## What Changed

**File**: `src/components/ZoomCalibration.tsx`

### Lines 520-577 (Coin name display area)

**Before**:
- Coin name was just static text
- No way to change coin without using bottom selector button

**After**:
- Coin name wrapped in `Pressable` component
- Tapping triggers haptic feedback + opens coin selector
- Added hint text: "(Tap to Change Coin)"
- Subtle scale animation on press (0.95x)

---

## Visual Layout

```
┌─────────────────────────┐
│                         │
│    [Green Circle]       │
│                         │
│      Quarter            │ ← Tappable!
│  (Tap to Change Coin)   │ ← New hint
│       1.52×             │ ← Zoom level
│                         │
└─────────────────────────┘
```

---

## Implementation Details

**Pressable wrapper** (lines 530-549):
- `onPress`: Opens coin selector with Medium haptic
- Scale animation: 1.0 → 0.95 on press
- `alignItems: 'center'` to keep text centered

**Coin name** (lines 550-561):
- Same styling as before
- White, bold, 20pt
- Text shadow for readability

**New hint text** (lines 564-576):
- Lighter white (0.7 opacity)
- Smaller font (11pt)
- "(Tap to Change Coin)" message
- Positioned 4px below coin name

**Zoom indicator** (lines 579-591):
- Moved down slightly (8px margin-top)
- Still shows current zoom level

---

## User Experience

1. **Visual Feedback**:
   - Subtle scale down when pressed
   - Medium haptic on tap

2. **Discoverability**:
   - "(Tap to Change Coin)" hint makes it obvious
   - Always visible (not hidden until zoomed)

3. **Convenience**:
   - Quick access to coin selector
   - No need to find button at bottom
   - Right where user is looking

---

## Testing

- [x] Tap coin name → Coin selector opens
- [x] Haptic feedback on tap
- [x] Scale animation works
- [x] Hint text visible and readable
- [x] Zoom level still shows below
- [x] All text properly centered
- [x] Works with any coin name length

---

## Additional Changes

**Line 525**: Adjusted top position from `-30` to `-40` to accommodate hint text

---

**Result**: Users can now quickly change coins by tapping the name in the center of the circle! 🎯
