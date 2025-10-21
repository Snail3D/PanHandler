# 🚀 Quick Start: Publish PanHandler in 30 Minutes

**No Xcode needed! EAS Build does it all in the cloud.**

---

## Step 1: Create Expo Account (2 min)
1. Go to https://expo.dev/signup
2. Sign up and verify email

---

## Step 2: Login from Terminal (1 min)
```bash
eas login
```
Enter your Expo credentials.

---

## Step 3: Set Up App Store Connect (5 min)

### A. Create New App
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Name**: PanHandler (or your choice)
   - **Language**: English
   - **Bundle ID**: com.snail.panhandler
   - **SKU**: panhandler2025 (or anything)
4. Click "Create"

### B. Get Your App ID
After creation, look at the URL:
```
https://appstoreconnect.apple.com/apps/1234567890/appstore
```
Save that number: **1234567890** ← This is your App ID

### C. Get Your Team ID
1. Go to https://developer.apple.com/account
2. Click "Membership"
3. Copy your **Team ID** (looks like ABC123XYZ)

---

## Step 4: Update eas.json (2 min)

Open `/home/user/workspace/eas.json` and replace:
```json
"appleId": "your-email@example.com",
"ascAppId": "1234567890",
"appleTeamId": "ABC123XYZ"
```

Save the file.

---

## Step 5: Build Your App (15 min)

Run this command:
```bash
eas build --platform ios --profile production
```

- Answer **YES** when asked about credentials
- Wait ~15 minutes for the build to complete
- You'll get a success message with a download link

---

## Step 6: Submit to App Store (2 min)

Run this command:
```bash
eas submit --platform ios --profile production
```

Done! Your app is uploaded to App Store Connect!

---

## Step 7: Fill Out App Store Info (10 min)

Go back to https://appstoreconnect.apple.com:

### Required Info:
1. **Screenshots**: Take 3-6 screenshots from your iPhone
2. **Description**: 
   ```
   PanHandler - Precise CAD measurements from photos. 
   
   Use coins for calibration, measure distances, angles, 
   and areas. Perfect for contractors, architects, and DIY enthusiasts.
   
   Features:
   • Coin-based calibration
   • Measure distances, angles & areas
   • Freehand drawing mode
   • Export to CAD
   • Imperial & metric units
   ```
3. **Keywords**: `CAD, measurement, blueprint, construction, architecture`
4. **Support URL**: Your email or website
5. **Privacy Policy**: Use https://www.privacypolicygenerator.info/ (free)
6. **Category**: Productivity
7. **Age Rating**: 4+

---

## Step 8: Submit for Review (1 min)

1. Click "Add for Review"
2. Click "Submit to App Review"
3. Wait 24-48 hours for approval
4. 🎉 Your app goes live!

---

## Troubleshooting

### Build Failed?
```bash
# Check build status
eas build:list

# View error logs
eas build:view [BUILD_ID]
```

### Need to rebuild?
```bash
eas build --platform ios --profile production
```

### Wrong info in eas.json?
Just edit the file and run `eas submit` again.

---

## That's It!

You don't need:
- ❌ Xcode
- ❌ A Mac
- ❌ Complex setup
- ❌ Code signing knowledge

EAS handles everything! 🎉

---

## Next: Android (Optional)

Want to publish on Google Play Store too?
```bash
eas build --platform android --profile production
eas submit --platform android --profile production
```

**Note:** You'll need a Google Play Developer account ($25 one-time fee)

---

## Questions?

- **EAS Docs**: https://docs.expo.dev/build/introduction/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **Ask me!** I'm here to help.
