import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';

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
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: '90%',
          maxWidth: 400,
          maxHeight: selectedCoin ? 520 : 440,
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
                    <Text style={{ fontSize: 24, marginRight: 10 }}>🪙</Text>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: 'rgba(0, 0, 0, 0.85)' }}>
                      Select Reference Coin
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
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                {/* Selected Coin */}
                {selectedCoin && (
                  <View style={{
                    marginHorizontal: 16,
                    marginTop: 14,
                    marginBottom: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: 'rgba(76, 175, 80, 0.3)',
                    shadowColor: '#4CAF50',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                  }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        marginBottom: 6,
                      }}>
                        <View style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 6,
                        }}>
                          <Text style={{ 
                            color: '#2E7D32', 
                            fontSize: 10, 
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
                        fontSize: 17,
                        marginBottom: 4,
                        textAlign: 'center',
                      }}>
                        {selectedCoin.name}
                      </Text>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.55)', 
                        fontSize: 14, 
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
                          padding: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: 20,
                          marginTop: 8,
                        }}
                      >
                        <Ionicons name="close-circle" size={22} color="rgba(0, 0, 0, 0.4)" />
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Search Bar */}
                <View style={{
                  marginHorizontal: 16,
                  marginTop: selectedCoin ? 0 : 14,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                }}>
                  <Ionicons name="search" size={18} color="rgba(0, 0, 0, 0.35)" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search coins..."
                    placeholderTextColor="rgba(0, 0, 0, 0.3)"
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontSize: 15,
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
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="close-circle" size={18} color="rgba(0, 0, 0, 0.35)" />
                    </Pressable>
                  )}
                </View>

                {/* Search Results */}
                <ScrollView 
                  style={{ flex: 1 }} 
                  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
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
                          paddingVertical: 16,
                          paddingHorizontal: 14,
                          marginBottom: 12,
                          borderRadius: 12,
                          backgroundColor: pressed 
                            ? 'rgba(255, 255, 255, 0.9)' 
                            : 'rgba(255, 255, 255, 0.6)',
                          borderWidth: 1,
                          borderColor: pressed 
                            ? 'rgba(0, 0, 0, 0.12)' 
                            : 'rgba(0, 0, 0, 0.06)',
                        })}
                      >
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.85)', 
                          fontWeight: '600', 
                          fontSize: 15,
                          marginBottom: 3,
                          textAlign: 'center',
                        }}>
                          {coin.name}
                        </Text>
                        <Text style={{ 
                          color: 'rgba(0, 0, 0, 0.5)', 
                          fontSize: 13, 
                          fontWeight: '500',
                          textAlign: 'center',
                        }}>
                          {coin.diameter}mm • {coin.country}
                        </Text>
                      </Pressable>
                    ))
                  ) : searchQuery.length > 0 ? (
                    <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                      <View style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}>
                        <Ionicons name="search-outline" size={28} color="rgba(0, 0, 0, 0.25)" />
                      </View>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.5)', 
                        fontSize: 15, 
                        fontWeight: '600' 
                      }}>
                        No coins found
                      </Text>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.35)', 
                        fontSize: 13, 
                        marginTop: 4,
                        textAlign: 'center',
                      }}>
                        Try a different search term
                      </Text>
                    </View>
                  ) : !selectedCoin ? (
                    <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                      <View style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}>
                        <Ionicons name="search" size={28} color="rgba(0, 0, 0, 0.25)" />
                      </View>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.5)', 
                        fontSize: 15, 
                        fontWeight: '600',
                        marginBottom: 6,
                      }}>
                        Find your coin
                      </Text>
                      <Text style={{ 
                        color: 'rgba(0, 0, 0, 0.35)', 
                        fontSize: 13,
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
                  paddingHorizontal: 16,
                  paddingTop: 14,
                  paddingBottom: 18,
                  borderTopWidth: 0.5,
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
                      borderRadius: 14,
                      paddingVertical: 18,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                    })}
                  >
                    <Text style={{ 
                      color: 'rgba(0, 0, 0, 0.8)', 
                      fontWeight: '700', 
                      fontSize: 22,
                    }}>
                      Continue
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Map Scale Option */}
              {onMapScale && !selectedCoin && (
                <View style={{
                  paddingHorizontal: 16,
                  paddingTop: 14,
                  paddingBottom: 18,
                  borderTopWidth: 0.5,
                  borderTopColor: 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: 'rgba(0, 0, 0, 0.5)',
                    textAlign: 'center',
                    marginBottom: 10,
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
                      borderRadius: 14,
                      paddingVertical: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(100, 150, 255, 0.3)',
                    })}
                  >
                    <Text style={{ fontSize: 18, marginRight: 8 }}>🗺️</Text>
                    <Text style={{ 
                      color: 'rgba(0, 0, 0, 0.75)', 
                      fontWeight: '600', 
                      fontSize: 15,
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
