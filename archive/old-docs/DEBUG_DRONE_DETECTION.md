# Debug: Drone Detection Issue 🐛

**Problem:** Drone detection behaving backwards
- ❌ Importing REAL drone photo → Nothing happens
- ✅ Taking regular photo → Drone modal appears (wrong!)

---

## Added Console Logging

I've added detailed console logging to help debug. Now when you import a photo, you'll see:

```
🔍 Checking if photo is from drone...
📊 Drone Detection Results: {
  isDrone: true/false,
  hasSpecs: true/false,
  displayName: "DJI Neo",
  make: "DJI",
  model: "FC8671",
  hasRelativeAltitude: true/false,
  hasGSD: true/false
}
```

---

## Test Steps

### Test 1: Import REAL Drone Photo
1. Go to app
2. Tap gallery/import button
3. Select your DJI Neo photo
4. **Watch the console logs** (I can see them)
5. Tell me what appears on screen

**Expected:**
- Console: `🚁 Drone detected: DJI Neo`
- Console: `📝 No RelativeAltitude - showing manual entry modal`
- Console: `✅ Modal state set to TRUE`
- Screen: Beautiful modal with "🚁 DJI Neo"

**If modal doesn't appear, tell me what DOES appear**

---

### Test 2: Take Regular Photo
1. Go to camera mode
2. Take a picture of anything
3. **Watch what happens**

**Expected:**
- NO drone detection (it only runs on import)
- Goes directly to calibration screen
- NO modal

**If modal DOES appear, that's the bug we need to fix**

---

## Possible Issues

### Issue 1: Wrong Detection
Maybe the detection is marking NON-drone photos as drones.
**Check:** Look at console logs for `isDrone: true` when it shouldn't be

### Issue 2: Modal Rendering Problem  
Maybe modal is set to show but doesn't render.
**Check:** Console says `✅ Modal state set to TRUE` but screen doesn't show it

### Issue 3: State Timing
Maybe state gets overridden immediately after setting.
**Check:** Modal flashes then disappears

---

## What I Need From You

### When you import REAL drone photo:
1. What do you see on screen?
2. Does modal appear?
3. Does it go straight to calibration?
4. Does nothing happen?

### When you take regular photo:
1. Does modal appear? (it shouldn't!)
2. If yes, what does it say?
3. Does it show drone name?

---

## Quick Fix Options

### If detection is wrong:
- Tighten detection logic (require DJI/Autel/etc in Make field)
- Remove altitude-based detection

### If modal doesn't render:
- Check z-index issues
- Check if mode blocks modal
- Add delay before showing modal

### If both are broken:
- Disable drone detection temporarily
- Ship update without this feature
- Fix in next version

---

**Next Step:** Try importing your drone photo again and tell me EXACTLY what happens!
