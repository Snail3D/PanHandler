# PanHandler - App Store Launch Guide

This guide will walk you through publishing your first app to the Apple App Store.

---

## Prerequisites

Before you begin, you'll need:

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   - It may take 24-48 hours for Apple to approve your account

2. **Physical iOS Device** (iPhone or iPad)
   - For testing and screenshots
   - Cannot use simulator for App Store submission

3. **macOS Computer** (required for final submission)
   - Xcode installed (free from Mac App Store)
   - Latest version recommended

---

## Phase 1: Prepare Your App

### 1.1 Update App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "name": "PanHandler",
    "slug": "panhandler",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.panhandler",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "PanHandler needs camera access to take photos of objects for measurement.",
        "NSPhotoLibraryUsageDescription": "PanHandler needs photo library access to save your measurement images.",
        "NSPhotoLibraryAddUsageDescription": "PanHandler needs permission to save measurement images to your photo library."
      }
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app needs access to your photos to save measurements.",
          "cameraPermission": "The app needs camera access to capture photos for measurement."
        }
      ]
    ]
  }
}
```

**Important fields:**
- `bundleIdentifier`: Must be unique (use reverse domain notation: `com.yourname.panhandler`)
- `version`: User-facing version number (increment for each release: 1.0.0, 1.1.0, 2.0.0)
- `buildNumber`: Internal build number (increment for each build: 1, 2, 3...)

### 1.2 Create App Icons and Screenshots

**App Icon Requirements:**
- 1024x1024 PNG (no transparency)
- Use: https://www.appicon.co/ to generate all sizes

**Screenshot Requirements:**
- iPhone 6.7" (1290 x 2796 pixels) - iPhone 14 Pro Max
- iPhone 6.5" (1242 x 2688 pixels) - iPhone 11 Pro Max
- iPad Pro 12.9" (2048 x 2732 pixels) - Optional but recommended

**Tips for Great Screenshots:**
1. Show the camera/calibration screen
2. Show measurement in action
3. Show the help modal
4. Show export options
5. Add marketing text overlay (optional)

Use: https://www.screenshot.rocks/ or https://www.shotsnapp.com/ for polished frames

---

## Phase 2: Test Your App

### 2.1 Test on Physical Device

Using Expo Go (Development):
```bash
# Start development server
bun start

# Scan QR code with your iPhone camera
# Test all features thoroughly
```

### 2.2 Create Development Build

For testing the actual app experience:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure your project
eas build:configure

# Create iOS development build
eas build --profile development --platform ios
```

Install the `.ipa` file on your device using TestFlight or direct installation.

---

## Phase 3: Build for Production

### 3.1 Create Production Build

```bash
# Create production build
eas build --profile production --platform ios
```

This will:
- Build your app on Expo's servers
- Generate an `.ipa` file ready for App Store submission
- Usually takes 10-20 minutes

### 3.2 Alternative: Build Locally (Advanced)

If you prefer to build locally:
```bash
# Generate iOS project files
npx expo prebuild --platform ios

# Open in Xcode
open ios/PanHandler.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as destination
# 2. Product > Archive
# 3. Wait for archive to complete
# 4. Click "Distribute App"
```

---

## Phase 4: App Store Connect Setup

### 4.1 Create App Listing

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"** > **"+"** > **"New App"**
3. Fill in details:
   - **Platform:** iOS
   - **Name:** PanHandler
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** (select the one you configured)
   - **SKU:** panhandler-001 (unique identifier for your reference)
   - **User Access:** Full Access

### 4.2 Complete App Information

**App Information:**
- **Name:** PanHandler
- **Subtitle:** Precision Measurement Tool
- **Category:** Primary: Utilities, Secondary: Productivity

**Pricing and Availability:**
- **Price:** Free (with in-app purchase for Pro)
- **Availability:** All countries

**App Privacy:**
1. Click **"App Privacy"** on the left sidebar
2. Click **"Get Started"**
3. Questions to answer:
   - Do you collect data from this app? **No** (unless you add analytics)
   - Does this app use third-party analytics? **No** (unless you add analytics)
4. Save

**In-App Purchases:**
1. Click **"In-App Purchases"** on left sidebar
2. Click **"+"** to create new
3. Type: **Non-Consumable**
4. Reference Name: **Pro User Lifetime**
5. Product ID: `com.yourcompany.panhandler.pro.lifetime`
6. Price: $9.99 (Tier 10)
7. Add localized descriptions:
   - Display Name: "Pro User - Lifetime"
   - Description: "Unlock unlimited measurements, remove watermarks, and get lifetime access to all features."
8. Review screenshot required (screenshot showing Pro features)
9. Submit for review

---

## Phase 5: Submit for Review

### 5.1 Version Information

1. Click **"App Store"** tab on left
2. Under **"iOS App"**, click **"1.0 Prepare for Submission"**

**Version Information:**
- **Screenshots:** Upload 3-5 screenshots per device size
- **Promotional Text:** (optional, can be updated without review)
  ```
  The fastest way to measure real-world objects with your iPhone camera!
  ```
