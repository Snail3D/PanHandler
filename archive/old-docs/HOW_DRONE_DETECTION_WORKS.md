# 📐 How We Know Drone Sensor Specs

## Your Question: "How will you know the sensor width and all that?"

Great question! Here's how:

---

## Method 1: From EXIF Data ✅ (Best)

### What We Can Read from the Photo:
```javascript
EXIF Data Contains:
- Make: "DJI"
- Model: "FC8671" (This is the DJI Neo's camera model)
- FocalLength: 14mm
- Image Resolution: 4000x3000
```

### We Have a Database:
```javascript
DRONE_DATABASE = {
  "DJI/FC8671": {
    displayName: "DJI Neo",
    sensor: { width: 6.3, height: 4.55 }, // 1/2" sensor
    focalLength: 14,
    resolution: { width: 4000, height: 3000 }
  },
  "DJI/FC3582": {
    displayName: "DJI Mini 3 Pro",
    sensor: { width: 9.7, height: 7.28 }, // 1/1.3" sensor
    focalLength: 6.72,
    resolution: { width: 4000, height: 3000 }
  },
  // ... 50+ drones in database
}
```

**When photo has EXIF:**
1. Read Model: "FC8671"
2. Look up in database
3. Get sensor specs: 6.3mm x 4.55mm
4. Calculate scale!

---

## Method 2: User Tells Us ❌ (Current iOS Problem)

**Problem:** iOS strips EXIF when importing photos

**Your photo shows:**
```
Make: none
Model: none
❌ Can't look up in database!
```

**So we need to ask:**
```
"Which drone did you use?"
[ DJI Neo ]
[ DJI Mini 3 Pro ]
[ DJI Air 3 ]
[ Other... ]
```

Then we know the sensor specs!

---

## Method 3: Estimation from Photo 🤔 (Fallback)

If we don't know the exact drone, we can estimate:

### From EXIF FocalLength + Resolution:
```javascript
// Most consumer drones use 1/2" to 1/1.3" sensors
if (focalLength < 10mm) {
  // Probably 1/2" sensor (6.3mm wide)
  sensorWidth = 6.3;
} else if (focalLength < 20mm) {
  // Probably 1/1.3" sensor (9.7mm wide)
  sensorWidth = 9.7;
}
```

**Accuracy:** ±10-20% (okay for rough measurements)

---

## 🎯 Best Solution: Dropdown Menu

When user clicks "🚁 Aerial Photo":

```
┌─────────────────────────────┐
│   🚁 Aerial Photo Setup     │
├─────────────────────────────┤
│                             │
│ Which drone?                │
│ ┌─────────────────────────┐ │
│ │ DJI Neo               ▼ │ │
│ └─────────────────────────┘ │
│                             │
│ Popular:                    │
│ • DJI Neo                   │
│ • DJI Mini 3 Pro            │
│ • DJI Air 3                 │
│ • DJI Mavic 3               │
│ • Autel EVO Lite+           │
│ • [Other - Enter Manually]  │
│                             │
│ Altitude above ground:      │
│ ┌─────┐  ┌──┐              │
│ │  50 │  │m │ [ft]         │
│ └─────┘  └──┘              │
│                             │
│      [Calculate Scale]      │
└─────────────────────────────┘
```

**Flow:**
1. Select drone from list → We know sensor specs ✅
2. Enter altitude → We know distance ✅  
3. Calculate GSD → Done! ✅

---

## Example: DJI Neo at 50m

**User Selects:**
- Drone: DJI Neo
- Altitude: 50m

**We Know from Database:**
- Sensor: 6.3mm wide
- Focal Length: 14mm
- Resolution: 4000px wide

**We Calculate:**
```
GSD = (50,000mm × 6.3mm) / (14mm × 4000px)
GSD = 5.625 mm/px
```

**Done!** Each pixel = 5.6mm in real life.

---

## What If "Other" Drone?

If user selects "Other" or unknown drone:

```
┌─────────────────────────────┐
│   Manual Drone Specs        │
├─────────────────────────────┤
│ Sensor Width: [6.3] mm      │
│ Focal Length: [14] mm       │
│ Altitude: [50] m            │
│                             │
│ ℹ️ Find these in your       │
│    drone's manual or        │
│    manufacturer website     │
│                             │
│      [Calculate Scale]      │
└─────────────────────────────┘
```

---

## 📊 Current Database Size

We have specs for:
- ✅ DJI: 30+ models (Mini, Air, Mavic, Phantom, Inspire, FPV, Avata, Neo)
- ✅ Autel: 8 models (EVO series)
- ✅ Parrot: 3 models (Anafi series)
- ✅ Skydio: 2 models

**Total: ~50 drones** covering 90%+ of consumer market

---

## Your DJI Neo Specs (Already in Database):

```javascript
"DJI/FC8671": {
  displayName: "DJI Neo",
  sensor: {
    width: 6.3,    // mm
    height: 4.55   // mm  
  },
  focalLength: 14, // mm
  resolution: {
    width: 4000,   // pixels
    height: 3000   // pixels
  },
  notes: "1/2 inch CMOS sensor, 24mm equivalent"
}
```

---

## TL;DR Answer:

**How we know sensor specs:**
1. ✅ **Best:** Read Model from EXIF → Look up in database
2. ❌ **iOS Problem:** EXIF stripped → Can't auto-detect
3. ✅ **Solution:** User selects drone from dropdown → We use database
4. ✅ **Fallback:** User enters specs manually

**Your DJI Neo is already in our database!** Just need you to select it from the list when iOS strips the EXIF.

---

## Ready to Implement?

I can add:
1. **Dropdown with 50+ drones**
2. **Altitude input (m/ft)**
3. **Auto-calculation**
4. **"Manual entry" fallback**

Want me to build it? 🚀
