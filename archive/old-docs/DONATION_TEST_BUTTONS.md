# Donation State Test Buttons

## Overview
Added three test buttons at the top-left of the camera screen to quickly test different donation states in the app.

## Test Buttons

### 1. **Not Donor** (Red Button)
- Sets user as a non-donor
- Triggers BattlingBots modal every 10 sessions
- Color: Red (`rgba(239, 68, 68, 0.9)`)

### 2. **Old Donor** (Blue Button)
- Sets user as a donor who donated 50 sessions ago
- Triggers BattlingBots modal every 40 sessions
- Simulates a donor who hasn't seen the modal in a while
- Color: Blue (`rgba(59, 130, 246, 0.9)`)

### 3. **New Donor** (Green Button)
- Sets user as a donor who just donated in the current session
- `lastDonationSession` is set to current `sessionCount`
- Triggers BattlingBots modal every 40 sessions
- Color: Green (`rgba(16, 185, 129, 0.9)`)

## Status Display
Below the buttons, there's a dark overlay showing:
- Current donation status (✅ Donor / ❌ Not Donor)
- Current session count
- Last donation session number

## Implementation Details

### Store Updates
All buttons use `useStore.getState()` to access and update the donation state:
```typescript
const setIsDonor = useStore.getState().setIsDonor;
const sessionCount = useStore.getState().sessionCount;
```

### State Properties (from measurementStore.ts)
- `isDonor`: Boolean - True if user has donated
- `lastDonationSession`: Number - Session number when user last donated
- `sessionCount`: Number - Current session count (increments on app open)

### Modal Trigger Logic (MeasurementScreen.tsx, line 248-259)
```typescript
const triggerInterval = isDonor ? 40 : 10;

if (newSessionCount % triggerInterval === 0) {
  setShowBattlingBots(true);
}
```

## Testing Scenarios

### Test Non-Donor Flow
1. Tap "Not Donor" button
2. Check status shows "❌ Not Donor"
3. Modal should appear every 10 sessions

### Test Old Donor Flow (Should see modal)
1. Tap "Old Donor" button
2. Check status shows "✅ Donor" with `lastDonationSession` 50 sessions ago
3. If 40+ sessions have passed since donation, modal will appear

### Test New Donor Flow (Just donated)
1. Tap "New Donor" button
2. Check status shows "✅ Donor" with `lastDonationSession` = current session
3. Modal should NOT appear until 40 more sessions pass

## Location
Camera screen top bar: `/home/user/workspace/src/screens/MeasurementScreen.tsx` (lines ~1437-1511)

## Visual Feedback
Each button press triggers a haptic success notification for confirmation.
