import React from 'react';
import { View, Text, Pressable } from 'react-native';
import useStore from '../state/measurementStore';
import { UnitSystem } from '../state/measurementStore';

export default function UnitSelector() {
  const unitSystem = useStore((s) => s.unitSystem);
  const setUnitSystem = useStore((s) => s.setUnitSystem);

  const options: { value: UnitSystem; label: string }[] = [
    { value: 'metric', label: 'Metric' },
    { value: 'imperial', label: 'Imperial' },
  ];

  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => setUnitSystem(option.value)}
          className={`flex-1 py-2 px-4 rounded-md ${
            unitSystem === option.value ? 'bg-white' : 'bg-transparent'
          }`}
          style={{
            shadowColor: unitSystem === option.value ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: unitSystem === option.value ? 0.1 : 0,
            shadowRadius: 2,
            elevation: unitSystem === option.value ? 2 : 0,
          }}
        >
          <Text
            className={`text-center font-medium ${
              unitSystem === option.value ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
