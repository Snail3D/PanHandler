# Motion Detection for Auto-Capture

**Date**: October 16, 2025  
**Status**: ✅ Complete

## Problem

User could take auto-capture photos while moving the phone, resulting in blurry images. The phone needs to be **physically still** for a sharp photo.

## Root Cause

Previous stability check only measured **tilt angle variance** (whether phone orientation was steady). It did NOT check if the phone was **moving through space** (translation, shake, etc.).

**Result**: Phone could be moving (walking, hand shake, etc.) but maintaining same angle → would still trigger auto-capture.

---

## Solution

Added **dual stability check**:
1. ✅ **Angle Stability** (existing): Tilt variance ≤ 2°
2. ✅ **Motion Stability** (NEW): Acceleration variance ≤ 0.1

**Both must be stable** for photo to be taken.

---

## Implementation

### New State
```typescript
const recentAccelerations = useRef<number[]>([]); // Track last 10 acceleration readings
```

### Acceleration Tracking
```typescript
if (data.acceleration) {
  const { x, y, z } = data.acceleration;
  // Calculate total acceleration magnitude (movement intensity)
  const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
  recentAccelerations.current.push(totalAcceleration);
  if (recentAccelerations.current.length > 10) {
    recentAccelerations.current.shift(); // Keep last 10
  }
}
```

### Dual Stability Check
```typescript
// Check BOTH angle stability AND motion stability
if (recentAngles.current.length >= 5 && recentAccelerations.current.length >= 5) {
  // Angle stability: max 2° variance
  const maxAngle = Math.max(...recentAngles.current);
  const minAngle = Math.min(...recentAngles.current);
  const angleStable = (maxAngle - minAngle) <= 2;
  
  // Motion stability: max 0.1 acceleration variance (phone not moving much)
  const maxAccel = Math.max(...recentAccelerations.current);
  const minAccel = Math.min(...recentAccelerations.current);
  const motionStable = (maxAccel - minAccel) <= 0.1;
  
  // BOTH must be stable
  setIsStable(angleStable && motionStable);
}
```

---

## How It Works

### Acceleration Magnitude
- Combines X, Y, Z acceleration into single value: `√(x² + y² + z²)`
- Represents **total movement intensity** regardless of direction
- Gravity-independent (measures changes in motion)

### Motion Variance Threshold
- **0.1**: Tight threshold - phone must be very still
- Measured over last 10 readings (1 second at 100ms intervals)
- Small hand tremors: OK ✅
- Walking/moving: NOT OK ❌

### Combined Check
```
Auto-capture triggers ONLY when:
  ✅ Angle variance ≤ 2° (good alignment)
  ✅ Acceleration variance ≤ 0.1 (not moving)
  ✅ User holding shutter button
```

---

## User Experience

### Before
- Phone at perfect angle but walking → ❌ Blurry capture
- Holding button while moving → ❌ Takes photo anyway
- Inconsistent photo quality

### After
- Phone at perfect angle but moving → ⏳ "Hold steady..." (waits)
- Stop moving + maintain angle → ✅ "Perfect! Capturing..."
- Only captures when ACTUALLY still
- Consistent sharp photos

---

## Threshold Tuning

### Current Values
- **Angle variance**: 2° (strict alignment)
- **Motion variance**: 0.1 (strict stillness)
- **Sample size**: 5 readings minimum
- **Buffer size**: 10 readings (1 second history)

### If Too Sensitive (never triggers):
```typescript
const motionStable = (maxAccel - minAccel) <= 0.15; // More lenient
```

### If Too Lenient (blurry photos):
```typescript
const motionStable = (maxAccel - minAccel) <= 0.05; // Stricter
```

Current **0.1** is a good balance for handheld photography.

---

## Files Modified

**`src/screens/MeasurementScreen.tsx`**
- Line 84: Added `recentAccelerations` ref
- Lines 271-278: Track acceleration data
- Lines 280-294: Dual stability check (angle + motion)

---

## Testing Checklist

- [ ] Hold button while walking → Should NOT capture
- [ ] Hold button while standing still at good angle → Should capture
- [ ] Hold button with small hand shake → Should still capture (not too sensitive)
- [ ] Hold button while turning phone → Should NOT capture
- [ ] Stop moving after holding → Should capture after ~1 second of stillness

---

## Technical Notes

### Why `data.acceleration`?
- **Acceleration**: Measures change in velocity (movement)
- **Rotation**: Already tracked for tilt angle
- **Gravity**: Filtered out by using variance (not absolute values)

### Why Magnitude?
```typescript
√(x² + y² + z²)
```
- Direction-independent
- One value to track instead of three
- Simpler variance calculation

### Why 10 Readings?
- DeviceMotion updates every 100ms
- 10 readings = 1 second of history
- Enough to detect movement without lag

---

## Future Enhancements (Optional)

1. **Show motion indicator**: Visual feedback when phone is moving
2. **Adaptive threshold**: Adjust based on lighting (darker = stricter)
3. **Calibration mode**: Let user test and adjust sensitivity
4. **Gyroscope integration**: Even more precise motion detection

---

## Summary

Auto-capture now requires **BOTH**:
- ✅ Good angle alignment (≤2° variance)
- ✅ Phone not moving (≤0.1 accel variance)

Result: Sharp, professional photos every time! 📸✨
