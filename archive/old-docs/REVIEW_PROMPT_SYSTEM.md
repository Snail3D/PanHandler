# Review Prompt System

## Overview
PanHandler includes a tasteful review prompt system that asks users to rate the app at strategic moments. The system is designed to be respectful and non-intrusive.

## Implementation Date
October 14, 2025

## Prompt Timing

### First Prompt: After 20 App Opens
- **When:** User has opened the app 20 times
- **Why:** They've demonstrated consistent usage and value
- **Result:** Either they rate, or we ask again later

### Second Prompt: After 50 App Opens
- **When:** User has opened the app 50 times (if they dismissed the first prompt)
- **Why:** They're a power user who might have forgotten
- **Result:** Final ask, never again after this

### Maximum Prompts: 2
- We will NEVER ask more than twice
- Once user rates, we never ask again
- Once we've asked twice, we never ask again

## System Architecture

### State Management
**Location:** `src/state/measurementStore.ts`

**Tracked Values:**
```typescript
sessionCount: number;           // Total app opens (incremented each launch)
reviewPromptCount: number;      // How many times we've shown the prompt (0, 1, or 2)
hasReviewedApp: boolean;        // True if user tapped "Rate" button
lastReviewPromptDate: string | null;  // ISO date of last prompt
```

**Methods:**
```typescript
incrementSessionCount()         // Called on every app launch
incrementReviewPromptCount()    // Called when we show the prompt
setHasReviewedApp(boolean)      // Called when user taps "Rate"
setLastReviewPromptDate(date)   // Called when we show the prompt
```

### Logic Flow
**Location:** `App.tsx`

**On App Launch:**
1. Increment `sessionCount`
2. Check conditions:
   - Has user already reviewed? → Exit
   - Have we asked twice already? → Exit
   - Is session count 20 AND prompt count 0? → **Show prompt**
   - Is session count 50 AND prompt count 1? → **Show prompt**
3. If showing prompt, wait 3 seconds (for intro to finish)
4. Display `RatingPromptModal`

**When User Taps "Rate":**
1. Close modal
2. Set `hasReviewedApp = true`
3. Increment `reviewPromptCount`
4. Record `lastReviewPromptDate`
5. Call `StoreReview.requestReview()` (native iOS/Android prompt)
6. Never ask again

**When User Taps "Maybe Later":**
1. Close modal
2. Increment `reviewPromptCount`
3. Record `lastReviewPromptDate`
4. Will ask again at next milestone (if under 2 prompts)

## User Experience

### Modal Appearance
**Component:** `RatingPromptModal.tsx`

**Design:**
- Watery glassmorphic aesthetic (matches app design)
- BlurView with semi-transparent white background
- Bouncy scale-in animation
- Gold star icon (⭐️)

**Content:**
```
┌─────────────────────────────────┐
│         [Gold Star Icon]        │
│                                 │
│    Enjoying PanHandler?         │
│                                 │
│  Your feedback helps us improve │
│  and reach more users who need  │
│  precise measurements!          │
│                                 │
│  [Rate on App Store ⭐️]        │
│  [Maybe Later]                  │
└─────────────────────────────────┘
```

### Native Review Flow
After tapping "Rate," iOS/Android shows their native review UI:
- **iOS:** In-app review sheet (star rating + optional text)
- **Android:** Google Play review sheet
- User never leaves the app
- Seamless experience

## Platform Compliance

### iOS App Store Guidelines ✅
- ✅ Uses native `StoreReview.requestReview()` API
- ✅ Maximum 3 prompts per 365 days (we only ask twice total)
- ✅ iOS controls actual prompt display
- ✅ Prevents spam by respecting system throttles

### Google Play Guidelines ✅
- ✅ Uses native In-App Review API
- ✅ Respectful timing (20+ uses = engaged user)
- ✅ Maximum 2 prompts total (very conservative)

### Key Points
- **Apple controls display:** Even if we call the API, iOS may not show it if user reviewed recently
- **Google controls display:** Android may throttle prompts
- **No rejections:** Using native APIs = approved method

## Testing

### Development Testing
```typescript
// Temporarily override values in measurementStore.ts for testing:
sessionCount: 19,  // Will prompt on next launch
reviewPromptCount: 0,
hasReviewedApp: false,
```

### Reset for Testing
```typescript
// In Expo Go or development build, clear AsyncStorage:
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

### Production Behavior
- Native review APIs work differently in production
- `StoreReview.requestReview()` may not show UI in development
- Full testing requires TestFlight (iOS) or Internal Testing (Android)

## Analytics Potential

### Future Tracking (Optional)
Could track in store or analytics:
```typescript
reviewPromptShownCount: number;     // How many times prompt appeared
reviewPromptDismissedCount: number; // How many times "Maybe Later"
reviewPromptRatedCount: number;     // How many times "Rate" clicked
```

## User Scenarios

### Scenario 1: Enthusiastic User
- Opens app 20 times
- Sees prompt
- Taps "Rate on App Store"
- Leaves 5-star review
- **Never sees prompt again** ✅

### Scenario 2: Busy User
- Opens app 20 times
- Sees prompt
- Taps "Maybe Later" (busy at the moment)
- Opens app 30 more times (total 50)
- Sees prompt again
- Taps "Rate on App Store"
- **Never sees prompt again** ✅

### Scenario 3: Non-Reviewer
- Opens app 20 times
- Sees prompt
- Taps "Maybe Later"
- Opens app 30 more times (total 50)
- Sees prompt again
- Taps "Maybe Later"
- **Never sees prompt again** ✅ (respects their choice)

### Scenario 4: Power User
- Opens app 100+ times
- Already reviewed after prompt #1
- **Never sees prompt again** ✅

## Benefits

### For Users
- **Non-intrusive:** Only 2 asks, at natural moments
- **Respectful:** Never bugs them after 2 prompts
- **Native feel:** Uses OS-level review UI
- **Optional:** Easy to dismiss

### For Developer
- **More reviews:** Engaged users = better reviews
- **Higher rating:** Happy users rate at good times
- **More downloads:** Better rating = more visibility
- **Compliant:** Follows all platform rules

## Files Modified

### Core Implementation
- `src/state/measurementStore.ts` - State management
- `App.tsx` - Prompt logic
- `src/components/RatingPromptModal.tsx` - UI component

### Documentation
- `REVIEW_PROMPT_SYSTEM.md` (this file)

## Dependencies
- `expo-store-review` - Native review API
- `react-native-reanimated` - Animations
- `expo-blur` - Glassmorphic effect
- `expo-haptics` - Success feedback

---

**Status:** ✅ Implemented and ready for production
**Last Updated:** October 14, 2025
**Max Prompts:** 2 (after 20 opens, then 50 opens)
**Policy Compliant:** iOS App Store ✅ | Google Play ✅
