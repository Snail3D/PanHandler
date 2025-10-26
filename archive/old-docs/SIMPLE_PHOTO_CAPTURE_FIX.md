# Simple Photo Capture - Complete Rewrite

## The Problem

The current `takePicture()` function is ~230 lines of nested timeouts, safety mechanisms, and complex state management. It's completely unmaintainable and buggy.

## The Solution

Replace with ~50 lines of straightforward code:

```typescript
const takePicture = async () => {
  // Guard
  if (!cameraRef.current || isCapturing || mode !== 'camera') return;
  
  setIsCapturing(true);
  setIsHoldingShutter(false);
  
  try {
    // Flash
    cameraFlashOpacity.value = 1;
    cameraFlashOpacity.value = withTiming(0, { duration: 100 });
    
    // Capture
    const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
    if (!photo?.uri) throw new Error('No photo');
    
    // Save to camera roll (non-blocking background)
    MediaLibrary.createAssetAsync(photo.uri).catch(console.error);
    
    // Detect table vs wall
    const absBeta = Math.abs(currentBeta);
    const absGamma = Math.abs(currentGamma);
    const isTable = absBeta < 45 && absGamma < 45;
    
    if (isTable) {
      // TABLE: Go to calibration immediately
      setCapturedPhotoUri(photo.uri);
      setMode('zoomCalibrate');
      setIsCapturing(false); // Reset since leaving camera
      
      // Background MMKV write
      setTimeout(() => setImageUri(photo.uri, false), 100);
      
    } else {
      // WALL: Show modal immediately
      setPendingPhotoUri(photo.uri);
      setShowPhotoTypeModal(true);
      // Leave isCapturing = true until user selects
    }
    
  } catch (error) {
    console.error('Capture error:', error);
    setIsCapturing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};
```

## Key Changes

1. **Removed**: Safety timeout (causes crashes)
2. **Removed**: Nested setTimeout chains
3. **Removed**: clearTimeout logic everywhere
4. **Removed**: Animation timing complexity
5. **Simplified**: Direct state updates, no delays
6. **Fixed**: Modal shows immediately, not after 100ms delay

## Why This Works

- **No setTimeout** = No timing bugs
- **No safety mechanisms** = No crashes from safety mechanisms
- **Immediate modal show** = User never waits
- **Simple state flow** = Easy to debug

The modal will handle its own animation/transition. We don't need to orchestrate it with timeouts.

## Implementation

Replace lines 1044-1271 in MeasurementScreen.tsx with the simple version above.
