# BUGMAN STRIKES BACK: The Progressive Haptics Bottleneck

## The Symptoms
1. "Freezes for 10-15 seconds when placing points"
2. "Cursor stays there, then it all stacks in"
3. Calibration screen was broken (couldn't pan)

## Root Causes Found

### Issue 1: Broken Gestures
My edits to conditionally disable GestureDetector broke calibration.
**Fixed**: Restored simple `<GestureDetector>` wrapper (always enabled)

### Issue 2: Progressive Haptics Creating Callback Hell
Lines 2363-2369 in DimensionOverlay create **5 setTimeout callbacks** on EVERY touch in freehand mode:
```typescript
Haptics.impactAsync(...);  // Immediate
setTimeout(() => Haptics.impactAsync(...), 300);
setTimeout(() => Haptics.impactAsync(...), 600);
setTimeout(() => Haptics.impactAsync(...), 900);
setTimeout(() => Haptics.impactAsync(...), 1200);
```

When user moves finger (onResponderMove fires 60+ times/second), this creates HUNDREDS of pending setTimeout callbacks, all trying to fire haptics. The JS event loop gets clogged with these callbacks, blocking touch event processing → 10-15 second freeze.

## The Fix
**Temporarily disabled progressive haptics** (lines 2365-2369 commented out)

This removes the setTimeout spam and should make touch response instant.

## Testing Now
1. ✅ Calibration should work (pan/zoom/rotate)
2. ✅ Placing measurement points should be instant (no freeze)
3. ⚠️ Freehand mode won't have progressive haptics (acceptable trade-off for now)

## Future Fix
If we want progressive haptics back:
- Store setTimeout IDs in refs
- Clear all pending haptic timeouts before creating new ones
- Or use a single timer that checks elapsed time instead of multiple timeouts

---
**The real bug was setTimeout callback spam from progressive haptics!** 🐛
