import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';
import {
  scaleFontSize,
  scalePadding,
  scaleMargin,
  scaleSize,
  scaleBorderRadius,
  scaleIconSize
} from '../utils/deviceScale';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: (coin: CoinReference) => void;
  onDismiss: () => void;
  onMapScale?: () => void; // Optional callback for map scale
}

export default function CalibrationModal({ visible, onComplete, onDismiss, onMapScale }: CalibrationModalProps) {
  const insets = useSafeAreaInsets();
  const lastSelectedCoin = useStore((s) => s.lastSelectedCoin);
  const setLastSelectedCoin = useStore((s) => s.setLastSelectedCoin);
  
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinReference[]>([]);

  useEffect(() => {
    if (visible && lastSelectedCoin) {
      const coin = getCoinByName(lastSelectedCoin);
      if (coin) {
        setSelectedCoin(coin);
      }
    }
  }, [visible, lastSelectedCoin]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchCoins(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleContinue = () => {
    if (!selectedCoin) return;
    setLastSelectedCoin(selectedCoin.name);
    onComplete(selectedCoin);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View style={{
          position: 'absolute',
          top: insets.top + scaleSize(60),
          left: scaleSize(20),
          right: scaleSize(20),
          maxHeight: selectedCoin ? scaleSize(520) : scaleSize(440),
          borderRadius: scaleBorderRadius(20),
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: scaleSize(12) },
          shadowOpacity: 0.4,
          shadowRadius: scaleSize(24),
        }}>
          <BlurView
            intensity={40}
            tint="light"
            style={{
              flex: 1,
              borderRadius: scaleBorderRadius(20),
              overflow: 'hidden',
            }}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              borderRadius: scaleBorderRadius(20),
              borderWidth: scaleSize(1),
              borderColor: 'rgba(255, 255, 255, 0.4)',
            }}>
              {/* Header */}
              <View style={{
                paddingTop: scalePadding(20),
                paddingHorizontal: scalePadding(20),
                paddingBottom: scalePadding(16),
                borderBottomWidth: scaleSize(0.5),
                borderBottomColor: 'rgba(0, 0, 0, 0.08)',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: scaleFontSize(24), marginRight: scaleMargin(10) }}>🪙</Text>
                    <Text style={{ fontSize: scaleFontSize(20), fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                      Select Reference Coin
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onDismiss();
                    }}
                    style={{
                      width: scaleSize(32),
                      height: scaleSize(32),
                      borderRadius: scaleBorderRadius(16),
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="close" size={scaleIconSize(18)} color="rgba(0, 0, 0, 0.6)" />
                  </Pressable>
                </View>
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                {/* Selected Coin */}
                {selectedCoin && (
                  <View style={{
                    marginHorizontal: scaleMargin(16),
                    marginTop: scaleMargin(14),
                    marginBottom: scaleMargin(12),
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: scaleBorderRadius(14),
                    padding: scalePadding(14),
                    borderWidth: scaleSize(1),
                    borderColor: 'rgba(76, 175, 80, 0.3)',
                    shadowColor: '#4CAF50',
                    shadowOffset: { width: 0, height: scaleSize(2) },
                    shadowOpacity: 0.15,
                    shadowRadius: scaleSize(8),
                  }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: scaleMargin(6),
                      }}>
                        <View style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          paddingHorizontal: scalePadding(8),
                          paddingVertical: scalePadding(3),
                          borderRadius: scaleBorderRadius(6),
                        }}>
                          <Text style={{
                            color: '#2E7D32',
                            fontSize: scaleFontSize(10),
                            fontWeight: '700',
                            letterSpacing: 0.5
                          }}>
                            SELECTED
                          </Text>
                        </View>
                      </View>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.9)',
                        fontWeight: '700',
                        fontSize: scaleFontSize(17),
                        marginBottom: scaleMargin(4),
                        textAlign: 'center',
                      }}>
                        {selectedCoin.name}
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.55)',
                        fontSize: scaleFontSize(14),
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                        {selectedCoin.diameter}mm • {selectedCoin.country}
                      </Text>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setSelectedCoin(null);
                        }}
                        style={{
                          padding: scalePadding(8),
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: scaleBorderRadius(20),
                          marginTop: scaleMargin(8),
                        }}
                      >
                        <Ionicons name="close-circle" size={scaleIconSize(22)} color="rgba(0, 0, 0, 0.4)" />
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Search Bar */}
                <View style={{
                  marginHorizontal: scaleMargin(16),
                  marginTop: selectedCoin ? 0 : scaleMargin(14),
                  marginBottom: scaleMargin(12),
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: scaleBorderRadius(12),
                  paddingHorizontal: scalePadding(14),
                  paddingVertical: scalePadding(12),
                  borderWidth: scaleSize(1),
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                }}>
                  <Ionicons name="search" size={scaleIconSize(18)} color="rgba(0, 0, 0, 0.35)" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search coins..."
                    placeholderTextColor="rgba(0, 0, 0, 0.3)"
                    style={{
                      flex: 1,
                      marginLeft: scaleMargin(10),
                      fontSize: scaleFontSize(15),
                      color: 'rgba(0, 0, 0, 0.85)',
                      fontWeight: '500',
                    }}
                    autoFocus={!selectedCoin}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSearchQuery('');
                      }}
                      style={{ padding: scalePadding(4) }}
                    >
                      <Ionicons name="close-circle" size={scaleIconSize(18)} color="rgba(0, 0, 0, 0.35)" />
                    </Pressable>
                  )}
                </View>

                {/* Search Results */}
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingHorizontal: scalePadding(16), paddingBottom: scalePadding(12) }}
                  showsVerticalScrollIndicator={false}
                >
                  {searchResults.length > 0 ? (
                    searchResults.slice(0, 6).map((coin) => (
                      <Pressable
                        key={`${coin.country}-${coin.name}`}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          Keyboard.dismiss();
                          setSelectedCoin(coin);
                          setSearchQuery('');
                        }}
                        style={({ pressed }) => ({
                          paddingVertical: scalePadding(16),
                          paddingHorizontal: scalePadding(14),
                          marginBottom: scaleMargin(12),
                          borderRadius: scaleBorderRadius(12),
                          backgroundColor: pressed
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(255, 255, 255, 0.6)',
                          borderWidth: scaleSize(1),
                          borderColor: pressed
                            ? 'rgba(0, 0, 0, 0.12)'
                            : 'rgba(0, 0, 0, 0.06)',
                        })}
                      >
                        <Text style={{
                          color: 'rgba(0, 0, 0, 0.85)',
                          fontWeight: '600',
                          fontSize: scaleFontSize(15),
                          marginBottom: scaleMargin(3),
                          textAlign: 'center',
                        }}>
                          {coin.name}
                        </Text>
                        <Text style={{
                          color: 'rgba(0, 0, 0, 0.5)',
                          fontSize: scaleFontSize(13),
                          fontWeight: '500',
                          textAlign: 'center',
                        }}>
                          {coin.diameter}mm • {coin.country}
                        </Text>
                      </Pressable>
                    ))
                  ) : searchQuery.length > 0 ? (
                    <View style={{ paddingVertical: scalePadding(32), alignItems: 'center' }}>
                      <View style={{
                        width: scaleSize(56),
                        height: scaleSize(56),
                        borderRadius: scaleBorderRadius(28),
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: scaleMargin(12),
                      }}>
                        <Ionicons name="search-outline" size={scaleIconSize(28)} color="rgba(0, 0, 0, 0.25)" />
                      </View>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.5)',
                        fontSize: scaleFontSize(15),
                        fontWeight: '600'
                      }}>
                        No coins found
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.35)',
                        fontSize: scaleFontSize(13),
                        marginTop: scaleMargin(4),
                        textAlign: 'center',
                      }}>
                        Try a different search term
                      </Text>
                    </View>
                  ) : !selectedCoin ? (
                    <View style={{ paddingVertical: scalePadding(32), alignItems: 'center' }}>
                      <View style={{
                        width: scaleSize(56),
                        height: scaleSize(56),
                        borderRadius: scaleBorderRadius(28),
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: scaleMargin(12),
                      }}>
                        <Ionicons name="search" size={scaleIconSize(28)} color="rgba(0, 0, 0, 0.25)" />
                      </View>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.5)',
                        fontSize: scaleFontSize(15),
                        fontWeight: '600',
                        marginBottom: scaleMargin(6),
                      }}>
                        Find your coin
                      </Text>
                      <Text style={{
                        color: 'rgba(0, 0, 0, 0.35)',
                        fontSize: scaleFontSize(13),
                        textAlign: 'center',
                      }}>
                        Try "penny", "nickel", or "quarter"
                      </Text>
                    </View>
                  ) : null}
                </ScrollView>
              </View>

              {/* Continue Button */}
              {selectedCoin && (
                <View style={{
                  paddingHorizontal: scalePadding(16),
                  paddingTop: scalePadding(14),
                  paddingBottom: scalePadding(18),
                  borderTopWidth: scaleSize(0.5),
                  borderTopColor: 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Pressable
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      handleContinue();
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(255, 255, 255, 0.7)',
                      borderRadius: scaleBorderRadius(14),
                      paddingVertical: scalePadding(18),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: scaleSize(1),
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: scaleSize(4) },
                      shadowOpacity: 0.1,
                      shadowRadius: scaleSize(12),
                    })}
                  >
                    <Text style={{
                      color: 'rgba(0, 0, 0, 0.8)',
                      fontWeight: '700',
                      fontSize: scaleFontSize(22),
                      textAlign: 'center',
                    }}>
                      CONTINUE
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Map Scale Option */}
              {onMapScale && !selectedCoin && (
                <View style={{
                  paddingHorizontal: scalePadding(16),
                  paddingTop: scalePadding(14),
                  paddingBottom: scalePadding(18),
                  borderTopWidth: scaleSize(0.5),
                  borderTopColor: 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Text style={{
                    fontSize: scaleFontSize(13),
                    color: 'rgba(0, 0, 0, 0.5)',
                    textAlign: 'center',
                    marginBottom: scaleMargin(10),
                    fontWeight: '500',
                  }}>
                    — or —
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onMapScale();
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: pressed
                        ? 'rgba(100, 150, 255, 0.15)'
                        : 'rgba(100, 150, 255, 0.1)',
                      borderRadius: scaleBorderRadius(14),
                      paddingVertical: scalePadding(14),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: scaleSize(1),
                      borderColor: 'rgba(100, 150, 255, 0.3)',
                    })}
                  >
                    <Text style={{ fontSize: scaleFontSize(18), marginRight: scaleMargin(8) }}>🗺️</Text>
                    <Text style={{
                      color: 'rgba(0, 0, 0, 0.75)',
                      fontWeight: '600',
                      fontSize: scaleFontSize(15),
                    }}>
                      Use Map Scale Instead
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
