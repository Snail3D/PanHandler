# Tool Dynamics & Behavior Documentation
**Version 1.65** | Last Updated: October 15, 2025

This document details the technical specifications, behaviors, and dynamics of all measurement tools in the application.

---

## Table of Contents
1. [Distance Tool](#distance-tool)
2. [Angle Tool](#angle-tool)
3. [Circle Tool](#circle-tool)
4. [Rectangle/Box Tool](#rectanglebox-tool)
5. [Freehand/Free Draw Tool](#freehandfree-draw-tool)
6. [Common Behaviors](#common-behaviors)
7. [Gesture System](#gesture-system)
8. [Cursor Dynamics](#cursor-dynamics)

---

## Distance Tool

### Purpose
Measures the linear distance between two points.

### Interaction Flow
1. **First Tap**: Places starting point
2. **Second Tap**: Places ending point and completes measurement
3. **Edit Mode**: Drag either endpoint to adjust

### Technical Specifications
- **Point Sampling**: Precision tap detection with crosshair cursor
- **Calculation**: Euclidean distance in image space, converted to calibrated units
- **Visual Rendering**: 
  - Main line with 3px stroke
  - Glow layers (12px, 8px, 5px) for depth
  - Animated endpoints with pulsing effect
- **Label Display**: Shows distance value at midpoint of line

### Color Coding
- Sequential rainbow progression per measurement
- Automatic color rotation through predefined palette

---

## Angle Tool

### Purpose
Measures angles between three points (vertex in middle) or azimuth bearings in map mode.

### Interaction Flow
1. **First Tap**: Start point
2. **Second Tap**: Vertex point (center/pivot)
3. **Third Tap**: End point and completes measurement

### Technical Specifications
- **Calculation**: `Math.atan2()` for angle computation
- **Map Mode**: Calculates azimuth bearing (0° = North, clockwise)
- **Display Format**: 
  - Normal mode: Interior angle in degrees
  - Map mode: Bearing with cardinal direction (e.g., "45° NE")
- **Arc Rendering**: 
  - Dynamic arc radius based on zoom
  - Rendered using SVG path with arc commands
  - Glow layers for visual depth

### Special Features
- **Protractor visualization** with arc between rays
- **Cardinal direction labels** in map mode
- **Automatic acute/obtuse angle display**

---

## Circle Tool

### Purpose
Measures circular objects by defining center and radius.

### Interaction Flow
1. **First Tap**: Places center point
2. **Second Tap**: Sets radius (distance from center) and completes
3. **Edit Mode**: 
   - Drag center to move circle
   - Drag edge to resize radius

### Technical Specifications
- **Radius Calculation**: Distance from center to edge point
- **Properties Displayed**:
  - Radius
  - Diameter
  - Circumference: `2 × π × radius`
  - Area: `π × radius²`
- **Visual Rendering**:
  - Dashed stroke circle outline
  - Center point marker
  - Edge control point
  - Glow layers (12px, 8px, 5px)

### Coin Reference Integration
- Can snap to calibration coin for accurate scaling
- Automatically detects coin type and dimensions

---

## Rectangle/Box Tool

### Purpose
Measures rectangular areas defined by opposite corners.

### Interaction Flow
1. **First Tap**: Places first corner
2. **Second Tap**: Places opposite corner and completes rectangle
3. **Edit Mode**:
   - Drag corners to resize
   - Drag edges to move entire rectangle

### Technical Specifications
- **Dimensions**: 
  - Width: Distance between horizontal corners
  - Height: Distance between vertical corners
  - Area: `width × height`
  - Perimeter: `2 × (width + height)`
- **Visual Rendering**:
  - Solid stroke rectangle outline
  - 4 corner control points
  - Glow layers for depth
- **Snap Behavior**: Corner points snap to pixel grid for precise alignment

### Special Features
- **Aspect ratio preservation** option (when holding corner)
- **Center-based resize** option (when holding edge)

---

## Freehand/Free Draw Tool

### Purpose
Allows users to trace complex shapes by drawing freehand paths with lasso-close functionality.

### Interaction Flow
1. **Activation**: Hold finger on screen for **1.5 seconds** to activate drawing mode
   - Visual feedback: Cursor changes color and pulses
   - Haptic feedback on activation
2. **Drawing**: Drag finger to draw path
   - Cursor offset: **-120px above finger** for visibility
   - Dynamic horizontal offset based on screen position
3. **Completion**: Lift finger to finish path (minimum 5 points required)

### Technical Specifications

#### Point Sampling
- **Minimum Distance Between Points**: `0.5 image pixels`
- **Rationale**: Creates smooth, fluid lines without visible segments
- **Point Storage**: Array of `{x, y}` coordinates in image space

#### Lasso Snap System
- **Activation Threshold**: Must have at least **10 points** in path
- **Snap Distance**: 
  - **With Calibration**: `0.3mm` real-world distance
  - **Without Calibration**: `1.5 image pixels`
- **Snap Behavior**:
  - Detects when drawing point comes within threshold of starting point
  - Checks for self-intersection - does NOT snap if path crosses itself
  - Success: Haptic feedback + automatic closure to starting point
  - Sets `isClosed: true` flag for area calculation

#### Zoom Locking
- **Activation**: When drawing begins, current zoom state is locked
- **Locked Properties**: `scale`, `translateX`, `translateY`, `rotation`
- **Purpose**: Prevents coordinate drift during drawing
- **Release**: Lock removed when drawing completes or is cancelled

#### Measurements
**For Open Paths** (non-closed):
- **Path Length**: Sum of distances between consecutive points
- **Display**: Single distance value

**For Closed Loops** (lasso mode):
- **Perimeter**: Sum of distances around entire closed path
- **Area**: Calculated using **Shoelace Formula**:
  ```
  Area = |Σ(x[i] * y[i+1] - x[i+1] * y[i])| / 2
  ```
- **Self-Intersection Check**: Prevents area calculation if path crosses itself
- **Display**: Both area and perimeter shown

#### Visual Rendering
- **Stroke Width**: 3px main path
- **Glow Layers**: 12px, 8px, 5px for depth
- **Path Preview**: Live preview while drawing (semi-transparent)
- **Completed Path**: Full opacity with color coding
- **Control Points**: First point marked with larger circle
- **Edit Mode**: All points shown as draggable handles

### Cursor Dynamics
- **Base Offset**: -120px vertical (above finger)
- **Horizontal Gradient Offset**: -30px to +30px based on screen position
  - Center: 0 offset
  - Left edge: -30px (leans left)
  - Right edge: +30px (leans right)
- **Speed-based Scaling**: Cursor size increases with drawing speed
- **Activation State**: Different colors for waiting vs. active drawing

### Performance Optimizations
- **Point Smoothing**: Minimum distance filter prevents redundant points
- **Incremental Rendering**: Path segments rendered progressively
- **Simplified Edit Mode**: Point thinning for complex paths (optional)

### Known Behaviors
- **Minimum Points**: Paths with fewer than 5 points are discarded
- **Self-Intersection**: Prevents area calculation but allows path completion
- **Cancellation**: Lifting finger during activation timer cancels drawing

---

## Common Behaviors

### Point Selection & Editing
- **Tap Radius**: 20px screen pixels for point selection
- **Drag Behavior**: Smooth interpolation with easing
- **Snapping**: Optional grid snapping for precise placement

### Color System
All tools use sequential rainbow color progression:
```javascript
const colorSequences = {
  distance: [
    { main: '#3B82F6', glow: '#3B82F6', name: 'Blue' },
    { main: '#10B981', glow: '#10B981', name: 'Green' },
    { main: '#F59E0B', glow: '#F59E0B', name: 'Amber' },
    // ... 10 colors total, cycles back to start
  ],
  // Similar sequences for other tools
};
```

### Measurement Labels
- **Position**: Dynamic based on measurement type
  - Distance: Midpoint of line
  - Angle: Near vertex, offset to avoid overlap
  - Circle: Near center or edge
  - Rectangle: Center or near first corner
  - Freehand: Centroid of path or near first point
- **Background**: Semi-transparent rounded rectangle
- **Visibility**: Can be toggled with "Hide labels" button

### Glow Effect System
All tools use multi-layer glow for depth and visibility:
1. **Outer Glow**: 12px stroke, 10% opacity
2. **Mid Glow**: 8px stroke, 15% opacity
3. **Inner Glow**: 5px stroke, 20% opacity
4. **Main Line**: 3px stroke, 100% opacity

---

## Gesture System

### Mode Switching Gesture
- **Trigger**: Swipe horizontally across screen
- **Direction**: 
  - Right swipe: Next tool
  - Left swipe: Previous tool
- **Minimum Distance**: 40px screen pixels
- **Fail Offset**: ±15px vertical (prevents accidental activation on taps)
- **Tool Order**: Distance → Angle → Circle → Rectangle → Freehand → (repeat)
- **Visual Feedback**: Tool icon animation + haptic feedback

### Menu Swipe Gesture
- **Trigger**: Swipe down on bottom menu
- **Minimum Distance**: 20px
- **Fail Offset**: ±10px horizontal
- **Action**: Minimizes/hides bottom toolbar
- **Visual**: Smooth slide animation

### Pan & Zoom (When Unlocked)
- **Pinch**: Zoom in/out (min: 1x, max: 10x)
- **Drag**: Pan image around screen
- **Double-tap**: 
  - No active measurement: Zoom to 2x
  - With measurements: Switch to measure mode

### Gesture Conflicts Resolution
- **Priority Order**: 
  1. Freehand drawing (when active)
  2. Point dragging (edit mode)
  3. Mode switch gesture
  4. Menu swipe
  5. Pan & zoom
- **Simultaneous Detection**: Mode switch uses `failOffsetX/Y` to distinguish from taps

---

## Cursor Dynamics

### Crosshair Cursor (Distance, Angle, Rectangle, Circle)
- **Size**: 40px × 40px
- **Design**: Thin lines with center gap
- **Offset**: -60px vertical (above finger)
- **Horizontal Gradient**: -30px to +30px based on screen position
- **Animation**: Subtle pulse on tap

### Freehand Cursor
- **Size**: Dynamic (18-28px) based on drawing speed
- **Design**: Circular with trail effect
- **Offset**: -120px vertical (higher than crosshair)
- **States**:
  - **Waiting**: Yellow/orange color, pulsing
  - **Active**: Color matches tool, larger size
- **Speed Indicator**: Size increases with finger velocity

### Cursor Speed Calculation
```javascript
const deltaTime = now - lastUpdateTime;
const distance = Math.sqrt(deltaX² + deltaY²);
const speed = distance / deltaTime;
```
Used for visual feedback and smoothness adjustments.

---

## Technical Constants

### Image Space vs Screen Space
- **Image Space**: Coordinates in original photo resolution
- **Screen Space**: Coordinates on device display
- **Conversion**: Accounts for zoom, pan, and rotation transformations

### Zoom Lock Reference
When pan/zoom is locked (measurements active):
```javascript
{
  scale: 1.0,          // Current zoom level
  translateX: 0,       // Pan offset X
  translateY: 0,       // Pan offset Y
  rotation: 0          // Rotation angle (degrees)
}
```

### Performance Metrics
- **Target Frame Rate**: 60fps
- **Point Update Throttle**: 16ms (1 frame)
- **Gesture Detection Debounce**: 50ms
- **Animation Duration**: 200-400ms depending on complexity

---

## Version History

### v1.65 (Current)
- **Freehand Tool**: Reduced snap threshold from 2mm to 0.3mm for precise tracing
- **Freehand Tool**: Reduced point sampling from 2px to 0.5px for smooth lines
- **Gesture System**: Fixed failOffset for better tap vs. swipe detection
- **Help Modal**: Added Auto-Leveled album documentation
- **Bug Fixes**: Fixed sticky buttons after panning, className TypeScript errors

### v1.6
- Cinematic transitions and polish
- Smoke trail effects
- Enhanced haptic feedback

### v1.5
- Initial freehand/free draw tool
- Lasso mode with area calculation
- Gesture-based mode switching

---

## Development Notes

### Adding New Tools
1. Add mode type to `MeasurementMode` union
2. Create color sequence in `getMeasurementColor()`
3. Implement tap/gesture logic in `panGestureHandler`
4. Add rendering logic in main render section
5. Update help modal with instructions
6. Add to mode-switching gesture cycle

### Debugging Tools
- Enable `__DEV__` console logs for detailed gesture info
- Check path length and snap threshold in freehand console logs
- Monitor zoom lock state during drawing operations

---

## Future Enhancements

### Planned Features
- [ ] Polygon tool (multi-point closed shapes)
- [ ] Text annotation tool
- [ ] Measurement grouping/layers
- [ ] Export measurements as CAD/DXF format
- [ ] AR mode with live camera overlay

### Under Consideration
- [ ] Snap-to-grid option for all tools
- [ ] Ruler/scale overlay
- [ ] Measurement templates (save & reuse)
- [ ] Multi-touch gestures for tool switching

---

**Last Updated**: October 15, 2025  
**Document Version**: 1.65  
**Maintained by**: Development Team
