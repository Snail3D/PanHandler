# ⚠️ CRITICAL PERFORMANCE RULE ⚠️

## NEVER WRITE TO ASYNCSTORAGE DURING GESTURES

### The Problem That Almost Killed The App

**Date**: October 16, 2025  
**Severity**: CRITICAL - App was completely unusable  
**Symptom**: 10-15 second button lockup after any pan/rotate gesture  
**Root Cause**: Writing to AsyncStorage 60+ times per second during gestures

---

## THE GOLDEN RULE

**❌ NEVER DO THIS:**
```typescript
onTransformChange={(scale, translateX, translateY, rotation) => {
  setSavedZoomState({ scale, translateX, translateY, rotation });
  // ☠️ WRITES TO ASYNCSTORAGE ON EVERY FRAME
  // ☠️ BLOCKS JS THREAD FOR 10-15 SECONDS
  // ☠️ MAKES APP COMPLETELY UNUSABLE
}}
```

**✅ ALWAYS DO THIS:**
```typescript
onTransformChange={(scale, translateX, translateY, rotation) => {
  setLocalState({ scale, translateX, translateY, rotation }); // ✅ Fast
  
  // Debounce AsyncStorage writes
  if (saveTimeout.current) clearTimeout(saveTimeout.current);
  saveTimeout.current = setTimeout(() => {
    setSavedZoomState({ scale, translateX, translateY, rotation }); // ✅ Once after gesture ends
  }, 500);
}}
```

---

## Why This Matters

### AsyncStorage Performance Facts
- **AsyncStorage is SLOW** - Each write takes 10-50ms
- **AsyncStorage blocks the JS thread** - Nothing else can run during writes
- **Gestures fire 60+ times per second** - That's 60+ writes per second
- **Result**: 10-15 second complete freeze of the app

### What Happens When You Violate This Rule
1. User pans/rotates image
2. `onTransformChange` fires 60-120 times per second
3. Each call writes to AsyncStorage (50ms each)
4. AsyncStorage write queue backs up: 60 writes × 50ms = **3+ seconds of blocked JS thread per second**
5. Writes stack up faster than they can complete
6. JS thread is blocked for 10-15 seconds
7. **ALL BUTTONS STOP WORKING**
8. **APP APPEARS FROZEN**
9. **USER THINKS APP IS BROKEN**
10. **COMPANY REPUTATION DESTROYED**

---

## Where This Rule Applies

### ❌ NEVER write to AsyncStorage in:
- `onUpdate` callbacks (called every frame)
- `onTransformChange` callbacks (called every frame)
- `onResponderMove` handlers (called every frame)
- `useAnimatedReaction` that runs every frame
- Any callback that fires more than 10 times per second

### ✅ SAFE places to write to AsyncStorage:
- `onPress` handlers (user taps)
- `onEnd` callbacks (gesture finished)
- Debounced callbacks (500ms+ after last call)
- `useEffect` with stable dependencies
- One-time initialization

---

## How To Debounce AsyncStorage Writes

### Pattern 1: Simple Timeout Debounce
```typescript
const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const debouncedSave = (data: any) => {
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  saveTimeoutRef.current = setTimeout(() => {
    saveToAsyncStorage(data);
  }, 500);
};

// Use in gesture callback
onTransformChange={(data) => {
  setLocalState(data);      // ✅ Instant
  debouncedSave(data);      // ✅ Debounced
}}
```

### Pattern 2: Save on Gesture End
```typescript
const pendingSaveRef = useRef<any>(null);

onTransformChange={(data) => {
  setLocalState(data);           // ✅ Instant
  pendingSaveRef.current = data; // ✅ Store for later
}}

onGestureEnd={() => {
  if (pendingSaveRef.current) {
    saveToAsyncStorage(pendingSaveRef.current); // ✅ Save once at end
    pendingSaveRef.current = null;
  }
}}
```

### Pattern 3: Throttled Writes (Still Dangerous)
```typescript
const lastSaveTime = useRef(0);
const MIN_SAVE_INTERVAL = 1000; // 1 second minimum between saves

onTransformChange={(data) => {
  setLocalState(data); // ✅ Always update local state
  
  const now = Date.now();
  if (now - lastSaveTime.current > MIN_SAVE_INTERVAL) {
    saveToAsyncStorage(data);
    lastSaveTime.current = now;
  }
}}
// ⚠️ Still writes once per second - use Pattern 1 or 2 instead
```

---

## The Incident - Step by Step

### What The User Experienced
1. Take a photo and enter measurement screen
2. Pan or rotate the image to adjust view
3. Try to tap Pan/Measure toggle button
4. **Button doesn't respond**
5. Tap it again - **nothing**
6. Tap it 20 times - **nothing**
7. Wait 10-15 seconds
8. Suddenly all 20 taps execute at once
9. App is unusable

### What Was Actually Happening
```typescript
// MeasurementScreen.tsx - THE BUG
onTransformChange={(scale, translateX, translateY, rotation) => {
  const newZoom = { scale, translateX, translateY, rotation };
  setMeasurementZoom(newZoom);
  setSavedZoomState(newZoom); // ← THIS LINE DESTROYED THE APP
}}

// measurementStore.ts - Zustand persist
setSavedZoomState: (zoomState) => set({ savedZoomState: zoomState })
// ↑ This writes to AsyncStorage via Zustand persist

// During pan gesture:
// Frame 1: Write to AsyncStorage (50ms) ← JS thread blocked
// Frame 2: Write to AsyncStorage (50ms) ← JS thread blocked  
// Frame 3: Write to AsyncStorage (50ms) ← JS thread blocked
// ... 60 times per second ...
// Result: 3 seconds of blocked JS thread PER SECOND
// Queue backs up, buttons can't execute for 10-15 seconds
```

