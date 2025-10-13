import React, { useEffect, useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Line, Circle, Path, Rect } from 'react-native-svg';
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
import useStore from '../state/measurementStore';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

// Expandable section component with GLOWING VIBRANT AESTHETIC
const ExpandableSection = ({ 
  title, 
  icon, 
  color, 
  children, 
  delay = 0 
}: { 
  title: string; 
  icon: string; 
  color: string; 
  children: React.ReactNode; 
  delay?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const heightValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 150 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay]);
  
  useEffect(() => {
    if (expanded) {
      heightValue.value = withSpring(1, { damping: 20, stiffness: 120 });
      rotateValue.value = withTiming(180, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      heightValue.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
      rotateValue.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [expanded]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: heightValue.value === 0 ? 0 : 2000,
    opacity: heightValue.value,
    overflow: 'hidden',
  }));
  
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 14 }]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setExpanded(!expanded);
        }}
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: 20,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 2,
          borderColor: `${color}40`,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `${color}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
              }}
            >
              <Ionicons name={icon as any} size={24} color={color} />
            </View>
            <Text style={{ 
              fontSize: 17, 
              fontWeight: '700', 
              color: '#1C1C1E', 
              flex: 1,
              letterSpacing: -0.3,
            }}>
              {title}
            </Text>
          </View>
          <AnimatedView style={chevronAnimatedStyle}>
            <Ionicons name="chevron-down" size={24} color={color} />
          </AnimatedView>
        </View>
        
        <AnimatedView style={contentAnimatedStyle}>
          <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
            {children}
          </View>
        </AnimatedView>
      </Pressable>
    </Animated.View>
  );
};

// Comparison row component for Free vs Pro table
const ComparisonRow = ({ 
  feature, 
  free, 
  pro,
  last = false 
}: { 
  feature: string; 
  free: string; 
  pro: string;
  last?: boolean;
}) => (
  <View 
    style={{ 
      flexDirection: 'row', 
      borderTopWidth: 1, 
      borderTopColor: 'rgba(0,0,0,0.06)',
    }}
  >
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 14, color: '#1C1C1E' }}>{feature}</Text>
    </View>
    <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
      <Text style={{ fontSize: 14, color: '#3C3C43' }}>{free}</Text>
    </View>
    <View style={{ 
      width: 70, 
      padding: 12, 
      alignItems: 'center',
      backgroundColor: 'rgba(255,149,0,0.08)',
    }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#FF9500' }}>{pro}</Text>
    </View>
  </View>
);

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  const insets = useSafeAreaInsets();
  const headerScale = useSharedValue(0.9);
  const globalDownloads = useStore((s) => s.globalDownloads);
  
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
      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View
            style={{
              flex: 1,
              marginTop: insets.top + 20,
              marginHorizontal: 16,
              marginBottom: insets.bottom + 20,
              borderRadius: 32,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.5,
              shadowRadius: 32,
              elevation: 24,
            }}
          >
            {/* Translucent Header with Blur */}
            <BlurView 
              intensity={100} 
              tint="light"
              style={{
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  paddingTop: 24,
                  paddingBottom: 20,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, headerAnimatedStyle]}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(0,122,255,0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                  }}>
                    <Ionicons name="help-circle" size={28} color="#007AFF" />
                  </View>
                  <View>
                    <Text style={{ 
                      color: '#1C1C1E', 
                      fontSize: 24, 
                      fontWeight: '700',
                      letterSpacing: -0.5,
                    }}>
                      Guide
                    </Text>
                    <Text style={{ 
                      color: '#8E8E93', 
                      fontSize: 13, 
                      fontWeight: '600',
                      marginTop: -2,
                    }}>
                      By CAD pros, for CAD pros
                    </Text>
                  </View>
                </Animated.View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(120,120,128,0.16)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={24} color="#3C3C43" />
                </Pressable>
              </View>
            </BlurView>

            {/* Content with glassmorphism background */}
            <BlurView intensity={95} tint="light" style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(245,245,247,0.75)' }}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 20 }}
                  showsVerticalScrollIndicator={false}
                >
              {/* Camera & Auto Level */}
              <ExpandableSection
                icon="camera"
                title="📸 Step 1: Take a Perfect Photo"
                color="#34C759"
                delay={0}
              >
                <View style={{ marginLeft: 4 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📐</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Hold perpendicular</Text> - Camera straight down (90°)
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>📏</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Distance matters:</Text>{'\n'}
                      • Small objects: 18 inches (1.5 feet / 0.5m){'\n'}
                      • Large objects: 3-4 feet away
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🪙</Text>
                    <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Coin in center of object</Text>
                    </Text>
                  </View>
                </View>

                {/* Auto Level Feature */}
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(52,199,89,0.12)',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: 'rgba(52,199,89,0.3)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Ionicons name="flash" size={22} color="#34C759" />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32', marginLeft: 6 }}>
                      AUTO LEVEL Mode
                    </Text>
                  </View>
                  
                  {/* Visual: Finger holding button */}
                  <View style={{ alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ fontSize: 36 }}>👆</Text>
                      <View style={{
                        backgroundColor: 'rgba(52,199,89,0.2)',
                        paddingHorizontal: 18,
                        paddingVertical: 12,
                        borderRadius: 26,
                        borderWidth: 3,
                        borderColor: '#34C759',
                        shadowColor: '#34C759',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                      }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#2E7D32' }}>HOLD SHUTTER</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 10, textAlign: 'center' }}>
                    Press and hold the shutter button for hands-free capture
                  </Text>
                  
                  {/* Color indicator flow */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF3B30' }} />
                      <Text style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>Too tilted</Text>
                    </View>
                    <Text style={{ fontSize: 18, marginHorizontal: 8, color: '#8E8E93' }}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFCC00' }} />
                      <Text style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>Close</Text>
                    </View>
                    <Text style={{ fontSize: 18, marginHorizontal: 8, color: '#8E8E93' }}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#34C759' }} />
                      <Text style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>Perfect!</Text>
                    </View>
                  </View>
                  
                  <View style={{ marginTop: 8, backgroundColor: 'rgba(52,199,89,0.15)', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontSize: 13, color: '#2E7D32', fontStyle: 'italic', textAlign: 'center' }}>
                      💡 Green = Auto countdown starts → Photo captures automatically
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Calibration */}
              <ExpandableSection
                icon="analytics"
                title="🪙 Step 2: Calibrate with Coin"
                color="#FF9500"
                delay={100}
              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  After capturing your photo, calibrate using the reference coin to enable precise measurements.
                </Text>
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • <Text style={{ fontWeight: '600' }}>Search for your coin type</Text> - Over 100 coin types from around the world!
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • Zoom in and position the calibration circle
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 6 }}>
                    • <Text style={{ fontWeight: '600' }}>Align circle edges perfectly to cover the coin</Text> - Match the outer edge precisely
                  </Text>
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22 }}>
                    • Tap "Lock In Calibration" when ready
                  </Text>
                </View>
              </ExpandableSection>

              {/* Measurement Modes */}
              <ExpandableSection
                icon="resize"
                title="📏 Step 3: Place Measurements"
                color="#AF52DE"
                delay={200}
              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  Choose from multiple measurement types to capture all dimensions of your object.
                </Text>
                
                {/* Distance */}
                <View
                  style={{
                    backgroundColor: 'rgba(175,82,222,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(175,82,222,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom distance icon matching menu */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Line x1="3" y1="8" x2="13" y2="8" stroke="#AF52DE" strokeWidth="1.5" />
                      <Circle cx="3" cy="8" r="2" fill="#AF52DE" />
                      <Circle cx="13" cy="8" r="2" fill="#AF52DE" />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Distance Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Measure straight-line distances. Tap to place two points and get the distance between them.
                  </Text>
                </View>

                {/* Angle */}
                <View
                  style={{
                    backgroundColor: 'rgba(255,149,0,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(255,149,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom angle icon matching menu - 45 degree acute angle */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Line x1="3" y1="13" x2="13" y2="3" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" />
                      <Line x1="3" y1="13" x2="13" y2="13" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" />
                      <Path d="M 7 13 A 5.66 5.66 0 0 1 6 8" stroke="#FF9500" strokeWidth="1.3" fill="none" />
                      <Line x1="6" y1="12" x2="6.8" y2="12.8" stroke="#FF9500" strokeWidth="1" strokeLinecap="round" />
                      <Line x1="5.2" y1="10" x2="4.4" y2="10.2" stroke="#FF9500" strokeWidth="1" strokeLinecap="round" />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Angle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Measure angles between two lines. Place first endpoint, then vertex (corner), then second endpoint.
                  </Text>
                </View>

                {/* Circle */}
                <View
                  style={{
                    backgroundColor: 'rgba(233,30,99,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(233,30,99,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="radio-button-off" size={20} color="#E91E63" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Circle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Measure circular objects. Tap center point, then tap edge to define radius and diameter.
                  </Text>
                </View>

                {/* Rectangle */}
                <View
                  style={{
                    backgroundColor: 'rgba(25,118,210,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: 'rgba(25,118,210,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="square-outline" size={20} color="#1976D2" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Rectangle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Measure rectangular objects. Tap two opposite corners to get length and height measurements.
                  </Text>
                </View>

                {/* Freehand/Free Measure */}
                <View
                  style={{
                    backgroundColor: 'rgba(16,185,129,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(16,185,129,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Freehand squiggle icon */}
                    <Svg width={20} height={20} viewBox="0 0 16 16">
                      <Path 
                        d="M 2 8 Q 4 6, 6 8 T 10 8 Q 12 9, 14 7" 
                        stroke="#10B981" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Freehand Mode (Free Measure)
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 8 }}>
                    Draw custom paths to measure any shape. Perfect for wire paths, curved edges, or irregular contours.
                  </Text>
                  <View style={{ backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 10, padding: 10, marginTop: 4 }}>
                    <Text style={{ fontSize: 13, color: '#2E7D32', fontWeight: '600', marginBottom: 4 }}>
                      How to use:
                    </Text>
                    <Text style={{ fontSize: 13, color: '#3C3C43', lineHeight: 19 }}>
                      1. Long-press the Distance button{'\n'}
                      2. Place finger and hold for 1.5 seconds{'\n'}
                      3. Draw your path{'\n'}
                      4. Release to complete
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(16,185,129,0.15)' }}>
                    <Text style={{ fontSize: 13, color: '#3C3C43', fontStyle: 'italic', lineHeight: 18 }}>
                      💡 Great for calculating wire paths in electrical projects, curved distances, or any non-straight measurement!
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Controls & Navigation */}
              <ExpandableSection
                icon="navigate-circle"
                title="🎮 Navigation & Controls"
                color="#FF3B30"
                delay={300}
              >
                <View style={{ gap: 12 }}>
                  {/* Pan/Zoom */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🗺️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Pan/Zoom Mode
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Pinch to zoom, drag to pan
                      </Text>
                    </View>
                  </View>

                  {/* Measure */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>📏</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Measure Mode
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Tap to place points with precision cursor
                      </Text>
                    </View>
                  </View>

                  {/* Cursor */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🎯</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Precision Cursor
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Floating crosshair shows exactly where points will be placed
                      </Text>
                    </View>
                  </View>

                  {/* Colors */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🎨</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Color-Coded
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Each measurement gets a unique color
                      </Text>
                    </View>
                  </View>

                  {/* Menu Controls */}
                  <View
                    style={{
                      backgroundColor: 'rgba(255,59,48,0.12)',
                      borderRadius: 14,
                      padding: 14,
                      marginTop: 8,
                      borderWidth: 2,
                      borderColor: 'rgba(255,59,48,0.25)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Ionicons name="menu" size={20} color="#FF3B30" />
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FF3B30', marginLeft: 6 }}>
                        Menu Controls
                      </Text>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        • <Text style={{ fontWeight: '600' }}>Swipe left anywhere on menu</Text> to collapse it off-screen
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        • <Text style={{ fontWeight: '600' }}>Tap side tab</Text> to bring menu back
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        • <Text style={{ fontWeight: '600' }}>Drag side tab up/down</Text> to reposition it
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        • Menu collapses instantly for quick workspace access
                      </Text>
                    </View>
                  </View>

                  {/* Visual Sample */}
                  <View style={{ marginTop: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16 }}>
                    <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 12, fontWeight: '600' }}>
                      Example measurement:
                    </Text>
                    <View style={{ position: 'relative', width: 220, height: 80 }}>
                      <Svg width={220} height={80} viewBox="0 0 220 80">
                        {/* Measurement line */}
                        <Line x1={30} y1={40} x2={190} y2={40} stroke="#3B82F6" strokeWidth="3" />
                        
                        {/* Start point */}
                        <Circle cx={30} cy={40} r={8} fill="#3B82F6" stroke="white" strokeWidth="2" />
                        
                        {/* End point */}
                        <Circle cx={190} cy={40} r={8} fill="#3B82F6" stroke="white" strokeWidth="2" />
                        
                        {/* Label background */}
                        <Rect x={85} y={10} width={50} height={20} rx={4} fill="#3B82F6" />
                      </Svg>
                      <Text style={{ 
                        position: 'absolute', 
                        top: 13, 
                        left: 0, 
                        right: 0, 
                        textAlign: 'center',
                        fontSize: 12, 
                        color: 'white', 
                        fontWeight: '600' 
                      }}>
                        145.2 mm
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 8, fontStyle: 'italic', textAlign: 'center' }}>
                      Measurements show as colored lines with labeled values
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Move & Edit Mode */}
              <ExpandableSection
                icon="move"
                title="✏️ Move & Edit Measurements"
                color="#FF2D55"
                delay={350}
              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  After placing measurements, you can move and edit them in Pan/Zoom mode.
                </Text>
                
                <View style={{ gap: 12 }}>
                  {/* Move Whole Measurements */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>👆</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Move Measurements
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Tap and drag circles, rectangles, or freehand paths to move them around
                      </Text>
                    </View>
                  </View>

                  {/* Edit Individual Points */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🎯</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Edit Points
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Tap and drag any point to adjust measurements. Freehand paths can be reshaped by moving individual points!
                      </Text>
                    </View>
                  </View>

                  {/* 4-Tap Delete */}
                  <View
                    style={{
                      backgroundColor: 'rgba(255,45,85,0.12)',
                      borderRadius: 14,
                      padding: 14,
                      marginTop: 4,
                      borderWidth: 2,
                      borderColor: 'rgba(255,45,85,0.25)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, marginRight: 8 }}>🗑️</Text>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FF2D55' }}>
                        Quick Delete: 4 Rapid Taps
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                      Tap any measurement 4 times rapidly (within 500ms each) to delete it. You will feel haptic feedback with each tap!
                    </Text>
                  </View>

                  {/* Snap to Points */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🧲</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Magnetic Snapping
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Points snap to nearby existing points (7mm range) when moving, making precise alignment easy
                      </Text>
                    </View>
                  </View>
                </View>
              </ExpandableSection>

              {/* Export Features */}
              <ExpandableSection
                icon="download"
                title="💾 Save & Share"
                color="#5856D6"
                delay={400}
              >
                {/* FREE badge */}
                <View style={{ 
                  backgroundColor: 'rgba(52,199,89,0.15)', 
                  alignSelf: 'flex-start',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 22,
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#34C759' }}>
                    ✓ FREE - 10 saves & 10 emails per month
                  </Text>
                </View>

                <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 12 }}>
                  Export photos with measurements and detailed reports
                </Text>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>📸</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Labeled Photo</Text> - All measurements shown
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>🔧</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>CAD Export</Text> - 50% opacity, perfectly scaled
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>📄</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Reference Photo</Text> - Clean with scale info
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>✉️</Text>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>Email Reports</Text> - All photos + data
                    </Text>
                  </View>
                </View>

                {/* CAD Integration */}
                <View
                  style={{
                    backgroundColor: 'rgba(88,86,214,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(88,86,214,0.25)',
                    marginTop: 14,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="cube" size={20} color="#5856D6" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                      Works with Any CAD Software
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Import photos as canvases in any CAD software. Scale values are included on every export for perfect alignment.
                  </Text>
                </View>
              </ExpandableSection>

              {/* Email Workflow - Expandable */}
              <ExpandableSection
                title="📧 Email Workflow Guide"
                icon="mail"
                color="#34C759"
                delay={450}
              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  Tap <Text style={{ fontWeight: '600', color: '#34C759' }}>Email</Text> to generate a report with 2 photos and a detailed measurement table.
                </Text>
                
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8, fontWeight: '600' }}>
                  Example Email Format
                </Text>
                
                <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E5EA' }}>
                  <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 8 }}>
                    Subject: <Text style={{ color: '#1C1C1E', fontWeight: '600' }}>PanHandler Measurement Report</Text>
                  </Text>
                  <View style={{ height: 1, backgroundColor: '#E5E5EA', marginBottom: 10 }} />
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    Measurement Report from PanHandler{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Calibration Reference:</Text> 24.26mm (US Quarter){'\n'}
                    <Text style={{ fontWeight: '600' }}>Unit System:</Text> Metric{'\n'}
                    <Text style={{ fontWeight: '600' }}>Pixels Per Unit:</Text> 41.23 px/mm{'\n'}
                    <Text style={{ fontWeight: '600' }}>Canvas Scale:</Text> 41.23 px/mm{'\n'}
                    <Text style={{ fontWeight: '600' }}>Image Resolution:</Text> 3024 × 4032 pixels{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Measurements:</Text>{'\n'}
                    🔵 Blue Distance: 145.2mm{'\n'}
                    🟢 Green Angle: 87.5°{'\n'}
                    🔴 Red Circle: Ø 52.3mm{'\n\n'}
                    <Text style={{ fontSize: 12, color: '#8E8E93', fontStyle: 'italic' }}>
                      Scale calculation: 1000 pixels ÷ 24.26mm = 41.23 px/mm{'\n'}
                    </Text>
                    {'\n'}
                    Attached: 2 photos (measurements + transparent CAD canvas)
                  </Text>
                </View>

                {/* "The Nerdy Stuff" Link */}
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      '🤓 The Nerdy Stuff: How PanHandler Works',
                      '═══ CALIBRATION ═══\n\n' +
                      '1️⃣ COIN REFERENCE SETUP:\n' +
                      'You place a calibration circle over the coin in your photo. The circle is 200px diameter on screen. When you zoom the photo to match the circle to the coin, we calculate:\n\n' +
                      'coinPixelSize = 200px ÷ currentZoomScale\n' +
                      'pixelsPerUnit = coinPixelSize ÷ actualCoinDiameter\n\n' +
                      'Example: If you zoom 2x to match a 24.26mm quarter:\n' +
                      '• coinPixelSize = 200px ÷ 2 = 100px\n' +
                      '• pixelsPerUnit = 100px ÷ 24.26mm = 4.12 px/mm\n\n' +
                      'This ratio stays constant for the entire photo!\n\n' +
                      '═══ MEASUREMENTS ═══\n\n' +
                      '2️⃣ DISTANCE (Line Mode):\n' +
                      'Two points define a line. We use the Pythagorean theorem:\n\n' +
                      'pixelDistance = √((x₂-x₁)² + (y₂-y₁)²)\n' +
                      'realDistance = pixelDistance ÷ pixelsPerUnit\n\n' +
                      'Example: 412px ÷ 4.12 px/mm = 100mm\n\n' +
                      '3️⃣ ANGLE MODE:\n' +
                      'Three points: endpoint₁, vertex (corner), endpoint₂\n' +
                      'We calculate the angle at the vertex using atan2:\n\n' +
                      'angle₁ = atan2(y₁-yᵥ, x₁-xᵥ)\n' +
                      'angle₂ = atan2(y₂-yᵥ, x₂-xᵥ)\n' +
                      'finalAngle = |angle₂ - angle₁| × (180/π)\n\n' +
                      '4️⃣ CIRCLE MODE:\n' +
                      'Two points: center + edge point\n' +
                      'Radius in pixels, then convert:\n\n' +
                      'radiusPixels = √((xₑ-xᴄ)² + (yₑ-yᴄ)²)\n' +
                      'radiusReal = radiusPixels ÷ pixelsPerUnit\n' +
                      'diameter = radiusReal × 2\n\n' +
                      '5️⃣ RECTANGLE (Box Mode):\n' +
                      'Four corners stored (top-left, top-right, bottom-right, bottom-left)\n' +
                      'We use opposite corners (points[0] and points[2]):\n\n' +
                      'widthPixels = |x₂ - x₀|\n' +
                      'heightPixels = |y₂ - y₀|\n' +
                      'width = widthPixels ÷ pixelsPerUnit\n' +
                      'height = heightPixels ÷ pixelsPerUnit\n\n' +
                      '6️⃣ FREEHAND (Free Measure) - THE COOL ONE! 🎨\n' +
                      'You draw a custom path by dragging your finger!\n' +
                      'We capture points along your path (every few pixels) and calculate the TOTAL path length:\n\n' +
                      'totalLength = 0\n' +
                      'for each consecutive point pair:\n' +
                      '  segmentLength = √((xᵢ₊₁-xᵢ)² + (yᵢ₊₁-yᵢ)²)\n' +
                      '  totalLength += segmentLength\n\n' +
                      'realLength = totalLength ÷ pixelsPerUnit\n\n' +
                      'This works for ANY shape: curves, zigzags, wire paths, irregular contours - you name it! Perfect for measuring things like:\n' +
                      '• Electrical wire routing paths\n' +
                      '• Curved edges of objects\n' +
                      '• Irregular perimeters\n' +
                      '• Any non-straight distance\n\n' +
                      'You can even EDIT the path after drawing by dragging individual points!\n\n' +
                      '═══ CAD EXPORT ═══\n\n' +
                      '7️⃣ CANVAS SCALING:\n' +
                      'For CAD import, we provide the inverse ratio:\n\n' +
                      'canvasScale = 1 ÷ pixelsPerUnit\n' +
                      'Example: 1 ÷ 4.12 px/mm = 0.2427 mm/px\n\n' +
                      'Set this as your canvas scale (X/Y) in CAD software for perfect 1:1 alignment!\n\n' +
                      '═══ WHY IT WORKS ═══\n\n' +
                      'The coin calibration creates a pixels-to-real-world ratio that applies to the ENTIRE photo (assuming the surface is flat and parallel to the camera).\n\n' +
                      'All measurements - whether straight lines, curves, angles, or complex paths - use this same ratio for accurate dimensions!\n\n' +
                      '🎯 PRO TIP: Higher resolution photos = more pixels per mm = better precision (we achieve ~0.5mm accuracy!)'
                    );
                  }}
                  style={{ marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(0,122,255,0.1)', borderRadius: 10, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 13, color: '#007AFF', fontWeight: '600' }}>
                    🤓 Read "the nerdy stuff" - How the math works
                  </Text>
                </Pressable>
              </ExpandableSection>

              {/* CAD Import Tutorial - Expandable */}
              <ExpandableSection
                title="🔧 CAD Import Guide"
                icon="construct"
                color="#FF9500"
                delay={500}
              >
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12, fontWeight: '600' }}>
                  Import to Any CAD Software
                </Text>
                <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 21, marginBottom: 16 }}>
                  Use the CAD Canvas Photo to trace your measurements in any CAD software that supports canvas images.
                </Text>
                
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>1</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Open Your CAD Software
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Create a new project or open an existing design
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>2</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Insert Canvas Image
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Import the CAD Canvas Photo from PanHandler as a canvas or reference image
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>3</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Set Canvas Scale
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 8 }}>
                        Use the scale value shown on the photo to calibrate your canvas
                      </Text>
                      <View style={{ backgroundColor: 'rgba(255,149,0,0.12)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,149,0,0.25)' }}>
                        <Text style={{ fontSize: 13, color: '#3C3C43', lineHeight: 18 }}>
                          <Text style={{ fontWeight: '700' }}>Example:</Text> If the photo shows "Canvas Scale: 0.0412", enter this value in your CAD software's canvas calibration settings
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>4</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Trace & Model
                      </Text>
                      <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                        Trace over the 50% opacity image using your CAD tools. All measurements are perfectly scaled!
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ backgroundColor: 'rgba(52,199,89,0.12)', borderRadius: 14, padding: 12, marginTop: 8, borderWidth: 2, borderColor: 'rgba(52,199,89,0.25)' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#34C759', marginLeft: 6 }}>
                      Pro Tip
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#3C3C43', lineHeight: 19 }}>
                    The 50% opacity makes it easy to see your CAD lines while still having the reference visible
                  </Text>
                </View>
              </ExpandableSection>

              {/* Pro Features with Comparison Chart */}
              <View style={{ marginBottom: 20 }}>
                <Animated.View 
                  entering={SlideInRight.delay(500).springify()}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#FF9500',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.25,
                    shadowRadius: 14,
                    elevation: 8,
                    borderWidth: 2,
                    borderColor: 'rgba(255,149,0,0.3)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255,149,0,0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                      shadowColor: '#FF9500',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                    }}>
                      <Ionicons name="star" size={22} color="#FF9500" />
                    </View>
                    <Text style={{ fontSize: 19, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
                      Free vs Pro
                    </Text>
                  </View>

                  {/* Comparison Table */}
                  <View style={{ 
                    borderRadius: 14, 
                    borderWidth: 1, 
                    borderColor: 'rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                  }}>
                    {/* Header Row */}
                    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                      <View style={{ flex: 1, padding: 12 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>Feature</Text>
                      </View>
                      <View style={{ width: 70, padding: 12, alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93' }}>Free</Text>
                      </View>
                      <View style={{ width: 70, padding: 12, alignItems: 'center', backgroundColor: 'rgba(255,149,0,0.08)' }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#FF9500' }}>Pro</Text>
                      </View>
                    </View>

                    {/* Feature Rows */}
                    <ComparisonRow feature="Monthly Saves" free="10" pro="∞" />
                    <ComparisonRow feature="Monthly Emails" free="10" pro="∞" />
                    <ComparisonRow feature="Measurements" free="∞" pro="∞" />
                    <ComparisonRow feature="All Measurement Types" free="✓" pro="✓" />
                    <ComparisonRow feature="Coin Calibration" free="✓" pro="✓" />
                    <ComparisonRow feature="CAD Canvas Photo" free="✓" pro="✓" last />
                  </View>

                  {/* Price */}
                  <View style={{ marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, fontWeight: '700', color: '#1C1C1E' }}>
                      $9.97
                    </Text>
                    <Text style={{ fontSize: 14, color: '#8E8E93', marginTop: 2 }}>
                      One-time payment • Lifetime access
                    </Text>
                  </View>

                  {/* Upgrade Button */}
                  <Pressable
                    onPress={() => {
                      // TODO: Implement Pro upgrade
                      console.log('Upgrade to Pro tapped');
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#E68900' : '#FF9500',
                      paddingVertical: 16,
                      borderRadius: 16,
                      marginTop: 16,
                      shadowColor: '#FF9500',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: pressed ? 0.5 : 0.35,
                      shadowRadius: pressed ? 16 : 12,
                      elevation: 8,
                    })}
                  >
                    <Text style={{ 
                      color: 'white', 
                      fontSize: 17, 
                      fontWeight: '700', 
                      textAlign: 'center',
                      letterSpacing: -0.2,
                    }}>
                      Upgrade to Pro
                    </Text>
                  </Pressable>

                  {/* Restore Purchase Link */}
                  <Pressable
                    onPress={() => {
                      // TODO: Implement restore purchase
                      console.log('Restore purchase tapped');
                    }}
                    style={({ pressed }) => ({
                      paddingVertical: 12,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ 
                      color: '#007AFF', 
                      fontSize: 14, 
                      fontWeight: '600', 
                      textAlign: 'center' 
                    }}>
                      Restore Purchase
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>

              {/* Pro Tips */}
              <ExpandableSection
                icon="bulb"
                title="💡 Pro Tips"
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
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    🎯 <Text style={{ fontWeight: '600' }}>Use cursor guide</Text> - Measurement cursor appears above your finger for precise placement
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 8 }}>
                    ✏️ <Text style={{ fontWeight: '600' }}>Edit after placing</Text> - Move measurements or adjust individual points in Pan/Zoom mode
                  </Text>
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                    🗑️ <Text style={{ fontWeight: '600' }}>Quick delete</Text> - Tap any measurement 4 times rapidly to delete it
                  </Text>
                </View>
                
                {/* Epic Stress Test Showcase */}
                <View style={{
                  marginTop: 16,
                  backgroundColor: 'rgba(0,122,255,0.12)',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: 'rgba(0,122,255,0.25)',
                }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: '#1C1C1E', 
                    textAlign: 'center',
                    marginBottom: 10,
                    letterSpacing: -0.3,
                  }}>
                    🚀 Add as many points as you want - you can't break it!
                  </Text>
                  <Image 
                    source={{ uri: 'https://images.composerapi.com/93039A99-47C5-414B-80B6-3CF31EECDF86.jpg' }}
                    style={{ 
                      width: '100%', 
                      height: 180,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                  <Text style={{
                    fontSize: 12,
                    color: '#3C3C43',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: 18,
                  }}>
                    Real stress test: 53 measurements! The app handles complex projects with ease. 📏✨
                  </Text>
                </View>
              </ExpandableSection>

              {/* Accuracy Fun Fact Section */}
              <View style={{ marginBottom: 16, marginTop: 12 }}>
                <Animated.View 
                  entering={FadeIn.delay(650)}
                  style={{
                    backgroundColor: 'rgba(255,204,0,0.15)',
                    borderRadius: 20,
                    padding: 18,
                    shadowColor: '#FFCC00',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                    borderWidth: 2,
                    borderColor: 'rgba(255,204,0,0.35)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="star" size={24} color="#FFCC00" />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginLeft: 8, letterSpacing: -0.3 }}>
                      🎯 Amazing Accuracy
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, marginBottom: 14, textAlign: 'center' }}>
                    PanHandler achieves{' '}
                    <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>
                      ~0.5 mm accuracy
                    </Text>
                    {'\n'}with small objects
                  </Text>
                  
                  <View style={{ 
                    backgroundColor: 'rgba(255,204,0,0.1)', 
                    borderRadius: 14, 
                    padding: 14, 
                    borderWidth: 1, 
                    borderColor: 'rgba(255,204,0,0.2)',
                    gap: 6,
                  }}>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', marginBottom: 4, fontWeight: '600', textAlign: 'center' }}>
                      📐 That's approximately:
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, textAlign: 'center' }}>
                      • 1/50th of an inch
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, textAlign: 'center' }}>
                      • Thickness of a credit card
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, textAlign: 'center' }}>
                      • 5-6 sheets of paper
                    </Text>
                  </View>

                  <Text style={{ fontSize: 13, color: '#3C3C43', fontStyle: 'italic', marginTop: 12, lineHeight: 18, textAlign: 'center' }}>
                    💡 Tip: Higher resolution photos = better accuracy
                  </Text>
                </Animated.View>
              </View>

              {/* About Section */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <Animated.View 
                  entering={FadeIn.delay(700)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(0,122,255,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0,122,255,0.15)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                      <Ionicons name="information-circle" size={24} color="#007AFF" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
                      About PanHandler
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                    <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22 }}>
                      Created by{' '}
                    </Text>
                    <Image 
                      source={require('../../assets/snail-logo.png')} 
                      style={{ width: 20, height: 20, marginRight: 4 }}
                      resizeMode="contain"
                    />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', lineHeight: 22 }}>
                      Snail
                    </Text>
                    <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22 }}>
                      , a 3D designer on a mission to make CAD designing faster, easier, and more accurate for everyone!
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => Linking.openURL("https://youtube.com/@realsnail3d?si=K4XTUYdou1ZefOlB")}
                    style={{
                      backgroundColor: '#FF0000',
                      borderRadius: 14,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#FF0000',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.35,
                      shadowRadius: 10,
                      elevation: 6,
                    }}
                  >
                    <Ionicons name="logo-youtube" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8, letterSpacing: -0.2 }}>
                      Follow on YouTube
                    </Text>
                  </Pressable>

                  <Text style={{ fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 12, lineHeight: 18 }}>
                    Get CAD tips, tutorials, and updates on new features
                  </Text>
                </Animated.View>
              </View>

              {/* Easter Egg Hints Section - At the very bottom of scrollable content */}
              <View style={{ marginBottom: 20, marginTop: 8 }}>
                <Animated.View 
                  entering={FadeIn.delay(800)}
                  style={{
                    backgroundColor: 'rgba(255,215,0,0.15)',
                    borderRadius: 20,
                    padding: 18,
                    shadowColor: '#FFD700',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 14,
                    elevation: 6,
                    borderWidth: 2,
                    borderColor: 'rgba(255,215,0,0.4)',
                    borderStyle: 'dashed',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 28 }}>🥚</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginHorizontal: 10, letterSpacing: -0.3 }}>
                      Hidden Surprises
                    </Text>
                    <Text style={{ fontSize: 28 }}>🥚</Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, textAlign: 'center', fontStyle: 'italic' }}>
                    Some badges hide secrets... if you are persistent enough 🤔
                  </Text>
                </Animated.View>
              </View>
            </ScrollView>
              </View>
            </BlurView>

            {/* Translucent Footer with Blur */}
            <BlurView 
              intensity={100} 
              tint="light"
              style={{
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(0,0,0,0.08)',
                }}
              >
                {/* Heartfelt Message with Download Counter */}
                <AnimatedView
                  entering={FadeIn.delay(750)}
                  style={{
                    marginBottom: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    backgroundColor: 'rgba(255,105,180,0.12)',
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: 'rgba(255,105,180,0.25)',
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#1C1C1E', 
                    textAlign: 'center',
                    lineHeight: 20,
                    fontWeight: '600'
                  }}>
                    ❤️ {globalDownloads.toLocaleString()} people trust PanHandler
                  </Text>
                </AnimatedView>

                <AnimatedPressable
                  entering={FadeIn.delay(700)}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    onClose();
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#0066CC' : '#007AFF',
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: pressed ? 0.5 : 0.35,
                    shadowRadius: pressed ? 16 : 12,
                    elevation: 8,
                  })}
                >
                  <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', letterSpacing: -0.2 }}>
                    Got It! Let's Measure 🎯
                  </Text>
                </AnimatedPressable>
              </View>
            </BlurView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
