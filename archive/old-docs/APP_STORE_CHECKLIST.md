# ✅ Pre-Launch Checklist for PanHandler

Before you submit your app, make sure you have everything ready!

---

## 📋 Account Setup
- [ ] Apple Developer Account created ($99/year)
- [ ] Expo account created (free at https://expo.dev/signup)
- [ ] Logged into EAS CLI (`eas login` in terminal)

---

## 🔧 Technical Requirements
- [x] App version updated to 5.0.0 ✅
- [x] Bundle ID set: `com.snail.panhandler` ✅
- [x] App icon ready: `./assets/snail-logo.png` ✅
- [x] Camera permissions configured ✅
- [x] Photo library permissions configured ✅
- [ ] eas.json updated with your Apple IDs (see main guide)

---

## 🏪 App Store Connect Setup
- [ ] New app created in App Store Connect
- [ ] App name chosen (PanHandler or your preferred name)
- [ ] App Store Connect App ID saved
- [ ] Apple Team ID saved
- [ ] Privacy Policy created and URL ready
- [ ] Support URL ready (can be email: support@yourdomain.com)

---

## 📱 Marketing Materials
- [ ] App description written
- [ ] App keywords chosen
- [ ] Screenshots taken (at least 3 for iPhone 15 Pro Max size)
- [ ] Screenshots taken (at least 3 for iPhone 8 Plus size)
- [ ] App category selected (Productivity or Utilities recommended)

---

## 📄 Legal & Privacy
- [ ] Privacy Policy URL ready
- [ ] Terms of Service (optional but recommended)
- [ ] Age rating determined (likely 4+)
- [ ] Export compliance questions answered

**Privacy Quick Check:**
- Does your app collect user data? ❌ No
- Does your app transmit data? ❌ No  
- Does your app use encryption beyond standard HTTPS? ❌ No
- Does your app use camera/photos? ✅ Yes (but stored locally only)

---

## 💰 Monetization (If Applicable)
- [ ] Decide: Free, Paid, or Freemium?
- [ ] If in-app purchases: Set up in App Store Connect
- [ ] If subscriptions: Set up subscription groups

**Current Status:** Your app mentions "Pro" features. If you plan to charge:
- [ ] Implement Apple In-App Purchases (let me know if you need help!)
- [ ] Set up products in App Store Connect
- [ ] Test purchases in sandbox mode

---

## 🧪 Testing
- [ ] Test app on your iPhone
- [ ] Test all major features:
  - [ ] Camera capture works
  - [ ] Photo import works  
  - [ ] Calibration works
  - [ ] Measurements work
  - [ ] Label editing works (new in v5.0!)
  - [ ] Export works
- [ ] Test on different iPhone sizes if possible

---

## 🚀 Ready to Launch?

Once all items above are checked:

1. Run: `eas build --platform ios --profile production`
2. Wait for build to complete (~15-20 minutes)
3. Run: `eas submit --platform ios --profile production`
4. Complete App Store Connect information
5. Submit for review
6. Wait 24-48 hours for approval
7. 🎉 Your app goes live!

---

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/

---

## 🐛 Common First-Time Issues

### "Build Failed"
- Check that all packages are up to date
- Make sure app.json is valid JSON
- Check the build logs for specific errors

### "Missing Compliance"
- Answer the export compliance questions in App Store Connect
- For PanHandler: Select "No" for custom encryption

### "Metadata Rejected"
- Make sure screenshots match actual app features
- Ensure no placeholder text in descriptions
- Check that icon meets Apple guidelines (no transparency, correct size)

### "Binary Rejected"  
- Most common: App crashes on launch
- Test thoroughly before submission!
- Check crash logs in App Store Connect

---

## 💡 Pro Tips

1. **Submit Early in the Week**: Reviews are typically faster Tuesday-Thursday
2. **Perfect Your Screenshots**: They're the first thing users see!
3. **Write a Great Description**: First 2-3 lines are most important (appear before "more...")
4. **Use All Keywords**: You get 100 characters - use them!
5. **Respond Fast to Rejection**: If rejected, fix and resubmit quickly

---

## 📈 After Launch

- [ ] Monitor crash reports in App Store Connect
- [ ] Respond to user reviews
- [ ] Track downloads and engagement
- [ ] Plan updates and improvements
- [ ] Consider Android version (Google Play Store)

---

**Remember:** Every developer's first app submission is a learning experience. Don't worry if you get feedback from Apple - it's normal! Just make the requested changes and resubmit.

You've got this! 🚀
