# Android Crash Debugging Log

## Problem
App crashes immediately on Android with "app keeps closing" error. No crash logs visible in logcat.

## Timeline of Investigations

### Build History (Recent)
| Version Code | Commit | Time | Status | Result |
|-------------|---------|------|--------|---------|
| 21 | 0cdcbf1 | 8:44 PM | **BUILD FAILED** | Tried disabling New Architecture - Gradle error |
| 20 | 54ba065 | 8:05 PM | Built OK | **CRASHES on launch** (compressed icon + removed permissions) |
| 18 | 461b83d | 12:06 PM | Built OK | **CRASHES on launch** (6 AM build) |
| 16 | 7196f46 | 11:18 AM | Built OK | Unknown if crashes |
| 14 | 612e226 | 10:33 AM | Built OK | Unknown if crashes (icon update commit) |
| 12 | 2b495a6 | 9:59 AM | Built OK | Unknown if crashes |

## Attempted Fixes (FAILED)

### 1. Icon Compression (DIDN'T FIX)
- **Theory:** 1.3MB icon causing OutOfMemory crash
- **Action:** Compressed from 1.3MB to 225KB using pngquant
- **Commit:** c87a674
- **Result:** ❌ Still crashes (build 20)

### 2. Removed Deprecated Permissions (DIDN'T FIX)
- **Theory:** `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` causing issues
- **Action:** Removed deprecated Android storage permissions
- **Commit:** 54ba065
- **Result:** ❌ Still crashes (build 20)

### 3. Disable New Architecture (BROKE BUILD)
- **Theory:** React Native New Architecture incompatibility
- **Action:** Set `newArchEnabled: false` in app.json
- **Commit:** 0cdcbf1
- **Result:** ❌ Build failed with Gradle error (build 21)
- **Reverted:** Yes - New Architecture is required

## Key Observations

1. **No logcat output:** Running `logcat -d | grep -i -E "panhandler|FATAL"` shows nothing
   - This suggests crash happens VERY early (before logging initializes)
   - Or crash is in native layer

2. **Builds succeed:** The APKs build successfully, so it's a runtime crash

3. **Icon not the issue:** Even with compressed icon, still crashes

4. **Permissions not the issue:** Removing storage permissions didn't help

5. **New Architecture required:** Disabling it breaks the build

## Potential Remaining Causes

### High Priority
1. **Missing Android-specific configuration** in app.json or eas.json
2. **Native module incompatibility** - Check for modules that don't support New Architecture on Android
3. **Splash screen issue** - Using same image for icon and splash (pan-handler-logo.png)
4. **React Native 0.79.2 + Expo SDK 53** compatibility issue
5. **Patches breaking Android** - Check patches/react-native@0.79.2.patch

### Medium Priority
6. **Audio module (expo-av)** - Even though it worked before, could be issue
7. **Reanimated worklet** - Intro animation might crash on Android
8. **iOS-specific dependencies** leaking into Android build:
   - react-native-ios-context-menu (line 100 package.json)
   - react-native-ios-utilities (line 101 package.json)

### Questions to Answer
- ❓ Did build 14 (10:33 AM, 612e226) actually work on device?
- ❓ Did build 12 (9:59 AM, 2b495a6) work?
- ❓ What changed between working build and first crashing build?

## Next Steps

### Option A: Test Older Builds
1. Download and test build 14 (commit 612e226):
   - https://expo.dev/artifacts/eas/pW49mokgzmEVKRELh861XC.apk
2. Download and test build 12 (commit 2b495a6):
   - https://expo.dev/artifacts/eas/pDYfkEppEdHEYoFfFCfSrU.apk
3. If one works, diff the changes to find what broke

### Option B: Get Better Crash Logs
Try in Termux:
```bash
# Capture ALL logs during crash
logcat -c  # Clear first
# Open PanHandler (let it crash)
logcat -d > /sdcard/full_crash.txt
cat /sdcard/full_crash.txt | tail -500
```

Or try:
```bash
# Watch in real-time
logcat -v time "*:E" | tee /sdcard/crash_errors.txt
# Open PanHandler while this runs
```

### Option C: Check Patches
```bash
cat patches/react-native@0.79.2.patch
# Look for Android-specific changes that might break
```

### Option D: Simplify App.tsx
Comment out intro animation and test if basic app loads

## Useful Commands

### Check specific build details
```bash
bunx eas-cli build:view BUILD_ID
```

### Compare commits
```bash
git diff 2b495a6 612e226  # Compare working vs possibly broken
```

### Download specific build APK
Build 14: https://expo.dev/artifacts/eas/pW49mokgzmEVKRELh861XC.apk
Build 12: https://expo.dev/artifacts/eas/pDYfkEppEdHEYoFfFCfSrU.apk

---

**Last Updated:** Oct 22, 2025, 8:50 PM UTC
**Current Status:** Debugging - all fixes attempted so far have failed
**Current Commit:** 54ba065 (with icon + permission fixes)
