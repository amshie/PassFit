import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BottomSheet, StudioCard } from '../../ui';
import { StudioListSkeleton } from '../../ui/Loading';
import { StudioBottomSheetProps } from '../../../types/home.types';

// Dummy-Daten für Amenities (bis Backend erweitert wird)
const STUDIO_AMENITIES: { [key: string]: string[] } = {
  'HYGIA Damascus': ['Fitnessstudio', 'Wellness', 'Ernährungsberatung', 'Functional Training'],
  'Elite Fitness Center': ['Cardio', 'Krafttraining', 'Yoga', 'Crossfit'],
  'Damascus Sports Club': ['Cardio', 'Krafttraining', 'Basketball', 'Tennis'],
  'Fitness Zone Damascus': ['Cardio', 'Krafttraining', 'Pilates', 'Spinning'],
};

// Dummy-Daten für Öffnungszeiten
const STUDIO_STATUS: { [key: string]: boolean } = {
  'HYGIA Damascus': true,
  'Elite Fitness Center': true,
  'Damascus Sports Club': false,
  'Fitness Zone Damascus': true,
};

export const StudioBottomSheet: React.FC<StudioBottomSheetProps> = ({
  visible,
  onClose,
  studios,
  onStudioSelect,
  isLoading,
}) => {
  const { t } = useTranslation();

  const renderEmptyState = () => (
    <View 
      style={styles.emptyContainer}
      accessible={true}
      accessibilityLabel={t('studios.noStudiosInArea')}
    >
      <Ionicons name="fitness-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>{t('studios.noStudiosInArea')}</Text>
      <Text style={styles.emptySubtext}>
        {t('studios.moveMapOrZoom')}
      </Text>
    </View>
  );

  const renderStudioList = () => {
    if (isLoading) {
      return (
        <StudioListSkeleton 
          itemCount={3} 
          showHeader={false} 
          showDistance={true} 
        />
      );
    }

    if (studios.length === 0) {
      return renderEmptyState();
    }

    return studios.map((studio) => (
      <StudioCard
        key={studio.studioId}
        studio={studio}
        distance={(studio as any).distance}
        onPress={onStudioSelect}
        amenities={STUDIO_AMENITIES[studio.name] || []}
        isOpen={STUDIO_STATUS[studio.name] !== false}
      />
    ));
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('studios.studiosNearby')}
      snapPoints={[0.4, 0.7]}
      initialSnapPoint={0}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel={t('studios.studiosNearby')}
      >
        {renderStudioList()}
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
