# Smart Calibration Hint - Implementation Plan

**Date**: October 16, 2025  
**Status**: ⏳ In Progress

## Feature Overview

Detect when user is struggling with measurements and suggest checking calibration.

---

## Detection Logic

### Thresholds (Per Measurement Type)
- **Distance/Line**: 2 attempts in same area
- **Circle/Rectangle/Angle/Freehand**: 3 attempts in same area

### What Counts as "Same Area"?
- Within 80px radius of previous measurement
- Within 20 seconds timeframe

### What Counts as "Retry"?
1. **Place → Delete → Place again** (in same area)
2. **Place → Drag endpoint → Drag again** (multiple adjustments)
3. **Place → Edit → Delete → Place** (refinement cycle)

### Tracking Required
```typescript
interface MeasurementAttempt {
  type: 'distance' | 'circle' | 'rectangle' | 'angle' | 'freehand';
  centerX: number; // Average of all points
  centerY: number;
  timestamp: number;
  wasAdjusted: boolean; // Did user drag points after placing?
}

// Per photo session
const attemptHistory: MeasurementAttempt[] = [];
const hasShownHintForThisPhoto: boolean = false;
```

---

## UI Design

### Hint Appearance
```
┌─────────────────────────────────┐
│  ⚠️ Measurements seem off?       │
│  Check calibration (upper right) │
│                                   │
│  Tap anywhere to dismiss          │
└─────────────────────────────────┘
```

**Styling:**
- Yellow/orange theme (`#F59E0B` amber)
- Semi-transparent glassmorphism
- BlurView background
- Centered on screen
- Above menu (high z-index)
- Smooth fade in/out (500ms)

### Dismissal
- Tap anywhere (full-screen pressable)
- Graceful fade out
- Haptic feedback (Light)
- Sets `hasShownHintForThisPhoto = true`

---

## State Management

### New State Variables
```typescript
// In DimensionOverlay.tsx
const [attemptHistory, setAttemptHistory] = useState<MeasurementAttempt[]>([]);
const [hasShownCalibrationHint, setHasShownCalibrationHint] = useState(false);
const [showCalibrationHint, setShowCalibrationHint] = useState(false);
```

### Reset Triggers
- **New photo loaded**: Clear `attemptHistory`, reset `hasShownCalibrationHint`
- **Recalibrate button tapped**: Reset hint (user acknowledged)
- **Photo cleared**: Full reset

---

## Detection Algorithm

```typescript
const checkForCalibrationIssues = (newMeasurement: CompletedMeasurement) => {
  // Don't show if already shown for this photo
  if (hasShownCalibrationHint) return;
  
  // Calculate center point of new measurement
  const centerX = newMeasurement.points.reduce((sum, p) => sum + p.x, 0) / newMeasurement.points.length;
  const centerY = newMeasurement.points.reduce((sum, p) => sum + p.y, 0) / newMeasurement.points.length;
  
  // Add to history
  const attempt: MeasurementAttempt = {
    type: newMeasurement.mode,
    centerX,
    centerY,
    timestamp: Date.now(),
    wasAdjusted: false, // Will be set to true if user drags points
  };
  
  // Filter recent attempts (last 20 seconds)
  const recentAttempts = attemptHistory.filter(a => Date.now() - a.timestamp < 20000);
  
  // Count attempts in same area (80px radius)
  const nearbyAttempts = recentAttempts.filter(a => {
    const distance = Math.sqrt(
      Math.pow(a.centerX - centerX, 2) + 
      Math.pow(a.centerY - centerY, 2)
    );
    return distance < 80 && a.type === newMeasurement.mode;
  });
  
  // Check threshold
  const threshold = newMeasurement.mode === 'distance' ? 2 : 3;
  
  if (nearbyAttempts.length >= threshold) {
    // Trigger hint!
    setShowCalibrationHint(true);
    setHasShownCalibrationHint(true);
  }
  
  // Update history
  setAttemptHistory([...recentAttempts, attempt]);
};
```

---

## Integration Points

### 1. When Measurement is Completed
```typescript
// In handleCompleteMeasurement or similar
const newMeasurement = {
  id: generateId(),
  points: [...points],
  mode,
  value: calculatedValue,
};

setCompletedMeasurements([...measurements, newMeasurement]);
checkForCalibrationIssues(newMeasurement); // NEW
```

### 2. When Measurement is Deleted
```typescript
// Track delete patterns
const handleDeleteMeasurement = (id: string) => {
  const deleted = measurements.find(m => m.id === id);
  if (deleted) {
    // Mark last attempt as potentially problematic
    // (user deleted it, suggesting dissatisfaction)
  }
  // ... existing delete logic
};
```

### 3. When Point is Dragged
```typescript
// In point drag handler
const handlePointDrag = (measurementId: string, pointId: string) => {
  // Mark measurement as "adjusted" in attempt history
  setAttemptHistory(prev => prev.map(attempt => {
    // Find matching attempt and mark as adjusted
    return { ...attempt, wasAdjusted: true };
  }));
};
```

### 4. On New Photo
```typescript
// In useEffect or when image changes
useEffect(() => {
  if (currentImageUri) {
    // Reset for new photo
    setAttemptHistory([]);
    setHasShownCalibrationHint(false);
  }
}, [currentImageUri]);
```

---

## Files to Modify

### `src/components/DimensionOverlay.tsx`
- Add state for attempt tracking
- Add detection logic
- Add hint UI component
- Integrate with measurement completion
- Integrate with point dragging

---

## Testing Checklist

- [ ] Place 2 distance lines in same spot → Hint appears
- [ ] Place 3 circles in same spot → Hint appears
- [ ] Tap hint → Dismisses gracefully
- [ ] Hint doesn't appear again for same photo
- [ ] New photo → Hint can appear again
- [ ] Measurements far apart → No hint
- [ ] Single measurement → No hint
- [ ] Quick adjustments (drag endpoint) → Counts as retry

---

## Edge Cases

### False Positives to Avoid
- **Intentional precise placement**: User places multiple lines to measure grid
  - *Solution*: Only trigger if measurements are deleted/adjusted
- **Different measurement types**: Mixing lines and circles in same area
  - *Solution*: Only count same measurement type
- **Long time between attempts**: User takes break
  - *Solution*: 20-second window

### Performance
- Clear old attempts from history (keep last 10)
- Debounce detection check
- Don't run on every render

---

## Future Enhancements (Optional)

1. **Show which calibration is active**: "Check your [COIN] calibration"
2. **Smart suggestion**: "Try a larger/smaller coin for this scale"
3. **Animation**: Point to recalibrate button with arrow
4. **Analytics**: Track how often hint is shown (helps understand UX issues)

---

## Next Steps

1. Implement basic attempt tracking
2. Add detection algorithm
3. Create hint UI component
4. Integrate with measurement flow
5. Test thoroughly
6. Polish animations

This is a sophisticated feature that will significantly improve UX for users with calibration issues! 🎯
