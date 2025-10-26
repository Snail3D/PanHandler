# Bubble Level - Starting Over

## Current Situation
- Horizontal mode works perfectly
- Vertical mode bubble is stuck and can't cross the center axis
- We've tried many coordinate transformations but none work correctly

## What We Know
1. **Horizontal mode formula (WORKS):**
   - `bubbleX = -(gamma / 15) * 48`
   - `bubbleY = (beta / 15) * 48`
   - Direct mapping: bubbleX → translateX, bubbleY → translateY

2. **Vertical mode issues:**
   - Crosshair rotates 90° clockwise
   - Bubble is inside rotated container
   - Need to account for this rotation in bubble positioning

## Next Steps
We need to step back and create a test session where we:
1. Temporarily remove debug display (too cluttered)
2. Test with crosshair rotation OFF first
3. If that works, add rotation back with proper coordinate transformation
4. Use the exact same formula as horizontal mode, just account for orientation

## User's Requirements
- Ball should show where "level" is
- When pointing down → ball at top (showing "tilt up to reach level")
- When pointing up → ball at bottom (showing "tilt down to reach level")
- Ball must move freely through ALL FOUR quadrants
- No invisible barriers or sticking at center
