# Gesture Composition Fix: Exclusive → Race

## The Problem
Pinch/zoom was "popping" between two states - zooming in slightly then snapping back repeatedly.

## Root Cause
`Gesture.Exclusive` was used for gesture composition:
```typescript
const composedGesture = Gesture.Exclusive(
  doubleTapGesture,
  doubleTapWhenLockedGesture,
  Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture)
);
```

### What Exclusive Does
- Only ONE gesture can be active at a time
- Evaluates gestures in order (double-tap first, then simultaneous)
- If a gesture starts, it blocks others from starting
- Problem: Single touches are evaluated as "potential double-taps" for ~300ms
- This blocks/delays the pinch gesture from activating smoothly
- Result: Gesture starts, stops, starts, stops → "popping" effect

## The Fix
Changed to `Gesture.Race`:
```typescript
const composedGesture = Gesture.Race(
  doubleTapGesture,
  doubleTapWhenLockedGesture,
  Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture)
);
```

### What Race Does
- Gestures race to activate
- First gesture to start winning wins and continues
- Others are cancelled
- Multi-finger pinch wins immediately over single-tap double-tap detection
- Result: Smooth, continuous pinch/zoom/rotate

## Testing
1. ✅ Calibration screen - pinch to zoom should be smooth
2. ✅ Measurement screen - pinch/zoom/rotate should work
3. ✅ Double-tap still works (but doesn't block other gestures)

---
**Exclusive was making gestures fight each other. Race lets them compete fairly!** ⚡
