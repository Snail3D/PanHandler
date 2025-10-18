# Supporter Badge 3-Line Layout & Help Button Fix

## Changes Made

### 1. Supporter Badge - 3-Line Compact Square

**Old Layout:**
- Single line: "❤️ Official PanHandler Supporter"
- Horizontal layout (`flexDirection: 'row'`)
- Wide rectangular badge

**New Layout:**
- Three lines in compact square:
  ```
  ❤️
  Official
  PanHandler
  Supporter
  ```
- Vertical layout (`alignItems: 'center', justifyContent: 'center'`)
- Compact, square-ish badge

**Position:**
- Moved from `bottom: insets.bottom + 200` to `bottom: insets.bottom + 80`
- Now positioned lower as shown in user's image
- Still centered horizontally
- Still within safe area

**Code Changes:**
```typescript
// Changed from flexDirection: 'row' to vertical centering
<View style={{ alignItems: 'center', justifyContent: 'center' }}>
  <Text>❤️</Text>
  <Text>Official</Text>
  <Text>PanHandler</Text>
  <Text>Supporter</Text>
</View>
```

---

### 2. Help Button Missing in Known Scale Mode

**Problem:**
- Help button only showed when `coinCircle` existed
- In Known Scale Mode (verbal scale), there's no coin circle
- Help button disappeared

**Solution:**
Changed condition from:
```typescript
// Before:
{coinCircle && !showLockedInAnimation && !isCapturing && (

// After:
{(coinCircle || calibration || mapScale) && !showLockedInAnimation && !isCapturing && (
```

Now help button shows when ANY calibration exists:
- ✅ Coin calibration (coinCircle)
- ✅ Known Scale Mode (calibration with verbal scale)
- ✅ Map Mode (mapScale)

---

## Files Modified

**`/src/components/DimensionOverlay.tsx`**:
1. Lines 5841-5881: Supporter badge layout changed to 3-line compact square
2. Line 5845: Badge position moved to `bottom: insets.bottom + 80`
3. Line 6788: Help button condition expanded to include all calibration types

---

## Testing Checklist

### Supporter Badge
- [x] Badge displays as 3 lines (Official / PanHandler / Supporter)
- [x] Heart emoji appears above text
- [x] Badge is compact and square-ish
- [x] Positioned lower on screen (80px above safe area)
- [x] Still centered horizontally
- [x] Within safe area (no clipping)

### Help Button
- [x] Shows in coin calibration mode
- [x] Shows in Known Scale Mode (verbal scale)
- [x] Shows in Map Mode
- [x] Hidden during capture
- [x] Hidden during locked-in animation
- [x] Positioned correctly next to other badges

---

## Visual Result

**Supporter Badge:**
```
┌─────────────┐
│      ❤️      │
│   Official   │
│  PanHandler  │
│  Supporter   │
└─────────────┘
```

More compact, square-shaped, and positioned lower on screen as requested.

**Help Button:**
Now visible in all calibrated states, not just coin mode.
