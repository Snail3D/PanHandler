# 📸 Photo Flow & Critical Rules - DO NOT BREAK

## ⚠️ This document prevents catastrophic bugs in the photo/measurement flow

---

## 🔄 Complete Photo Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                              │
│                    (MeasurementScreen.tsx)                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │   CAMERA MODE       │ ← Default state on launch
            │   (React Native     │
            │    Vision Camera)   │
            └─────────┬───────────┘
                      │
         ─────────────┼─────────────
         │                         │
         ▼                         ▼
   ┌──────────┐            ┌──────────────┐
   │ Take Photo│            │ Gallery Button│
   │  Button   │            │              │
   └─────┬─────┘            └──────┬───────┘
         │                         │
         │                         ▼
         │              ┌──────────────────────┐
         │              │ Image Picker Opens   │
         │              │ (Expo ImagePicker)   │
         │              └──────┬───────────────┘
         │                     │
         │                     ▼
         │              ┌──────────────────────┐
         │              │ User Selects Photo   │
         │              │ Sets: photoUri state │
         │              └──────┬───────────────┘
         │                     │
         │                     ▼
         │              ┌──────────────────────────────┐
         │              │ PhotoTypeSelectionModal      │
         │              │ ⚠️ CRITICAL: Must render     │
         │              │    INSIDE camera mode JSX    │
         │              │    (line ~2214)              │
         │              └──────┬───────────────────────┘
         │                     │
         │              ┌──────┴──────────┐
         │              │                 │
         │              ▼                 ▼
         │         Table Shot         Wall Shot
         │              │                 │
         ▼              ▼                 ▼
   ┌─────────────────────────────────────────┐
   │  Photo Orientation Detection            │
   │  (DeviceMotionManager - beta angle)     │
   │  • beta < 45° = Table → Coin            │
   │  • beta ≥ 45° = Wall → Menu             │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ setImageUri(uri)     │ ← CRITICAL: Triggers state reset
          │ • Clears measurements │
          │ • Clears calibration  │
          │ • Clears zoom state   │
          │ • Sets isAutoCaptured │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  PHOTO/MEASUREMENT   │
          │       SCREEN         │
          │  (Photo displayed)   │
          └──────────┬───────────┘
                     │
         ────────────┼────────────
         │                       │
         ▼                       ▼
   ┌─────────────┐       ┌─────────────┐
   │ Table Shot  │       │ Wall Shot   │
   │ (Auto/User) │       │ (Auto/User) │
   └──────┬──────┘       └──────┬──────┘
          │                     │
          ▼                     ▼
   ┌─────────────┐       ┌─────────────┐
   │COIN CALIB   │       │   MENU      │
   │MODAL        │       │   OPENED    │
   └──────┬──────┘       └──────┬──────┘
          │                     │
          ▼                     │
   ┌─────────────┐              │
   │ User selects│              │
   │ coin size   │              │
   │ (Quarter,   │              │
   │  Penny, etc)│              │
   └──────┬──────┘              │
          │                     │
          ▼                     ▼
   ┌──────────────────────────────┐
   │ User places coin circle      │
   │ or chooses other option:     │
   │ • Map Scale (verbal)         │
   │ • Blueprint Mode (known pins)│
   │ • Manual (skip calibration)  │
   └──────────┬───────────────────┘
              │
              ▼
   ┌──────────────────────────┐
   │ CALIBRATION LOCKED       │
   │ • Green badge shows      │
   │ • pixelsPerUnit set      │
   │ • Ready to measure       │
   └──────────┬───────────────┘
              │
              ▼
   ┌──────────────────────────┐
   │ MEASUREMENT MODE         │
   │ • Distance, Angle, etc   │
   │ • Place points           │
   │ • Auto polygon detection │
   │ • Save/Email/Export      │
   └──────────────────────────┘
```

---

## 🚨 Critical Rules - NEVER VIOLATE THESE

### Rule #1: PhotoTypeSelectionModal Placement
**Location**: `MeasurementScreen.tsx` ~line 2214

```typescript
// ❌ WRONG - Outside camera mode return block
export default function MeasurementScreen() {
  // ...
  if (currentImageUri) {
    return <PhotoScreen />; // Early return
  }
  
  return (
    <View>
      {/* Camera UI */}
    </View>
  );
  
  // ❌ NEVER PUT MODAL HERE - It will never render!
  <PhotoTypeSelectionModal visible={!!photoUri} ... />
}

