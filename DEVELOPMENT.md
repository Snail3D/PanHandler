# 🛠️ PanHandler - Developer Guide

**Version:** Alpha v1.65+
**Last Updated:** 2025-10-26
**Status:** Production Ready

---

## 🚀 Quick Start

### Setup
```bash
# Install dependencies
bun install

# Start development server (runs automatically on port 8081)
bun start

# Type checking
bun tsc --noEmit

# Clear cache if needed
bun run clear-cache
```

### Environment
- **Platform:** React Native 0.79.2 / Expo SDK 53
- **Node:** Uses Bun (not npm)
- **Port:** 8081 (auto-managed)
- **Logs:** `/home/user/workspace/expo.log`

---

## 📐 How Measurements Work

### Core Calibration Formula
Everything hinges on this relationship:
```typescript
pixelsPerUnit = referencePixels / referenceRealWorldSize
```

#### Coin Calibration
```typescript
// User zooms until coin matches 260px diameter circle
const originalImageCoinDiameterPixels = (130 * 2) / userZoomScale;
const pixelsPerMM = originalImageCoinDiameterPixels / coinDiameterMM;
```

#### Map/Blueprint Calibration
```typescript
// User specifies scale (e.g., "1 inch = 10 feet")
const pixelsPerUnit = measuredPixels / knownDistance;
```

### Measurement Formulas

**Distance:**
```typescript
pixelDistance = √((x₂-x₁)² + (y₂-y₁)²)
realDistance = pixelDistance / pixelsPerUnit
```

**Angle:**
```typescript
angle = arccos(v1·v2 / (|v1|×|v2|))
// Where v1 and v2 are vectors from vertex to endpoints
```

**Circle:**
```typescript
radius = pixelRadius / pixelsPerUnit
area = πr²
circumference = 2πr
```

**Rectangle:**
```typescript
width = pixelWidth / pixelsPerUnit
height = pixelHeight / pixelsPerUnit
area = width × height
```

**Freehand/Polygon:**
```typescript
// Perimeter: sum of all segment distances
perimeter = Σ(distance between consecutive points)

// Area: Shoelace formula
area = |Σ(xᵢyᵢ₊₁ - xᵢ₊₁yᵢ)| / 2 / pixelsPerUnit²
```

---

## 🏗️ Architecture

### File Structure
```
src/
├── components/
│   ├── DimensionOverlay.tsx         # Main measurement UI (6000+ lines)
│   ├── CoinCalibration.tsx          # Zoom calibration interface
│   ├── CalibrationModal.tsx         # Coin selection modal
│   ├── HelpModal.tsx                # In-app guide
│   └── BattlingBotsModal.tsx        # Easter egg hints
├── screens/
│   ├── CameraScreen.tsx             # Photo capture + bubble level
│   └── MeasurementScreen.tsx        # Main container
├── state/
│   └── measurementStore.ts          # Zustand store (persistent)
├── utils/
│   ├── coinReferences.ts            # 650+ coin database
│   ├── unitConversion.ts            # Metric/Imperial conversions
│   ├── deviceScale.ts               # 1.2X tablet scaling
│   └── chuckNorrisJokes.ts          # Easter egg content
└── types/
    └── measurement.ts               # TypeScript types
```

### State Management (Zustand)

**measurementStore.ts** handles all app state:
```typescript
// Persistent state (AsyncStorage)
- calibration (pixelsPerMM, coin info)
- measurements (array of all measurements)
- photos (captured/imported images)
- settings (units, preferences)
- userEmail (for reports)

// Ephemeral state
- currentMode (distance, angle, circle, etc.)
- tempPoints (points being placed)
- selectedMeasurements (for editing)
```

**Critical Rule:** NEVER write to AsyncStorage during gestures or animations - it blocks the JS thread!

---

## 🎨 UI/UX Patterns

### Styling
- **Primary:** NativeWind (TailwindCSS for React Native)
- **Special Components:** Inline styles (LinearGradient, complex animations)
- **Colors:** Glassmorphic aesthetic with vibrant measurement colors

### Tablet Support
All UI scales 1.2X on iPad/Android tablets (automatic detection):
```typescript
import { scaleFontSize, scalePadding, scaleSize } from '@/utils/deviceScale';

fontSize: scaleFontSize(16)  // 16pt phone, 19pt tablet
padding: scalePadding(12)    // 12px phone, 14px tablet
```

### Animations
Use Reanimated v3 for all animations:
```typescript
// ✅ CORRECT
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

// ❌ WRONG - causes warnings
<View style={{ opacity: opacity.value }} />
```

### Gestures
- Pan/pinch on image: `react-native-gesture-handler`
- Always define animated styles at top level (never conditionally)
- Use `pointerEvents="box-none"` to allow touch passthrough

---

## 🐛 Common Issues & Solutions

### Memory Leaks
Always clean up timers and subscriptions:
```typescript
const timers: NodeJS.Timeout[] = [];

useEffect(() => {
  timers.push(setTimeout(() => { /* ... */ }, 1000));

  return () => {
    timers.forEach(timer => clearTimeout(timer));
  };
}, [deps]);
```

