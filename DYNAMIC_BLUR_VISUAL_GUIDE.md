# Dynamic Blur Effect - Visual Guide

## How It Works

### The Blur Progression

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          ZOOM LEVEL vs BLUR INTENSITY          │
│                                                 │
│  1.0x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  5%    │
│  1.5x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  14%   │
│  2.0x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  23%   │
│  2.5x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  32%   │
│  3.0x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  41%   │
│  3.5x  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  50%   │
│                                                 │
│        Light ────────────────────> Strong      │
└─────────────────────────────────────────────────┘
```

---

## Visual Effect at Different Zoom Levels

### 1.0x Zoom (Starting State)
```
┌────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 5% blur
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ (barely visible)
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░╔═════════╗░░░░░░░░░░░│
│░░░░░░░░░░░░░║         ║░░░░░░░░░░░│
│░░░░░░░░░░░░░║  COIN   ║░░░░░░░░░░░│ Coin: Clear
│░░░░░░░░░░░░░║  CLEAR  ║░░░░░░░░░░░│
│░░░░░░░░░░░░░║         ║░░░░░░░░░░░│
│░░░░░░░░░░░░░╚═════════╝░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────┘
```

### 2.0x Zoom (Moderate Blur)
```
┌────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ 23% blur
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ (moderate)
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓╔═════════╗▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓║         ║▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓║  COIN   ║▓▓▓▓▓▓▓▓▓▓▓▓│ Coin: Clear
│▓▓▓▓▓▓▓▓▓▓▓▓║  CLEAR  ║▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓║         ║▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓╚═════════╝▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└────────────────────────────────────┘
```

### 3.5x Zoom (Maximum Blur)
```
┌────────────────────────────────────┐
│████████████████████████████████████│ 50% blur
│████████████████████████████████████│ (strong focus)
│████████████████████████████████████│
│█████████████╔═════════╗████████████│
│█████████████║         ║████████████│
│█████████████║  COIN   ║████████████│ Coin: Clear
│█████████████║  CLEAR  ║████████████│
│█████████████║         ║████████████│
│█████████████╚═════════╝████████████│
│████████████████████████████████████│
│████████████████████████████████████│
└────────────────────────────────────┘
```

---

## The Formula

### Mathematical Expression:
```javascript
opacity = Math.min(
  0.05 + (zoomScale - 1) × 0.18,
  0.50
)
```

### Step-by-Step Calculation:

**Example: 2.0x Zoom**
```
1. zoomScale = 2.0
2. (zoomScale - 1) = 2.0 - 1.0 = 1.0
3. 1.0 × 0.18 = 0.18
4. 0.05 + 0.18 = 0.23
5. Math.min(0.23, 0.50) = 0.23
6. Result: 23% opacity blur
```

**Example: 3.5x Zoom**
```
1. zoomScale = 3.5
2. (zoomScale - 1) = 3.5 - 1.0 = 2.5
3. 2.5 × 0.18 = 0.45
4. 0.05 + 0.45 = 0.50
5. Math.min(0.50, 0.50) = 0.50
6. Result: 50% opacity blur (capped)
```

---

## Why These Values?

### Starting Point: 5%
- Subtle enough to not distract
- Still provides slight visual separation
- Leaves room for dramatic increase

### Maximum: 50%
- Strong enough for clear focal point
- Not so strong it obscures context
- Professional, polished look

### Rate: 0.18 per zoom unit
- Calculated: (0.50 - 0.05) / (3.5 - 1.0)
- Linear, predictable progression
- Smooth visual transition

---

## Technical Implementation

### SVG Structure:
```xml
<Svg>
  <Defs>
    <!-- Mask: White = visible, Black = hidden -->
    <Mask id="circleMask">
      <Rect fill="white" />      <!-- Everything visible -->
      <Circle fill="black" />    <!-- Coin area hidden -->
    </Mask>
  </Defs>
  
  <!-- Dynamic blur overlay (only outside coin) -->
  <Rect 
    fill="rgba(255, 255, 255, DYNAMIC_OPACITY)"
    mask="url(#circleMask)"
  />
  
  <!-- Coin circle and other elements -->
</Svg>
```

### React Native Code:
```javascript
// State tracking zoom level
const [zoomScale, setZoomScale] = useState(1);

// Dynamic blur calculation
<Rect 
  x="0" 
  y="0" 
  width={SCREEN_WIDTH} 
  height={SCREEN_HEIGHT} 
  fill={`rgba(255, 255, 255, ${Math.min(0.05 + (zoomScale - 1) * 0.18, 0.50)})`}
  mask="url(#circleMask)"
/>
```

---

## User Experience Flow

```
User Action              Zoom Level    Blur Effect
─────────────────────────────────────────────────────
Open calibration    →    1.0x     →   Subtle blur (5%)
Start pinch zoom    →    1.5x     →   Light blur (14%)
Continue zooming    →    2.0x     →   Moderate blur (23%)
Zoom in more        →    2.5x     →   Strong blur (32%)
Keep zooming        →    3.0x     →   Very strong (41%)
Maximum zoom        →    3.5x     →   Maximum blur (50%)
                         ↓
                    Coin stays clear throughout
                         ↓
                    Creates natural focal point
```

---

## Design Goals Achieved

✅ **Natural Depth-of-Field**: Mimics camera focus effect
✅ **Clear Focal Point**: Coin area always sharp and clear
✅ **Smooth Transition**: No sudden jumps or steps
✅ **Professional Polish**: "Super sexy" visual enhancement
✅ **Functional Purpose**: Helps user focus on calibration target
✅ **Performance**: Lightweight, no complex calculations

---

## Comparison

### Before (Fixed Blur):
- Static 15% opacity at all zoom levels
- No visual feedback from zooming
- Less engaging user experience

### After (Dynamic Blur):
- 5% → 50% responsive to zoom
- Strong visual feedback
- Natural focal point effect
- More engaging and professional

---

## Color Choice

### Why White (`rgba(255, 255, 255, ...)`)?
- Creates glassmorphic overlay effect
- Doesn't alter image colors
- Clean, modern aesthetic
- Works on light and dark backgrounds
- Maintains image visibility underneath

---

## Edge Cases Handled

### Below Minimum Zoom (< 1.0x):
- Formula ensures minimum 5% blur
- Even if zoom somehow goes below 1x

### Above Maximum Zoom (> 3.5x):
- `Math.min()` caps at 50%
- Prevents over-blurring

### Coin Circle:
- SVG mask ensures 0% blur inside coin
- Works at any zoom level
- No special handling needed

---

## Performance Notes

- ✅ Lightweight calculation (simple math)
- ✅ No complex image processing
- ✅ SVG rendering is hardware-accelerated
- ✅ Updates only on zoom change
- ✅ No animation loops or intervals

---

## Future Enhancements (Optional)

Possible improvements if desired:
- Easing curve instead of linear (e.g., ease-in-out)
- Different blur colors for different themes
- Configurable min/max values
- Blur intensity based on image brightness
- Animated blur transitions (withTiming)
