# Karate Chop Easter Egg 🥋

## The Story

When the developer was a kid, their mom always told them not to talk to strangers. They would drive her crazy by confidently responding: **"Don't worry Mom, I'll give 'em a karate chop!"**

This Easter egg is a tribute to that childhood memory and mom's patience. ❤️

## How to Trigger

1. **Hold phone vertically** (portrait orientation)
2. **Make a quick karate chop motion** (downward)
3. **Watch the magic happen!**

## What Happens

1. 📱 Screen fades to white (500ms fade)
2. ⌨️ Text types out: *"Don't worry Mom, I'll give 'em a karate chop!"*
3. 🥋 Karate emoji appears
4. ⏰ Auto-dismisses after 4 seconds
5. 💥 Heavy haptic feedback on trigger

**Early Dismissal:**
- Tap the screen **3 times** to dismiss early
- Graceful fade-out animation

## Technical Implementation

### Detection Logic:
```typescript
const CHOP_THRESHOLD = 25; // High acceleration needed
const CHOP_COOLDOWN = 5000; // 5 seconds between chops

// Requirements:
1. Phone must be vertical (portrait: beta < 0.5 radians ≈ 30°)
2. Rapid downward acceleration (y < -25)
3. Sustained downward motion (not just a bump)
```

### Animation Sequence:
```typescript
// Fade in (500ms)
karateChopOpacity.value = withTiming(1, { duration: 500 });

// Type out text (50ms per character)
const message = "Don't worry Mom, I'll give 'em a karate chop!";
// Typewriter effect...

// Auto-dismiss after 4 seconds
setTimeout(() => dismissKarateChop(), 4000);

// Fade out (500ms)
karateChopOpacity.value = withTiming(0, { duration: 500 });
```

## Files Modified

**DimensionOverlay.tsx:**
- Added karate chop state variables (line ~283-287)
- Added animated styles for white overlay (line ~268-277)
- Added `showKarateChopOverlay()` function
- Added `dismissKarateChop()` function  
- Added `handleKarateChopTap()` for early dismissal
- Added karate chop detection useEffect (line ~1044)
- Added karate chop modal UI (line ~4868)

## Design Details

### White Overlay:
- Background: White with opacity animation
- Creates clean canvas for the message
- Gentle fade in/out (500ms cubic bezier)

### Typography:
- Font size: 32px (bold, impactful)
- Color: Black on white
- Text shadow: Subtle white glow
- Center aligned
- Typewriter effect at 50ms/char

### Emoji:
- 🥋 Karate uniform emoji
- 48px size
- Appears after text completes
- 20px margin top

### Haptics:
- **Heavy impact** on trigger
- Most powerful haptic available
- Emphasizes the "karate chop" action

## User Experience

### Natural Gesture:
- Mimics an actual karate chop motion
- Phone held vertically (how you'd use it)
- Quick downward swipe/chop
- Feels satisfying and fun

### Cooldown Prevents Spam:
- 5-second cooldown between triggers
- Keeps the Easter egg special
- Prevents accidental repeated triggers
- Makes each appearance memorable

### Graceful Exit:
- Auto-dismiss after 4 seconds
- OR tap 3 times for manual dismiss
- Smooth fade-out animation
- Non-intrusive

## Why It's Special

1. **Personal Memory** - Tribute to childhood and mom
2. **Hidden Gem** - Not documented in Help Modal
3. **Discovery Moment** - Users accidentally find it
4. **Smile Factor** - Brings joy when discovered
5. **Gesture-Based** - Natural phone interaction
6. **Well-Timed** - Appears and disappears perfectly

## Testing Checklist

To verify the Easter egg:
1. ✅ Hold phone vertically
2. ✅ Make quick downward chop motion
3. ✅ Screen fades to white
4. ✅ Text types out character by character
5. ✅ Karate emoji appears
6. ✅ Heavy haptic feedback occurs
7. ✅ Auto-dismisses after 4 seconds
8. ✅ Can tap 3x to dismiss early
9. ✅ 5-second cooldown works
10. ✅ Doesn't trigger from normal movement

## Technical Notes

### Orientation Detection:
- Uses `DeviceMotion.rotation.beta`
- Beta = pitch (forward/backward tilt)
- Portrait: beta ≈ 0 radians
- Threshold: |beta| < 0.5 (~30° tolerance)

### Acceleration Detection:
- Samples at 50ms (20 Hz)
- Y-axis = vertical acceleration
- Negative Y = downward motion
- Tracks previous Y for sustained motion

### Performance:
- Minimal battery impact
- 50ms sampling (vs 100ms for shake)
- Subscription cleaned up on unmount
- No memory leaks

## Mom's Reaction

When mom sees this, she'll probably:
1. Laugh at the memory
2. Roll her eyes lovingly
3. Say "You were such a little troublemaker!"
4. Be touched by the tribute

**This one's for you, Mom!** ❤️🥋

---

**Easter egg added**: October 13, 2025  
**Dedicated to**: Mom, for putting up with that kid  
**Status**: Hidden and ready to surprise users!
