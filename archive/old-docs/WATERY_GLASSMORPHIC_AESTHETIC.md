# 🌊 Watery Glassmorphic Aesthetic Guide

## Core Design Philosophy
This app uses a **watery, glassmorphic aesthetic** inspired by iOS design principles with enhanced depth and fluidity.

---

## 🎨 Visual Characteristics

### 1. **Glassmorphism (Frosted Glass Effect)**
- **BlurView** with `intensity={35-50}` and `tint="light"`
- Semi-transparent white backgrounds: `rgba(255, 255, 255, 0.4-0.6)`
- Subtle borders: `rgba(255, 255, 255, 0.3-0.4)` at 1-2px width
- Soft shadows with color-matched glows

### 2. **Watery Fluidity**
- **Generous border radius**: 16-24px for cards, 12-16px for buttons
- **Soft, rounded shapes** - nothing sharp or angular
- **Flowing layouts** with proper spacing (12-16px gaps)
- **Depth layering** through overlapping translucent elements

### 3. **Color Philosophy**
- **Session colors** (dynamic, changes per session):
  - Crosshair color (main)
  - Bubble level color (complementary)
  - Shutter button color (high contrast)
  - **Icons should use the session color** for visual continuity
- **Neutral base**: White/light gray with transparency
- **Vibrant accents**: Use current session color for interactive elements

### 4. **Typography**
- **Heavy weight titles**: fontWeight '700'-'900'
- **Medium body text**: fontWeight '600'
- **Soft contrast**: `rgba(0, 0, 0, 0.85)` for primary text, `rgba(0, 0, 0, 0.6)` for secondary
- **White text on colored buttons**: Always with subtle shadow for readability

---

## 📐 Component Patterns

### Modal Structure
```tsx
<BlurView intensity={40} tint="light" style={{ borderRadius: 24, overflow: 'hidden' }}>
  <View style={{
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  }}>
    {/* Content */}
  </View>
</BlurView>
```

### Button Pattern (Watery)
```tsx
<Pressable style={({ pressed }) => ({
  backgroundColor: pressed 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(255, 255, 255, 0.7)',
  borderRadius: 16,
  padding: 20,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.4)',
  shadowColor: sessionColor,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 12,
})}>
  {/* Icon in session color */}
  {/* Text */}
</Pressable>
```

### Icon Pattern
- **Size**: 32-48px for primary actions, 24-28px for secondary
- **Color**: Use current session color for brand consistency
- **Style**: Bold, clear, vector-based (SVG preferred)

### Card Pattern
```tsx
<BlurView intensity={35} tint="light" style={{ borderRadius: 20, overflow: 'hidden' }}>
  <View style={{
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }}>
    {/* Content */}
  </View>
</BlurView>
```

---

## 🎭 Interactive States

### Press States
- **Scale down**: `transform: [{ scale: 0.97 }]`
- **Brighten**: Increase alpha by 0.1-0.2
- **Haptic feedback**: Always on press (Light/Medium)

### Hover/Focus (if applicable)
- Subtle glow increase
- Border brightness increase

---

## 🌈 Session Color Integration

The app uses **dynamic session colors** that change each time user returns to camera:
- **Crosshair** (main reference color)
- **Bubble** (complementary for level)
- **Shutter** (high contrast action)

**IMPORTANT**: Icons and interactive elements should use the session color for visual coherence across the session.

---

## ❌ Anti-Patterns (Things to AVOID)

1. **Sharp corners** - Everything should be rounded
2. **Solid backgrounds** - Always use translucency
3. **Harsh shadows** - Keep shadows soft and colored
4. **Small touch targets** - Minimum 44x44pt
5. **Inconsistent spacing** - Use 8/12/16/24px increments
6. **Flat designs** - Always add depth with blur and shadows
7. **Mismatched icon colors** - Icons should match session color

---

## 📱 Reference Components

Good examples in the codebase:
- `DimensionOverlay.tsx` - Bottom control buttons
- `ZoomCalibration.tsx` - Lock-in button and coin selector
- `HelpModal.tsx` - Section cards with glassmorphic styling
- `PhotoTypeSelectionModal.tsx` - Modal structure

---

## 🎯 Summary

**Think: iOS meets water**
- Soft, flowing, translucent
- Generous spacing and rounded corners
- Dynamic session colors for personality
- Depth through layered glass effects
- Bold typography for clarity
- Responsive haptic feedback

**Every UI element should feel like it's floating in water with light passing through it.**
