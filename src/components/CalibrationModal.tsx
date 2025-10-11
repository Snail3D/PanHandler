import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../state/measurementStore';
import UnitSelector from './UnitSelector';
import { COIN_REFERENCES, CoinReference, getCoinByName, searchCoins } from '../utils/coinReferences';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: (coin: CoinReference) => void;
}

export default function CalibrationModal({ visible, onComplete }: CalibrationModalProps) {
  const setCalibration = useStore((s) => s.setCalibration);
  const lastSelectedCoin = useStore((s) => s.lastSelectedCoin);
  const setLastSelectedCoin = useStore((s) => s.setLastSelectedCoin);
  const unitSystem = useStore((s) => s.unitSystem);
  
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [customUnit, setCustomUnit] = useState<'mm' | 'cm' | 'in'>(unitSystem === 'metric' ? 'mm' : 'in');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoinReference[]>([]);

  // Load last selected coin on mount
  useEffect(() => {
    if (visible && lastSelectedCoin && !useCustomSize) {
      const coin = getCoinByName(lastSelectedCoin);
      if (coin) {
        setSelectedCoin(coin);
      }
    }
  }, [visible, lastSelectedCoin, useCustomSize]);

  useEffect(() => {
    // Update custom unit when unit system changes
    setCustomUnit(unitSystem === 'metric' ? 'mm' : 'in');
  }, [unitSystem]);

  useEffect(() => {
    // Update search results when query changes
    if (searchQuery.trim()) {
      setSearchResults(searchCoins(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSkipCalibration = () => {
    // Set a default calibration (1 pixel = 1mm)
    setCalibration({
      pixelsPerUnit: 1,
      unit: 'mm',
      referenceDistance: 1,
    });
    // Use US Quarter as default
    const defaultCoin = COIN_REFERENCES[0].coins[3]; // US Quarter
    onComplete(defaultCoin);
  };

  const handleSetCalibration = () => {
    if (useCustomSize) {
      const size = parseFloat(customSize);
      if (isNaN(size) || size <= 0) {
        return;
      }
      
      // Convert to mm for consistency
      let sizeInMm = size;
      if (customUnit === 'cm') sizeInMm = size * 10;
      if (customUnit === 'in') sizeInMm = size * 25.4;
      
      // Create a custom coin reference
      const customCoin: CoinReference = {
        name: `Custom ${size}${customUnit}`,
        diameter: sizeInMm,
        currency: 'CUSTOM',
        country: 'Custom',
        value: `${size}${customUnit}`,
      };
      
      setLastSelectedCoin(customCoin.name);
      onComplete(customCoin);
    } else {
      if (!selectedCoin) {
        return;
      }

      setLastSelectedCoin(selectedCoin.name);
      onComplete(selectedCoin);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="bg-white rounded-t-3xl overflow-hidden" style={{ maxHeight: '85%' }}>
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Set Reference Scale
              </Text>
              <Text className="text-gray-600 text-base">
                Select a coin in your photo for calibration
              </Text>
            </View>

            <ScrollView 
              className="px-6 py-6"
              keyboardShouldPersistTaps="handled"
            >
              {/* Unit System Selector */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  UNIT SYSTEM
                </Text>
                <UnitSelector />
              </View>

              {/* Custom Size Toggle */}
              <View className="mb-6">
                <Pressable
                  onPress={() => {
                    setUseCustomSize(!useCustomSize);
                    if (!useCustomSize) {
                      setSelectedCoin(null);
                    }
                  }}
                  className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4"
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons 
                      name={useCustomSize ? "create" : "cash-outline"} 
                      size={24} 
                      color={useCustomSize ? "#3B82F6" : "#6B7280"} 
                    />
                    <Text className={`ml-3 font-semibold ${useCustomSize ? 'text-blue-600' : 'text-gray-700'}`}>
                      {useCustomSize ? 'Custom Size' : 'Use Coin Reference'}
                    </Text>
                  </View>
                  <Ionicons 
                    name={useCustomSize ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={useCustomSize ? "#3B82F6" : "#D1D5DB"} 
                  />
                </Pressable>
              </View>

              {/* Custom Size Input */}
              {useCustomSize && (
                <View className="mb-6 bg-amber-50 rounded-xl p-4">
                  <Text className="text-sm font-semibold text-amber-900 mb-3">
                    CUSTOM REFERENCE SIZE
                  </Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={customSize}
                      onChangeText={setCustomSize}
                      placeholder="Enter size"
                      keyboardType="decimal-pad"
                      className="flex-1 bg-white rounded-lg px-4 py-3 text-lg font-medium text-gray-900 border-2 border-amber-200"
                    />
                    
                    {/* Unit selector buttons */}
                    <View className="ml-3 bg-white rounded-lg flex-row border-2 border-amber-200">
                      {(unitSystem === 'metric' ? ['mm', 'cm'] : ['in']).map((unit) => (
                        <Pressable
                          key={unit}
                          onPress={() => setCustomUnit(unit as 'mm' | 'cm' | 'in')}
                          className={`px-4 py-3 ${customUnit === unit ? 'bg-amber-500' : 'bg-transparent'} ${
                            unit === 'mm' ? 'rounded-l-lg' : ''
                          } ${unit === (unitSystem === 'metric' ? 'cm' : 'in') ? 'rounded-r-lg' : ''}`}
                        >
                          <Text className={`font-semibold ${customUnit === unit ? 'text-white' : 'text-gray-600'}`}>
                            {unit}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <Text className="text-amber-700 text-sm mt-3">
                    Enter the diameter or width of any reference object in your photo
                  </Text>
                </View>
              )}

              {/* Selected Coin Display */}
              {selectedCoin && !useCustomSize && (
                <View className="mb-6 bg-blue-50 rounded-xl p-4">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
                      <Ionicons name="cash" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-blue-900 font-bold text-base">
                        {selectedCoin.name}
                      </Text>
                      <Text className="text-blue-700 text-sm">
                        {selectedCoin.diameter}mm diameter
                      </Text>
                    </View>
                    <Pressable onPress={() => setSelectedCoin(null)}>
                      <Ionicons name="close-circle" size={24} color="#2563eb" />
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Coin Categories */}
              {!useCustomSize && (
                <View className="mb-6">
                  {/* Search Bar */}
                  <View className="mb-4">
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                      <Ionicons name="search" size={20} color="#6B7280" />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search coins by name, country, or currency..."
                        className="flex-1 ml-3 text-gray-900"
                        placeholderTextColor="#9CA3AF"
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
                    <View>
                      <Text className="text-sm font-semibold text-gray-700 mb-3">
                        SEARCH RESULTS ({searchResults.length})
                      </Text>
                      <View className="space-y-2">
                        {searchResults.map((coin) => (
                          <Pressable
                            key={`${coin.country}-${coin.name}`}
                            onPress={() => {
                              setSelectedCoin(coin);
                              setSearchQuery('');
                            }}
                            className={`py-3 px-4 rounded-lg border-2 ${
                              selectedCoin?.name === coin.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <View className="flex-row items-center justify-between">
                              <View className="flex-1">
                                <Text className={`font-semibold ${
                                  selectedCoin?.name === coin.name ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {coin.name} {coin.nativeName && `(${coin.nativeName})`}
                                </Text>
                                <Text className={`text-sm ${
                                  selectedCoin?.name === coin.name ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {coin.country} • {coin.value} • {coin.diameter}mm
                                </Text>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ) : searchQuery.length > 0 ? (
                    <View className="py-8 items-center">
                      <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                      <Text className="text-gray-500 mt-3">No coins found</Text>
                      <Text className="text-gray-400 text-sm">Try a different search term</Text>
                    </View>
                  ) : (
                    <View className="py-8 items-center bg-gray-50 rounded-xl">
                      <Ionicons name="search" size={48} color="#9CA3AF" />
                      <Text className="text-gray-600 mt-3 font-medium">Start typing to search</Text>
                      <Text className="text-gray-400 text-sm text-center px-8 mt-2">
                        Search for coins by name, country, or currency
                      </Text>
                      <View className="mt-4 bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <Text className="text-gray-500 text-xs">
                          💡 Try: "penny", "euro", "yen", "quarter"
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Info box */}
              {!useCustomSize && (
                <View className="bg-amber-50 rounded-xl p-4 mb-6">
                  <View className="flex-row">
                    <Ionicons name="bulb" size={20} color="#d97706" />
                    <Text className="flex-1 ml-2 text-sm text-amber-900 leading-5">
                      Place a coin on or near the object you want to measure. Make sure the coin is clearly visible and on the same plane as the object for accurate measurements.
                    </Text>
                  </View>
                </View>
              )}

              {/* Action buttons */}
              <View className="space-y-3">
                <Pressable
                  onPress={handleSetCalibration}
                  disabled={useCustomSize ? (!customSize || parseFloat(customSize) <= 0) : !selectedCoin}
                  className={`rounded-xl py-4 ${
                    (useCustomSize ? (!customSize || parseFloat(customSize) <= 0) : !selectedCoin) ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white text-center text-base font-semibold">
                    {useCustomSize 
                      ? (customSize ? `Use Custom ${customSize}${customUnit} Reference` : 'Enter Size First')
                      : (selectedCoin ? `Use ${selectedCoin.name} as Reference` : 'Select a Coin First')
                    }
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSkipCalibration}
                  className="rounded-xl py-4 bg-gray-100"
                >
                  <Text className="text-gray-700 text-center text-base font-medium">
                    Skip (Pixel Measurements Only)
                  </Text>
                </Pressable>
              </View>

              <View className="h-8" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
