# App Crash After Wall Photo - INVESTIGATION (v3.0.8)

**Date**: Oct 20, 2025  
**Status**: IN PROGRESS - NEEDS IMMEDIATE FIX  
**Severity**: CRITICAL - App crashes and restarts

---

## The Bug

**User Report**: "Took vertical wall picture, nothing happened. Photo capture button disappeared. Then it finally triggered but the app restarted/crashed."

**Symptoms**:
1. Take wall photo (vertical) → Nothing happens
2. Shutter button disappears (stuck in `isCapturing = true`)
3. After delay, something triggers
4. **App crashes and restarts completely**

---

## What's Causing the Crash

The crash is happening when multiple state updates and timeouts collide. Possible causes:

### 1. Safety Timeout Firing After Component Unmount
The 10-second safety timeout in `takePicture()` might be firing after the component has unmounted or while in a transition, causing setState on an unmounted component.

### 2. Nested setTimeout Hell
We have multiple nested timeouts:
- Safety timeout (10s)
- Photo capture delay (50ms)
- Mode switch delay (150ms)
- Fade-in delay (200ms)
- Wall photo modal delay (100ms)

If these fire in the wrong order or after state changes, they can cause crashes.

### 3. Animation Value Access During Unmount
Setting `transitionBlackOverlay.value` or other shared values while component is transitioning or unmounting could cause native module crashes.

### 4. `isCapturing` Stuck True
If `isCapturing` stays true (button hidden), the user can't do anything. The safety timeout should reset it, but something is preventing that or causing a crash when it does.

---

## Immediate Workaround for User

**FORCE CLOSE THE APP NOW:**
1. Swipe up to see app switcher
2. Swipe app card up to kill it
3. Reopen app

The app state will reset and you can try again.

---

## Why This Is So Bad

This is **app-breaking** in the worst way:
1. User loses control (button disappears)
2. App crashes instead of recovering
3. Happens on a basic user flow (taking a photo)
4. No way to recover except force-close

**This would cause immediate app deletion and 1-star reviews.**

---

## Root Cause Analysis

The performance optimizations in v3.0.3-3.0.7 introduced:
- Deferred MMKV writes
- Complex timeout management
- Safety mechanisms (which themselves can cause crashes)
- Local state (`capturedPhotoUri`) separate from persisted state

These changes created a **fragile timing-dependent system** where:
- State updates must happen in exact order
- Timeouts must all clear properly
- Component lifecycle must be perfectly managed

One thing goes wrong → Cascade failure → Crash

---

## The Real Problem

**We're fighting symptoms, not the disease.**

The disease is: **Photo capture flow is too complex and fragile.**

Every fix adds more timeouts, more state, more edge cases. We need to **simplify radically**.

---

## Proposed Fix: Simplify Everything

### 1. Remove All Safety Timeouts
They're causing more problems than they solve. Trust React Native's error boundaries instead.

### 2. Synchronous State Updates Where Possible
Batch state updates together instead of spreading them across timeouts.

### 3. Single Source of Truth for Photo State
Either use `capturedPhotoUri` OR `currentImageUri`, not both.

### 4. Immediate Mode Switch
Don't delay mode switches. Switch immediately and let React handle rendering.

### 5. Remove Nested Timeouts
Replace with simple sequential execution or useEffect chains.

---

## Emergency Fix (Implement Now)

Add a **visible "STUCK? TAP HERE" button** that appears if `isCapturing` is true for more than 3 seconds:

```javascript
// Add to state
const [showEmergencyReset, setShowEmergencyReset] = useState(false);

// Add useEffect
useEffect(() => {
  let timer: NodeJS.Timeout;
  if (isCapturing) {
    timer = setTimeout(() => {
      setShowEmergencyReset(true);
    }, 3000);
  } else {
    setShowEmergencyReset(false);
  }
  return () => clearTimeout(timer);
}, [isCapturing]);

// Add to camera UI
{showEmergencyReset && (
  <Pressable
    onPress={() => {
      setIsCapturing(false);
      setIsTransitioning(false);
      setPendingPhotoUri(null);
      setCapturedPhotoUri(null);
      setShowPhotoTypeModal(false);
      transitionBlackOverlay.value = 0;
      cameraOpacity.value = 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }}
    style={{
      position: 'absolute',
      bottom: 120,
      alignSelf: 'center',
      backgroundColor: 'red',
      padding: 16,
      borderRadius: 12,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>
      STUCK? TAP TO RESET
    </Text>
  </Pressable>
)}
```

This gives users a **visible escape hatch** instead of a crash.

---

## Long-Term Fix (Next Session)

1. **Rewrite photo capture flow** from scratch
2. Remove all safety timeouts
3. Simplify state management
4. Add proper error boundaries
5. Test extensively with rapid captures, cancels, and edge cases

---

## Testing Protocol

Before deploying ANY fix:

1. **Rapid capture test**: Take 5 photos in a row as fast as possible
2. **Cancel spam**: Take photo, cancel, take photo, cancel (10 times)
3. **Mode switch spam**: Take photo, go to calibration, back to camera (10 times)
4. **Wall photo test**: Take 10 wall photos in a row
5. **Table photo test**: Take 10 table photos in a row
6. **Mixed test**: Alternate wall/table 10 times

If **ANY** of these cause a crash or lockup → Don't deploy.

---

## Lessons Learned

1. **Complexity is the enemy** - Every added timeout/safety mechanism increases fragility
2. **Symptoms vs disease** - We've been fixing symptoms (stuck states) instead of the disease (complex flow)
3. **React Native is fragile** - setState during unmount, animation value access during transition = crash
4. **Test edge cases religiously** - Happy path always works, crashes hide in rapid actions and cancels

---

## Current Status

**BLOCKED**: App is crashing on basic photo flow.  
**PRIORITY**: Implement emergency reset button NOW.  
**NEXT**: Complete rewrite of photo capture system.

---

**For the user**: I'm deeply sorry. This is unacceptable. Force-close the app now, and I'm implementing an emergency fix that will let you reset if it gets stuck again.
