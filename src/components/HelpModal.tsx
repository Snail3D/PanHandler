import React, { useEffect } from 'react';
import { View, Text, Modal, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Animated feature card component
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  delay = 0,
  children 
}: { 
  icon: string; 
  title: string; 
  description?: string; 
  color: string; 
  delay?: number;
  children?: React.ReactNode;
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 150 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 20 }]}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderLeftWidth: 4,
          borderLeftColor: color,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: color,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name={icon as any} size={22} color="white" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', flex: 1 }}>
            {title}
          </Text>
        </View>
        
        {description && (
          <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, marginBottom: 8 }}>
            {description}
          </Text>
        )}
        
        {children}
      </View>
    </Animated.View>
  );
};

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  const insets = useSafeAreaInsets();
  const headerScale = useSharedValue(0.9);
  
  useEffect(() => {
    if (visible) {
      headerScale.value = withSequence(
        withTiming(1.05, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    }
  }, [visible]);
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

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
              backgroundColor: '#F8F9FA',
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
              <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, headerAnimatedStyle]}>
                <Ionicons name="help-circle" size={32} color="white" />
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 12 }}>
                  PanHandler Guide
                </Text>
              </Animated.View>
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
              {/* Camera & Auto Level */}
              <FeatureCard
                icon="camera"
                title="Step 1: Take a Perfect Photo"
                color="#34C759"
                delay={0}
              >
                <View style={{ marginLeft: 4 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🎯</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Use 1x zoom</Text> - No digital zoom for accuracy
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📐</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Hold perpendicular</Text> - Camera straight down (90°)
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📏</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Distance: 3-4 feet</Text> - About arm's length above
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🪙</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Place coin near object</Text> - Same flat surface
                    </Text>
                  </View>
                </View>

                {/* Auto Level Feature */}
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: '#E8F5E9',
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: '#4CAF50',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="flash" size={18} color="#2E7D32" />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32', marginLeft: 6 }}>
                      AUTO LEVEL Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 8 }}>
                    Enable Auto Level in camera for hands-free capture! The app monitors your device angle and stability in real-time.
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • Hold camera perpendicular (90°) to the surface
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • Keep steady - watch the alignment indicator turn green
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • When perfectly level and stable, a 3-second countdown begins
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20 }}>
                      • Photo captures automatically - no need to tap!
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, backgroundColor: 'rgba(46, 125, 50, 0.15)', borderRadius: 6, padding: 8 }}>
                    <Text style={{ fontSize: 13, color: '#1B5E20', fontStyle: 'italic' }}>
                      💡 Tip: If you move during countdown, it will cancel and restart when steady again
                    </Text>
                  </View>
                </View>
              </FeatureCard>

              {/* Calibration */}
              <FeatureCard
                icon="analytics"
                title="Step 2: Calibrate with Coin"
                description="After capturing your photo, calibrate using the reference coin to enable precise measurements."
                color="#FF9500"
                delay={100}
              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • Select your coin type from the list
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • Zoom in and position the calibration circle
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • Align circle edges perfectly with coin edge
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                    • Tap "Lock In Calibration" when ready
                  </Text>
                </View>
              </FeatureCard>

              {/* Measurement Modes */}
              <FeatureCard
                icon="resize"
                title="Step 3: Place Measurements"
                description="Choose from multiple measurement types to capture all dimensions of your object."
                color="#AF52DE"
                delay={200}
              >
                {/* Distance */}
                <View
                  style={{
                    backgroundColor: '#EDE7F6',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="remove" size={18} color="#7E57C2" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Distance Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                    Measure straight-line distances. Tap to place two points and get the distance between them.
                  </Text>
                </View>

                {/* Angle */}
                <View
                  style={{
                    backgroundColor: '#FFF3E0',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="git-compare" size={18} color="#FB8C00" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Angle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                    Measure angles between two lines. Place first endpoint, then vertex (corner), then second endpoint.
                  </Text>
                </View>

                {/* Circle */}
                <View
                  style={{
                    backgroundColor: '#FCE4EC',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="radio-button-off" size={18} color="#E91E63" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Circle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                    Measure circular objects. Tap center point, then tap edge to define radius and diameter.
                  </Text>
                </View>

                {/* Rectangle */}
                <View
                  style={{
                    backgroundColor: '#E3F2FD',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="square-outline" size={18} color="#1976D2" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Rectangle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                    Measure rectangular objects. Tap two opposite corners to get length and height measurements.
                  </Text>
                </View>
              </FeatureCard>

              {/* Controls & Navigation */}
              <FeatureCard
                icon="options"
                title="Navigation & Controls"
                color="#FF3B30"
                delay={300}
              >
                <View style={{ marginLeft: 4 }}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🔄 Pan/Zoom Mode
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Pinch to zoom, drag to pan around the image. Perfect for exploring your photo before measuring.
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      ✏️ Measure Mode
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Tap to place measurement points. Pan/zoom locks after first point for precision. Switch back to Pan mode to reposition.
                    </Text>
                  </View>

                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🎨 Color-Coded Measurements
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Each measurement gets a unique vibrant color. Check the legend in the corner to identify them!
                    </Text>
                  </View>
                </View>
              </FeatureCard>

              {/* Export Features */}
              <FeatureCard
                icon="download"
                title="Save & Share"
                description="Export your measurements in multiple formats optimized for different uses."
                color="#5856D6"
                delay={400}
              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    📸 <Text style={{ fontWeight: '600' }}>Labeled Photo</Text> - Full measurements with annotations
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    🔧 <Text style={{ fontWeight: '600' }}>Fusion 360 Export</Text> - 50% opacity, perfectly scaled for CAD
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    📄 <Text style={{ fontWeight: '600' }}>Original Reference</Text> - Clean photo with scale info
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                    ✉️ <Text style={{ fontWeight: '600' }}>Email Reports</Text> - All photos + detailed measurement data
                  </Text>
                </View>
              </FeatureCard>

              {/* Pro Features */}
              <View style={{ marginBottom: 20 }}>
                <Animated.View 
                  entering={SlideInRight.delay(500).springify()}
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: '#FF9500',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                    borderWidth: 2,
                    borderColor: '#FFD700',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="star" size={28} color="#FF9500" />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginLeft: 8 }}>
                      Unlock Pro Features
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    Free users get 1 measurement per photo. Upgrade to Pro for unlimited precision:
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 24, marginBottom: 4 }}>
                      ✓ <Text style={{ fontWeight: '600' }}>Unlimited measurements</Text> per photo
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 24, marginBottom: 4 }}>
                      ✓ <Text style={{ fontWeight: '600' }}>Mix all measurement types</Text> (distance, angle, circle, rectangle)
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 24, marginBottom: 4 }}>
                      ✓ <Text style={{ fontWeight: '600' }}>Vibrant color-coded</Text> measurements
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 24, marginBottom: 4 }}>
                      ✓ <Text style={{ fontWeight: '600' }}>Remove watermarks</Text> from exports
                    </Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 24, fontWeight: '700' }}>
                      💎 One-time payment of $9.99 • Lifetime access
                    </Text>
                  </View>
                </Animated.View>
              </View>

              {/* Pro Tips */}
              <FeatureCard
                icon="bulb"
                title="Pro Tips"
                color="#00C7BE"
                delay={600}
              >
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    💡 <Text style={{ fontWeight: '600' }}>Measurements stay accurate</Text> - Zoom freely after placing, coordinates are stored in image space
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    💾 <Text style={{ fontWeight: '600' }}>Auto-save enabled</Text> - Close the app anytime, resume your session later
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    🔄 <Text style={{ fontWeight: '600' }}>Switch units anytime</Text> - Toggle between metric ⇄ imperial instantly
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                    🎯 <Text style={{ fontWeight: '600' }}>Use cursor guide</Text> - Measurement cursor appears above your finger for precise placement
                  </Text>
                </View>
              </FeatureCard>

              {/* About Section */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <Animated.View 
                  entering={FadeIn.delay(700)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                    borderWidth: 2,
                    borderColor: '#E5E5EA',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="information-circle" size={24} color="#007AFF" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', marginLeft: 8 }}>
                      About PanHandler
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, marginBottom: 16 }}>
                    Created by <Text style={{ fontWeight: '700', color: '#007AFF' }}>Snail</Text>, a 3D designer on a mission to make CAD designing faster, easier, and more accurate for everyone!
                  </Text>

                  <Pressable
                    onPress={() => Linking.openURL("https://youtube.com/@realsnail3d?si=K4XTUYdou1ZefOlB")}
                    style={{
                      backgroundColor: '#FF0000',
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#FF0000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name="logo-youtube" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10 }}>
                      Follow on YouTube
                    </Text>
                  </Pressable>

                  <Text style={{ fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 12, lineHeight: 18 }}>
                    Get CAD tips, tutorials, and updates on new features
                  </Text>
                </Animated.View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#E5E5EA',
                padding: 16,
                backgroundColor: 'white',
              }}
            >
              <AnimatedPressable
                entering={FadeIn.delay(700)}
                onPress={onClose}
                style={{
                  backgroundColor: '#007AFF',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>Got It! Let's Measure 🎯</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
