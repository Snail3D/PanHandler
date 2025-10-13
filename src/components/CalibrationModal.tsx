import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../state/measurementStore';
import { CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: (coin: CoinReference) => void;
  onDismiss: () => void;
}

export default function CalibrationModal({ visible, onComplete, onDismiss }: CalibrationModalProps) {
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
          top: insets.top + 60,
          left: 20,
          right: 20,
          maxHeight: selectedCoin ? 460 : 380,
          backgroundColor: 'rgba(28, 28, 30, 0.98)',
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
        }}>
          {/* Header */}
          <View style={{
            paddingTop: 18,
            paddingHorizontal: 18,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, marginRight: 10 }}>🪙</Text>
                <Text style={{ fontSize: 19, fontWeight: '700', color: '#FFFFFF' }}>Select Coin</Text>
              </View>
              <Pressable
                onPress={onDismiss}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={17} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {/* Selected Coin */}
            {selectedCoin && (
              <View style={{
                marginHorizontal: 16,
                marginTop: 12,
                marginBottom: 10,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: 'rgba(76, 175, 80, 0.5)',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#4CAF50', fontSize: 10, fontWeight: '700', marginBottom: 3, letterSpacing: 0.5 }}>
                      SELECTED
                    </Text>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                      {selectedCoin.name}
                    </Text>
                    <Text style={{ color: '#9CCC65', fontSize: 13, marginTop: 3, fontWeight: '500' }}>
                      {selectedCoin.diameter}mm • {selectedCoin.country}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCoin(null);
                    }}
                    style={{ padding: 6 }}
                  >
                    <Ionicons name="close-circle" size={24} color="#4CAF50" />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Search Bar */}
            <View style={{
              marginHorizontal: 16,
              marginTop: selectedCoin ? 0 : 12,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}>
              <Ionicons name="search" size={18} color="rgba(255, 255, 255, 0.6)" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search coins..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: '#FFFFFF',
                }}
                autoFocus={!selectedCoin}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="rgba(255, 255, 255, 0.6)" />
                </Pressable>
              )}
            </View>

            {/* Search Results */}
            <ScrollView 
              style={{ flex: 1 }} 
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
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
                      paddingVertical: 11,
                      paddingHorizontal: 14,
                      marginBottom: 6,
                      borderRadius: 10,
                      backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    })}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
                      {coin.name}
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13, marginTop: 2 }}>
                      {coin.diameter}mm • {coin.country}
                    </Text>
                  </Pressable>
                ))
              ) : searchQuery.length > 0 ? (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <Ionicons name="search-outline" size={36} color="rgba(255, 255, 255, 0.3)" />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginTop: 10 }}>
                    No coins found
                  </Text>
                </View>
              ) : !selectedCoin ? (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <Ionicons name="search" size={36} color="rgba(255, 255, 255, 0.3)" />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginTop: 10 }}>
                    Start typing to search
                  </Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, marginTop: 6 }}>
                    Try "penny", "nickel", "quarter"
                  </Text>
                </View>
              ) : null}
            </ScrollView>
          </View>

          {/* Continue Button */}
          {selectedCoin && (
            <View style={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 16,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
            }}>
              <Pressable
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  handleContinue();
                }}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#E69500' : '#FFA500',
                  borderRadius: 12,
                  paddingVertical: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#FFA500',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                })}
              >
                <Ionicons name="arrow-forward-circle" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginLeft: 8 }}>
                  Continue
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
