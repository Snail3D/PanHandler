import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerbalScale } from '../state/measurementStore';
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
  
  const [scaleMode, setScaleMode] = useState<ScaleMode>('verbal');
  const [screenDistance, setScreenDistance] = useState('1');
  const [screenUnit, setScreenUnit] = useState<'cm' | 'in'>('cm');
  const [realDistance, setRealDistance] = useState('');
  const [realUnit, setRealUnit] = useState<'km' | 'mi' | 'm' | 'ft'>('km');
  const [showExamples, setShowExamples] = useState(false);

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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View style={{
          position: 'absolute',
          top: insets.top + 60,
          left: 20,
          right: 20,
          maxHeight: 620,
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
                paddingTop: 20,
                paddingHorizontal: 20,
                paddingBottom: 16,
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
                    <Text style={{ fontSize: 20, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
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
                  marginTop: 8, 
                  fontSize: 14, 
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontWeight: '500' 
                }}>
                  Choose your calibration method
                </Text>
              </View>

              {/* Content */}
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                  {/* Mode Selector */}
                  <View style={{ 
                    flexDirection: 'row', 
                    marginBottom: 24,
                    gap: 12,
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
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 2,
                        borderColor: scaleMode === 'verbal' 
                          ? 'rgba(52, 199, 89, 0.6)' 
                          : 'rgba(0, 0, 0, 0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons 
                        name="text-outline" 
                        size={28} 
                        color={scaleMode === 'verbal' ? '#2E7D32' : 'rgba(0, 0, 0, 0.4)'}
                        style={{ marginBottom: 8 }}
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
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 2,
                        borderColor: scaleMode === 'blueprint' 
                          ? 'rgba(52, 199, 89, 0.6)' 
                          : 'rgba(0, 0, 0, 0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons 
                        name="finger-print-outline" 
                        size={28} 
                        color={scaleMode === 'blueprint' ? '#2E7D32' : 'rgba(0, 0, 0, 0.4)'}
                        style={{ marginBottom: 8 }}
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
                    marginBottom: 20,
                    gap: 12,
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

                  {/* Live Preview */}
                  {isValid && (
                    <View style={{
                      backgroundColor: 'rgba(52, 199, 89, 0.15)',
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(52, 199, 89, 0.3)',
                    }}>
                      <Text style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#2E7D32',
                        textAlign: 'center',
                      }}>
                        {screenDistance}{screenUnit} = {realDistance}{realUnit}
                      </Text>
                    </View>
                  )}

                  {/* Examples Section */}
                  <Pressable
                    onPress={() => {
                      setShowExamples(!showExamples);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="bulb-outline" size={18} color="rgba(0, 0, 0, 0.6)" />
                      <Text style={{ 
                        marginLeft: 8,
                        fontSize: 14, 
                        fontWeight: '600', 
                        color: 'rgba(0, 0, 0, 0.75)' 
                      }}>
                        Common Examples
                      </Text>
                    </View>
                    <Ionicons 
                      name={showExamples ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="rgba(0, 0, 0, 0.4)" 
                    />
                  </Pressable>

                  {/* Examples List */}
                  {showExamples && (
                    <View style={{ marginBottom: 12 }}>
                      {[
                        { label: '📍 Hiking Map', screenDist: 1, screenUnit: 'cm' as const, realDist: 1, realUnit: 'km' as const },
                        { label: '🏙️ City Map', screenDist: 1, screenUnit: 'in' as const, realDist: 0.25, realUnit: 'mi' as const },
                        { label: '📐 Blueprint', screenDist: 1, screenUnit: 'in' as const, realDist: 10, realUnit: 'ft' as const },
                        { label: '🗺️ USGS Topo', screenDist: 1, screenUnit: 'in' as const, realDist: 0.38, realUnit: 'mi' as const },
                      ].map((example, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => applyExample(example)}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: 'rgba(0, 0, 0, 0.06)',
                          }}
                        >
                          <Text style={{ 
                            fontSize: 14, 
                            fontWeight: '600', 
                            color: 'rgba(0, 0, 0, 0.8)',
                            marginBottom: 3,
                          }}>
                            {example.label}
                          </Text>
                          <Text style={{ 
                            fontSize: 13, 
                            color: 'rgba(0, 0, 0, 0.5)' 
                          }}>
                            {example.screenDist}{example.screenUnit} = {example.realDist}{example.realUnit}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
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

              {/* LOCK IN Button - matches calibration screen (only for verbal mode) */}
              {scaleMode === 'verbal' && isValid && (
                <View style={{
                  paddingHorizontal: 16,
                  paddingTop: 14,
                  paddingBottom: 18,
                  borderTopWidth: 0.5,
                  borderTopColor: 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Pressable
                    onPress={() => {
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
                      backgroundColor: pressed 
                        ? 'rgba(52, 199, 89, 0.9)' 
                        : 'rgba(52, 199, 89, 0.85)',
                      borderRadius: 24,
                      paddingVertical: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#34C759',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 24,
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                    })}
                  >
                    <Text style={{ 
                      color: '#FFFFFF', 
                      fontWeight: '900', 
                      fontSize: 32,
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
    </Modal>
  );
}
