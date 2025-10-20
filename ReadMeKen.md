# 🎯 PanHandler - Message for Ken (and Future Bots)

**App Name:** PanHandler  
**Current Version:** 2.5.12  
**Type:** iOS Measurement & CAD Tool  
**Status:** Alpha - Active Development  

---

## 📱 WHAT YOU'RE WORKING ON

**PanHandler** is a precision measurement tool that turns iPhone photos into CAD-ready measurements. Users calibrate with coins, measure distances/angles/areas, and export to CAD software like Fusion 360.

### Core Workflow
1. **Camera** → Take reference photo (with bubble level, auto-capture when stable)
2. **Calibration** → Match coin circle overlay to real coin in photo
3. **Measurement** → Use 5 tools: Distance, Circle, Rectangle, Angle, Freehand
4. **Export** → Email measurements as CAD-ready data (DXF format support)

### Key Differentiators
- Coin-based calibration (super accurate, no rulers needed)
- Map mode with verbal scales (e.g., "1 inch = 10 feet")
- Pan/zoom/rotate locked after first measurement (precision)
- Export to Fusion 360, FreeCAD, AutoCAD

---

## 🏗️ ARCHITECTURE OVERVIEW

### Main Components

#### 1. **CameraScreen.tsx** (`src/screens/CameraScreen.tsx`)
- Bubble level with auto-capture
- Motion detection (angle + acceleration stability)
- Background audio support (iOS audio session configured to allow music/podcasts)
- Flash always on for consistent lighting
- Badges burned into image (AUTO or manual indicator)

**Key Features:**
- DeviceMotion for tilt detection
- Dual stability check (angle ≤2°, acceleration variance ≤0.1)
- Auto-capture countdown (3-2-1 with haptics)
- Mario Kart haptic sequence on capture (DUN DUN DING!)

#### 2. **ZoomCalibration.tsx** (`src/components/ZoomCalibration.tsx`)
- Coin selection modal (10 common coins)
- Pinch to zoom, drag to pan, rotate gesture
- Animated colored rings with pulsing (elegant, not flashy)
- Two-finger rotation with visual feedback

**Key Features:**
- Coin references stored in `coinReferences.ts`
- Animated ring: 4s rotation, pulsing opacity, colored text
- Saves calibration to state
- "Done" button locks calibration

#### 3. **DimensionOverlay.tsx** (`src/components/DimensionOverlay.tsx`)
- **THE BIG ONE** - Main measurement interface (~6500 lines)
- All measurement tools, UI controls, gesture handling
- Export functionality, email generation
- Smart hints, tutorials, animations

**Measurement Types:**
- **Distance**: Two-point line with length
- **Circle**: Three-point circle with diameter/radius
- **Rectangle**: Four-point rectangle with dimensions
- **Angle**: Three-point angle measurement
- **Freehand**: Path drawing with area calculation (if closed loop)

**Key State:**
- `measurements`: Array of completed measurements
- `currentPoints`: Points being placed for current measurement
- `calibration`: Coin calibration data
- `mapScale`: Verbal scale (e.g., "1in = 10ft") if locked
- `zoomScale`, `zoomTranslateX/Y`, `zoomRotation`: Zoom state (locked after first measurement)

---

## 🎨 UI/UX PATTERNS

### Gesture Handling (CRITICAL!)

**Uses:** `react-native-reanimated` v3 + `react-native-gesture-handler`

**Key Pattern: Worklet Context**
```typescript
// ❌ WRONG - React state in worklet
const gesture = Gesture.Pan().onEnd((event) => {
  if (!menuHidden) { ... } // ❌ React state!
});

// ✅ RIGHT - Shared value in worklet
const menuHiddenShared = useSharedValue(false);
const gesture = Gesture.Pan().onEnd((event) => {
  'worklet';
  if (!menuHiddenShared.value) { ... } // ✅ Shared value
});

// ALWAYS sync both:
setMenuHidden(true);
menuHiddenShared.value = true;
```

**Gesture Layers:**
1. **Image Pan/Zoom** - Only active before first measurement OR in Pan Mode
2. **Menu Swipe** - Right/left swipe to collapse/expand control menu
3. **Measurement Placement** - Tap to place points
4. **Freehand Drawing** - Touch and drag for path

