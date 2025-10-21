# 📱 Complete Guide: Publishing PanHandler to the Apple App Store

## What You Need

✅ Apple Developer Account ($99/year) - You already have this!  
✅ Your app built with Expo - You have this!  
✅ An Expo account (free) - We'll create this

---

## Step 1: Create an Expo Account

1. Go to https://expo.dev/signup
2. Sign up with your email
3. Verify your email

---

## Step 2: Login to EAS from Your Computer

Open your terminal and run:

```bash
eas login
```

Enter your Expo account credentials when prompted.

---

## Step 3: Configure Your App in App Store Connect

### 3.1 Go to App Store Connect
1. Visit https://appstoreconnect.apple.com
2. Login with your Apple Developer account
3. Click **"My Apps"**
4. Click the **"+"** button → **"New App"**

### 3.2 Fill Out the New App Form
- **Platform**: iOS
- **Name**: PanHandler (or whatever you want to call it publicly)
- **Primary Language**: English (or your preference)
- **Bundle ID**: Select "com.snail.panhandler" (this matches your app.json)
- **SKU**: Can be anything unique, like "panhandler-2025"
- **User Access**: Full Access

Click **"Create"**

### 3.3 Save Your App ID
After creation, you'll see a number in the URL like this:
```
https://appstoreconnect.apple.com/apps/1234567890/appstore
                                        ^^^^^^^^^^
```
That number (1234567890) is your **App Store Connect App ID** - save it!

---

## Step 4: Find Your Apple Team ID

1. Go to https://developer.apple.com/account
2. Click on **"Membership"** in the sidebar
3. You'll see **"Team ID"** - it looks like **ABC123XYZ**
4. Save this ID

---

## Step 5: Update Your eas.json File

Open `/home/user/workspace/eas.json` and replace:

```json
"appleId": "YOUR_APPLE_ID_EMAIL",           ← Your Apple ID email
"ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID", ← The number from Step 3.3
"appleTeamId": "YOUR_TEAM_ID"               ← The ID from Step 4
```

**Example:**
```json
"appleId": "john@example.com",
"ascAppId": "1234567890",
"appleTeamId": "ABC123XYZ"
```

---

## Step 6: Build Your App with EAS

Run this command in your terminal:

```bash
eas build --platform ios --profile production
```

### What Will Happen:
1. EAS will ask if you want to automatically manage credentials - **Say YES**
2. It will generate all the necessary certificates and profiles
3. It will build your app in the cloud (takes 10-20 minutes)
4. You'll get a link to download the `.ipa` file when done

---

## Step 7: Submit Your App to the App Store

Once the build is complete, run:

```bash
eas submit --platform ios --profile production
```

This will automatically upload your app to App Store Connect!

---

## Step 8: Fill Out App Store Information

Go back to App Store Connect (https://appstoreconnect.apple.com):

### 8.1 App Information
- **Name**: PanHandler
- **Subtitle**: Precise CAD measurements from photos
- **Privacy Policy URL**: (You'll need to create one - see note below)

### 8.2 Pricing and Availability
- Choose **Free** or set a price
- Select countries/regions

### 8.3 App Store Screenshots & Preview
You'll need:
- 6.7" screenshots (iPhone 15 Pro Max) - at least 3
- 5.5" screenshots (iPhone 8 Plus) - at least 3

**Tip**: You can use your phone to take screenshots while using the app!

### 8.4 App Description
```
PanHandler - Precise CAD measurements from photos. Use coins for calibration, 
measure distances, angles, areas, and export to CAD software.

Features:
• Coin-based calibration for accurate measurements
• Distance, angle, and area measurements
• Freehand drawing mode
• Export measurements to CAD software
• Support for imperial and metric units
```

### 8.5 Keywords
```
CAD, measurement, blueprint, construction, architecture, photo measurement
```

### 8.6 Support URL & Marketing URL
- You can use your personal website, GitHub repo, or create a simple landing page

---

## Step 9: Submit for Review

1. Make sure all required fields are filled
2. Click **"Add for Review"**
3. Click **"Submit to App Review"**

**Review Time**: Usually 24-48 hours

---

## Common Issues & Solutions

### Issue: "Missing Compliance Information"
**Solution**: 
1. Go to your app in App Store Connect
2. Answer the export compliance questions
3. For most apps: Select **"No"** for encryption (unless you added custom encryption)

### Issue: "Privacy Policy Required"
**Solution**: 
Create a simple one using a free generator:
- https://www.privacypolicygenerator.info/
- Or use https://app-privacy-policy-generator.nisrulz.com/

### Issue: "App Icon Missing"
**Solution**: 
Your app icon is already set in `app.json` at `./assets/snail-logo.png`

---

## Important Notes

### 📸 About Screenshots
If you need help generating perfect screenshots:
1. Use the iOS Simulator (if you have a Mac)
2. Or use your real iPhone and upload actual screenshots
3. Or use a tool like https://www.appure.io/ to create mockups

### 💰 About In-App Purchases
Your app mentions "Pro" features. If you're charging for these:
- You MUST use Apple's In-App Purchase system
- You'll need to set these up in App Store Connect
- Let me know if you need help with this!

### 🔒 Privacy & Permissions
Your app uses:
- Camera (for taking photos)
- Photo Library (for saving/loading)

Make sure to explain in App Store Connect:
- Why you need camera access
- Why you need photo library access
- That you don't collect or transmit user data

---

## Quick Commands Reference

```bash
# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

---

## Need Help?

If you get stuck at any step:
1. Check the Expo docs: https://docs.expo.dev/submit/ios/
2. Check App Store Connect Help: https://developer.apple.com/help/app-store-connect/
3. Ask me! I'm here to help.

---

## What's Next After Approval?

Once Apple approves your app:
1. It will say **"Ready for Sale"** in App Store Connect
2. You can click **"Release this Version"** to make it public
3. Your app will appear in the App Store within a few hours!

🎉 Congratulations on publishing your first app!
