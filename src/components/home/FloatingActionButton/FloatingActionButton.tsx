import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FloatingActionButtonProps } from '../../../types/home.types';

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  studiosCount,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={t('accessibility.showStudiosList')}
      accessibilityHint="Öffnet die Liste aller Studios in der Nähe"
    >
      <Ionicons name="list" size={24} color="#fff" />
      <Text style={styles.floatingButtonText}>
        {t('studios.showStudios')} ({studiosCount})
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#ff6b35',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
