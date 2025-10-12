import React, { useEffect, useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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

// Expandable section component
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
        onPress={() => setExpanded(!expanded)}
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: `${color}15`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text style={{ 
              fontSize: 17, 
              fontWeight: '600', 
              color: '#1C1C1E', 
              flex: 1,
              letterSpacing: -0.3,
            }}>
              {title}
            </Text>
          </View>
          <AnimatedView style={chevronAnimatedStyle}>
            <Ionicons name="chevron-down" size={22} color={color} />
          </AnimatedView>
        </View>
        
        <AnimatedView style={contentAnimatedStyle}>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {children}
          </View>
        </AnimatedView>
      </Pressable>
    </Animated.View>
  );
};

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
      <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              flex: 1,
              marginTop: insets.top + 20,
              marginHorizontal: 16,
              marginBottom: insets.bottom + 20,
              borderRadius: 28,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 24,
              elevation: 24,
            }}
          >
            {/* Translucent Header with Blur */}
            <BlurView 
              intensity={95} 
              tint="light"
              style={{
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
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
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  borderBottomWidth: 0.5,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, headerAnimatedStyle]}>
                  <View style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: 'rgba(0,122,255,0.12)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                    <Ionicons name="help-circle" size={26} color="#007AFF" />
                  </View>
                  <View>
                    <Text style={{ 
                      color: '#1C1C1E', 
                      fontSize: 22, 
                      fontWeight: '700',
                      letterSpacing: -0.5,
                    }}>
                      Guide
                    </Text>
                    <Text style={{ 
                      color: '#8E8E93', 
                      fontSize: 13, 
                      fontWeight: '500',
                      marginTop: -2,
                    }}>
                      Master PanHandler
                    </Text>
                  </View>
                </Animated.View>
                <Pressable
                  onPress={onClose}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(120,120,128,0.16)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={22} color="#3C3C43" />
                </Pressable>
              </View>
            </BlurView>

            {/* Content with subtle background */}
            <View style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
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
                      <Text style={{ fontWeight: '600' }}>Distance: 3-4 feet</Text> - About arm's length above
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
                    backgroundColor: 'rgba(76,175,80,0.08)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: 'rgba(76,175,80,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Ionicons name="flash" size={20} color="#34C759" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#2E7D32', marginLeft: 6 }}>
                      AUTO LEVEL Mode
                    </Text>
                  </View>
                  
                  {/* Visual: Finger holding button */}
                  <View style={{ alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ fontSize: 32 }}>👆</Text>
                      <View style={{
                        backgroundColor: 'rgba(52,199,89,0.15)',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 24,
                        borderWidth: 2,
                        borderColor: '#34C759',
                      }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32' }}>HOLD SHUTTER</Text>
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
                  
                  <View style={{ marginTop: 8, backgroundColor: 'rgba(76,175,80,0.12)', borderRadius: 8, padding: 10 }}>
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
                    backgroundColor: 'rgba(175,82,222,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: 'rgba(175,82,222,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom distance icon matching menu */}
                    <Svg width={18} height={18} viewBox="0 0 16 16">
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
                    backgroundColor: 'rgba(255,149,0,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: 'rgba(255,149,0,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {/* Custom angle icon matching menu - 45 degree acute angle */}
                    <Svg width={18} height={18} viewBox="0 0 16 16">
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
                    backgroundColor: 'rgba(233,30,99,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: 'rgba(233,30,99,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="radio-button-off" size={18} color="#E91E63" />
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
                    backgroundColor: 'rgba(25,118,210,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 0.5,
                    borderColor: 'rgba(25,118,210,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="square-outline" size={18} color="#1976D2" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginLeft: 8 }}>
                      Rectangle Mode
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                    Measure rectangular objects. Tap two opposite corners to get length and height measurements.
                  </Text>
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

                  {/* Visual Sample */}
                  <View style={{ marginTop: 12, alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16 }}>
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

              {/* Export Features */}
              <ExpandableSection
                icon="download"
                title="💾 Save & Share"
                color="#5856D6"
                delay={400}
              >
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  Export your measurements in multiple formats optimized for different uses.
                </Text>
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
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    ✉️ <Text style={{ fontWeight: '600' }}>Email Reports</Text> - All photos + detailed measurement data
                  </Text>
                </View>

                {/* CAD Integration Tips */}
                <View
                  style={{
                    backgroundColor: 'rgba(88,86,214,0.08)',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(88,86,214,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="cube" size={18} color="#5856D6" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                      CAD Software Integration
                    </Text>
                  </View>
                  <View style={{ marginLeft: 4 }}>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 6 }}>
                      • <Text style={{ fontWeight: '600' }}>Center alignment guides</Text> help position objects perfectly for CAD import
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 6 }}>
                      • <Text style={{ fontWeight: '600' }}>Scale notes on every photo</Text> show exact Canvas Scale values for Fusion 360
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20 }}>
                      • <Text style={{ fontWeight: '600' }}>No guesswork!</Text> Insert {`>`} Canvas {`>`} Set Scale X/Y to the provided value
                    </Text>
                  </View>
                </View>
              </ExpandableSection>

              {/* Email Workflow - Expandable */}
              <ExpandableSection
                title="📧 Email Workflow Guide"
                icon="mail"
                color="#34C759"
                delay={450}
              >
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12, fontWeight: '600' }}>
                  How Email Reports Work
                </Text>
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 12 }}>
                  When you tap the <Text style={{ fontWeight: '600', color: '#34C759' }}>Email</Text> button, PanHandler generates a comprehensive report containing:
                </Text>
                
                <View style={{ backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 4 }}>
                    📎 <Text style={{ fontWeight: '600' }}>3 Attached Photos:</Text>
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • Labeled photo with all measurements
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • Fusion 360 export (50% opacity)
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • Original reference photo with scale
                    </Text>
                  </View>
                </View>

                <View style={{ backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 4 }}>
                    📊 <Text style={{ fontWeight: '600' }}>Detailed Measurement Table:</Text>
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • All measurements with color coding
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • Measurement types (distance, angle, etc.)
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 19 }}>
                      • Precise values in your selected units
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 8, marginTop: 8, fontWeight: '600' }}>
                  Example Email Format
                </Text>
                
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E5EA' }}>
                  <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 8 }}>
                    Subject: <Text style={{ color: '#1C1C1E', fontWeight: '600' }}>PanHandler Measurement Report</Text>
                  </Text>
                  <View style={{ height: 1, backgroundColor: '#E5E5EA', marginBottom: 10 }} />
                  <Text style={{ fontSize: 13, color: '#1C1C1E', lineHeight: 19 }}>
                    Measurement Report from PanHandler{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Calibration Reference:</Text> 24.26mm (US Quarter){'\n'}
                    <Text style={{ fontWeight: '600' }}>Unit System:</Text> Metric{'\n'}
                    <Text style={{ fontWeight: '600' }}>Pixels Per Unit:</Text> 41.23 px/mm{'\n'}
                    <Text style={{ fontWeight: '600' }}>Canvas Scale (Fusion 360):</Text> 41.23 px/mm{'\n'}
                    <Text style={{ fontWeight: '600' }}>Image Resolution:</Text> 3024 × 4032 pixels{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Measurements:</Text>{'\n'}
                    🔵 Blue Distance: 145.2mm{'\n'}
                    🟢 Green Angle: 87.5°{'\n'}
                    🔴 Red Circle: Ø 52.3mm{'\n\n'}
                    <Text style={{ fontSize: 12, color: '#8E8E93', fontStyle: 'italic' }}>
                      Scale calculation: 1000 pixels ÷ 24.26mm = 41.23 px/mm{'\n'}
                    </Text>
                    {'\n'}
                    Attached: 3 photos for reference and CAD import
                  </Text>
                </View>

                {/* "The Nerdy Stuff" Link */}
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      '🤓 The Nerdy Stuff: Scale Calculations',
                      'HOW PANHANDLER CALCULATES PRECISE MEASUREMENTS:\n\n' +
                      '1️⃣ CALIBRATION PHASE:\n' +
                      'When you align the calibration circle to your coin, PanHandler measures the circle diameter in pixels (e.g., 1000 px).\n\n' +
                      '2️⃣ PIXELS PER UNIT:\n' +
                      'pixelsPerUnit = coin_diameter_pixels ÷ coin_diameter_mm\n' +
                      'Example: 1000 px ÷ 24.26mm = 41.23 px/mm\n\n' +
                      '3️⃣ DISTANCE MEASUREMENTS:\n' +
                      'distance_mm = √((x₂-x₁)² + (y₂-y₁)²) ÷ pixelsPerUnit\n' +
                      'This converts pixel distance to real-world units.\n\n' +
                      '4️⃣ FUSION 360 CANVAS SCALE:\n' +
                      'Canvas Scale = pixelsPerUnit (directly!)\n' +
                      'Fusion expects: pixels per mm or pixels per inch\n' +
                      'Example: 41.23 px/mm\n\n' +
                      '5️⃣ ANGLE MEASUREMENTS:\n' +
                      'angle = atan2(y₃-y₂, x₃-x₂) - atan2(y₁-y₂, x₁-x₂)\n' +
                      'Converted to degrees: angle × (180/π)\n\n' +
                      '6️⃣ CIRCLE MEASUREMENTS:\n' +
                      'radius_px = √((x_edge-x_center)² + (y_edge-y_center)²)\n' +
                      'radius_mm = radius_px ÷ pixelsPerUnit\n' +
                      'diameter = radius × 2\n\n' +
                      'WHY THIS WORKS:\n' +
                      'By using a known reference (coin), we establish a pixel-to-millimeter ratio that remains constant across the entire photo. All measurements use this ratio for accurate real-world dimensions!\n\n' +
                      '🎯 TIP: Higher resolution photos = more accurate measurements!'
                    );
                  }}
                  style={{ marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F0F4FF', borderRadius: 8, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 13, color: '#007AFF', fontWeight: '600' }}>
                    🤓 Read "the nerdy stuff" - How the math works
                  </Text>
                </Pressable>
              </ExpandableSection>

              {/* Fusion 360 Tutorial - Expandable */}
              <ExpandableSection
                title="🔧 Fusion 360 Import Tutorial"
                icon="construct"
                color="#FF9500"
                delay={500}
              >
                <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12, fontWeight: '600' }}>
                  Step-by-Step: Import to Fusion 360
                </Text>
                <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21, marginBottom: 16 }}>
                  Use the Fusion 360 Export image to trace your measurements perfectly in CAD software.
                </Text>
                
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>1</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Open Fusion 360
                      </Text>
                      <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                        Create a new design or open an existing project where you want to import the reference image.
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
                      <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                        Go to <Text style={{ fontWeight: '600' }}>Insert {`>`} Canvas</Text> from the toolbar. Select your Fusion 360 export image from PanHandler.
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
                      <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginBottom: 8 }}>
                        Right-click the canvas image and select <Text style={{ fontWeight: '600' }}>Calibrate</Text>. Look at the scale note on your exported photo.
                      </Text>
                      <View style={{ backgroundColor: 'rgba(255,149,0,0.1)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(255,149,0,0.25)' }}>
                        <Text style={{ fontSize: 13, color: '#3C3C43', lineHeight: 18 }}>
                          <Text style={{ fontWeight: '700' }}>Example:</Text> If the scale note says "Canvas Scale: 0.0412", enter 0.0412 for both X and Y scale values.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>4</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Position & Align
                      </Text>
                      <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                        Use the center crosshairs visible in the image to align your canvas to the origin point (0,0) in Fusion 360 for perfect positioning.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>5</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 }}>
                        Trace & Model
                      </Text>
                      <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20 }}>
                        Now you can trace over the 50% opacity image using sketches, lines, circles, and other CAD tools. All measurements will be perfectly scaled!
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ backgroundColor: 'rgba(52,199,89,0.08)', borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1, borderColor: 'rgba(52,199,89,0.2)' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#34C759', marginLeft: 6 }}>
                      Pro Tip
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#3C3C43', lineHeight: 19 }}>
                    The 50% opacity makes it easy to see your CAD lines while still having the reference visible. You can adjust canvas opacity in Fusion 360 if needed!
                  </Text>
                </View>
              </ExpandableSection>

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
                  <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 21 }}>
                    🎯 <Text style={{ fontWeight: '600' }}>Use cursor guide</Text> - Measurement cursor appears above your finger for precise placement
                  </Text>
                </View>
                
                {/* Epic Stress Test Showcase */}
                <View style={{
                  marginTop: 16,
                  backgroundColor: 'rgba(0,122,255,0.08)',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(0,122,255,0.2)',
                }}>
                  <Text style={{ 
                    fontSize: 15, 
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
                      borderRadius: 10,
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
                    backgroundColor: 'rgba(255,204,0,0.1)',
                    borderRadius: 18,
                    padding: 18,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: 'rgba(255,204,0,0.25)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="star" size={22} color="#FFCC00" />
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginLeft: 8, letterSpacing: -0.3 }}>
                      🎯 Amazing Accuracy!
                    </Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, marginBottom: 12 }}>
                    PanHandler achieves{' '}
                    <Text style={{ fontWeight: '700', color: '#1C1C1E' }}>
                      ~0.2 mm accuracy
                    </Text>
                    {' '}(or better) with small objects!
                  </Text>
                  
                  <View style={{ 
                    backgroundColor: 'rgba(255,204,0,0.08)', 
                    borderRadius: 12, 
                    padding: 12, 
                    borderWidth: 0.5, 
                    borderColor: 'rgba(255,204,0,0.2)' 
                  }}>
                    <Text style={{ fontSize: 14, color: '#1C1C1E', lineHeight: 20, marginBottom: 6, fontWeight: '600' }}>
                      📐 That's approximately:
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginLeft: 20 }}>
                      • 0.0079 inches (less than 1/100th of an inch!)
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginLeft: 20 }}>
                      • Thickness of 2-3 sheets of paper
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginLeft: 20 }}>
                      • Width of a human hair
                    </Text>
                  </View>

                  <Text style={{ fontSize: 13, color: '#3C3C43', fontStyle: 'italic', marginTop: 12, lineHeight: 18 }}>
                    💡 Pro tip: Use higher resolution photos and proper lighting for maximum accuracy!
                  </Text>
                </Animated.View>
              </View>

              {/* About Section */}
              <View style={{ marginBottom: 20, marginTop: 12 }}>
                <Animated.View 
                  entering={FadeIn.delay(700)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: 18,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 2,
                    borderWidth: 0.5,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'rgba(0,122,255,0.12)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                      <Ionicons name="information-circle" size={22} color="#007AFF" />
                    </View>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
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
                      borderRadius: 13,
                      paddingVertical: 13,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#FF0000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name="logo-youtube" size={22} color="white" />
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', marginLeft: 8, letterSpacing: -0.2 }}>
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
                    backgroundColor: 'rgba(255,215,0,0.12)',
                    borderRadius: 18,
                    padding: 18,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 2,
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,215,0,0.35)',
                    borderStyle: 'dashed',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>🥚</Text>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginHorizontal: 8, letterSpacing: -0.3 }}>
                      Hidden Surprises
                    </Text>
                    <Text style={{ fontSize: 24 }}>🥚</Text>
                  </View>
                  
                  <Text style={{ fontSize: 15, color: '#3C3C43', lineHeight: 22, textAlign: 'center', fontStyle: 'italic' }}>
                    Some badges hide secrets... if you are persistent enough 🤔
                  </Text>
                </Animated.View>
              </View>
            </ScrollView>
            </View>

            {/* Translucent Footer with Blur */}
            <BlurView 
              intensity={95} 
              tint="light"
              style={{
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  borderTopWidth: 0.5,
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
                    backgroundColor: 'rgba(255,105,180,0.08)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,105,180,0.2)',
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
                  onPress={onClose}
                  style={{
                    backgroundColor: '#007AFF',
                    paddingVertical: 15,
                    borderRadius: 14,
                    alignItems: 'center',
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', letterSpacing: -0.2 }}>
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
