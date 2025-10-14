# Email Prompt Modal: Button Style Update

**Date**: Current Session  
**File Modified**: `src/components/EmailPromptModal.tsx`

## Changes Made

Updated the Email Prompt Modal buttons to match the Label Modal's glassmorphic style for consistency across the app.

### Button Style Changes

#### Before:
```
[Cancel ████]  (gray button with close icon)
[Save ████]    (green button with checkmark icon)
Equal size, gap: 12px
```

#### After:
```
      [💾 Save ░░░░░░]    [Skip]
      Bigger, translucent   Smaller, transparent
      Gap: 20px
```

### 1. Save Button - Glassmorphic Style

**Before:**
- Green background (#34C759)
- White text with checkmark icon
- Equal size to Cancel
- Bright and prominent

**After:**
- **Translucent white background** (`rgba(255, 255, 255, 0.5)`)
- **Dark text and icon** (#1C1C1E)
- **40% larger** than Skip (flex: 1.4 vs 1.0)
- **Floppy disk icon** (💾 save)
- Subtle border and shadow
- Matches control menu aesthetic

**Styling:**
```typescript
{
  flex: 1.4,
  backgroundColor: 'rgba(255, 255, 255, 0.5)', // Glassmorphic
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.35)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
}
```

### 2. Skip Button (formerly Cancel)

**Before:**
- Named "Cancel"
- Gray background with close icon
- Equal size to Save
- Visible border

**After:**
- **Renamed to "Skip"** (matches Label Modal)
- **Transparent background**
- **Smaller size** (flex: 1.0)
- **Light gray text** (#8E8E93)
- No border, no icon
- Barely visible (de-emphasized)

**Styling:**
```typescript
{
  flex: 1,
  backgroundColor: 'transparent',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  // Pressed: rgba(120,120,128,0.08)
}
```

### 3. Layout Changes

**Container:**
- Added `alignItems: 'center'` to center button row
- `maxWidth: 320px` to constrain width
- `gap: 12px` → `20px` (more breathing room)

**Button Ratio:**
- Save: `flex: 1.4` (~58% width)
- Skip: `flex: 1.0` (~42% width)

## Visual Comparison

### Before:
```
┌────────────────────────────────────┐
│                                    │
│  [Cancel ████████] [Save ████████] │
│    50% width         50% width     │
│    Gray bg           Green bg      │
│    Close icon        Check icon    │
│                                    │
└────────────────────────────────────┘
```

### After:
```
┌────────────────────────────────────┐
│                                    │
│       [💾 Save ░░░░░░]   [Skip]    │
│          58% width      42% width  │
│       Translucent       Transparent│
│       Floppy disk       Text only  │
│                                    │
└────────────────────────────────────┘
```

## Consistency Achieved

Now **all three modals** use the same button style:

### Label Modal:
- 💾 Save (glassmorphic, dark text) + Skip (transparent, light text)

### Email Prompt Modal:
- 💾 Save (glassmorphic, dark text) + Skip (transparent, light text)

### Paywall Modal:
- Different style (intentionally prominent for purchase)

## Benefits

1. **Visual Consistency**: Matches Label Modal exactly
2. **Unified Design**: Same glassmorphic "watery" aesthetic
3. **Better Hierarchy**: Save is obviously the primary action
4. **Less Aggressive**: Translucent white softer than bright green
5. **Professional**: Cohesive design language throughout app
6. **Better UX**: Users recognize the pattern from Label Modal

## Technical Details

### Icon Change:
- Before: `checkmark-circle` (22px, white)
- After: `save` (18px, dark) - floppy disk

### Text Change:
- Button label: "Cancel" → "Skip"
- Matches Label Modal terminology

### Color Scheme:
- Save text: White → `#1C1C1E` (dark)
- Save bg: `#34C759` (green) → `rgba(255, 255, 255, 0.5)` (translucent)
- Skip text: `#8E8E93` (light gray)
- Skip bg: Gray → Transparent

### Spacing:
- Gap: 12px → 20px
- Container: Centered with max width
- Save padding: 14px vertical, 16px horizontal
- Skip padding: 10px vertical, 12px horizontal

## User Experience

### Before:
- Two equally prominent buttons
- Green Save button very eye-catching
- Cancel feels like negative action

### After:
- Save button clearly primary
- Skip is subtle/non-intrusive
- Encourages saving email for convenience
- Matches expected behavior from Label Modal

**Status**: ✅ Complete - Email modal matches label modal style!
