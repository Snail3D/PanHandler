import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        onPress={onDismiss}
      >
        <Pressable 
          className="bg-gray-900 rounded-3xl w-full max-w-md"
          style={{ maxHeight: '70%' }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-700">
            <Text className="text-white text-xl font-bold">Select Coin</Text>
            <Pressable onPress={onDismiss} className="w-10 h-10 items-center justify-center -mr-2">
              <Ionicons name="close" size={28} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* Content */}
          <View className="px-6 py-4">
            {/* Selected Coin Display */}
            {selectedCoin && (
              <View className="mb-4 bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-blue-400 text-xs font-semibold mb-1">SELECTED</Text>
                    <Text className="text-white font-bold text-lg">
                      {selectedCoin.name}
                    </Text>
                    <Text className="text-blue-300 text-sm mt-1">
                      {selectedCoin.diameter}mm • {selectedCoin.country}
                    </Text>
                  </View>
                  <Pressable 
                    onPress={() => setSelectedCoin(null)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Ionicons name="close-circle" size={24} color="#60A5FA" />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Search Bar */}
            <View className="mb-4">
              <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 border-2 border-gray-700">
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search coins..."
                  placeholderTextColor="#6B7280"
                  className="flex-1 ml-3 text-white text-base"
                  autoFocus={!selectedCoin}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <View style={{ maxHeight: 300 }}>
                {searchResults.slice(0, 8).map((coin) => (
                  <Pressable
                    key={`${coin.country}-${coin.name}`}
                    onPress={() => {
                      Keyboard.dismiss();
                      setSelectedCoin(coin);
                      setSearchQuery('');
                    }}
                    className="py-3 px-4 mb-2 rounded-xl bg-gray-800 border-2 border-gray-700 active:border-blue-500"
                  >
                    <Text className="text-white font-semibold">
                      {coin.name}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {coin.diameter}mm • {coin.country}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : searchQuery.length > 0 ? (
              <View className="py-8 items-center">
                <Ionicons name="search-outline" size={40} color="#4B5563" />
                <Text className="text-gray-400 mt-3">No coins found</Text>
              </View>
            ) : !selectedCoin ? (
              <View className="py-8 items-center">
                <Ionicons name="search" size={40} color="#4B5563" />
                <Text className="text-gray-400 mt-3">Start typing to search</Text>
                <Text className="text-gray-600 text-xs mt-2">
                  Try "penny", "nickel", "quarter"
                </Text>
              </View>
            ) : null}
          </View>

          {/* Footer */}
          {selectedCoin && (
            <View className="px-6 py-4 border-t border-gray-700">
              <Pressable
                onPress={handleContinue}
                className="bg-blue-500 rounded-xl py-4 flex-row items-center justify-center active:bg-blue-600"
              >
                <Ionicons name="checkmark-circle" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Continue
                </Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
