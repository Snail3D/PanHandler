# Email System Structure

## Overview
The email system in PanHandler allows users to export measurements and images via email. It uses a two-step capture process to create both a measurements photo and a CAD-style overlay photo.

## File Location
`/src/components/DimensionOverlay.tsx`

## System Flow

### 1. **User Initiates Email**
```typescript
const handleEmail = async () => {
  setPendingAction('email');
  setShowLabelModal(true);
};
```
- User taps the green "Email" button
- Sets pending action to `'email'`
- Shows `LabelModal` for optional item naming

### 2. **Label Modal Interaction**
**Component:** `LabelModal.tsx`
- User can enter a label (e.g., "Arduino Case")
- User can skip (label = null)
- On complete: calls `performEmail(label)`

### 3. **Email Composition Flow**
```typescript
const performEmail = async (label: string | null) => {
  // Step 1: Check email availability
  const isAvailable = await MailComposer.isAvailableAsync();
  
  // Step 2: Get user email (prompt if not stored)
  if (!userEmail) {
    // Show EmailPromptModal to get user's email
    setShowEmailPromptModal(true);
  }
  
  // Step 3: Capture measurements image
  setIsCapturing(true);
  setCurrentLabel(label);
  await delay(600ms); // Wait for label to render
  const measurementsUri = await captureRef(externalViewRef.current);
  
  // Step 4: Capture CAD overlay (label only)
  setHideMeasurementsForCapture(true);
  setImageOpacity(0.5);
  await delay(600ms);
  const labelOnlyUri = await captureRef(externalViewRef.current);
  
  // Step 5: Copy to cache with proper filenames
  const measurementsDest = `${label}_Measurements.jpg`;
  const labelOnlyDest = `${label}_Label.png`;
  
  // Step 6: Build email body
  let measurementText = buildEmailBody(label, measurements, calibration);
  
  // Step 7: Compose email
  await MailComposer.composeAsync({
    recipients: [userEmail],
    ccRecipients: [userEmail],
    subject: label ? `${label} - Measurements` : 'PanHandler Measurements',
    body: measurementText,
    attachments: [measurementsDest, labelOnlyDest]
  });
}
```

## Email Body Format

### Structure
```
[Label Name] - Measurements by PanHandler
========================================

Calibration: [Coin/Map Scale Info]
Unit: [Metric/Imperial]

Measurements:
[Value] ([Color])
[Value] ([Color])
...

Attached: 2 photos

[If not Pro: Watermark footer]
═══════════════════════════
Made with PanHandler for iOS
═══════════════════════════
```

### Example
```
Arduino Enclosure - Measurements by PanHandler
========================================

Calibration: 0.75in (US Quarter)
Unit: Imperial

Measurements:
3.25in (Blue)
2.10in x 1.50in (Green)
45.0° (Red)

Attached: 2 photos
```

## Two Photo Attachment System

### Photo 1: Measurements (JPG, 90% quality)
- **Shows:** Full photo with all measurements, labels, and annotations
- **Background:** Original photo at 100% opacity
- **Format:** JPG for smaller file size
- **Filename:** `[Label]_Measurements.jpg` or `Measurements.jpg`

### Photo 2: CAD Overlay (PNG, 100% quality)
- **Shows:** Label text only over semi-transparent photo (50% opacity)
- **Background:** Photo at 50% opacity (ghosted)
- **Format:** PNG for transparency support
- **Filename:** `[Label]_Label.png` or `Label.png`
- **Purpose:** Can be imported into CAD software as overlay

## State Management

### Key States
```typescript
const [isCapturing, setIsCapturing] = useState(false);
const [currentLabel, setCurrentLabel] = useState<string | null>(null);
const [hideMeasurementsForCapture, setHideMeasurementsForCapture] = useState(false);
const [userEmail, setUserEmail] = useState<string | null>(null);
const [showEmailPromptModal, setShowEmailPromptModal] = useState(false);
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

4. **Cleanup:**
   - Reset all states to normal

## Email Prompt Modal

**Component:** `EmailPromptModal.tsx`

**When shown:** First time user attempts to email (no stored email)

**Purpose:** 
- Collect user's email address
- Store in Zustand state with AsyncStorage persistence
- Pre-fill email recipient field

**Flow:**
```typescript
if (!userEmail) {
  await new Promise((resolve) => {
    const handleEmailComplete = (email: string | null) => {
      if (email?.trim()) {
        setUserEmail(email.trim());
      }
      setShowEmailPromptModal(false);
      resolve();
    };
    
    (window as any)._emailPromptHandlers = { handleEmailComplete };
    setShowEmailPromptModal(true);
  });
}
```

## Error Handling

### Common Errors
1. **No Image:** User hasn't taken a photo yet
2. **Email Not Available:** Device has no email app configured
3. **View Ref Lost:** Component unmounted during capture
4. **Permission Denied:** User declined photo library access

### Error Recovery
- All errors reset capture states
- User-friendly Alert messages
- Maintains app stability

## Dependencies
- `expo-mail-composer` - Email composition
- `react-native-view-shot` (captureRef) - Screenshot capture
- `expo-file-system` - File operations
- `expo-haptics` - Success feedback
- `LabelModal.tsx` - Label input
- `EmailPromptModal.tsx` - Email collection

## Pro Features
**Free users:** Get watermark footer in email body
**Pro users:** No watermark

---

**Last Updated:** Oct 14, 2025
**Status:** ✅ Working, tested, stable
