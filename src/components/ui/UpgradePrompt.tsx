import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
  benefits?: string[];
}

export function UpgradePrompt({
  visible,
  onClose,
  feature,
  description,
  benefits = [
    'QR-Code Check-ins',
    'KI-gestützte Trainingsempfehlungen',
    'Zugriff auf exklusive Coaches',
    'Personalisierte Wochen- und Monatspläne',
    'Priority-Support',
    'Exklusive Rabatt-Codes',
  ],
}: UpgradePromptProps) {
  const router = useRouter();
  const { getTextColor, getSurfaceColor, getBorderColor } = useTheme();

  const handleUpgrade = () => {
    onClose();
    router.push('/upgrade');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: getSurfaceColor() }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={getTextColor('secondary')} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: '#FFE4B5' }]}>
                <Ionicons name="star" size={32} color="#FF8C00" />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: getTextColor('primary') }]}>
              Premium Feature
            </Text>

            {/* Feature name */}
            <Text style={[styles.featureName, { color: '#FF8C00' }]}>
              {feature}
            </Text>

            {/* Description */}
            {description && (
              <Text style={[styles.description, { color: getTextColor('secondary') }]}>
                {description}
              </Text>
            )}

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={[styles.benefitsTitle, { color: getTextColor('primary') }]}>
                Mit Premium erhältst du:
              </Text>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={[styles.benefitText, { color: getTextColor('secondary') }]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTA Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: '#FF8C00' }]}
                onPress={handleUpgrade}
              >
                <Text style={styles.upgradeButtonText}>Jetzt upgraden</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.laterButton, { borderColor: getBorderColor() }]}
                onPress={onClose}
              >
                <Text style={[styles.laterButtonText, { color: getTextColor('secondary') }]}>
                  Vielleicht später
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  upgradeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

// Export both named and default
export default UpgradePrompt;
