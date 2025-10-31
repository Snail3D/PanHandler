# 📐 PanHandler

> Transform your iPhone into a precision measurement tool — no hardware needed, just a coin.

**Professional measurements • CAD-ready exports • Free forever**

---

## 🎯 What is PanHandler?

PanHandler turns your iPhone camera into a professional measurement tool using coin-based calibration and advanced computer vision. Measure distances, angles, areas, volumes, and more with CAD-level precision.

**From a can of Coke to an ocean — measure anything in between.**

**No expensive laser tools. No subscriptions. Just your phone and a coin.**

---

## ✨ Features

### 📏 Measurement Tools

| Tool | Description |
|------|-------------|
| **Distance** | Straight-line measurements between two points |
| **Angle** | Three-point angle measurements with azimuth bearing |
| **Circle** | Radius, diameter, area, circumference, and volume |
| **Rectangle** | Length, width, area, and volume calculations |
| **Freehand** | Trace custom paths, get area and volume for closed shapes |

### 🪙 Calibration

- **650+ Coins Supported** — From 130+ countries worldwide
- **Map Scale Mode** — Measure from blueprints and drawings
- **Auto-Level Capture** — Hold level for auto-capture
- **One-Time Setup** — Calibration remembered

### 💾 Export Options

- **Email Reports** — Annotated photos with measurements
- **Save to Photos** — High-quality exports
- **Custom Labels** — Name your measurements

---

## 🚀 Quick Start

### 1. Take a Photo Horizontally _(vertical photos will automatically go to to set known points for scale)_
- Hold camera perpendicular (90°) to subject
- Use the bubble level for alignment
- Tap shutter or Hold for auto-capture

### 2. Calibrate with a Coin
- Search for your coin (650+ available)
- Place coin in photo
- Align calibration circle to coin edge
- Lock in calibration

### 3. Measure
- Choose measurement type
- Tap to place points
- Get instant measurements

### 4. Export
- Email or save to Photos
- Share professionally formatted reports instantly

---

## 💰 Pricing

**Free. Forever.**

- ✅ Unlimited measurements & exports
- ✅ All measurement tools included
- ✅ No subscriptions or in-app purchases

---

## 🏗️ Technical Details

### Tech Stack

- React Native 0.76.7 + Expo SDK 53
- TypeScript + Zustand state management
- React Native Reanimated v3
- NativeWind (Tailwind CSS)

### How It Works _(coin calibration mode)_

```
1. User aligns coin to reference circle
2. App calculates: pixelsPerMM = (circleDiameter / zoomScale) / coinDiameterMM
3. For any measurement: realDistance = pixelDistance / pixelsPerMM
```

Coin diameters are precisely known (standardized minting), providing accurate calibration.


## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** — Developer guide
- **[CLAUDE.md](./CLAUDE.md)** — Current session notes
- **[/archive/](./archive/)** — Historical documentation

---

## 🎓 Learn More

<a href="https://www.youtube.com/playlist?list=PLJB4l6OZ0E3HRdPaJn8dJPZrEu4dPBDJi" target="_blank"><strong>📹 Video Tutorials on YouTube</strong></a>

Complete course covering:
- Getting started
- Advanced techniques
- Real-world workflows
- Tips & tricks

---

## 🎮 Easter Eggs

PanHandler has hidden surprises! Hints:
- Something about snails... 🐌
- Music lovers, check the help screen... 🎵
- Chuck Norris doesn't measure things... ⚡

---

## 👨‍💻 Credits

**Created by:** [Snail](https://youtube.com/@realsnail3d) (3D Designer)
**Launch:** November 2025

**Mission:** Make CAD designing faster, easier, and more accurate for everyone.

## 💬 Support

- **YouTube:** [@realsnail3d](https://youtube.com/@realsnail3d)
- **GitHub:** [github.com/Snail3D/PanHandler](https://github.com/Snail3D/PanHandler)
- **Email:** Contact via app

---

<p align="center">
  <strong>Made with ❤️ for makers, builders, and creators everywhere.</strong><br>
  <em>Measure anything. Anytime. Anywhere.</em>
</p>

---

**📐 PanHandler — Professional measurements from your pocket.**