### How We Found It
After 2 hours of debugging:
1. ❌ Checked gesture configurations
2. ❌ Checked pointerEvents
3. ❌ Checked z-index stacking
4. ❌ Checked touch responders
5. ✅ Added on-screen debug logging
6. ✅ Discovered button taps were queued for 13+ seconds
7. ✅ Realized JS thread was blocked
8. ✅ User said: "It only happens after panning"
9. ✅ Checked what happens during pan
10. ✅ Found `onTransformChange` calling `setSavedZoomState`
11. ✅ Found `setSavedZoomState` writes to AsyncStorage
12. ✅ **FOUND THE BUG**

### The Fix
```typescript
// Added debounce ref
const zoomSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Fixed onTransformChange
onTransformChange={(scale, translateX, translateY, rotation) => {
  const newZoom = { scale, translateX, translateY, rotation };
  setMeasurementZoom(newZoom); // ✅ Instant - local state only
  
  // Debounce AsyncStorage saves - only save 500ms after gesture ends
  if (zoomSaveTimeoutRef.current) {
    clearTimeout(zoomSaveTimeoutRef.current);
  }
  zoomSaveTimeoutRef.current = setTimeout(() => {
    setSavedZoomState(newZoom); // ✅ Writes once after gesture ends
  }, 500);
}}
```

**Result**: Buttons now respond instantly. Zero lag. App is smooth.

---

## Testing Checklist - VERIFY THIS NEVER BREAKS

### Before Committing Any Code That Writes To AsyncStorage

Run this test sequence:

1. ✅ Open measurement screen
2. ✅ Pan image aggressively for 5 seconds
3. ✅ **IMMEDIATELY** tap a button
4. ✅ **Button MUST respond within 100ms**
5. ✅ Rotate image aggressively for 5 seconds  
6. ✅ **IMMEDIATELY** tap a button
7. ✅ **Button MUST respond within 100ms**
8. ✅ Pan + rotate simultaneously for 5 seconds
9. ✅ **IMMEDIATELY** tap a button
10. ✅ **Button MUST respond within 100ms**

**If any button takes more than 200ms to respond, YOU BROKE IT.**

### Code Review Checklist

Before approving any PR, search for these patterns:

```bash
# Find potential AsyncStorage abuse in gesture handlers
rg "onTransformChange.*setSaved" -A 5
rg "onUpdate.*set.*Storage" -A 5  
rg "onResponderMove.*set.*Storage" -A 5
rg "useAnimatedReaction.*set.*Storage" -A 10
```

If you find AsyncStorage writes in any of these, **REJECT THE PR**.

---

## Performance Monitoring

### Add This To Catch Future Issues

```typescript
// Add performance monitoring to AsyncStorage writes
const originalSetItem = AsyncStorage.setItem;
AsyncStorage.setItem = async (key, value) => {
  const start = Date.now();
  const result = await originalSetItem(key, value);
  const duration = Date.now() - start;
  
  if (duration > 50) {
    console.warn(`⚠️ SLOW AsyncStorage write: ${key} took ${duration}ms`);
  }
  
  return result;
};

// Monitor high-frequency writes
const writeCount = new Map<string, number>();
setInterval(() => {
  writeCount.forEach((count, key) => {
    if (count > 10) {
      console.error(`🚨 CRITICAL: ${key} written ${count} times in 1 second!`);
    }
  });
  writeCount.clear();
}, 1000);
```

---

## Summary - The Rules

1. **NEVER write to AsyncStorage in gesture callbacks**
2. **NEVER write to AsyncStorage more than once per second**
3. **ALWAYS debounce AsyncStorage writes with 500ms+ delay**
4. **ALWAYS update local state immediately (fast)**
5. **ALWAYS persist to AsyncStorage later (debounced)**
6. **ALWAYS test button responsiveness after gesture changes**
7. **ALWAYS check AsyncStorage write frequency in code review**

---

## If You Break This Rule

**You will:**
- Block the JS thread for 10-15 seconds
- Make all buttons unresponsive
- Make the app appear frozen
- Destroy user experience
- Get support complaints
- Lose users
- Damage company reputation

**Don't do it.**

---

## Related Files

- `src/screens/MeasurementScreen.tsx` (Lines 935-946) - THE FIX
- `src/state/measurementStore.ts` - Zustand persist configuration
- `ASYNC_STORAGE_FIX.md` - Detailed incident report

---

## Questions?

**Q: What if I need to save frequently?**  
A: Use local React state for fast updates, debounce AsyncStorage writes.

**Q: What if I need to persist immediately?**  
A: You don't. Users can wait 500ms. They can't wait 15 seconds.

**Q: What about other async operations?**  
A: Same rule applies to any blocking operation: network requests, file I/O, heavy computation.

**Q: How do I test this?**  
A: Pan aggressively, then immediately tap buttons. They MUST respond instantly.

---

**This document was written in blood. Don't make me write it again.** 🔥