- **Description:**
  ```
  PanHandler is a professional measurement app that uses your iPhone camera and a reference coin to measure real-world objects with incredible precision.

  KEY FEATURES:
  • Camera-based measurements using coin calibration
  • Multiple measurement types: distance, angles, circles, and rectangles
  • AUTO LEVEL mode for hands-free capture
  • Export to Fusion 360 with perfect scaling
  • Email comprehensive measurement reports
  • Zoom and pan for precise point placement
  • Color-coded measurements for easy identification
  • Save measurements for later reference

  PRO FEATURES:
  • Unlimited measurements per photo
  • Mix all measurement types
  • Remove watermarks from exports
  • Lifetime access - one-time payment

  PERFECT FOR:
  • CAD designers and engineers
  • DIY enthusiasts and makers
  • Home improvement projects
  • Product design and prototyping
  • Education and STEM projects

  HOW IT WORKS:
  1. Place a reference coin (quarter, penny, etc.) on the same surface as your object
  2. Take a photo using the built-in camera
  3. Calibrate by aligning the circle with your coin
  4. Place measurement points on your photo
  5. Export to CAD software or share via email

  Created by Snail, a 3D designer on a mission to make precision measurement accessible to everyone!
  ```

- **Keywords:** (max 100 characters, comma-separated)
  ```
  measurement,CAD,ruler,dimension,Fusion 360,calibration,engineering,3D,design,prototyping
  ```

- **Support URL:** Your website or YouTube channel
  ```
  https://youtube.com/@realsnail3d
  ```

- **Marketing URL:** (optional) Same as support URL

### 5.2 Build Selection

1. Click **"Build"** section (may show as missing)
2. After EAS build completes, click **"+"** or **"Select a build before you submit your app"**
3. Select your production build
4. Wait a few minutes for build to process

### 5.3 App Review Information

**Contact Information:**
- First Name: Your first name
- Last Name: Your last name
- Phone Number: Your phone number
- Email: Your email

**Demo Account:** (Not required for PanHandler)
- Leave blank unless your app requires login

**Notes:**
```
PanHandler is a measurement app that uses the device camera and a reference coin for calibration.

To test the app:
1. Allow camera and photo library permissions
2. Place a coin (US Quarter recommended) on a flat surface
3. Take a photo using the camera button
4. Select "US Quarter" from the calibration screen
5. Align the green circle with the coin edge
6. Tap "Lock In Calibration"
7. Switch to "Measure" mode and tap to place measurement points

The app includes an in-app purchase for Pro features ($9.99 lifetime). You can test the app fully without purchasing.
```

**Attachment:** (optional)
- If you have a demo video, upload it here

### 5.4 Version Release

- **Manually release this version:** Keep selected for first release
- You can change to automatic release in future updates

### 5.5 Final Checks

- **Age Rating:** Click "Edit" and answer questions
  - Likely result: 4+ (No objectionable content)
- **Copyright:** © 2025 [Your Name]
- **Routing App Coverage File:** Not applicable

### 5.6 Submit

1. Click **"Add for Review"** in top right
2. Review all information one final time
3. Click **"Submit to App Review"**

---

## Phase 6: Wait for Review

### Timeline
- **Initial Review:** 24-48 hours (sometimes faster)
- **Status Updates:** Check App Store Connect
- **Email Notifications:** Apple will email you with status changes

### Possible Statuses
1. **Waiting for Review:** In queue
2. **In Review:** Being reviewed (usually takes a few hours)
3. **Pending Developer Release:** Approved! Ready to release
4. **Ready for Sale:** Live on App Store 🎉

### If Rejected
- Don't panic! Very common for first-time submissions
- Read the rejection reason carefully
- Common issues:
  - Missing privacy policy
  - Unclear app functionality
  - Permission descriptions unclear
  - Screenshots don't show actual functionality
- Make the requested changes
- Resubmit (usually reviewed faster the second time)

---

## Phase 7: Post-Launch

### Monitor Performance
- **App Store Connect:** Analytics, downloads, ratings, reviews
- **TestFlight:** Continue testing updates before releasing
- **User Feedback:** Respond to reviews, fix bugs

### Update Process
1. Fix bugs or add features
2. Increment `buildNumber` in `app.json`
3. Increment `version` if user-facing changes (1.0.0 → 1.0.1)
4. Build new production version
5. Submit update through App Store Connect
6. Updates usually reviewed faster (often within 24 hours)

### Marketing
- Share on social media
- Post on Product Hunt
- YouTube tutorial videos
- Reddit communities (r/CAD, r/3Dprinting, r/DIY)
- Ask satisfied users for reviews

---

## Troubleshooting

### Build Fails
- Check all assets exist (icon, splash screen)
- Verify `bundleIdentifier` is unique
- Check for TypeScript errors: `npx tsc --noEmit`
- Review build logs in EAS

### TestFlight Issues
- Ensure Apple Developer account is active
- Check device is registered
- Verify provisioning profiles

### In-App Purchase Not Working
- Ensure product ID matches exactly
- Products must be "Ready to Submit" status
- Test in sandbox environment
- Sign in with sandbox test user

### Rejection for Metadata
- Add privacy policy URL (can be GitHub page)
- Clarify camera usage in description
- Ensure screenshots show actual app (no mockups)

---

## Resources

- **Apple Developer Portal:** https://developer.apple.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **EAS Documentation:** https://docs.expo.dev/eas/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/

---

## Cost Breakdown

- Apple Developer Program: $99/year
- Expo EAS Build: Free tier (100 builds/month) or $29/month for unlimited
- Total minimum: $99/year

---

## Next Steps After Launch

1. **Monitor** first reviews and downloads
2. **Respond** to user feedback
3. **Plan** feature updates
4. **Market** through your channels
5. **Iterate** based on user needs

---

**Congratulations on launching your first app! 🎉**

Remember: The first launch is just the beginning. Keep improving, listening to users, and shipping updates. Good luck with PanHandler!

---

*Need help? Feel free to reach out to Expo community: https://forums.expo.dev/*
