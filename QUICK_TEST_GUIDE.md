# 🎮 Quick Test Guide - New Features

## 3 New Haptic Sequences 🎵

### Test 1: Imperial March (Star Wars)
1. Open app
2. Go to Settings or Unit selector
3. Tap **"Imperial"** button
4. 🎵 **Feel**: DUN-DUN-DUN... dun-da-DUN... dun-da-DUN (9 beats, ~1s)

### Test 2: Metric Goes to 11 (Spinal Tap)
1. In same unit selector
2. Tap **"Metric"** button
3. 🎸 **Feel**: Rapid ascending scale of 11 beats (~0.5s)
4. Last 2 beats are HEAVY (THE ELEVEN!)

### Test 3: Dora "We Did It!" (Map Mode)
1. Take a photo
2. Enable Map Mode (set a scale)
3. Exit to camera, take another photo
4. Tap Map Mode button again (to activate with existing scale)
5. 🗺️ **Feel**: Light-Medium-Heavy-SUCCESS! (~300ms celebration)

---

## Map-Themed Label Examples 🗾

### Test:
1. Take a photo
2. Enable Map Mode + set scale
3. Tap **Save** or **Email**
4. In Label Modal, look at placeholder examples
5. ✅ **Should see**: Map-themed examples like:
   - "Map to Nowhere"
   - "Pirate Treasure Map"  
   - "Where I Parked"
   - "Dad's Shortcut"
6. ❌ **Should NOT see**: Maker examples like "3D Printer Nozzle"

---

## Pinch-Zoom Tutorial Animation 👆

### Test (Fresh Install):
1. **Reset tutorial flag** (see options below)
2. Take a photo
3. Open calibration screen
4. Wait ~1 second
5. ✅ **Should see**: 
   - Two white circle "fingers" appear
   - They pinch outward (zoom gesture)
   - Text: "Pinch to Zoom"
   - Animation plays twice
   - Fades out after ~3.5 seconds
6. Close and reopen calibration
7. ✅ **Should NOT see**: Tutorial again (only shows once)

### How to Reset Tutorial:
**Option A** (Easiest): Delete app and reinstall

**Option B**: Add this to any screen temporarily:
```javascript
import useStore from './src/state/measurementStore';
// In component:
useStore.getState().setHasSeenPinchTutorial(false);
```

**Option C**: Clear all data:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.removeItem('measurement-store');
```

---

## All Working? ✅

If all 5 features work:
- ✅ Imperial March haptic
- ✅ Metric "to 11" haptic  
- ✅ Dora Map Mode haptic
- ✅ Map-themed label examples
- ✅ Pinch tutorial (first time only)

**YOU'RE ALL SET!** 🎉

---

## Troubleshooting

**Haptics not working?**
- Check iPhone Settings → Sounds & Haptics → System Haptics (must be ON)
- Check device is not in Low Power Mode
- Requires iPhone 6s or newer (Taptic Engine)

**Tutorial not showing?**
- Check if `hasSeenPinchTutorial` is already `true` in store
- Try resetting (see options above)
- Check console for errors

**Map examples not showing?**
- Verify Map Mode is actually ON (blue highlighted button)
- Check LabelModal is receiving `isMapMode={true}` prop
- Try regular mode first to confirm examples work

---

🎮 Have fun with the new features!
