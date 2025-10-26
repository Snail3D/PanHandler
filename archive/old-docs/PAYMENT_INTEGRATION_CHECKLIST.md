# Payment Integration Checklist for v2.0

## Overview
This document outlines everything needed to integrate in-app purchases for the Pro upgrade feature in PanHandler.

---

## Current Payment Touchpoints in the App

### 1. **Special Offer Banner** (Session 50-52)
- **File**: `src/screens/MeasurementScreen.tsx`
- **Triggers**: Sessions 50, 51, 52 for free users
- **Prices**: $6.97 → $5.97 → $4.97
- **Action**: Tap banner to dismiss (needs upgrade button)

### 2. **Pro Modal in Control Menu**
- **File**: `src/components/DimensionOverlay.tsx` (lines ~5566-5700)
- **Trigger**: Tap "Tap for Pro Features" footer
- **Price**: $9.97 (regular price)
- **Action**: Currently shows comparison chart only

### 3. **Freehand Tool Paywall**
- **File**: `src/components/DimensionOverlay.tsx`
- **Trigger**: Trying to use Freehand tool as free user
- **Shows**: Pro modal with comparison chart

### 4. **Help Modal Easter Egg**
- **File**: `src/components/HelpModal.tsx` (lines ~2124-2164)
- **Trigger**: Tap right egg emoji 10 times
- **Action**: Toggle Pro/Free for testing (keep this for testing!)

---

## Store Setup Requirements

### Apple App Store (iOS)
- [ ] **Apple Developer Account** ($99/year)
- [ ] **App Store Connect** setup
- [ ] **In-App Purchase Products** created:
  - Product ID: `com.panhandler.pro` (or similar)
  - Type: Non-Consumable (one-time purchase)
  - Pricing tiers:
    - Regular: $9.97
    - Special Offer 1: $6.97
    - Special Offer 2: $5.97
    - Special Offer 3: $4.97
- [ ] **Bank/Tax info** configured
- [ ] **Test users** created for sandbox testing

### Google Play Store (Android)
- [ ] **Google Play Console** account ($25 one-time)
- [ ] **In-App Products** created:
  - Product ID: `pro_upgrade` (or similar)
  - Type: Managed Product (one-time)
  - Pricing: Same as iOS
- [ ] **Merchant account** linked
- [ ] **Test users** added for testing

---

## Recommended Library: React Native IAP

### Installation
```bash
bun add react-native-iap
```

### Why React Native IAP?
- Unified API for iOS and Android
- Active maintenance and community support
- Handles receipt validation
- Works with Expo (via custom dev client if needed)
- Good TypeScript support

### Documentation
- GitHub: https://github.com/dooboolab/react-native-iap
- Docs: https://react-native-iap.dooboolab.com/

---

## Implementation Plan

### Phase 1: Setup (Before coding)
1. Create in-app purchase products in App Store Connect
2. Create in-app products in Google Play Console
3. Set up test accounts on both platforms
4. Install `react-native-iap` package

### Phase 2: Core Purchase Flow
**File to create**: `src/api/purchases.ts`

```typescript
import * as RNIap from 'react-native-iap';

// Product IDs (match store configuration)
export const PRODUCT_IDS = {
  PRO_REGULAR: 'com.panhandler.pro',
  PRO_OFFER_1: 'com.panhandler.pro.offer1', // $6.97
  PRO_OFFER_2: 'com.panhandler.pro.offer2', // $5.97
  PRO_OFFER_3: 'com.panhandler.pro.offer3', // $4.97
};

// Initialize IAP connection
export const initializeIAP = async () => {
  try {
    await RNIap.initConnection();
    // Get available products
    const products = await RNIap.getProducts(Object.values(PRODUCT_IDS));
    return products;
  } catch (error) {
    console.error('IAP initialization error:', error);
  }
};

// Purchase product
export const purchaseProduct = async (productId: string) => {
  try {
    const purchase = await RNIap.requestPurchase({ sku: productId });
    // Handle successful purchase
    return purchase;
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
};

// Restore purchases (for users who reinstall)
export const restorePurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases;
  } catch (error) {
    console.error('Restore error:', error);
  }
};
```

