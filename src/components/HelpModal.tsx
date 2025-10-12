import React, { useEffect, useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, Linking } from 'react-native';
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
    <Animated.View style={[animatedStyle, { marginBottom: 16 }]}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderLeftWidth: 4,
          borderLeftColor: color,
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
                    Enable Auto Level in camera for hands-free capture in portrait OR landscape orientation! The app monitors your device angle and stability in real-time.
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • <Text style={{ fontWeight: '600' }}>Hold (press and hold) the shutter button</Text> - Don't just tap, keep it pressed down
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • <Text style={{ fontWeight: '600' }}>Watch the color indicator</Text> - Red (too tilted) → Yellow (close) → Green (perfect alignment)
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • <Text style={{ fontWeight: '600' }}>Works horizontally OR vertically</Text> - Orient your phone perpendicular (90°) to surface in either direction
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20, marginBottom: 4 }}>
                      • <Text style={{ fontWeight: '600' }}>Hold steady when green</Text> - A 3-second countdown begins automatically
                    </Text>
                    <Text style={{ fontSize: 14, color: '#1B5E20', lineHeight: 20 }}>
                      • <Text style={{ fontWeight: '600' }}>Photo captures automatically</Text> - No need to tap, just keep holding steady!
                    </Text>
                  </View>
                  <View style={{ marginTop: 8, backgroundColor: 'rgba(46, 125, 50, 0.15)', borderRadius: 6, padding: 8 }}>
                    <Text style={{ fontSize: 13, color: '#1B5E20', fontStyle: 'italic' }}>
                      💡 Tip: If you move during countdown, it will cancel and restart when you're steady again
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
                    {/* Custom distance icon matching menu */}
                    <Svg width={18} height={18} viewBox="0 0 16 16">
                      <Line x1="3" y1="8" x2="13" y2="8" stroke="#7E57C2" strokeWidth="1.5" />
                      <Circle cx="3" cy="8" r="2" fill="#7E57C2" />
                      <Circle cx="13" cy="8" r="2" fill="#7E57C2" />
                    </Svg>
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
                    {/* Custom angle icon matching menu */}
                    <Svg width={18} height={18} viewBox="0 0 16 16">
                      <Line x1="3" y1="13" x2="3" y2="3" stroke="#FB8C00" strokeWidth="1.5" strokeLinecap="round" />
                      <Line x1="3" y1="13" x2="13" y2="13" stroke="#FB8C00" strokeWidth="1.5" strokeLinecap="round" />
                      <Path d="M 7 13 A 4 4 0 0 1 3 9" stroke="#FB8C00" strokeWidth="1.3" fill="none" />
                      <Line x1="5.3" y1="12.3" x2="5.7" y2="13.3" stroke="#FB8C00" strokeWidth="1" strokeLinecap="round" />
                      <Line x1="3.7" y1="10.7" x2="2.7" y2="10.3" stroke="#FB8C00" strokeWidth="1" strokeLinecap="round" />
                    </Svg>
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
                icon="navigate-circle"
                title="Navigation & Controls"
                color="#FF3B30"
                delay={300}
              >
                <View style={{ marginLeft: 4 }}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🗺️ Pan/Zoom Mode
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Pinch to zoom, drag to pan around the image. Perfect for exploring your photo before measuring.
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      📏 Measure Mode
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Tap to place measurement points with the floating precision cursor. Pan/zoom automatically locks after placing your first point for maximum precision. Switch back to Pan mode to zoom/reposition before placing your next measurement.
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      📍 Precision Cursor Helper
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      A floating crosshair cursor appears above your finger when placing measurements. It's color-coded to match your next measurement and shows exactly where the point will be placed. The label above tells you which point you're placing (Point 1, Point 2, etc.). The yellow center dot indicates the exact placement location.
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      ✨ Center Alignment Guides
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Subtle white crosshairs appear in Pan mode after calibration to help center your object for CAD software import. These guides help you position objects at the origin (0,0) for perfect alignment in Fusion 360 and other CAD tools.
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 }}>
                      🎨 Color-Coded Measurements
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 20, marginLeft: 8 }}>
                      Each measurement gets a unique vibrant color. Check the legend in the corner to identify them!
                    </Text>
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
                  <Text style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 22, marginBottom: 12 }}>
                    ✉️ <Text style={{ fontWeight: '600' }}>Email Reports</Text> - All photos + detailed measurement data
                  </Text>
                </View>

                {/* CAD Integration Tips */}
                <View
                  style={{
                    backgroundColor: '#F0F4FF',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: '#5856D6',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="cube" size={18} color="#5856D6" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#5856D6', marginLeft: 6 }}>
                      CAD Software Integration
                    </Text>
                  </View>
                  <View style={{ marginLeft: 4 }}>
                    <Text style={{ fontSize: 14, color: '#3C3C58', lineHeight: 20, marginBottom: 6 }}>
                      • <Text style={{ fontWeight: '600' }}>Center alignment guides</Text> help position objects perfectly for CAD import
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C58', lineHeight: 20, marginBottom: 6 }}>
                      • <Text style={{ fontWeight: '600' }}>Scale notes on every photo</Text> show exact Canvas Scale values for Fusion 360
                    </Text>
                    <Text style={{ fontSize: 14, color: '#3C3C58', lineHeight: 20 }}>
                      • <Text style={{ fontWeight: '600' }}>No guesswork!</Text> Insert {`>`} Canvas {`>`} Set Scale X/Y to the provided value
                    </Text>
                  </View>
                </View>
              </FeatureCard>

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
                    <Text style={{ fontWeight: '600' }}>Calibration Scale:</Text> 24.26mm (US Quarter){'\n'}
                    <Text style={{ fontWeight: '600' }}>Unit System:</Text> Metric{'\n'}
                    <Text style={{ fontWeight: '600' }}>Canvas Scale (Fusion 360):</Text> 0.0412{'\n\n'}
                    <Text style={{ fontWeight: '600' }}>Measurements:</Text>{'\n'}
                    Blue Distance: 145.2mm{'\n'}
                    Green Angle: 87.5°{'\n'}
                    Red Circle: Ø 52.3mm{'\n\n'}
                    Attached: 3 photos for reference and CAD import
                  </Text>
                </View>
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
                      <View style={{ backgroundColor: '#FFF3E0', borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: '#FF9500' }}>
                        <Text style={{ fontSize: 13, color: '#E65100', lineHeight: 18 }}>
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

                <View style={{ backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#2E7D32', marginLeft: 6 }}>
                      Pro Tip
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#1B5E20', lineHeight: 19 }}>
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
              {/* Heartfelt Message with Download Counter */}
              <AnimatedView
                entering={FadeIn.delay(750)}
                style={{
                  marginBottom: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: '#FFF0F5',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FFB6C1',
                }}
              >
                <Text style={{ 
                  fontSize: 15, 
                  color: '#1C1C1E', 
                  textAlign: 'center',
                  lineHeight: 22,
                  fontWeight: '700'
                }}>
                  ❤️ Snail thanks {globalDownloads.toLocaleString()} people for using this app!
                </Text>
              </AnimatedView>

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
