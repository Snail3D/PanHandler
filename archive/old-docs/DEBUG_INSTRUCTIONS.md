# 🐛 Drone Detection Debug Plan

## Current Issue
- Taking regular photo → Drone modal appears ❌
- Importing drone photo → Nothing happens ❌  

This is completely backwards!

---

## What I Just Added

### Debug Logging:
```typescript
useEffect(() => {
  console.log('🔔 MODAL STATE CHANGED:', showManualAltitudeModal);
  if (showManualAltitudeModal) {
    console.log('📍 Modal showing NOW - stack trace:');
    console.trace(); // This shows WHERE the modal was triggered from
  }
}, [showManualAltitudeModal]);
```

This will show EXACTLY when and WHERE the modal gets triggered.

---

## Test Instructions

### Test 1: Take Regular Photo
1. Open app
2. Point camera at anything (NOT a drone photo)
3. Press shutter button
4. **Watch console for these logs:**
   - `🔔 MODAL STATE CHANGED: true` 
   - `📍 Modal showing NOW - stack trace:`
   - Stack trace showing the code path

### Test 2: Import Drone Photo
1. Tap gallery/import button
2. Select your DJI Neo photo
3. **Watch console for:**
   - `🔍 Checking if photo is from drone...`
   - `📊 Drone Detection Results: {...}`
   - `🚁 Drone detected: DJI Neo`
   - `📝 No RelativeAltitude - showing manual entry modal`
   - `✅ Modal state set to TRUE`
   - `🔔 MODAL STATE CHANGED: true`

---

## Possible Causes

### Theory 1: State Persisting
Maybe `showManualAltitudeModal` is stuck at `true` from a previous session.
**Check:** Does modal appear IMMEDIATELY when app loads?

### Theory 2: Wrong Detection Trigger
Maybe there's code calling drone detection that I haven't found yet.
**Check:** Stack trace will show us!

### Theory 3: Modal Rendering Issue
Maybe modal IS being set for drone photos, but something else is wrong.
**Check:** Look for "✅ Modal state set to TRUE" in logs

---

## Quick Fix Option

If debugging takes too long, I can:

### Option A: Disable Drone Detection Temporarily
```typescript
// Comment out drone detection entirely
// Ship without this feature for now
// Add it back in next version when working
```

### Option B: Make It Manual
```typescript
// Add a "This is a drone photo" button
// User taps it manually
// Then show modal
```

### Option C: Move Detection to Calibration Screen
```typescript
// Instead of detecting on import
// Add "Drone Photo?" button in calibration screen
// User confirms, then enter altitude
```

---

## What I Need From You

**Please try both tests and tell me:**

1. **For regular photo:** What does the console say? Where is the stack trace pointing to?

2. **For drone photo:** Do you see the "🚁 Drone detected" log? Or nothing at all?

3. **When modal appears (wrong time):** What text does it show? What drone name?

---

## Expected Console Output

### When Importing Drone Photo (Should Work):
```
🔍 Checking if photo is from drone...
📊 Drone Detection Results: {
  isDrone: true,
  hasSpecs: true,
  displayName: "DJI Neo",
  ...
}
🚁 Drone detected: DJI Neo
📝 No RelativeAltitude - showing manual entry modal
🎯 Setting pendingDroneData and showing modal NOW
✅ Modal state set to TRUE
🔔 MODAL STATE CHANGED: true
📍 Modal showing NOW - stack trace:
  at setShowManualAltitudeModal (line 1408)
  at pickImage (line 1408)
```

### When Taking Regular Photo (Should NOT trigger):
```
(NO drone detection logs at all)
(Goes straight to calibration)
```

---

**Next Step:** Run these tests and send me the console output! 🔍