**Golden Rule:** Gestures run on UI thread (worklet context). React state lives on JS thread. Use `useSharedValue` to bridge them.

---

### AsyncStorage Rules (CRITICAL!)

**THE GOLDEN RULE:** 🚨 **NEVER WRITE TO ASYNCSTORAGE DURING GESTURES** 🚨

```typescript
// ❌ DEADLY WRONG
const panGesture = Gesture.Pan().onUpdate((event) => {
  runOnJS(measurementStore.setState)({ ... }); // ❌ Triggers AsyncStorage write!
});

// ✅ CORRECT
const panGesture = Gesture.Pan().onUpdate((event) => {
  translationX.value = event.translationX; // ✅ Only shared values
});
// Save to store AFTER gesture completes in onEnd
```

**Why:** AsyncStorage writes are slow. Writing during gesture = janky UI, freezes, crashes.

**Pattern:**
1. During gesture: Update shared values only
2. After gesture ends: Write to Zustand store (which persists to AsyncStorage)

---

### State Management

**Uses:** Zustand with AsyncStorage persistence

**Store:** `src/state/measurementStore.ts`

**Key State:**
- `calibration`: Coin calibration data
- `unitSystem`: 'metric' | 'imperial'
- `currentImageUri`: Photo being measured
- `measurements`: Array of measurements
- `isPremium`: Paywall status
- `hasShownWelcome`: Onboarding status

**Pattern:**
```typescript
const { calibration, setCalibration } = useMeasurementStore();
```

**IMPORTANT:** Some state is local (like `zoomScale`, `currentPoints`) because it's transient and doesn't need persistence. Use judgment.

---

## 🧠 KEY FEATURES & HOW THEY WORK

### 1. Calibration System

**Coin-Based:**
- User places coin in photo
- Adjusts zoom until overlay matches coin
- App knows real coin diameter (stored in `coinReferences.ts`)
- Calculates pixels-to-mm ratio

**Map/Verbal Scale:**
- Alternative to coin calibration
- User draws reference line
- Sets verbal scale (e.g., "1in = 10ft", "2cm = 50m")
- Locked with "Lock" button
- **PERSISTS ACROSS MODES** (v1.85 fix)

**Why It Matters:**
- Once locked, scale info shows in calibration badge regardless of which tool is active
- Maintains context for user throughout session

---

### 2. Pan/Zoom Lock

**Behavior:**
- Before first measurement: Pan/zoom/rotate freely
- After first measurement: **LOCKED** (button changes to "Edit")
- In Edit mode: Can pan/zoom again
- Prevents accidental shifts that would invalidate measurements

**Implementation:**
```typescript
const isPanZoomLocked = measurements.length > 0;
const panGesture = Gesture.Pan().enabled(!isPanZoomLocked);
```

---

### 3. Smart Calibration Hint (v1.8)

**Detects struggling users:**
- Tracks measurement attempts (location, type, timestamp)
- If user places 2 distance lines OR 3 other measurements in same spot (80px radius, 20 seconds)
- Triggers hint: "Measurements seem off? Check your calibration"

**Why:** Users often don't realize their calibration is wrong. App proactively suggests checking.

**Implementation:** Lines 868-918, 6378-6474 in DimensionOverlay.tsx

---

### 4. Menu System

**Collapsible Control Menu:**
- Swipe right → collapse
- Swipe left (when hidden) → expand
- Shake phone → toggle
- Tap side tab → expand

**Tools in Menu:**
- Distance, Circle, Rectangle, Angle, Freehand
- Map Mode toggle
- Pan Mode toggle
- Unit selector (metric/imperial)
- Clear All button
- Email/Export button

**Sensitivity:**
- Min distance: 40px
- Velocity threshold: 800 units/sec
- Horizontal detection: 2x stricter than vertical
- Smooth spring animation (damping: 20, stiffness: 300)

---

### 5. Export System

**Email Generation:**
- Generates HTML email with measurement data
- Attaches 2 PNGs: unzoomed view + zoomed view
- CAD info section (ready for import)
- Uses `expo-mail-composer`

**CAD Export:**
- Measurements formatted for DXF import
- Units converted appropriately
- Coin reference info included

