# v2.2.0 Drone Calibration Quick Reference 🚁

**Release:** October 18, 2025  
**Feature:** Drone Photo Calibration  
**Status:** Production Ready

---

## 🎯 What It Does

Import aerial drone photos and get accurate measurements instantly!

---

## 📱 How to Use

### Quick Start (5 seconds):
1. **Import drone photo** from gallery
2. **Modal appears:** "🚁 DJI Neo - Enter altitude"
3. **Type height:** 50 (meters or feet)
4. **Tap Calibrate** → Done! ✅
5. **Start measuring** accurate distances

---

## 🚁 Supported Drones

✅ **DJI:** Mini 3/4 Pro, Air 2/3, Mavic, Phantom, Neo  
✅ **Autel:** EVO Lite, II Pro  
✅ **Parrot:** Anafi  
✅ **Skydio:** 2/2+  
✅ **Others:** Any with EXIF data

---

## 💡 Tips

### ✅ Do This:
- Use the altitude from your controller (e.g., "H: 50.2m")
- Fly straight down (gimbal at -90°)
- Take photos over flat terrain
- Double-check your units (meters vs feet)

### ❌ Don't Do This:
- Don't guess the altitude
- Don't use GPS elevation (wrong!)
- Don't use angled shots
- Don't forget to check controller before landing

---

## 📊 Results

| Before v2.2.0 | After v2.2.0 |
|---------------|--------------|
| 44 feet (wrong!) | 12 feet ✓ |
| 60s calibration | 5s calibration |
| Need coin/ruler | Just altitude |
| 28x error | Accurate |

---

## 🎓 Quick Math

**Example: DJI Neo at 50m**
- Each pixel = 0.56 cm in real world
- 100 pixels = 56 cm = 22 inches
- Precise and automatic!

---

## 🐛 Troubleshooting

**Modal doesn't show?**  
→ Photo might not have drone EXIF. Use coin method.

**Still wrong measurements?**  
→ Check: Was photo straight down? Flat ground? Right altitude?

**Can't find altitude?**  
→ DJI: Look for "H: 50.2m" on flight screen

---

**Version:** 2.2.0  
**Date:** October 18, 2025  
**One-Sentence Summary:** Import drone photo → Enter altitude → Accurate measurements in 5 seconds! 🚁
