import React from 'react';
import { View, Text, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View
            style={{
              flex: 1,
              marginTop: insets.top + 20,
              marginHorizontal: 20,
              marginBottom: insets.bottom + 20,
              backgroundColor: 'white',
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            {/* Header */}
            <View
              style={{
                backgroundColor: '#007AFF',
                paddingTop: 20,
                paddingBottom: 16,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="help-circle" size={32} color="white" />
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 12 }}>
                  How to Use
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={true}
            >
              {/* Taking a Good Photo */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#34C759',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>1</Text>
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', flex: 1 }}>
                    Take a Good Reference Photo
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#F2F2F7',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#1C1C1E', lineHeight: 24, marginBottom: 12 }}>
                    For accurate measurements, follow these guidelines:
                  </Text>

                  <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 8 }}>📏</Text>
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Use 1x zoom lens</Text> - No digital zoom for best accuracy
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 8 }}>📐</Text>
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Hold phone perpendicular</Text> - Camera should face straight down
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 8 }}>📍</Text>
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Distance: 3-4 feet</Text> - About arm's length above the object
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 8 }}>🪙</Text>
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Place coin near object</Text> - In center of frame, on same surface
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 8 }}>💡</Text>
                      <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>Good lighting</Text> - Avoid shadows and glare
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Visual guide */}
                <View
                  style={{
                    backgroundColor: '#007AFF',
                    borderRadius: 16,
                    padding: 20,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                    📱 Ideal Setup
                  </Text>
                  <View style={{ alignItems: 'center', width: '100%' }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 12,
                        padding: 16,
                        width: '100%',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
                        {"Hold phone 3-4 feet\n(about 1 meter)\ndirectly above"}
                      </Text>
                      <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <Ionicons name="phone-portrait-outline" size={48} color="white" />
                        <Text style={{ color: 'white', fontSize: 24, marginVertical: 8 }}>↓</Text>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>90° angle</Text>
                        <Text style={{ color: 'white', fontSize: 24, marginVertical: 8 }}>↓</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 20 }}>🪙</Text>
                          </View>
                          <View
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 8,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 12 }}>Object</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
                        Coin and object on same flat surface
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Calibration */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#FF9500',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>2</Text>
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', flex: 1 }}>
                    Calibrate with a Coin
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#FFF3E0',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: '#FF9500',
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    After taking your photo:
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                      • Select your coin type from the list
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                      • Zoom in and position the circle over the coin
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                      • Adjust until it matches the coin edge perfectly
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                      • Tap "Lock In Calibration" when ready
                    </Text>
                  </View>
                </View>
              </View>

              {/* Measuring */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#AF52DE',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>3</Text>
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', flex: 1 }}>
                    Place Your Measurements
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#F2F2F7',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    📏 Distance Measurements
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginLeft: 8 }}>
                    • Switch to "Measure" mode{'\n'}
                    • Select "Distance" type{'\n'}
                    • Tap to place first point{'\n'}
                    • Tap to place second point{'\n'}
                    • Tap ✓ to save the measurement
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#F2F2F7',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 }}>
                    📐 Angle Measurements
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginLeft: 8 }}>
                    • Switch to "Measure" mode{'\n'}
                    • Select "Angle" type{'\n'}
                    • Tap to place first line endpoint{'\n'}
                    • Tap to place vertex (corner point){'\n'}
                    • Tap to place second line endpoint{'\n'}
                    • Tap ✓ to save the measurement
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#E3F2FD',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: '#2196F3',
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#1976D2', lineHeight: 20, fontWeight: '600' }}>
                    💡 Pro Tip: Pan/zoom locks after placing your first point, ensuring accuracy!
                  </Text>
                </View>
              </View>

              {/* Controls */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#FF3B30',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>4</Text>
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', flex: 1 }}>
                    Navigation Controls
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#F2F2F7',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🔄 Pan/Zoom Mode
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginLeft: 8 }}>
                      • Pinch to zoom in/out{'\n'}
                      • Drag to pan around the image{'\n'}
                      • Use this to explore and position
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      ✏️ Measure Mode
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginLeft: 8 }}>
                      • Tap to place measurement points{'\n'}
                      • Pan/zoom locks after first point{'\n'}
                      • Switch back to Pan mode to move around
                    </Text>
                  </View>

                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🗑️ Other Controls
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginLeft: 8 }}>
                      • Tap "Undo" to remove last point{'\n'}
                      • Tap "Clear All" to start over{'\n'}
                      • Tap "✓" to confirm measurement{'\n'}
                      • Tap "✕" to cancel measurement
                    </Text>
                  </View>
                </View>
              </View>

              {/* Pro Features */}
              <View style={{ marginBottom: 32 }}>
                <View
                  style={{
                    backgroundColor: '#FFD700',
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="star" size={28} color="#FF9500" />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginLeft: 8 }}>
                      Pro Features
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    Free users get 1 measurement per photo. Upgrade to Pro for:
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 4 }}>
                      ✓ Unlimited measurements per photo
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 4 }}>
                      ✓ Mix distance and angle measurements
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 4 }}>
                      ✓ Vibrant color-coded measurements
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                      ✓ One-time payment of $5.99
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tips */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 12 }}>
                  💡 Quick Tips
                </Text>
                <View
                  style={{
                    backgroundColor: '#F2F2F7',
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8 }}>
                    • Measurements are stored in image coordinates - zoom freely without losing accuracy
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8 }}>
                    • Your session auto-saves - close the app and resume later
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8 }}>
                    • Switch units anytime (metric ⇄ imperial)
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                    • Email results to yourself with all measurements included
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#E5E5EA',
                padding: 16,
              }}
            >
              <Pressable
                onPress={onClose}
                style={{
                  backgroundColor: '#007AFF',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>Got It!</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