// ✅ CORRECT - Inside camera mode JSX
export default function MeasurementScreen() {
  // ...
  if (currentImageUri) {
    return <PhotoScreen />; // Early return
  }
  
  return (
    <View>
      {/* Camera UI */}
      
      {/* ✅ Modal INSIDE the return block */}
      <PhotoTypeSelectionModal 
        visible={!!photoUri} 
        onSelectType={handlePhotoTypeSelect}
        onClose={() => setPhotoUri(null)}
      />
    </View>
  );
}
```

**Why**: If modal is outside the return block or after an early return, React will never render it.

---

### Rule #2: Image URI State Reset
**Location**: `measurementStore.ts` ~line 145

```typescript
setImageUri: (uri, isAutoCaptured = false) => set((state) => { 
  // If setting a NEW image (not null), clear all measurements/calibration
  if (uri !== null) {
    return {
      currentImageUri: uri,
      isAutoCaptured,
      // ✅ MUST CLEAR EVERYTHING for new photo
      measurements: [],
      completedMeasurements: [],
      currentPoints: [],
      tempPoints: [],
      coinCircle: null,
      calibration: null,
      savedZoomState: null,
      imageOrientation: null,
      // Apply default unit system for new session
      unitSystem: state.defaultUnitSystem,
    };
  }
  
  // If setting to null (going back to camera), just clear calibration
  return {
    currentImageUri: null,
    isAutoCaptured: false,
    coinCircle: null,
    calibration: null,
    imageOrientation: null,
    savedZoomState: null,
  };
})
```

**Why**: Each photo is a new session. Old measurements/calibration must be cleared to prevent coordinate system mismatches.

---

### Rule #3: Photo Orientation Detection
**Location**: `MeasurementScreen.tsx` ~line 1500 (handlePhotoCapture)

```typescript
// ✅ CORRECT orientation logic
if (deviceMotion?.rotation?.beta !== undefined) {
  const beta = deviceMotion.rotation.beta * (180 / Math.PI); // Convert to degrees
  
  if (beta < 45) {
    // Table shot - phone looking DOWN
    photoType = 'table';
    console.log('📐 Table shot detected (beta < 45°)');
  } else {
    // Wall shot - phone looking FORWARD
    photoType = 'wall';
    console.log('📐 Wall shot detected (beta >= 45°)');
  }
}

// ❌ NEVER INVERT THIS - It was broken before
// ❌ WRONG: beta >= 45 = table (BACKWARDS!)
```

**Routing**:
- `table` → Coin calibration modal
- `wall` → Menu (user chooses mode)

---

### Rule #4: Session Color Propagation
**Flow**: Camera → MeasurementScreen → DimensionOverlay

```typescript
// Camera.tsx - Generate once per session
const [sessionColor] = useState(() => {
  const colors = [...]; // Color palette
  return colors[Math.floor(Math.random() * colors.length)];
});

// Pass down to MeasurementScreen
<MeasurementScreen sessionColor={sessionColor} />

// MeasurementScreen passes to DimensionOverlay
<DimensionOverlay sessionColor={sessionColor} />

// ✅ DimensionOverlay uses it for Help button, collapse menu, etc
backgroundColor: sessionColor ? `${sessionColor.main}dd` : 'rgba(100, 149, 237, 0.85)'
```

**Why**: Visual continuity. User sees consistent color throughout their session.

---

### Rule #5: Polygon Auto-Detection Trigger
**Location**: `DimensionOverlay.tsx` ~line 1680

```typescript
// ✅ MUST call after placing distance measurement
if (mode === 'distance') {
  detectAndMergePolygon([...measurements, newMeasurement]);
}

// ❌ NEVER remove this call or polygons won't auto-detect
```

**Validation**: Polygon must have area > 1 pixel² (not collinear)

```typescript
if (areaPx2 < 1) {
  // Points are in a straight line - invalid polygon
  showAlert('Invalid Polygon', 'All points are in a straight line. Please form a proper shape.', 'error');
  return; // Don't create polygon
}
```

---

### Rule #6: Modal Presentation Styles
**Location**: Various modal components

```typescript
// ✅ For overlays that need to dim/blur background
<Modal
  visible={visible}
  transparent
  animationType="fade"
  presentationStyle="overFullScreen" // ← CRITICAL for blur to work
