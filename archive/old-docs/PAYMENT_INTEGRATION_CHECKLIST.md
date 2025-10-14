# Payment Integration Checklist

## Overview
This document tracks all payment/upgrade touchpoints in PanHandler that need to be wired up to a real payment provider (App Store In-App Purchase, Google Play Billing, RevenueCat, etc.) before launch.

**Status:** 🔴 Mock implementation (shows alerts)  
**Required for Launch:** ✅ Must be completed before App Store/Play Store submission

---

## Payment Provider Options

### Recommended: RevenueCat
- ✅ Cross-platform (iOS + Android)
- ✅ Handles App Store + Play Store billing
- ✅ Subscription management
- ✅ Purchase restoration
- ✅ Analytics dashboard
- **Library:** `react-native-purchases`

### Alternative: Native Implementation
- iOS: `expo-in-app-purchases` or `react-native-iap`
- Android: Same libraries support both platforms
- More manual work, but no RevenueCat fees

---

## 1. Pro Upgrade Buttons

### Location 1: Inline Pro Modal (DimensionOverlay.tsx)
**File:** `/src/components/DimensionOverlay.tsx`  
**Lines:** ~5026-5035  
**Current Code:**
```typescript
<Pressable
  onPress={() => {
    setShowProModal(false);
    Alert.alert('Pro Upgrade', 'Payment integration would go here. For now, tap the footer 5 times fast to unlock!');
  }}
  style={...}
>
  <Text>Purchase Pro</Text>
</Pressable>
```

**Needs to be:**
```typescript
<Pressable
  onPress={async () => {
    setShowProModal(false);
    try {
      // RevenueCat example:
      const purchaseResult = await Purchases.purchaseProduct('pro_lifetime');
      if (purchaseResult.customerInfo.entitlements.active['pro'] !== undefined) {
        setIsProUser(true);
        Alert.alert('Success!', 'You are now a Pro user!');
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', error.message);
      }
    }
  }}
>
  <Text>Purchase Pro</Text>
</Pressable>
```

**SKU/Product ID:** `pro_lifetime` (or your chosen ID)  
**Price:** $9.97 one-time purchase

---

### Location 2: PaywallModal Component
**File:** `/src/components/PaywallModal.tsx`  
**Lines:** ~195-208  
**Current Code:**
```typescript
<Pressable
  onPress={handleUpgrade}
  style={...}
>
  <Text>Purchase Pro</Text>
</Pressable>
```

**Handler (lines 55-58):**
```typescript
const handleUpgrade = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  onUpgrade();
};
```

**Needs to be:**
Same RevenueCat integration as above, or pass through to parent component that handles purchase.

**Called from:** Help Modal when user taps "Upgrade to Pro" text

---

### Location 3: Help Modal Pro Section
**File:** `/src/components/HelpModal.tsx`  
**Lines:** ~1135-1145  
**Current Code:**
```typescript
<AnimatedText style={[{ 
  fontSize: 17,
  fontWeight: '800', 
  color: '#5856D6',
}, textPulseStyle]}>
  Upgrade to Pro
</AnimatedText>
```

**Action:** This is text, but when PaywallModal's `onUpgrade` is called, it triggers the purchase flow.

**Parent component needs to handle:** Setting `setShowProModal(true)` → PaywallModal → Purchase

---

## 2. Restore Purchase Buttons

### Location 1: Inline Pro Modal
**File:** `/src/components/DimensionOverlay.tsx`  
**Lines:** ~5037-5045  
**Current Code:**
```typescript
<Pressable
  onPress={() => {
    Alert.alert('Restore Purchase', 'Checking for previous purchases...\n\nThis would connect to your payment provider (App Store, Google Play, etc.)');
  }}
  style={...}
>
  <Text>Restore Purchase</Text>
</Pressable>
```

**Needs to be:**
```typescript
<Pressable
  onPress={async () => {
    try {
      // RevenueCat example:
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active['pro'] !== undefined) {
        setIsProUser(true);
        Alert.alert('Restored!', 'Your Pro purchase has been restored!');
      } else {
        Alert.alert('No Purchase Found', 'We could not find a previous Pro purchase for this account.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', error.message);
    }
  }}
>
  <Text>Restore Purchase</Text>
</Pressable>
```

---

### Location 2: PaywallModal Component
**File:** `/src/components/PaywallModal.tsx`  
**Lines:** ~221-241  
**Current Code:**
```typescript
<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }}
  style={...}
>
  <Text>Restore Purchase</Text>
</Pressable>
```

**Needs to be:**
Same restore logic as above.

---

## 3. Pro Status Check on App Launch

### Location: App.tsx or Root Component
**File:** `/App.tsx` or `/src/state/measurementStore.ts`  
**Current:** `isProUser: false` (hardcoded)

**Needs to be:**
```typescript
useEffect(() => {
  const checkProStatus = async () => {
    try {
      // RevenueCat example:
      const customerInfo = await Purchases.getCustomerInfo();
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      setIsProUser(isPro);
    } catch (error) {
      console.log('Error checking Pro status:', error);
      setIsProUser(false);
    }
  };
  
  checkProStatus();
}, []);
```

