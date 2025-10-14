# Save System Structure

## Overview
The save system in PanHandler allows users to export measurements and images to their device's photo library. It uses a two-step capture process similar to email, creating both a measurements photo and a CAD-style overlay photo.

## File Location
`/src/components/DimensionOverlay.tsx`

## System Flow

### 1. **User Initiates Save**
```typescript
const handleExport = async () => {
  setPendingAction('save');
  setShowLabelModal(true);
};
```
- User taps the blue "Save" button
- Sets pending action to `'save'`
- Shows `LabelModal` for optional item naming

### 2. **Label Modal Interaction**
**Component:** `LabelModal.tsx`
- User can enter a label (e.g., "Arduino Case")
- User can skip (label = null)
- On complete: calls `performSave(label)`

### 3. **Save Process Flow**
```typescript
const performSave = async (label: string | null) => {
  // Step 1: Request photo library permissions
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Please grant photo library access.');
    return;
  }
  
  // Step 2: Capture measurements image
  setIsCapturing(true);
  setCurrentLabel(label);
  await delay(600ms); // Wait for label to render
  const measurementsUri = await captureRef(externalViewRef.current, {
    format: 'jpg',
    quality: 0.9,
    result: 'tmpfile'
  });
  await MediaLibrary.createAssetAsync(measurementsUri);
  
  // Step 3: Capture CAD overlay (label only)
  setHideMeasurementsForCapture(true);
  setImageOpacity(0.5);
  await delay(600ms);
  const labelOnlyUri = await captureRef(externalViewRef.current, {
    format: 'png',
    quality: 1.0,
    result: 'tmpfile'
  });
  await MediaLibrary.createAssetAsync(labelOnlyUri);
  
  // Step 4: Reset states and show success
  setImageOpacity(1);
  setHideMeasurementsForCapture(false);
  setIsCapturing(false);
  setCurrentLabel(null);
  
  showToastNotification(label ? `"${label}" saved!` : 'Saved to Photos!');
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
```

## Two Photo Save System

### Photo 1: Measurements (JPG, 90% quality)
- **Shows:** Full photo with all measurements, labels, and annotations
- **Background:** Original photo at 100% opacity
- **Format:** JPG for smaller file size
- **Saved to:** Device photo library
- **Purpose:** Complete annotated photo for reference

### Photo 2: CAD Overlay (PNG, 100% quality)
- **Shows:** Label text only over semi-transparent photo (50% opacity)
- **Background:** Photo at 50% opacity (ghosted)
- **Format:** PNG for transparency support
- **Saved to:** Device photo library
- **Purpose:** Can be imported into CAD software as overlay

## State Management

### Key States
```typescript
const [isCapturing, setIsCapturing] = useState(false);
const [currentLabel, setCurrentLabel] = useState<string | null>(null);
const [hideMeasurementsForCapture, setHideMeasurementsForCapture] = useState(false);
const [pendingAction, setPendingAction] = useState<'save' | 'email' | null>(null);
```

### Capture Sequence States
1. **Normal View:**
   - `isCapturing = false`
   - `currentLabel = null`
   - `hideMeasurementsForCapture = false`
   - Image opacity = 100%

2. **Measurements Capture:**
   - `isCapturing = true`
   - `currentLabel = [user's label]`
   - `hideMeasurementsForCapture = false`
   - Image opacity = 100%

3. **CAD Overlay Capture:**
   - `isCapturing = true`
   - `currentLabel = [user's label]`
   - `hideMeasurementsForCapture = true`
   - Image opacity = 50%

4. **Cleanup & Success:**
   - Reset all states to normal
   - Show toast notification
   - Trigger success haptic

## Toast Notification

**Component:** Custom toast implemented in DimensionOverlay

**Appearance:**
- Green background with checkmark icon
- Displays label name if provided
- Fades in, stays briefly, fades out
- Non-blocking (doesn't require user action)

**Messages:**
- With label: `"Arduino Case" saved!`
- Without label: `Saved to Photos!`

## Permission Flow

### First Time Save
1. App requests `MediaLibrary` permissions
2. iOS shows system permission dialog
3. If granted: proceed with save
4. If denied: show alert explaining need for access

### Subsequent Saves
- Permissions are cached by iOS
- No additional prompts needed
- Instant save flow

## Error Handling

### Common Errors
1. **No Image:** User hasn't taken a photo yet
   - Alert: "No image to export. Please take a photo first."

2. **Permission Denied:** User declined photo library access
   - Alert: "Please grant photo library access."

3. **View Ref Lost:** Component unmounted during capture
   - Alert: "View lost during capture."
   - Cleanup: Reset all capture states

4. **Unknown Error:** Unexpected capture failure
   - Alert: Shows error message
   - Cleanup: Reset all capture states

### Error Recovery
```typescript
catch (error) {
  setIsCapturing(false);
  setCurrentLabel(null);
  setHideMeasurementsForCapture(false);
  if (setImageOpacity) setImageOpacity(1);
  Alert.alert('Save Error', `${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

## Visual Feedback

### During Save (600ms per capture)
1. **Measurements Capture:**
   - Label appears at bottom of screen
   - All measurements visible
   - Normal photo brightness

2. **CAD Overlay Capture:**
   - Label still visible
   - Measurements hidden
   - Photo dimmed to 50% opacity
   - Creates "ghost" effect for CAD import

### After Save
- Toast notification slides up from bottom
- Green checkmark animation
- Success haptic feedback
- UI returns to normal instantly

## Label Rendering

**Location:** Bottom center of captured image

**Format:**
```
[Label Text]
```

**Styling:**
- Font: Bold, 18pt
- Color: White with black stroke/shadow for readability
- Position: 20px from bottom, centered horizontally
- Background: Semi-transparent black pill shape

**Conditional Display:**
- Only shown when `currentLabel !== null`
- Visible in both photo captures
- Hidden after save completes

## Dependencies
- `expo-media-library` - Photo library access
- `react-native-view-shot` (captureRef) - Screenshot capture
- `expo-file-system` - Temp file handling
- `expo-haptics` - Success feedback
- `LabelModal.tsx` - Label input

## Pro Features
Currently, both Free and Pro users get same save functionality.

**Future considerations:**
- Watermark removal for Pro users
- Batch save multiple measurements
- Custom export formats

## Performance Notes

### Capture Timing
- **Total time:** ~1.2 seconds (600ms × 2 captures)
- **JPG compression:** Fast, small file size
- **PNG transparency:** Slower but necessary for CAD import

### Memory Management
- Uses `tmpfile` result type to avoid memory buildup
- Files automatically cleaned by iOS when no longer needed
- No manual cleanup required

### File Sizes (approximate)
- **Measurements JPG:** 200-800 KB (depends on photo complexity)
- **CAD Overlay PNG:** 1-3 MB (transparency requires more space)

---

**Last Updated:** Oct 14, 2025
**Status:** ✅ Working, tested, stable