>
  <BlurView intensity={90} tint="dark">
    {/* Modal content */}
  </BlurView>
</Modal>

// ❌ WRONG - Blur won't work without presentationStyle
<Modal visible={visible} transparent>
  <BlurView ... /> {/* Won't blur! */}
</Modal>
```

---

### Rule #7: Async Storage During Gestures
**NEVER write to AsyncStorage in high-frequency callbacks**

```typescript
// ❌ EXTREMELY BAD - Blocks JS thread
onUpdate: (e) => {
  setSavedZoomState({ scale: e.scale, ... }); // ← Writes to disk every frame!
}

// ✅ CORRECT - Debounce with 500ms+ delay
const debouncedSave = useRef<NodeJS.Timeout | null>(null);

onUpdate: (e) => {
  // Update state locally (fast)
  setLocalZoom(e.scale);
  
  // Debounce disk writes
  if (debouncedSave.current) clearTimeout(debouncedSave.current);
  debouncedSave.current = setTimeout(() => {
    setSavedZoomState({ scale: e.scale, ... }); // ← Writes to disk once after settling
  }, 500);
}
```

**See**: `NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md`

---

## 🐛 Common Bugs & Fixes

### Bug #1: Gallery Modal Doesn't Appear
**Symptom**: User selects photo from gallery, nothing happens

**Cause**: `PhotoTypeSelectionModal` rendered outside camera mode JSX

**Fix**: Move modal INSIDE camera mode return block (~line 2214)

---

### Bug #2: Photo Routing Inverted
**Symptom**: Table shots go to menu, wall shots go to calibration

**Cause**: Orientation detection logic inverted

**Fix**: Ensure `beta < 45` = table, `beta >= 45` = wall

**Working commit**: `26ac66b`

---

### Bug #3: Measurements Persist After New Photo
**Symptom**: Old measurements appear on new photo (wrong coordinates)

**Cause**: `setImageUri` not clearing measurements

**Fix**: In `measurementStore.ts`, ensure all measurement arrays cleared when `uri !== null`

---

### Bug #4: Help Button Wrong Color
**Symptom**: Help button uses hardcoded blue instead of session color

**Cause**: Not using `sessionColor` prop

**Fix**: `backgroundColor: sessionColor ? \`\${sessionColor.main}dd\` : 'rgba(100, 149, 237, 0.85)'`

---

### Bug #5: Polygon Detection Broken
**Symptom**: Distance lines don't auto-merge into polygons

**Cause**: `detectAndMergePolygon()` function removed OR not called after placing distance line

**Fix**: See `POLYGON_AUTO_DETECTION_CRITICAL_FEATURE.md`

**Restore**: `git checkout 3775fa5 -- src/components/DimensionOverlay.tsx`

---

### Bug #6: Blank Alert Modal During Measurement
**Symptom**: Blurred screen appears with no text, freezes interaction

**Possible Causes**:
1. **Collinear polygon detection**: 3+ distance lines in straight line triggers "Invalid Polygon" alert
2. **Alert text not rendering**: Title/message might be empty strings
3. **Modal stuck visible**: `alertConfig.visible` not resetting

**Fix**:
```typescript
// Option 1: Remove collinear validation (let user create invalid polygons)
// if (areaPx2 < 1) { ... } // Comment out

// Option 2: Only validate if area is EXACTLY zero (more forgiving)
if (areaPx2 === 0) { ... }

// Option 3: Increase threshold to allow very thin polygons
if (areaPx2 < 0.1) { ... }

// Option 4: Make sure alert is dismissible by tapping outside
<Pressable onPress={handleCancel}> {/* Tap outside to dismiss */}
```

**Debug**:
```typescript
console.log('🚨 Alert triggered:', title, message, type);
console.log('📐 Polygon area:', areaPx2);
```

---

## 🧪 Testing Checklist

### Photo Flow Tests

#### Test 1: Camera Capture
- [ ] Open app → Camera loads
- [ ] Tap capture → Photo routing works (table/wall)
- [ ] Table shot → Coin calibration modal appears
- [ ] Wall shot → Menu opens

#### Test 2: Gallery Import
- [ ] Tap gallery button
- [ ] Image picker opens
- [ ] Select photo
- [ ] PhotoTypeSelectionModal appears (NOT blank screen!)
- [ ] Select "Table Shot"
- [ ] Routes to coin calibration
- [ ] Select "Wall Shot"  
- [ ] Routes to menu

