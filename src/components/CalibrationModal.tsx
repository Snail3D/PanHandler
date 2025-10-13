import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import useStore from '../state/measurementStore';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: (coin: CoinReference) => void;
  onDismiss: () => void;
}

export default function CalibrationModal({ visible, onComplete, onDismiss }: CalibrationModalProps) {
  const lastSelectedCoin = useStore((s) => s.lastSelectedCoin);
  const setLastSelectedCoin = useStore((s) => s.setLastSelectedCoin);
  
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinReference[]>([]);

  // Load last selected coin on mount
  useEffect(() => {
    if (visible && lastSelectedCoin) {
      const coin = getCoinByName(lastSelectedCoin);
      if (coin) {
        setSelectedCoin(coin);
      }
    }
  }, [visible, lastSelectedCoin]);

  useEffect(() => {
    // Update search results when query changes
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <Pressable 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          onPress={onDismiss}
        >
          <Pressable 
            style={{
              width: '100%',
              maxWidth: 420,
              maxHeight: '75%',
              borderRadius: 32,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.5,
              shadowRadius: 32,
              elevation: 24,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
                {/* Glowing Header */}
                <View style={{
                  paddingTop: 24,
                  paddingHorizontal: 24,
                  paddingBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.08)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(255,149,0,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                        shadowColor: '#FF9500',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                      }}>
                        <Text style={{ fontSize: 26 }}>🪙</Text>
                      </View>
                      <Text style={{ 
                        fontSize: 24, 
                        fontWeight: '700',
                        color: '#1C1C1E',
                        letterSpacing: -0.5,
                      }}>
                        Select Coin
                      </Text>
                    </View>
                    <Pressable 
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onDismiss();
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(120,120,128,0.16)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="close" size={24} color="#3C3C43" />
                    </Pressable>
                  </View>
                </View>

                {/* Content */}
                <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
                  {/* Selected Coin Display - Vibrant Glowing Style */}
                  {selectedCoin && (
                    <View style={{
                      marginBottom: 16,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 20,
                      padding: 16,
                      borderWidth: 3,
                      borderColor: '#10B981',
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 12,
                      elevation: 8,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ 
                            color: '#10B981', 
                            fontSize: 11, 
                            fontWeight: '700', 
                            marginBottom: 4,
                            letterSpacing: 0.5,
                          }}>
                            SELECTED
                          </Text>
                          <Text style={{ 
                            color: '#1C1C1E', 
                            fontWeight: '700', 
                            fontSize: 19,
                            textShadowColor: 'rgba(16,185,129,0.3)',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 4,
                          }}>
                            {selectedCoin.name}
                          </Text>
                          <Text style={{ 
                            color: '#10B981', 
                            fontSize: 15, 
                            marginTop: 4,
                            fontWeight: '600',
                          }}>
                            {selectedCoin.diameter}mm • {selectedCoin.country}
                          </Text>
                        </View>
                        <Pressable 
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setSelectedCoin(null);
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons name="close-circle" size={32} color="#10B981" />
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* Search Bar - Glassmorphism Style */}
                  <View style={{ marginBottom: 16 }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderWidth: 2,
                      borderColor: 'rgba(120,120,128,0.25)',
                    }}>
                      <Ionicons name="search" size={22} color="#8E8E93" />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search coins..."
                        placeholderTextColor="#8E8E93"
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          fontSize: 16,
                          fontWeight: '500',
                          color: '#1C1C1E',
                        }}
                        autoFocus={!selectedCoin}
                      />
                      {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                          <Ionicons name="close-circle" size={22} color="#8E8E93" />
                        </Pressable>
                      )}
                    </View>
                  </View>

                  {/* Search Results */}
                  {searchResults.length > 0 ? (
                    <View style={{ flex: 1 }}>
                      {searchResults.slice(0, 8).map((coin) => (
                        <Pressable
                          key={`${coin.country}-${coin.name}`}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            Keyboard.dismiss();
                            setSelectedCoin(coin);
                            setSearchQuery('');
                          }}
                          style={({ pressed }) => ({
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            marginBottom: 10,
                            borderRadius: 16,
                            backgroundColor: pressed ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                            borderWidth: 2,
                            borderColor: pressed ? '#007AFF' : 'rgba(120,120,128,0.2)',
                            shadowColor: pressed ? '#007AFF' : 'transparent',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: pressed ? 0.4 : 0,
                            shadowRadius: pressed ? 8 : 0,
                          })}
                        >
                          <Text style={{ 
                            color: '#1C1C1E', 
                            fontWeight: '700', 
                            fontSize: 16,
                          }}>
                            {coin.name}
                          </Text>
                          <Text style={{ 
                            color: '#8E8E93', 
                            fontSize: 14, 
                            marginTop: 4,
                            fontWeight: '500',
                          }}>
                            {coin.diameter}mm • {coin.country}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : searchQuery.length > 0 ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                      <View style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: 'rgba(142,142,147,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}>
                        <Ionicons name="search-outline" size={32} color="#8E8E93" />
                      </View>
                      <Text style={{ color: '#8E8E93', fontSize: 16, fontWeight: '600' }}>
                        No coins found
                      </Text>
                    </View>
                  ) : !selectedCoin ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                      <View style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: 'rgba(142,142,147,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}>
                        <Ionicons name="search" size={32} color="#8E8E93" />
                      </View>
                      <Text style={{ 
                        color: '#8E8E93', 
                        fontSize: 16, 
                        fontWeight: '600',
                        marginBottom: 8,
                      }}>
                        Start typing to search
                      </Text>
                      <Text style={{ 
                        color: '#C7C7CC', 
                        fontSize: 13,
                        fontWeight: '500',
                      }}>
                        Try "penny", "nickel", "quarter"
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Footer - Glowing Continue Button */}
                {selectedCoin && (
                  <View style={{
                    paddingHorizontal: 24,
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(0,0,0,0.08)',
                  }}>
                    <Pressable
                      onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        handleContinue();
                      }}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? '#0066CC' : '#007AFF',
                        borderRadius: 16,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#007AFF',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: pressed ? 0.6 : 0.4,
                        shadowRadius: pressed ? 16 : 12,
                        elevation: 8,
                      })}
                    >
                      <Ionicons name="checkmark-circle" size={24} color="white" />
                      <Text style={{ 
                        color: 'white', 
                        fontWeight: '700', 
                        fontSize: 17, 
                        marginLeft: 8,
                        textShadowColor: 'rgba(0,0,0,0.2)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                      }}>
                        Continue
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}