**Important:** Check on every app launch to handle:
- Purchase on one device, restore on another
- Subscription renewals (if you add subscriptions later)
- Family Sharing (if enabled)

---

## 4. Freehand Tool Access Control

### Location: Freehand Button Press
**File:** `/src/components/DimensionOverlay.tsx`  
**Lines:** ~4611-4624  
**Current Logic:**
```typescript
onPress={() => {
  if (!isProUser) {
    setShowProModal(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    return;
  }
  // Activate freehand...
}}
```

**Status:** ✅ Already wired up to `isProUser` state  
**Action needed:** Ensure `isProUser` is properly set after purchase (see #3 above)

---

## 5. Easter Egg: Footer Tap to Unlock (FOR TESTING ONLY)

### Location: Footer in DimensionOverlay
**File:** `/src/components/DimensionOverlay.tsx`  
**Search for:** "Tap 5 times fast"

**Current:** Allows developers to unlock Pro without payment  
**Before Launch:** 🔴 **MUST REMOVE** or disable in production builds

**Recommendation:**
```typescript
// Only enable in development
if (__DEV__) {
  // Show tap counter, unlock after 5 taps
}
```

---

## 6. Product Configuration

### App Store Connect (iOS)
1. Create In-App Purchase
2. Type: **Non-Consumable** (one-time purchase)
3. Product ID: `pro_lifetime` (or your choice)
4. Price: **$9.97 USD**
5. Display Name: "PanHandler Pro"
6. Description: "Unlock the Freehand measurement tool and all future Pro features"

### Google Play Console (Android)
1. Create In-App Product
2. Product ID: `pro_lifetime` (must match iOS)
3. Type: **One-time**
4. Price: **$9.97 USD**
5. Title: "PanHandler Pro"
6. Description: Same as iOS

---

## 7. RevenueCat Configuration (if using)

### Entitlements
- Create entitlement: **"pro"**
- Attach product: `pro_lifetime`
- Type: Non-subscription

### Products
- iOS: `pro_lifetime` (from App Store Connect)
- Android: `pro_lifetime` (from Google Play Console)

### API Keys
Add to `.env`:
```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
```

---

## 8. State Management

### Current Implementation
**File:** `/src/state/measurementStore.ts`  
**State:** `isProUser: boolean`

**Needs persistence:** ✅ Already persisted via AsyncStorage

**After successful purchase:**
```typescript
setIsProUser(true);
```

**After restore or app launch check:**
```typescript
const isPro = // check with payment provider
setIsProUser(isPro);
```

---

## Testing Checklist

### Before Launch
- [ ] Test purchase flow on real iOS device (sandbox)
- [ ] Test purchase flow on real Android device (sandbox)
- [ ] Test restore purchase (after reinstalling app)
- [ ] Test "Maybe Later" → doesn't charge user
- [ ] Test canceling purchase mid-flow
- [ ] Test offline behavior (graceful degradation)
- [ ] Test family sharing (if enabled)
- [ ] Verify Pro features unlock after purchase
- [ ] Verify free features still work without purchase
- [ ] **REMOVE/DISABLE easter egg unlock**

### Sandbox Testing
**iOS:** Create sandbox test accounts in App Store Connect  
**Android:** Add test email addresses in Google Play Console

---

## Code Locations Summary

| Feature | File | Line(s) | Status |
|---------|------|---------|--------|
| Purchase Button (Inline Modal) | `DimensionOverlay.tsx` | ~5026-5035 | 🔴 Mock |
| Purchase Button (PaywallModal) | `PaywallModal.tsx` | ~195-208 | 🔴 Mock |
| Restore Button (Inline Modal) | `DimensionOverlay.tsx` | ~5037-5045 | 🔴 Mock |
| Restore Button (PaywallModal) | `PaywallModal.tsx` | ~221-241 | 🔴 Mock |
| Pro Status Check | `App.tsx` | N/A | 🔴 Missing |
| Freehand Access Control | `DimensionOverlay.tsx` | ~4611-4624 | ✅ Ready |
| Easter Egg Unlock | `DimensionOverlay.tsx` | TBD | ⚠️ Remove |

---

## Recommended Implementation Order

1. **Set up payment provider** (RevenueCat or native)
2. **Create products** in App Store Connect + Play Console
3. **Add Pro status check** on app launch
4. **Wire up Purchase buttons** (both locations)
5. **Wire up Restore buttons** (both locations)
6. **Test thoroughly** in sandbox
7. **Remove easter egg** unlock
8. **Submit for review**

---

## Helpful Resources

### RevenueCat
- Docs: https://docs.revenuecat.com/docs/reactnative
- Setup Guide: https://www.revenuecat.com/docs/getting-started
- Sample Code: https://github.com/RevenueCat/react-native-purchases

### Native Implementation
- `react-native-iap`: https://github.com/dooboolab/react-native-iap
- Expo IAP: https://docs.expo.dev/versions/latest/sdk/in-app-purchases/

### App Store Guidelines
- In-App Purchase: https://developer.apple.com/app-store/review/guidelines/#in-app-purchase

---

**Last Updated:** October 14, 2025  
**Status:** Payment integration pending  
**Estimated Time:** 4-8 hours (with RevenueCat)
