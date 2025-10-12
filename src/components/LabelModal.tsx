import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LabelModalProps {
  visible: boolean;
  onComplete: (label: string | null) => void;
  onDismiss: () => void;
}

export default function LabelModal({ visible, onComplete, onDismiss }: LabelModalProps) {
  const [label, setLabel] = useState('');

  const handleContinue = () => {
    Keyboard.dismiss();
    onComplete(label.trim() || null);
    setLabel(''); // Reset for next time
  };

  const handleSkip = () => {
    Keyboard.dismiss();
    onComplete(null);
    setLabel(''); // Reset for next time
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setLabel('');
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        onPress={handleCancel}
      >
        <Pressable 
          className="bg-gray-900 rounded-3xl w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4 border-b border-gray-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">Label This Item</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Optional - helps organize your measurements
                </Text>
              </View>
              <Pressable onPress={handleCancel} className="w-10 h-10 items-center justify-center -mr-2">
                <Ionicons name="close" size={28} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View className="px-6 py-6">
            {/* Input Field */}
            <View className="mb-2">
              <Text className="text-gray-300 text-sm font-semibold mb-2">What is this?</Text>
              <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 border-2 border-gray-700">
                <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                <TextInput
                  value={label}
                  onChangeText={setLabel}
                  placeholder="e.g., Kitchen Table, Door Frame, Box..."
                  placeholderTextColor="#6B7280"
                  className="flex-1 ml-3 text-white text-base"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  maxLength={50}
                />
                {label.length > 0 && (
                  <Pressable onPress={() => setLabel('')}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                  </Pressable>
                )}
              </View>
            </View>

            <Text className="text-gray-500 text-xs">
              This label will appear in emails and saved photos
            </Text>
          </View>

          {/* Footer Buttons */}
          <View className="px-6 pb-6 pt-2">
            <View className="flex-row gap-3">
              {/* Skip Button */}
              <Pressable
                onPress={handleSkip}
                className="flex-1 bg-gray-800 rounded-xl py-4 flex-row items-center justify-center active:bg-gray-700 border-2 border-gray-700"
              >
                <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
                <Text className="text-gray-300 font-semibold text-base ml-2">
                  Skip
                </Text>
              </Pressable>

              {/* Continue Button */}
              <Pressable
                onPress={handleContinue}
                className="flex-1 bg-blue-500 rounded-xl py-4 flex-row items-center justify-center active:bg-blue-600"
              >
                <Ionicons name="checkmark-circle" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  {label.trim() ? 'Continue' : 'Skip'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
