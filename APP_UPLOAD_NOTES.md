# PanHandler - Project Context & Quick Start Guide

## Project Overview
**PanHandler** is a React Native measurement app (Expo SDK 53) that turns smartphones into precision measurement tools using coin-based calibration. Currently building APKs with EAS (Expo Application Services).

- **Package Manager:** Bun
- **Platforms:** iOS (primary), Android
- **Owner:** snail3d
- **Bundle ID (iOS):** com.snail.panhandler
- **Package (Android):** com.snail.panhandler
- **Version:** Check app.json for current version

## Developer Accounts
- ✅ **Apple Developer Account** - Active
- ✅ **Google Play Developer Account** - Active
- ✅ **EAS Account** - User: snail3d

## Quick Start - SSH Session Setup

### 1. Check Git Status
```bash
cd /home/user/workspace
git status
git log --oneline -5
```

### 2. Login to EAS (Required for Builds)
```bash
# Check if logged in
bunx eas-cli whoami

# If not logged in, use one of these methods:
bunx eas-cli login                    # Interactive (enter credentials)
bunx eas-cli login --web              # Browser-based login
bunx eas-cli login --token YOUR_TOKEN # Token-based (get from expo.dev)
```

### 3. Verify EAS Configuration
```bash
cat eas.json    # Check build profiles
cat app.json    # Check app configuration
```

## Recent Critical Fixes (Oct 22, 2025)

### Issue #1: Android Crash on Launch (FIXED ✅)
- **Problem:** App crashed immediately on Android with "app keeps closing"
- **Root Cause:** Oversized app icon (1.3MB) causing OutOfMemory error during startup
- **Solution:** Compressed icon to 225KB (83% reduction) using pngquant
- **Commit:** `c87a674` - "Fix Android crash by compressing oversized app icon"

### Issue #2: Repeated Permission Prompts on Android (FIXED ✅)
- **Problem:** Android kept asking for storage permissions every time user entered coin calibration
- **Root Cause:** Deprecated `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` permissions (Android 13+)
- **Solution:** Removed deprecated permissions, letting Expo modules handle their own permissions
- **Commit:** `54ba065` - "Remove deprecated Android storage permissions causing repeated prompts"

### Check Build Status
Use these commands to check latest commit and build status:
```bash
git log --oneline -3  # View recent commits
bunx eas-cli build:list --platform android --limit 3  # View recent builds
```
- **Build Dashboard:** https://expo.dev/accounts/snail3d/projects/panhandler/builds

## Common EAS Commands

### Check Build Status
```bash
# List recent builds
bunx eas-cli build:list --platform android --limit 5
bunx eas-cli build:list --platform ios --limit 5

# Check specific build
bunx eas-cli build:view BUILD_ID
```

### Create New Build
```bash
# Android production build
bunx eas-cli build --platform android --profile production --non-interactive

# iOS production build
bunx eas-cli build --platform ios --profile production --non-interactive

# Development build (for testing)
bunx eas-cli build --platform android --profile development
```

### Cancel Build
```bash
bunx eas-cli build:cancel BUILD_ID
```

### Submit to Stores
```bash
# Submit to Google Play
bunx eas-cli submit --platform android

# Submit to App Store
bunx eas-cli submit --platform ios
```

## Build Profiles (from eas.json)

```json
{
  "development": {
    "distribution": "internal",
    "android": { "gradleCommand": ":app:assembleDebug" },
    "ios": { "buildConfiguration": "Debug" }
  },
  "preview": {
    "distribution": "internal"
  },
  "production": {
    "autoIncrement": true  // Auto-increments version codes
  }
}
```

## Project Structure Quick Reference

```
/home/user/workspace/
├── src/
│   ├── screens/           # Main UI (MeasurementScreen, etc.)
│   ├── components/        # 30+ React components
│   ├── state/            # Zustand store (MMKV persistence)
│   ├── api/              # Claude, OpenAI, Grok integrations
│   └── utils/            # Helpers, coin database, conversions
├── assets/               # Icons, images (keep icons < 500KB!)
├── App.tsx              # Root component with intro animation
├── app.json             # Expo config (IMPORTANT for builds)
├── eas.json             # EAS build config
├── package.json         # Dependencies
└── .env                 # API keys (not in git)
```

## Troubleshooting

### "Not logged in" Error
```bash
bunx eas-cli login
```

### "Build failed" - Check Logs
```bash
# Get build logs URL
bunx eas-cli build:list --platform android --limit 1

# Or visit directly
# https://expo.dev/accounts/snail3d/projects/panhandler/builds
```

### Android App Crashes on Launch
- Check icon file size: `ls -lh assets/*.png` (should be < 500KB)
- Check permissions in app.json (avoid deprecated storage permissions)
- Check build logs for native module errors

### Permission Issues
- **Android:** Only use `CAMERA` permission in app.json, let Expo modules handle the rest
- **iOS:** Permissions defined in `ios.infoPlist` section of app.json

## Important Notes

### Audio Session Code
The app has `Audio.setAudioModeAsync()` configuration in App.tsx (lines 39-58). This is NOT causing crashes - it's been in working builds. It's configured to allow background music/YouTube to continue playing.

### Icon Requirements
- **Android:** Keep under 500KB (ideally < 250KB)
- **iOS:** Keep under 1MB
- Use pngquant for compression: `bunx pngquant --quality=65-80 --force --output OUTPUT.png INPUT.png`

### Git Workflow
```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Your message"
git push

# EAS builds from latest commit on remote, so ALWAYS push before building!
```

## Key Dependencies to Know

- **Zustand + MMKV:** State management with fast persistence
- **React Native Reanimated v3:** Smooth animations
- **NativeWind:** Tailwind CSS for React Native
- **Expo Camera, Image Picker, Media Library:** Media handling
- **Anthropic, OpenAI, Grok SDKs:** AI integrations
- **React Navigation v7:** Navigation stack

## Environment Variables

API keys stored in `.env` using pattern:
```bash
EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY
EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY
EXPO_PUBLIC_VIBECODE_GROK_API_KEY
EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY
EXPO_PUBLIC_VIBECODE_ELEVENLABS_API_KEY
```

Access in code: `process.env.EXPO_PUBLIC_VIBECODE_*`

## Testing Checklist After New Build

After creating a new Android build, verify:
1. ✅ App launches without crashing (icon should be < 500KB)
2. ✅ No repeated permission prompts (only CAMERA permission in app.json)
3. ✅ Camera/photo access works properly
4. ✅ Measurements save and export correctly

---

**Active Branch:** main
**Check current status:** `git status && git log --oneline -3`
