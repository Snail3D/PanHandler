import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

interface DebugModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function DebugModal({ visible, message, onClose }: DebugModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, maxWidth: 400, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
            Debug Info
          </Text>
          <Text style={{ fontSize: 14, color: '#374151', marginBottom: 24, textAlign: 'center' }}>
            {message}
          </Text>
          <Pressable
            onPress={onClose}
            style={{ backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