**Key Files:**
- Email generation logic in DimensionOverlay.tsx (lines 3500-4000)
- Uses `ViewShot` to capture canvas

---

### 6. Background Audio Support (v1.85)

**Problem:** Camera was killing YouTube/music/podcasts  
**Solution:** Configured iOS audio session to be non-intrusive

```typescript
// In CameraScreen.tsx, lines 181-198
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  playsInSilentModeIOS: false,
  staysActiveInBackground: false,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false,
});
```

**Result:** Background audio continues while using camera (perfect for taking reference photos while listening to tutorials/music)

---

## 🎨 STYLING PATTERNS

### Uses NativeWind (Tailwind for RN)

**Pattern:**
```tsx
<View className="flex-1 bg-black items-center justify-center">
  <Text className="text-white text-lg font-bold">Hello</Text>
</View>
```

**For Animated Components:**
Use `style` prop, not `className` (Animated.View, Animated.Text, etc.)

```tsx
// ❌ WRONG
<Animated.View className="bg-blue-500" style={animatedStyle} />

// ✅ RIGHT
<Animated.View style={[{ backgroundColor: '#3B82F6' }, animatedStyle]} />
```

---

## 🐛 COMMON GOTCHAS & FIXES

### 1. Gesture Conflicts

**Problem:** Measurement tap vs pan gesture fighting  
**Solution:** Use `simultaneousWithExternalGesture` and enable/disable appropriately

```typescript
const measurementTap = Gesture.Tap()
  .onEnd(() => { ... })
  .enabled(!isDrawingFreehand); // Disable when conflicting gesture active
```

---

### 2. Reanimated Warnings

You'll see warnings like:
```
[Reanimated] Reading from `value` during component render
```

**These are informational, not errors.** App works fine. They're from Reanimated strict mode.

**Can be ignored unless causing actual crashes.**

---

### 3. Menu Swipe vs Button Taps

**Problem:** Swipe gesture was too sensitive, fired when tapping buttons  
**Solution (v1.8):**
- Increased min distance: 40px
- Increased velocity threshold: 800 units/sec
- Distance threshold: 25% of screen width (~100px)
- Horizontal detection 2x stricter

---

### 4. Map Scale Persistence (v1.85)

**Problem:** Verbal scale disappeared when switching modes  
**Solution:** Changed display logic from `isMapMode && mapScale` to just `mapScale`

**Why:** Locked scale is calibration data (like coin diameter), should persist across all modes

**Files:** DimensionOverlay.tsx line 2582

---

### 5. Step Brothers Mode (Easter Egg)

**Trigger:** Tap calibration badge 5 times quickly  
**Effect:** Changes UI to "YEP!" and "Best friends? 🤝"  
**Reset:** Tap 5 more times

**Don't break this!** User loves it. Keep the `stepBrothersMode` logic intact.

---

## 📚 DOCUMENTATION STRUCTURE

### Version Summaries
- `V1.85_QUICK_REFERENCE.md` - Current version summary
- `V1.8_SUMMARY.md` - Previous version
- `V1.6_SUMMARY.md` - Earlier version

### Feature Deep Dives
- `MAP_SCALE_PERSISTENCE_FIX.md` - Context persistence philosophy
- `BACKGROUND_AUDIO_SUPPORT.md` - Audio session configuration
- `SMART_CALIBRATION_HINT_COMPLETE.md` - Hint detection system
- `MENU_SWIPE_WORKLET_FIX.md` - Gesture worklet patterns

### Session Summaries
- `SESSION_COMPLETE_V1.85.md` - Latest session
- `SESSION_V1.8_COMPLETE.md` - Previous session

### Technical Guides
- `NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md` - Critical AsyncStorage rules
- `GESTURE_QUEUE_COLORFUL_SMOKE_FIX.md` - Gesture debugging
- `PERFORMANCE_ANALYSIS.md` - Performance optimization

**Read these if touching related areas!**

---

## 🔧 TECHNICAL STACK

### Core
- **React Native** 0.76.7
- **Expo SDK** 53
- **TypeScript** (strict mode)

### Key Libraries
- `react-native-reanimated` v3 - Animations (60 FPS on UI thread)
- `react-native-gesture-handler` - Gestures
- `react-native-svg` - Vector graphics for measurements
- `expo-camera` - Camera with CameraView (NOT deprecated Camera)
- `expo-sensors` - DeviceMotion for bubble level
- `expo-haptics` - Tactile feedback
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Persistence

