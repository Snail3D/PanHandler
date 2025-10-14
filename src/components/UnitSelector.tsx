// UnitSelector v1.1 - Imperial=Red, Metric=Blue
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
      {options.map((option) => {
        const isSelected = unitSystem === option.value;
        
        return (
          <Pressable
            key={option.value}
            onPress={() => setUnitSystem(option.value)}
            className={`flex-1 py-2 px-4 rounded-md ${
              isSelected ? 'bg-white' : 'bg-transparent'
            }`}
            style={{
              shadowColor: isSelected ? '#000' : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isSelected ? 0.1 : 0,
              shadowRadius: 2,
              elevation: isSelected ? 2 : 0,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
                color: !isSelected 
                  ? '#6B7280' // Gray when not selected
                  : option.value === 'metric' 
                    ? '#3B82F6' // Blue for Metric when selected
                    : '#EF4444', // Red for Imperial when selected
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
