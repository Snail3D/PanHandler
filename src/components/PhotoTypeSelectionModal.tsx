import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export type PhotoType = 'coin' | 'aerial' | 'map' | 'blueprint' | 'knownScale';

interface PhotoTypeSelectionModalProps {
  visible: boolean;
  onSelect: (type: PhotoType) => void;
  onCancel: () => void;
}

const PhotoTypeSelectionModal: React.FC<PhotoTypeSelectionModalProps> = ({
  visible,
  onSelect,
  onCancel,
}) => {
  const handleSelect = (type: PhotoType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(type);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Choose Photo Type</Text>
              <Text style={styles.subtitle}>
                How would you like to calibrate this photo?
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Coin Reference */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('coin')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,149,0,0.15)' }]}>
                  <Text style={styles.emoji}>🪙</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Coin Reference</Text>
                  <Text style={styles.optionDescription}>
                    Classic calibration with a coin
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </Pressable>

              {/* Aerial Photo */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('aerial')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,199,190,0.15)' }]}>
                  <Text style={styles.emoji}>✈️</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Aerial Photo</Text>
                  <Text style={styles.optionDescription}>
                    Auto-calibrate from drone metadata
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </Pressable>

              {/* Map Mode */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('map')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,122,255,0.15)' }]}>
                  <Text style={styles.emoji}>🗺️</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Map Mode</Text>
                  <Text style={styles.optionDescription}>
                    Use verbal scale (1 inch = 10 miles)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </Pressable>

              {/* Blueprint */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('blueprint')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(88,86,214,0.15)' }]}>
                  <Text style={styles.emoji}>📐</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Blueprint</Text>
                  <Text style={styles.optionDescription}>
                    Calibrate from scale bar
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </Pressable>

              {/* Known Scale */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect('knownScale')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(52,199,89,0.15)' }]}>
                  <Text style={styles.emoji}>📏</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Known Scale</Text>
                  <Text style={styles.optionDescription}>
                    Two-point with known distance
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </Pressable>
            </View>

            {/* Cancel Button */}
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionPressed: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ scale: 0.98 }],
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PhotoTypeSelectionModal;
