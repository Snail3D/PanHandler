# 🎵 Haptic Rickroll Easter Egg

## What It Does:
When users tap the "AUTO LEVEL" badge 7 times, they now get:
1. **~3.2 second haptic sequence** that mimics the rhythm of that famous song
2. **Then** opens the YouTube link

## The Haptic Sequence:
- **Intro**: Piano note rhythm (4 beats over 550ms)
- **Verse 1**: 4 beats with varying intensity (800-1350ms)
- **Verse 2**: 4 beats with rhythm variations (1600-2100ms)
- **Verse 3**: 4 beats building up (2400-2950ms)
- **Finale**: Success notification + YouTube opens! (3200ms)

**Total**: 16 haptic beats over 3.2 seconds that capture the feel and rhythm of the song

## How to Trigger:
1. Go to measurement screen
2. Look for "AUTO LEVEL" badge (if it's showing)
3. Tap it 7 times quickly
4. Feel the haptic rhythm play out
5. YouTube opens automatically after the sequence!

## The Experience:
Users get haptic-rolled BEFORE getting rickrolled! 😂
They'll feel the rhythm building up and think "wait... is this...?" 
Then BOOM - YouTube opens and confirms their suspicions!

**It's the perfect double-rickroll!** 🎵✨

---

**File**: `src/components/DimensionOverlay.tsx` (lines ~564-622)