### Phase 3: Wire Up UI Components

#### Special Offer Banner (`src/screens/MeasurementScreen.tsx`)
- Add "Get Pro Now" button to banner
- Button triggers purchase with appropriate product ID based on session
- Show loading state during purchase
- Update `isProUser` on success

#### Pro Modal (`src/components/DimensionOverlay.tsx`)
- Replace placeholder "Upgrade" button with real purchase button
- Trigger `purchaseProduct(PRODUCT_IDS.PRO_REGULAR)`
- Handle success/error states
- Show "Restore Purchases" option for reinstalls

#### Store State (`src/state/measurementStore.ts`)
- Already has `isProUser` boolean ✅
- Add: `purchaseReceipt` (string | null) for validation
- Add: `purchaseDate` (string | null) for tracking

### Phase 4: Receipt Validation (CRITICAL for security)

**Option A: Server-side validation (Recommended)**
- Set up backend API to validate receipts with Apple/Google
- Prevents hacking/piracy
- More secure but requires server

**Option B: Client-side validation (Quick but less secure)**
- Use `react-native-iap` built-in validation
- Easier to implement
- Less secure (can be bypassed)

### Phase 5: Testing

**File to create**: `src/utils/testPurchases.ts`

```typescript
// Test script for purchase flow
export const testPurchaseFlow = async () => {
  console.log('🧪 Testing IAP Flow...');
  
  // 1. Initialize
  const products = await initializeIAP();
  console.log('✅ Products loaded:', products);
  
  // 2. Test purchase (sandbox)
  try {
    const purchase = await purchaseProduct(PRODUCT_IDS.PRO_REGULAR);
    console.log('✅ Purchase successful:', purchase);
  } catch (error) {
    console.log('❌ Purchase failed:', error);
  }
  
  // 3. Test restore
  const restored = await restorePurchases();
  console.log('✅ Restored purchases:', restored);
};
```

**Add test button in Help Modal (dev only)**:
```tsx
{__DEV__ && (
  <Pressable onPress={testPurchaseFlow}>
    <Text>🧪 Test IAP Flow</Text>
  </Pressable>
)}
```

---

## Testing Checklist

### iOS Testing
- [ ] Test purchase with sandbox account
- [ ] Test "Cancel" flow
- [ ] Test "Payment Failed" flow
- [ ] Test "Restore Purchases"
- [ ] Test purchase on real device (not simulator)
- [ ] Verify receipt validation
- [ ] Test interrupted purchase (app crash during purchase)

### Android Testing
- [ ] Test purchase with test account
- [ ] Test "Cancel" flow
- [ ] Test "Payment Failed" flow
- [ ] Test "Restore Purchases"
- [ ] Test on real device
- [ ] Verify receipt validation
- [ ] Test interrupted purchase

### Cross-Platform Testing
- [ ] Purchase on iOS, reinstall on iOS → restore works
- [ ] Purchase on Android, reinstall on Android → restore works
- [ ] Verify free users can't access Freehand tool
- [ ] Verify Pro users CAN access Freehand tool
- [ ] Test all 4 price points (regular + 3 special offers)
- [ ] Verify special offer expires after session 52

---

## Edge Cases to Handle

1. **Purchase interrupted** (app crashes mid-purchase)
   - Handle pending transactions on app restart
   - Use `finishTransaction()` properly

2. **User reinstalls app**
   - Provide "Restore Purchases" button
   - Check for existing purchases on app launch

3. **Refund requested**
   - Listen for refund events
   - Revoke Pro access if refunded

4. **Network errors**
   - Show user-friendly error messages
   - Retry logic for failed requests

5. **Multiple devices**
   - Same Apple/Google account = Pro on all devices
   - Receipt validation ensures this works

