#!/usr/bin/env python3
"""Fix label editing to work without measurementMode check"""

with open('src/components/DimensionOverlay.tsx', 'r') as f:
    content = f.read()

# Fix 1: Remove measurementMode check from main labels (around line 5548-5565)
content = content.replace(
    '''              // Handle double-tap on label to open edit modal (only when NOT in measurement mode)
              const handleLabelPress = () => {
                if (!measurementMode) {
                  const now = Date.now();
                  const TAP_TIMEOUT = 300; // 300ms for double-tap detection
                  
                  if (labelTapState?.measurementId === measurement.id && (now - labelTapState.lastTapTime) < TAP_TIMEOUT) {
                    // Second tap - open editor
                    setLabelEditingMeasurementId(measurement.id);
                    setShowLabelEditModal(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setLabelTapState(null);
                  } else {
                    // First tap - record time
                    setLabelTapState({ measurementId: measurement.id, lastTapTime: now });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }
              };''',
    '''              // Handle double-tap on label to open edit modal
              const handleLabelPress = () => {
                const now = Date.now();
                const TAP_TIMEOUT = 300; // 300ms for double-tap detection
                
                if (labelTapState?.measurementId === measurement.id && (now - labelTapState.lastTapTime) < TAP_TIMEOUT) {
                  // Second tap - open editor
                  setLabelEditingMeasurementId(measurement.id);
                  setShowLabelEditModal(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLabelTapState(null);
                } else {
                  // First tap - record time
                  setLabelTapState({ measurementId: measurement.id, lastTapTime: now });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              };'''
)

# Fix 2: Change pointerEvents for main labels
content = content.replace(
    '''                  pointerEvents={measurementMode ? "none" : "auto"}
                  onPress={handleLabelPress}''',
    '''                  pointerEvents="auto"
                  onPress={handleLabelPress}'''
)

# Fix 3: Remove measurementMode check from rectangle labels
content = content.replace(
    '''            // Handle label tap to open edit modal (only when NOT in measurement mode)
            const handleRectLabelPress = () => {
              if (!measurementMode) {
                setLabelEditingMeasurementId(measurement.id);
                setShowLabelEditModal(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            };''',
    '''            // Handle label tap to open edit modal
            const handleRectLabelPress = () => {
              setLabelEditingMeasurementId(measurement.id);
              setShowLabelEditModal(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            };'''
)

with open('src/components/DimensionOverlay.tsx', 'w') as f:
    f.write(content)

print("✅ Fixed label editing - removed measurementMode checks")