### Pressable Long-Press
Both events fire - prevent double triggers:
```typescript
const longPressedRef = useRef(false);

<Pressable
  onPress={() => {
    if (!longPressedRef.current) {
      // Normal press
    }
    setTimeout(() => longPressedRef.current = false, 100);
  }}
  onLongPress={() => {
    longPressedRef.current = true;
    // Long press action
  }}
  delayLongPress={800}
/>
```

### AsyncStorage Performance
NEVER write during gestures/animations:
```typescript
// ✅ CORRECT - debounced write after gesture ends
onEnd: () => {
  setTimeout(() => {
    setMeasurements(newMeasurements); // Zustand handles async write
  }, 100);
}

// ❌ WRONG - blocks UI thread
onUpdate: () => {
  setMeasurements(newMeasurements); // Writes on every frame!
}
```

### TypeScript Errors
```bash
# Full typecheck
bun tsc --noEmit

# Clear cache and rebuild
bun run clear-cache
```

---

## 🎯 Key Features

### Measurement Modes
1. **Distance** - Two points, straight line
2. **Angle** - Three points (start, vertex, end)
3. **Circle** - Center + edge point
4. **Rectangle** - Two opposite corners (snaps to axes)
5. **Freehand** - Custom paths, auto-detects closed polygons

### Calibration Methods
1. **Coin** - 650+ coins from 130+ countries
2. **Map/Blueprint** - Scale entry (e.g., "1:100")

### Special Features
- **Polygon Auto-Detection** - Closing freehand loops calculates area
- **Smart Snapping** - Measurements snap to horizontal/vertical
- **Unit Conversion** - Real-time metric/imperial switching
- **CAD Export** - DXF format for professional workflows
- **Email Reports** - Annotated photos with measurements

---

## 🎮 Easter Eggs

1. **Left Egg** - Tap left egg 7 times → Snail's YouTube
2. **Right Egg** - Tap right egg 7 times → Music video
3. **Chuck Norris** - Triple-tap Angle/Azimuth button → Random joke
4. **BattlingBots** - Long-press left egg 7 times → Hints modal

---

## 🚨 Critical Rules

### DO NOT:
- Write to AsyncStorage during gestures/animations
- Access `.value` outside `useAnimatedStyle` hooks
- Install packages with native code (JS-only packages are fine)
- Remove polygon auto-detection feature
- Break the photo flow (see archived PHOTO_FLOW_AND_CRITICAL_RULES.md)

### ALWAYS:
- Clean up timers/subscriptions in useEffect
- Use Zustand store for state (never local state for persistent data)
- Test on tablets (1.2X scaling)
- Use TypeScript strict mode
- Read expo.log for runtime debugging

---

## 📦 Dependencies

### Core
- React Native 0.79.2
- Expo SDK 53
- React 19.0.0

### Key Libraries
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Persistent storage
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Touch gestures
- `nativewind` - Styling
- `expo-audio` - Background audio config (replaced expo-av)
- `expo-camera` - Photo capture
- `expo-image-picker` - Gallery import

---

## 🔧 Debugging

### Check Logs
```bash
tail -f /home/user/workspace/expo.log
```

### Common Issues
- **Metro won't start:** Clear cache with `bun run clear-cache`
- **TypeScript errors:** Run `bun tsc --noEmit` to see all errors
- **Gesture not working:** Check z-index and `pointerEvents`
- **App freezing:** Look for AsyncStorage writes in hot paths
- **Animation stuttering:** Ensure worklet functions are marked properly

### Performance
- Use React DevTools Profiler for component re-renders
- Check for unnecessary useEffect dependencies
- Avoid inline function creation in render
- Memoize expensive calculations with useMemo

---

## 📱 Testing

### Manual Testing Checklist
- [ ] Take photo with camera
- [ ] Import photo from gallery
- [ ] Calibrate with coin
- [ ] Place each measurement type
- [ ] Edit existing measurements
- [ ] Recalibrate photo
- [ ] Export to email/photos/DXF
- [ ] Test on tablet (if available)

### Edge Cases
- Fresh install (no saved data)
- Background/foreground transitions
- Low memory conditions
- Rotation (locked to portrait)
- Dark mode (not supported yet)

---

## 🚀 Deployment

### Build for iOS
```bash
# Install EAS CLI
npm install -g eas-cli

# Build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### App Store Assets
- Icon: 1024x1024 PNG
- Screenshots: 6.5" and 5.5" iPhones
- Privacy policy URL (required)

---

## 📚 Resources

- **Archive:** `/archive/old-docs/` - Historical documentation
- **Sessions:** `/archive/sessions/` - Past development sessions
- **Backups:** `/archive/backups/` - Old code backups

For session-specific notes, check `CLAUDE.md` (updated each session).

---

**Made with ❤️ by Snail for PanHandler**
