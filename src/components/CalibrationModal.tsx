import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../state/measurementStore';
import { getDefaultCalibrationUnit } from '../utils/unitConversion';
import UnitSelector from './UnitSelector';

interface CalibrationModalProps {
  visible: boolean;
  onComplete: () => void;
}

export default function CalibrationModal({ visible, onComplete }: CalibrationModalProps) {
  const unitSystem = useStore((s) => s.unitSystem);
  const setCalibration = useStore((s) => s.setCalibration);
  const defaultUnit = getDefaultCalibrationUnit(unitSystem);
  
  const [referenceDistance, setReferenceDistance] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<'mm' | 'cm' | 'in'>(defaultUnit);

  const handleSkipCalibration = () => {
    // Set a default calibration (1 pixel = 1mm)
    setCalibration({
      pixelsPerUnit: 1,
      unit: 'mm',
      referenceDistance: 1,
    });
    onComplete();
  };

  const handleSetCalibration = () => {
    const distance = parseFloat(referenceDistance);
    if (isNaN(distance) || distance <= 0) {
      return;
    }

    // For now, we'll set a default pixel ratio
    // In a full implementation, the user would draw a reference line first
    setCalibration({
      pixelsPerUnit: 100 / distance, // Assuming 100px reference
      unit: selectedUnit,
      referenceDistance: distance,
    });
    
    onComplete();
  };

  const metricUnits: Array<'mm' | 'cm'> = ['mm', 'cm'];
  const imperialUnits: Array<'in'> = ['in'];
  const availableUnits = unitSystem === 'metric' ? metricUnits : imperialUnits;

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
          <View className="bg-white rounded-t-3xl overflow-hidden">
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Set Reference Scale
              </Text>
              <Text className="text-gray-600 text-base">
                Enter a known dimension to calibrate measurements
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

              {/* Reference Distance Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  KNOWN DIMENSION
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    value={referenceDistance}
                    onChangeText={setReferenceDistance}
                    placeholder="Enter distance"
                    keyboardType="decimal-pad"
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-4 text-lg font-medium text-gray-900"
                  />
                  
                  {/* Unit selector buttons */}
                  <View className="ml-3 bg-gray-100 rounded-lg flex-row">
                    {availableUnits.map((unit) => (
                      <Pressable
                        key={unit}
                        onPress={() => setSelectedUnit(unit)}
                        className={`px-4 py-4 ${selectedUnit === unit ? 'bg-blue-500' : 'bg-transparent'} ${
                          unit === availableUnits[0] ? 'rounded-l-lg' : ''
                        } ${unit === availableUnits[availableUnits.length - 1] ? 'rounded-r-lg' : ''}`}
                      >
                        <Text className={`font-semibold ${selectedUnit === unit ? 'text-white' : 'text-gray-600'}`}>
                          {unit}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Info box */}
              <View className="bg-blue-50 rounded-xl p-4 mb-6">
                <View className="flex-row">
                  <Ionicons name="information-circle" size={20} color="#2563eb" />
                  <Text className="flex-1 ml-2 text-sm text-blue-900 leading-5">
                    Find an object in your photo with a known size (like a credit card, ruler, or standard object) to calibrate accurate measurements.
                  </Text>
                </View>
              </View>

              {/* Action buttons */}
              <View className="space-y-3">
                <Pressable
                  onPress={handleSetCalibration}
                  disabled={!referenceDistance || parseFloat(referenceDistance) <= 0}
                  className={`rounded-xl py-4 ${
                    !referenceDistance || parseFloat(referenceDistance) <= 0
                      ? 'bg-gray-300'
                      : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white text-center text-base font-semibold">
                    Set Calibration & Start Measuring
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSkipCalibration}
                  className="rounded-xl py-4 bg-gray-100"
                >
                  <Text className="text-gray-700 text-center text-base font-medium">
                    Skip Calibration
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
