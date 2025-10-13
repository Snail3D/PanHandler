# Reset to Fresh User Experience

**Purpose**: Reset PanHandler to experience it as a brand new user

## What Gets Reset

When you reset to fresh user state, all persisted data is cleared:

### ✅ User Preferences
- ❌ Email address (will be prompted on first email)
- ❌ Last selected coin (US Quarter will be default)
- ❌ Unit system preference (resets to Metric)
- ❌ Pro user status (resets to free tier)

### ✅ Measurements & Session Data
- ❌ Current photo/image
- ❌ All measurements
- ❌ Calibration data
- ❌ Coin circle placement
- ❌ Saved zoom/pan state

### ✅ Usage Tracking
- ❌ Session count (resets to 0)
- ❌ Monthly save count (resets to 0/10)
- ❌ Monthly email count (resets to 0/10)
- ❌ Rating prompt status
- ❌ Last rating prompt date

## How to Reset

### Method 1: Delete & Reinstall (Recommended)
```bash
1. Delete PanHandler app from device
2. Reinstall from TestFlight/App Store
3. App will start with fresh state
```

### Method 2: React Native Debugger
```javascript
// In Chrome DevTools or React Native Debugger console:
await AsyncStorage.clear();
// Then reload the app
```

### Method 3: Expo Development
```bash
# If using Expo development build
expo start --clear
```

### Method 4: Manual Clear (iOS Simulator)
```bash
# Reset iOS Simulator
xcrun simctl erase all

# Or for specific device
xcrun simctl erase [DEVICE_ID]
```

### Method 5: Device Settings (iOS)
```
Settings → General → iPhone Storage → PanHandler → Delete App
```

## Fresh User Experience

After resetting, you'll experience:

### 1️⃣ First Launch
- Welcome screen (if implemented)
- No saved email
- No measurements
- Default metric units
- Free tier limits (10 saves, 10 emails/month)

### 2️⃣ First Photo
- Camera permission prompt
- Photo capture
- Calibration tutorial (if first time)
- Coin selection modal

### 3️⃣ First Measurement
- Clean canvas
- No previous measurements
- Tutorial tooltips (if implemented)

### 4️⃣ First Save
- **Label Modal appears** with funny random examples
- User can enter label or skip
- Photo saves to library
- Counter: 1/10 saves used

### 5️⃣ First Email
- **Email Prompt Modal appears** (glassmorphic style)
- User enters email or skips
- Email composer opens
- Counter: 1/10 emails used

### 6️⃣ Second Save/Email
- **Label Modal pre-fills** with previous label (session persistence)
- **Email Modal doesn't appear** (email already saved)
- Much faster workflow

## Testing Checklist

Use this checklist to verify fresh user experience:

### ✅ Modals & UI
- [ ] Email prompt appears on first email attempt
- [ ] Label modal appears on first save/email
- [ ] Random funny examples show in label modal
- [ ] Help modal opens correctly
- [ ] Rating section visible in help modal

### ✅ Button Styling
- [ ] Label Modal: 💾 Save (glassmorphic) + Skip (transparent)
- [ ] Email Modal: 💾 Save (glassmorphic) + Skip (transparent)
- [ ] Both buttons match styling (watery background)

### ✅ Label Persistence
- [ ] First save: Label modal is empty
- [ ] Enter "Arduino Case"
- [ ] Second save: Label modal pre-fills with "Arduino Case"
- [ ] Take new photo: Label resets to empty

### ✅ Email Workflow
- [ ] First email: Prompt for email address
- [ ] Enter email and save
- [ ] Second email: No prompt (uses saved email)
- [ ] Subject line: "Arduino Case - Measurements" (if labeled)
- [ ] Email body shows color names: (Blue), (Green), (Red)

### ✅ Limits (Free User)
- [ ] Can save up to 10 times
- [ ] Can email up to 10 times
- [ ] Paywall appears at 11th attempt
- [ ] Counters reset monthly

## Storage Keys

AsyncStorage stores data under this key:
```
measurement-settings
```

Contents include:
```json
{
  "state": {
    "unitSystem": "metric",
    "lastSelectedCoin": "US Quarter",
    "userEmail": "user@example.com",
    "isProUser": false,
    "sessionCount": 5,
    "hasRatedApp": false,
    "monthlySaveCount": 3,
    "monthlyEmailCount": 2,
    "lastResetDate": "2025-10-13T12:00:00.000Z",
    "currentImageUri": "file://...",
    "calibration": {...},
    "coinCircle": {...},
    "measurements": [...],
    "savedZoomState": {...}
  },
  "version": 0
}
```

## Quick Reset Command

```bash
# For testing - clear storage key manually
cd /home/user/workspace
node -e "require('@react-native-async-storage/async-storage').default.clear()"
```

## Important Notes

1. **Session Persistence**: Labels persist within a photo session, but clear when taking a new photo
2. **Email Persistence**: Saved email persists forever (until app reinstall)
3. **Monthly Limits**: Reset automatically on the 1st of each month
4. **Coin Selection**: Last selected coin is remembered across sessions
5. **Zoom State**: Saved per photo session, cleared on new photo

## After Reset

You should see:
- ✅ **Clean slate** - no saved data
- ✅ **Email prompt** on first email
- ✅ **Fresh modals** with new styling
- ✅ **Random examples** in label modal
- ✅ **Glassmorphic buttons** (💾 Save + Skip)
- ✅ **Full free tier limits** (10/10 saves, 10/10 emails)

**Status**: Ready to test as a fresh user! 🎯