#### Test 3: Image State Reset
- [ ] Take photo #1
- [ ] Add measurements
- [ ] Calibrate
- [ ] Go back to camera
- [ ] Take photo #2
- [ ] Old measurements are GONE
- [ ] Calibration is RESET
- [ ] Fresh session

#### Test 4: Session Colors
- [ ] Take photo
- [ ] Note session color (random)
- [ ] Help button matches session color
- [ ] Collapse menu button matches
- [ ] Colors persist throughout session

#### Test 5: Polygon Detection
- [ ] Calibrate with coin
- [ ] Switch to Distance mode
- [ ] Draw 3 connected lines (triangle)
- [ ] Lines auto-merge into polygon
- [ ] Shows perimeter + area
- [ ] Success haptic plays

#### Test 6: Alert Modal
- [ ] Trigger an alert (e.g., invalid polygon)
- [ ] Modal has visible title
- [ ] Modal has visible message
- [ ] Modal has visible "OK" button
- [ ] Can tap outside to dismiss
- [ ] Can tap "OK" to dismiss
- [ ] Modal closes properly

---

## 📁 File Reference

### Key Files in Photo Flow

1. **`src/screens/MeasurementScreen.tsx`**
   - Main screen with camera/photo modes
   - Photo capture/gallery logic
   - Orientation detection
   - Modal rendering (CRITICAL placement!)

2. **`src/components/DimensionOverlay.tsx`**
   - Measurement tools
   - Polygon auto-detection
   - Alert modals
   - Session color usage

3. **`src/state/measurementStore.ts`**
   - Image URI state
   - Measurement persistence
   - Calibration state
   - State reset on new photo

4. **`src/components/PhotoTypeSelectionModal.tsx`**
   - Table/Wall shot selection
   - Triggered by gallery import

5. **`src/components/AlertModal.tsx`**
   - Glassmorphic alert design
   - Used for errors, confirmations

---

## 🔧 Emergency Restore Commands

### Restore Everything to Working State
```bash
cd /home/user/workspace
git checkout 3775fa5 -- src/components/DimensionOverlay.tsx
git checkout 3775fa5 -- src/screens/MeasurementScreen.tsx
```

### Check Current State
```bash
# Find PhotoTypeSelectionModal placement
rg "PhotoTypeSelectionModal" src/screens/MeasurementScreen.tsx -B 5 -A 2

# Verify polygon detection exists
rg "detectAndMergePolygon" src/components/DimensionOverlay.tsx

# Check session color usage
rg "sessionColor.*Help" src/components/DimensionOverlay.tsx -A 3
```

---

## 📊 State Flow Diagram

```
User Opens App
      │
      ▼
  Camera Mode
  (no photo)
      │
      ├─► Capture Photo ──► setImageUri(uri) ──┐
      │                                        │
      └─► Gallery Button ──► PhotoTypeModal ──┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │ measurementStore │
                                    │   .setImageUri() │
                                    └────────┬─────────┘
                                             │
                                             ▼
                                    Clear Everything:
                                    • measurements: []
                                    • calibration: null
                                    • coinCircle: null
                                    • savedZoomState: null
                                             │
                                             ▼
                                    Photo/Measurement Screen
                                    (Fresh session ready)
```

---

## 💡 Design Principles

### Why These Rules Exist

1. **Modal Placement**: React only renders what's in the return block
2. **State Reset**: Prevents coordinate system mismatches between photos
3. **Orientation Detection**: Provides smart automatic routing
4. **Session Colors**: Visual continuity improves UX
5. **Polygon Auto-Detection**: Power user feature, saves time
6. **AsyncStorage Throttling**: Prevents UI freezes/jank

---

## Last Updated
**Date**: October 18, 2025  
**Status**: ✅ ALL FLOWS WORKING  
**Tested**: Camera, gallery, routing, polygons, alerts  
**Commits**: 3775fa5 (base), 212d3a3 (docs), eea2bec (session notes)

---

## ⚠️ Before Making Changes

**Ask yourself**:
1. Will this affect photo capture or gallery import?
2. Will this change how images are stored/cleared?
3. Will this modify modal rendering?
4. Will this alter measurement state management?

**If YES to any**: Read this document first, test thoroughly, commit frequently.
