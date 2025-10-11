import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../state/measurementStore';
import UnitSelector from './UnitSelector';
import { COIN_REFERENCES, CoinReference } from '../utils/coinReferences';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: (coin: CoinReference) => void;
}

export default function CalibrationModal({ visible, onComplete }: CalibrationModalProps) {
  const setCalibration = useStore((s) => s.setCalibration);
  
  const [selectedCoin, setSelectedCoin] = useState<CoinReference | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
    if (!selectedCoin) {
      return;
    }

    onComplete(selectedCoin);
  };

  const toggleCategory = (label: string) => {
    setExpandedCategory(expandedCategory === label ? null : label);
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

              {/* Selected Coin Display */}
              {selectedCoin && (
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
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  SELECT REFERENCE COIN
                </Text>
                
                {COIN_REFERENCES.map((category) => (
                  <View key={category.label} className="mb-3">
                    <Pressable
                      onPress={() => toggleCategory(category.label)}
                      className="bg-gray-100 rounded-lg px-4 py-3 flex-row items-center justify-between"
                    >
                      <View className="flex-row items-center flex-1">
                        <Ionicons 
                          name="cash-outline" 
                          size={20} 
                          color="#4B5563" 
                        />
                        <Text className="ml-3 text-gray-900 font-semibold">
                          {category.label}
                        </Text>
                      </View>
                      <Ionicons 
                        name={expandedCategory === category.label ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#6B7280" 
                      />
                    </Pressable>

                    {expandedCategory === category.label && (
                      <View className="mt-2 ml-4">
                        {category.coins.map((coin) => (
                          <Pressable
                            key={coin.name}
                            onPress={() => {
                              setSelectedCoin(coin);
                              setExpandedCategory(null);
                            }}
                            className={`py-3 px-4 mb-2 rounded-lg border-2 ${
                              selectedCoin?.name === coin.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <Text className={`font-semibold mb-1 ${
                              selectedCoin?.name === coin.name ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {coin.name}
                            </Text>
                            <Text className={`text-sm ${
                              selectedCoin?.name === coin.name ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {coin.diameter}mm diameter
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Info box */}
              <View className="bg-amber-50 rounded-xl p-4 mb-6">
                <View className="flex-row">
                  <Ionicons name="bulb" size={20} color="#d97706" />
                  <Text className="flex-1 ml-2 text-sm text-amber-900 leading-5">
                    Place a coin on or near the object you want to measure. Make sure the coin is clearly visible and on the same plane as the object for accurate measurements.
                  </Text>
                </View>
              </View>

              {/* Action buttons */}
              <View className="space-y-3">
                <Pressable
                  onPress={handleSetCalibration}
                  disabled={!selectedCoin}
                  className={`rounded-xl py-4 ${
                    !selectedCoin ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white text-center text-base font-semibold">
                    {selectedCoin ? `Use ${selectedCoin.name} as Reference` : 'Select a Coin First'}
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
