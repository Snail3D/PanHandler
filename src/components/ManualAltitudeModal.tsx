/**
 * Manual Altitude Entry Modal
 * 
 * When phone is far from drone location, ask user to manually enter
 * the drone altitude above ground (they know this from their controller)
 */

import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput } from 'react-native';
import { cn } from '../utils/cn';

interface ManualAltitudeModalProps {
  visible: boolean;
  onConfirm: (altitudeMeters: number) => void;
  onCancel: () => void;
  droneModel?: string;
  distance?: number;
}

export default function ManualAltitudeModal({
  visible,
  onConfirm,
  onCancel,
  droneModel = 'Drone',
  distance,
}: ManualAltitudeModalProps) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  
  const handleConfirm = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      alert('Please enter a valid altitude greater than 0');
      return;
    }
    
    const altitudeMeters = unit === 'feet' ? numValue * 0.3048 : numValue;
    onConfirm(altitudeMeters);
    setValue('');
  };
  
  const handleCancel = () => {
    setValue('');
    onCancel();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              🚁 {droneModel}
            </Text>
            {distance !== undefined && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                {distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance.toFixed(0)}m`} from photo location
              </Text>
            )}
          </View>
          
          <Text className="text-base text-gray-700 dark:text-gray-300 text-center mb-6">
            Enter drone height above ground when photo was taken
          </Text>
          
          <View className="flex-row items-center mb-6 gap-3">
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="50"
              keyboardType="decimal-pad"
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-bold px-4 py-3 rounded-xl text-center"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            
            <View className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <Pressable
                onPress={() => setUnit('meters')}
                className={cn(
                  'px-4 py-3',
                  unit === 'meters' ? 'bg-blue-500' : 'bg-transparent'
                )}
              >
                <Text
                  className={cn(
                    'font-semibold text-base',
                    unit === 'meters' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  m
                </Text>
              </Pressable>
              
              <View className="h-px bg-gray-300 dark:bg-gray-600" />
              
              <Pressable
                onPress={() => setUnit('feet')}
                className={cn(
                  'px-4 py-3',
                  unit === 'feet' ? 'bg-blue-500' : 'bg-transparent'
                )}
              >
                <Text
                  className={cn(
                    'font-semibold text-base',
                    unit === 'feet' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  ft
                </Text>
              </Pressable>
            </View>
          </View>
          
          <View className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 mb-6">
            <Text className="text-sm text-blue-700 dark:text-blue-300 text-center">
              💡 Shown on drone controller or DJI app
            </Text>
          </View>
          
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCancel}
              className="flex-1 bg-gray-200 dark:bg-gray-700 py-4 rounded-xl"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-semibold text-center text-base">
                Cancel
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleConfirm}
              className="flex-1 bg-blue-500 py-4 rounded-xl"
            >
              <Text className="text-white font-semibold text-center text-base">
                Calibrate
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