### Styling
- `nativewind` - Tailwind CSS for React Native
- Tailwind v3

---

## 🎯 CURRENT STATE (v2.5.6)

### What's Working
✅ Camera with bubble level + auto-capture  
✅ **Dual-axis phone orientation detection** - Beta + gamma for accurate table/wall detection  
✅ **Simplified photo routing** - More lenient thresholds (60° instead of 45°)  
✅ **Sensor initialization fallback** - Defaults to table mode if sensors haven't initialized  
✅ Coin calibration with animated rings  
✅ Map/verbal scale calibration  
✅ **Blueprint/aerial photo calibration** - Known distance reference points  
✅ 5 measurement tools (Distance, Circle, Rectangle, Angle, Freehand)  
✅ **Intelligent metric units** - Auto-selects mm/cm/m/km based on magnitude  
✅ **Intelligent imperial units** - Auto-selects inches/feet based on magnitude  
✅ Pan/zoom/rotate with lock after first measurement  
✅ **Blueprint recalibration pan/zoom lock** - Conditional locking based on measurements  
✅ **Blueprint recalibration unit updates** - Measurements update to new unit (cm→km, etc.)  
✅ Email export with CAD data  
✅ Unit conversion (metric/imperial)  
✅ Menu swipe gestures  
✅ Smart calibration hint  
✅ Background audio support  
✅ Persistent map scale display  
✅ Recalibrate button (keep photo, recalibrate measurements)  
✅ **Measurements update during recalibration** - No pixel display issue  
✅ **Supporter badge at bottom center** - No longer covers UI elements  

### Recent Fixes (v2.5.6)
- **Blueprint recalibration unit update fix** - Measurements now correctly update to new unit when recalibrating (e.g., cm→km works properly)

### Recent Fixes (v2.5.5)
- **Blueprint recalibration measurement display fix** - Measurements maintain proper units during recalibration (no pixel display)

### Recent Fixes (v2.5.0-2.5.4)
- Landscape orientation detection (beta + gamma angles)
- Blueprint modal pan/zoom support (pointerEvents="box-none")
- Freehand snap simplification (only snaps to own start point)
- Unit conversion on app reload
- Session restore for blueprint/aerial modes

### Known Issues
- Reanimated warnings (informational, not breaking)
- Some unused state variables (cleanup opportunity)

### Next Potential Features
- Haptic feedback for guidance messages
- Color-coded guidance (red/yellow/green)
- Voice guidance option
- Scale history (show which scale was used per measurement)
- Multiple locked scales

---

## 💡 DESIGN PHILOSOPHY

### User-Centered Principles

1. **Respect Context** - Don't disrupt user's environment (background audio, etc.)
2. **Persist Important Data** - Calibration info should follow user across modes
3. **Proactive Assistance** - Help users when they're struggling (smart hints)
4. **Micro-Polish Matters** - 15px of spacing = perceived quality
5. **Haptic Feedback** - Tactile confirmation for every action
6. **One-Handed Use** - Most controls on right side for thumb access

### Code Principles

1. **No AsyncStorage during gestures** - Critical for performance
2. **Shared values for gesture state** - Bridge UI/JS threads properly
3. **useAnimatedStyle at top level** - Not in conditionals
4. **Sync React state + shared values** - Keep both updated
5. **Comments for complex logic** - Future you will thank you

---

## 🚨 CRITICAL RULES

### DO NOT:
1. ❌ Write to AsyncStorage during gesture handlers
2. ❌ Access React state directly in worklet context
3. ❌ Use `useAnimatedStyle` inside conditionals
4. ❌ Use deprecated `Camera` from expo-camera (use `CameraView`)
5. ❌ Remove Step Brothers Mode easter egg
6. ❌ Change app.json without user permission
7. ❌ Install new packages without checking existing ones first