6. **Subscription vs One-Time**
   - Current plan: One-time purchase (Non-Consumable)
   - Consider subscription model for recurring revenue?

---

## Store Submission Requirements

### App Store (iOS)
- [ ] App privacy policy URL (required for IAP)
- [ ] Screenshots showing Pro features
- [ ] Clear description of what Pro includes
- [ ] Pricing visible in app listing

### Google Play (Android)
- [ ] Same as iOS
- [ ] Content rating (adjust for app type)
- [ ] Proper permissions in AndroidManifest.xml

---

## Revenue Tracking (Optional but Recommended)

### Analytics to Track
- Number of free users
- Conversion rate (free → Pro)
- Which price point converts best
- Average time to purchase
- Special offer effectiveness

### Tools
- RevenueCat (recommended - handles IAP + analytics)
- Mixpanel
- Firebase Analytics
- Custom backend

---

## Security Considerations

1. **Never store product IDs as strings in plain sight**
   - Use environment variables or secure config

2. **Always validate receipts**
   - Server-side validation preferred
   - Prevents "Lucky Patcher" style hacks

3. **Obfuscate Pro checks**
   - Don't just check `isProUser` boolean
   - Cross-reference with receipt validation

4. **Handle jailbroken/rooted devices**
   - Consider using `jail-monkey` package to detect
   - Decide policy for modified devices

---

## Code Locations to Update for v2.0

### Files to Create
- [ ] `src/api/purchases.ts` - IAP logic
- [ ] `src/utils/testPurchases.ts` - Test script
- [ ] `src/components/PurchaseButton.tsx` - Reusable purchase button component

### Files to Modify
- [ ] `src/screens/MeasurementScreen.tsx` - Add purchase button to special offer banner
- [ ] `src/components/DimensionOverlay.tsx` - Wire up Pro modal purchase button
- [ ] `src/state/measurementStore.ts` - Add purchase receipt tracking
- [ ] `App.tsx` - Initialize IAP on app launch, check for restored purchases
- [ ] `app.json` - Add IAP permissions/config if needed

### Files to Test
- [ ] All payment flows work in sandbox
- [ ] Error handling works correctly
- [ ] Loading states look good
- [ ] Success/failure messages are clear

---

## Launch Day Checklist

- [ ] Switch from sandbox to production mode
- [ ] Verify products are live in both stores
- [ ] Test one real purchase (refund immediately after)
- [ ] Monitor error logs closely
- [ ] Have "Restore Purchases" support ready
- [ ] Customer support plan for payment issues

---

## Future Enhancements (Post v2.0)

- [ ] Subscription model (monthly/yearly)
- [ ] Family Sharing support (iOS)
- [ ] Promotional codes
- [ ] Limited-time sales
- [ ] Referral program
- [ ] Gift purchases

---

## Questions to Answer Before Implementation

1. **Single product or multiple?**
   - Option A: 1 product, dynamic pricing client-side (easier)
   - Option B: 4 products (regular + 3 offers) - (more complex, more control)

2. **Server-side validation?**
   - Do we need a backend for receipt validation?
   - Or use third-party service like RevenueCat?

3. **Subscription vs One-Time?**
   - Current plan: One-time ($4.97-$9.97)
   - Alternative: Monthly ($2.99/mo) or Yearly ($19.99/yr)

4. **Free trial?**
   - Offer 7-day free trial before charging?

5. **Family Sharing?**
   - Allow purchases to be shared across family group?

---

## Contact Info for Support

- Apple Developer Support: https://developer.apple.com/contact/
- Google Play Support: https://support.google.com/googleplay/android-developer/
- React Native IAP Discord: [Link in their GitHub]

---

## Notes

- Current app is 100% client-side (no backend)
- May need simple backend for receipt validation
- Consider Firebase for easy backend setup
- Or use RevenueCat (handles everything but costs money)

**Status**: Ready for implementation when payment setup is complete! 🚀
