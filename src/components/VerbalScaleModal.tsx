import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerbalScale } from '../state/measurementStore';
import useStore from '../state/measurementStore';
import Svg, { Path } from 'react-native-svg';

type ScaleMode = 'verbal' | 'blueprint';

interface VerbalScaleModalProps {
  visible: boolean;
  onComplete: (scale: VerbalScale) => void;
  onBlueprintMode: () => void; // New: User wants to use blueprint mode
  onDismiss: () => void;
}

export default function VerbalScaleModal({ visible, onComplete, onBlueprintMode, onDismiss }: VerbalScaleModalProps) {
  const insets = useSafeAreaInsets();
  
  // Access store for magnetic declination
  const magneticDeclination = useStore((s) => s.magneticDeclination);
  const setMagneticDeclination = useStore((s) => s.setMagneticDeclination);
  
  const [scaleMode, setScaleMode] = useState<ScaleMode>('verbal');
  const [screenDistance, setScreenDistance] = useState('1');
  const [screenUnit, setScreenUnit] = useState<'cm' | 'in'>('cm');
  const [realDistance, setRealDistance] = useState('');
  const [realUnit, setRealUnit] = useState<'km' | 'mi' | 'm' | 'ft'>('km');
  const [showExamples, setShowExamples] = useState(false);
  const [showDeclinationHelp, setShowDeclinationHelp] = useState(false);
  
  // Magnetic declination state
  const [declinationInput, setDeclinationInput] = useState(magneticDeclination.toString());

  const screenNum = parseFloat(screenDistance);
  const realNum = parseFloat(realDistance);
  const isValid = !isNaN(screenNum) && screenNum > 0 && !isNaN(realNum) && realNum > 0;

  const handleContinue = () => {
    if (!isValid) return;
    
    const scale: VerbalScale = {
      screenDistance: screenNum,
      screenUnit,
      realDistance: realNum,
      realUnit,
    };
    
    onComplete(scale);
  };

  const applyExample = (example: { screenDist: number, screenUnit: 'cm' | 'in', realDist: number, realUnit: 'km' | 'mi' | 'm' | 'ft' }) => {
    setScreenDistance(example.screenDist.toString());
    setScreenUnit(example.screenUnit);
    setRealDistance(example.realDist.toString());
    setRealUnit(example.realUnit);
    setShowExamples(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Apply manual declination input
  const applyManualDeclination = () => {
    // Treat blank input as 0 (angle mode)
    if (declinationInput.trim() === '') {
      setMagneticDeclination(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    const declination = parseFloat(declinationInput);
    if (isNaN(declination)) {
      return; // Ignore invalid input
    }

    setMagneticDeclination(declination);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 20,
          right: 20,
          maxHeight: '85%',
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        }}>
          <BlurView
            intensity={40}
            tint="light"
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.4)',
            }}>
              {/* Header */}
              <View style={{
                paddingTop: 14,
                paddingHorizontal: 16,
                paddingBottom: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(0, 0, 0, 0.08)',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Folded map icon */}
                    <Svg width={28} height={28} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
                      {/* Three vertical panels of a folded map */}
                      <Path
                        d="M3 4 L8 2 L8 22 L3 20 Z"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <Path
                        d="M8 2 L16 4 L16 22 L8 22"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <Path
                        d="M16 4 L21 2 L21 20 L16 22"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </Svg>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                      Map Scale
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onDismiss();
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="close" size={18} color="rgba(0, 0, 0, 0.6)" />
                  </Pressable>
                </View>
                <Text style={{ 
                  marginTop: 6, 
                  fontSize: 13, 
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontWeight: '500' 
                }}>
                  Choose your calibration method
                </Text>
              </View>

              {/* Content */}
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 16 }}>
                  {/* Mode Selector */}
                  <View style={{ 
                    flexDirection: 'row', 
                    marginBottom: 16,
                    gap: 10,
                  }}>
                    {/* Verbal Scale Button */}
                    <Pressable
                      onPress={() => {
                        setScaleMode('verbal');
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: scaleMode === 'verbal' 
                          ? 'rgba(52, 199, 89, 0.2)' 
                          : 'rgba(255, 255, 255, 0.6)',
                        borderRadius: 10,
                        padding: 12,
                        borderWidth: 2,
                        borderColor: scaleMode === 'verbal' 
                          ? 'rgba(52, 199, 89, 0.6)' 
                          : 'rgba(0, 0, 0, 0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons 
                        name="text-outline" 
                        size={24} 
                        color={scaleMode === 'verbal' ? '#2E7D32' : 'rgba(0, 0, 0, 0.4)'}
                        style={{ marginBottom: 6 }}
                      />
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '700', 
                        color: scaleMode === 'verbal' ? '#2E7D32' : 'rgba(0, 0, 0, 0.6)',
                        textAlign: 'center',
                      }}>
                        Verbal Scale
                      </Text>
                      <Text style={{ 
                        fontSize: 11, 
                        color: scaleMode === 'verbal' ? 'rgba(46, 125, 50, 0.7)' : 'rgba(0, 0, 0, 0.4)',
                        textAlign: 'center',
                        marginTop: 4,
                      }}>
                        e.g. 1cm = 1km
                      </Text>
                    </Pressable>

                    {/* Blueprint Scale Button */}
                    <Pressable
                      onPress={() => {
                        setScaleMode('blueprint');
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: scaleMode === 'blueprint' 
                          ? 'rgba(52, 199, 89, 0.2)' 
                          : 'rgba(255, 255, 255, 0.6)',
                        borderRadius: 10,
                        padding: 12,
                        borderWidth: 2,
                        borderColor: scaleMode === 'blueprint' 
                          ? 'rgba(52, 199, 89, 0.6)' 
                          : 'rgba(0, 0, 0, 0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons 
                        name="finger-print-outline" 
                        size={24} 
                        color={scaleMode === 'blueprint' ? '#2E7D32' : 'rgba(0, 0, 0, 0.4)'}
                        style={{ marginBottom: 6 }}
                      />
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '700', 
                        color: scaleMode === 'blueprint' ? '#2E7D32' : 'rgba(0, 0, 0, 0.6)',
                        textAlign: 'center',
                      }}>
                        Blueprint Scale
                      </Text>
                      <Text style={{ 
                        fontSize: 11, 
                        color: scaleMode === 'blueprint' ? 'rgba(46, 125, 50, 0.7)' : 'rgba(0, 0, 0, 0.4)',
                        textAlign: 'center',
                        marginTop: 4,
                      }}>
                        Place 2 points
                      </Text>
                    </Pressable>
                  </View>

                  {scaleMode === 'verbal' && (
                    <>
                  {/* Scale Input Row */}
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: 14,
                    gap: 10,
                  }}>
                    {/* Screen Distance */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 12, 
                        fontWeight: '600', 
                        color: 'rgba(0, 0, 0, 0.6)', 
                        marginBottom: 8 
                      }}>
                        On Map
                      </Text>
                      <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                      }}>
                        <TextInput
                          value={screenDistance}
                          onChangeText={setScreenDistance}
                          placeholder="1"
                          keyboardType="numeric"
                          style={{
                            padding: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'rgba(0, 0, 0, 0.85)',
                            textAlign: 'center',
                          }}
                        />
                        {/* Unit Toggle */}
                        <View style={{ 
                          flexDirection: 'row', 
                          padding: 4,
                          backgroundColor: 'rgba(120, 120, 128, 0.12)',
                        }}>
                          <Pressable
                            onPress={() => {
                              setScreenUnit('cm');
                              // Smart unit switching: cm → metric units
                              if (realUnit === 'ft') setRealUnit('m');
                              if (realUnit === 'mi') setRealUnit('km');
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={{
                              flex: 1,
                              paddingVertical: 6,
                              borderRadius: 6,
                              backgroundColor: screenUnit === 'cm' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            }}
                          >
                            <Text style={{
                              textAlign: 'center',
                              fontSize: 12,
                              fontWeight: '600',
                              color: screenUnit === 'cm' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                            }}>
                              cm
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setScreenUnit('in');
                              // Smart unit switching: in → imperial units
                              if (realUnit === 'm') setRealUnit('ft');
                              if (realUnit === 'km') setRealUnit('mi');
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={{
                              flex: 1,
                              paddingVertical: 6,
                              borderRadius: 6,
                              backgroundColor: screenUnit === 'in' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            }}
                          >
                            <Text style={{
                              textAlign: 'center',
                              fontSize: 12,
                              fontWeight: '600',
                              color: screenUnit === 'in' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                            }}>
                              in
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>

                    {/* Equals Sign */}
                    <Text style={{ 
                      fontSize: 24, 
                      fontWeight: '700', 
                      color: 'rgba(0, 0, 0, 0.3)',
                      marginTop: 20,
                    }}>
                      =
                    </Text>

                    {/* Real Distance */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 12, 
                        fontWeight: '600', 
                        color: 'rgba(0, 0, 0, 0.6)', 
                        marginBottom: 8 
                      }}>
                        In Reality
                      </Text>
                      <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                      }}>
                        <TextInput
                          value={realDistance}
                          onChangeText={setRealDistance}
                          placeholder="9"
                          keyboardType="numeric"
                          style={{
                            padding: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'rgba(0, 0, 0, 0.85)',
                            textAlign: 'center',
                          }}
                        />
                        {/* Unit Toggle */}
                        <View style={{ 
                          flexDirection: 'row', 
                          padding: 4,
                          backgroundColor: 'rgba(120, 120, 128, 0.12)',
                        }}>
                          {(['km', 'mi', 'm', 'ft'] as const).map((unit) => (
                            <Pressable
                              key={unit}
                              onPress={() => {
                                setRealUnit(unit);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              style={{
                                flex: 1,
                                paddingVertical: 6,
                                borderRadius: 6,
                                backgroundColor: realUnit === unit ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                              }}
                            >
                              <Text style={{
                                textAlign: 'center',
                                fontSize: 11,
                                fontWeight: '600',
                                color: realUnit === unit ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                              }}>
                                {unit}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Magnetic Declination Section - Collapsible */}
                  <View style={{ marginTop: 12 }}>
                    <Pressable
                      onPress={() => {
                        setShowDeclinationHelp(!showDeclinationHelp);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={{
                        padding: 10,
                        backgroundColor: 'rgba(100, 150, 255, 0.12)',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(100, 150, 255, 0.25)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="compass-outline" size={16} color="#0066FF" />
                        <Text style={{ 
                          marginLeft: 6,
                          fontSize: 13, 
                          fontWeight: '700', 
                          color: 'rgba(0, 0, 0, 0.85)' 
                        }}>
                          Magnetic Declination
                        </Text>
                      </View>
                      <Ionicons 
                        name={showDeclinationHelp ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="rgba(0, 0, 0, 0.4)" 
                      />
                    </Pressable>

                    {showDeclinationHelp && (
                      <View style={{
                        padding: 12,
                        backgroundColor: 'rgba(100, 150, 255, 0.08)',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(100, 150, 255, 0.2)',
                        marginTop: 8,
                      }}>
                        <Text style={{ 
                          fontSize: 11, 
                          color: 'rgba(0, 0, 0, 0.6)',
                          marginBottom: 10,
                          lineHeight: 15,
                        }}>
                          Set your magnetic declination to correct azimuth measurements for true north. Positive = East, Negative = West.
                        </Text>
                        
                        {/* Declination Input Row */}
                        <View style={{ marginBottom: 8 }}>
                          <TextInput
                            value={declinationInput}
                            onChangeText={setDeclinationInput}
                            placeholder="0.0"
                            keyboardType="numbers-and-punctuation"
                            onBlur={applyManualDeclination}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: 'rgba(0, 0, 0, 0.08)',
                              padding: 10,
                              fontSize: 14,
                              fontWeight: '600',
                              color: 'rgba(0, 0, 0, 0.85)',
                              textAlign: 'center',
                            }}
                          />
                        </View>
                        
                        {/* Current Declination Display */}
                        <View style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: 6,
                          padding: 8,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(0, 0, 0, 0.6)' }}>
                            Current:
                          </Text>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0066FF' }}>
                            {magneticDeclination.toFixed(2)}° {magneticDeclination >= 0 ? 'E' : 'W'}
                          </Text>
                        </View>
                        
                        {/* Map Orientation Reminder - only show if declination is set */}
                        {magneticDeclination !== 0 && (
                          <View style={{
                            marginTop: 8,
                            padding: 10,
                            backgroundColor: 'rgba(255, 180, 0, 0.15)',
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 180, 0, 0.3)',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}>
                            <Ionicons name="information-circle" size={16} color="#FF9500" style={{ marginRight: 6, marginTop: 1 }} />
                            <View style={{ flex: 1 }}>
                              <Text style={{ 
                                fontSize: 11, 
                                fontWeight: '700',
                                color: 'rgba(0, 0, 0, 0.85)',
                                marginBottom: 3,
                              }}>
                                Map Orientation Required
                              </Text>
                              <Text style={{ 
                                fontSize: 10, 
                                color: 'rgba(0, 0, 0, 0.65)',
                                lineHeight: 14,
                              }}>
                                Use pan & zoom to orient your map so north is straight up on screen for accurate azimuth measurements.
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                    </>
                  )}

                  {/* Blueprint Scale Mode */}
                  {scaleMode === 'blueprint' && (
                    <View style={{
                      backgroundColor: 'rgba(52, 199, 89, 0.1)',
                      borderRadius: 14,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: 'rgba(52, 199, 89, 0.3)',
                    }}>
                      <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <Ionicons name="locate-outline" size={48} color="#2E7D32" />
                      </View>
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: '#2E7D32',
                        textAlign: 'center',
                        marginBottom: 12,
                      }}>
                        Place Two Points
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: 'rgba(0, 0, 0, 0.6)',
                        textAlign: 'center',
                        lineHeight: 20,
                        marginBottom: 20,
                      }}>
                        You'll place two points on your blueprint or drawing, then enter the real-world distance between them.
                      </Text>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          onBlueprintMode();
                        }}
                        style={({ pressed }) => ({
                          backgroundColor: pressed 
                            ? 'rgba(52, 199, 89, 0.9)' 
                            : 'rgba(52, 199, 89, 0.85)',
                          borderRadius: 16,
                          paddingVertical: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#34C759',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 12,
                          borderWidth: 2,
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                        })}
                      >
                        <Text style={{ 
                          color: '#FFFFFF', 
                          fontWeight: '800', 
                          fontSize: 16,
                          letterSpacing: 0.5,
                        }}>
                          START PLACEMENT
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* LOCK IN Button - Always visible, disabled when invalid */}
              {scaleMode === 'verbal' && (
                <View style={{
                  paddingHorizontal: 16,
                  paddingTop: 10,
                  paddingBottom: 14,
                  borderTopWidth: 0.5,
                  borderTopColor: 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Pressable
                    onPress={() => {
                      if (!isValid) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        Alert.alert(
                          'Set Your Scale',
                          'Please enter a valid scale value in the "In Reality" field to continue.',
                          [{ text: 'OK', style: 'default' }]
                        );
                        return;
                      }
                      // GoldenEye "Objective Complete" - doo-doo-doot! 🎯
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 120);
                      setTimeout(() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      }, 240);
                      Keyboard.dismiss();
                      handleContinue();
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: !isValid 
                        ? 'rgba(150, 150, 150, 0.5)'
                        : pressed 
                          ? 'rgba(52, 199, 89, 0.9)' 
                          : 'rgba(52, 199, 89, 0.85)',
                      borderRadius: 20,
                      paddingVertical: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: isValid ? '#34C759' : '#888',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: isValid ? 0.4 : 0.2,
                      shadowRadius: 20,
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      transform: pressed && isValid ? [{ scale: 0.98 }] : [{ scale: 1 }],
                      opacity: isValid ? 1 : 0.6,
                    })}
                  >
                    <Text style={{ 
                      color: isValid ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)', 
                      fontWeight: '900', 
                      fontSize: 28,
                      textAlign: 'center',
                      letterSpacing: 2,
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                    }}>
                      LOCK IN
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </BlurView>
        </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