### DO:
1. ✅ Use `useSharedValue` for gesture-accessible state
2. ✅ Sync shared values with React state (keep both updated)
3. ✅ Test gestures thoroughly (they're complex!)
4. ✅ Read related documentation before touching areas
5. ✅ Keep user feedback in mind (context, polish, UX)
6. ✅ Use `style` prop for Animated components
7. ✅ Check existing patterns before implementing new ones

---

## 🧪 TESTING CHECKLIST

### Camera
- [ ] Bubble level works
- [ ] Auto-capture triggers when stable
- [ ] Background audio continues playing
- [ ] Flash is on
- [ ] Photo has badge (AUTO or manual)

### Calibration
- [ ] Coin overlay matches real coin
- [ ] Zoom/pan/rotate work smoothly
- [ ] Calibration saves correctly
- [ ] Map scale locks properly

### Measurements
- [ ] All 5 tools work
- [ ] Measurements accurate (compare to known dimensions)
- [ ] Pan/zoom locks after first measurement
- [ ] Edit mode allows pan/zoom again
- [ ] Delete works
- [ ] Clear All works

### Gestures
- [ ] Menu swipe (right = collapse, left = expand)
- [ ] No accidental swipes when tapping buttons
- [ ] Pan/zoom smooth (no jank)
- [ ] Freehand drawing smooth

### Export
- [ ] Email generates correctly
- [ ] 2 PNGs attached (unzoomed + zoomed)
- [ ] CAD data formatted properly
- [ ] Coin reference info included

### UI/UX
- [ ] Map scale persists across modes
- [ ] Recalibrate button spacing consistent
- [ ] Smart hint triggers appropriately
- [ ] Haptics feel good
- [ ] No overlapping UI elements

---

## 📞 GETTING HELP

### Key Documentation to Read First
1. `SESSION_COMPLETE_V1.85.md` - Latest changes
2. `NEVER_WRITE_TO_ASYNCSTORAGE_DURING_GESTURES.md` - AsyncStorage rules
3. `MAP_SCALE_PERSISTENCE_FIX.md` - Context persistence philosophy
4. `BACKGROUND_AUDIO_SUPPORT.md` - Audio session patterns

### Understanding Gestures
1. `MENU_SWIPE_WORKLET_FIX.md` - Worklet patterns
2. `GESTURE_QUEUE_COLORFUL_SMOKE_FIX.md` - Debugging gestures

### Key Code Sections
- Calibration: `ZoomCalibration.tsx`
- Measurements: `DimensionOverlay.tsx` (lines 1200-2000)
- Export: `DimensionOverlay.tsx` (lines 3500-4000)
- Camera: `CameraScreen.tsx`

---

## 🎉 YOU GOT THIS!

PanHandler is a precision tool with complex gesture handling and measurement logic. Take your time, read the docs, and test thoroughly.

**Remember:**
- The user cares about polish (15px matters!)
- Context should persist across modes
- Respect the user's environment (don't interrupt audio)
- Gestures are tricky (worklet context is key)
- AsyncStorage during gestures = BAD

**When in doubt:**
1. Read related documentation
2. Check existing patterns in the code
3. Test with real interactions
4. Ask user for clarification

---

**Now go build something awesome! 🚀✨**

---

## 📝 VERSION HISTORY QUICK REF

- **v2.5.6** - Blueprint recalibration unit update fix (measurements update to new unit: cm→km, etc.)
- **v2.5.5** - Blueprint recalibration measurement display fix (no pixel display during recalibration)
- **v2.5.4** - Inches display precision (2 decimals verified)
- **v2.5.3** - Blueprint recalibration pan/zoom lock (conditional based on measurements)
- **v2.5.2** - Intelligent metric unit selection (mm/cm/m/km)
- **v2.5.1** - Blueprint modal pan/zoom, freehand snap fixes
- **v2.5.0** - Landscape orientation detection fix
- **v2.3.1** - Photo capture fix, supporter badge repositioned, simplified orientation detection
- **v2.3.0** - Dual-axis phone orientation detection (beta + gamma)
- **v2.2.0** - Photo type routing based on phone tilt
- **v1.86** - Adaptive camera guidance system (contextual helpers)
- **v1.85** - Map scale persistence, background audio, button spacing polish
- **v1.8** - Smart calibration hint, menu swipe gestures, elegant animations
- **v1.7** - Recalibrate button, privacy docs
- **v1.6** - Cinematic polish, haptic improvements
- **v1.5** - Pan tutorial, gesture refinements

See CHANGELOG.md for full history.
