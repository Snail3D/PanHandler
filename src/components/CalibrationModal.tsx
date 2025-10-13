import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <View style={{
          position: 'absolute',
          top: 80,
          left: 20,
          right: 20,
          bottom: 80,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <View style={{
            paddingTop: 24,
            paddingHorizontal: 24,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5EA',
            backgroundColor: '#F8F9FA',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, marginRight: 12 }}>🪙</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E' }}>Select Coin</Text>
              </View>
              <Pressable onPress={onDismiss} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="close" size={20} color="#1C1C1E" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View style={{ flex: 1, padding: 20 }}>
            {/* Selected Coin */}
            {selectedCoin && (
              <View style={{ marginBottom: 16, backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, borderWidth: 2, borderColor: '#4CAF50' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#2E7D32', fontSize: 11, fontWeight: '700', marginBottom: 4 }}>SELECTED</Text>
                    <Text style={{ color: '#1C1C1E', fontWeight: '700', fontSize: 18 }}>{selectedCoin.name}</Text>
                    <Text style={{ color: '#2E7D32', fontSize: 14, marginTop: 4, fontWeight: '600' }}>{selectedCoin.diameter}mm • {selectedCoin.country}</Text>
                  </View>
                  <Pressable onPress={() => setSelectedCoin(null)} style={{ padding: 8 }}>
                    <Ionicons name="close-circle" size={28} color="#4CAF50" />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Search Bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}>
              <Ionicons name="search" size={20} color="#8E8E93" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search coins..."
                placeholderTextColor="#8E8E93"
                style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1C1C1E' }}
                autoFocus={!selectedCoin}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#8E8E93" />
                </Pressable>
              )}
            </View>

            {/* Search Results */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {searchResults.length > 0 ? (
                searchResults.slice(0, 8).map((coin) => (
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
                      marginBottom: 8,
                      borderRadius: 12,
                      backgroundColor: pressed ? '#E8F5E9' : '#F5F5F5',
                      borderWidth: 1,
                      borderColor: pressed ? '#4CAF50' : '#E5E5EA',
                    })}
                  >
                    <Text style={{ color: '#1C1C1E', fontWeight: '700', fontSize: 16 }}>{coin.name}</Text>
                    <Text style={{ color: '#8E8E93', fontSize: 14, marginTop: 4 }}>{coin.diameter}mm • {coin.country}</Text>
                  </Pressable>
                ))
              ) : searchQuery.length > 0 ? (
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Ionicons name="search-outline" size={48} color="#C7C7CC" />
                  <Text style={{ color: '#8E8E93', fontSize: 16, marginTop: 16 }}>No coins found</Text>
                </View>
              ) : !selectedCoin ? (
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Ionicons name="search" size={48} color="#C7C7CC" />
                  <Text style={{ color: '#8E8E93', fontSize: 16, marginTop: 16 }}>Start typing to search</Text>
                  <Text style={{ color: '#C7C7CC', fontSize: 13, marginTop: 8 }}>Try "penny", "nickel", "quarter"</Text>
                </View>
              ) : null}
            </ScrollView>
          </View>

          {/* Continue Button */}
          {selectedCoin && (
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#FFFFFF' }}>
              <Pressable
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  handleContinue();
                }}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#0051CC' : '#007AFF',
                  borderRadius: 12,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 17, marginLeft: 8 }}>Continue</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
