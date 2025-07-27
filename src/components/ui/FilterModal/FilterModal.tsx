import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudioFilters } from '../../../models/studio';

export interface FilterOptions {
  distance: number;
  isOpen: boolean;
  amenities: string[];
  minRating: number;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: StudioFilters) => void;
  filters?: StudioFilters;
}

const DISTANCE_OPTIONS = [
  { label: '10 km', value: 10 },
  { label: '50 km', value: 50 },
  { label: '500 km', value: 500 },
  { label: 'Weltweit', value: Infinity },
];

const AMENITY_OPTIONS = [
  'Fitnessstudio',
  'Cardio',
  'Krafttraining',
  'Yoga',
  'Pilates',
  'Crossfit',
  'Functional Training',
  'Spinning',
  'Wellness',
  'Sauna',
  'Ernährungsberatung',
  'Personal Training',
];

const RATING_OPTIONS = [
  { label: 'Alle', value: 0 },
  { label: '3+ Sterne', value: 3 },
  { label: '4+ Sterne', value: 4 },
  { label: '4.5+ Sterne', value: 4.5 },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  filters: initialFilters = {},
}) => {
  const [filters, setFilters] = useState<StudioFilters>({
    radiusKm: initialFilters?.radiusKm || 50,
    isOpen: initialFilters?.isOpen || false,
    amenities: initialFilters?.amenities || [],
    minRating: initialFilters?.minRating || 0,
    type: initialFilters?.type,
    priceRange: initialFilters?.priceRange,
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: StudioFilters = {
      radiusKm: 50,
      isOpen: false,
      amenities: [],
      minRating: 0,
    };
    setFilters(resetFilters);
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Distance Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Entfernung</Text>
              <View style={styles.optionsGrid}>
                {DISTANCE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.radiusKm === option.value && styles.optionButtonActive,
                      option.value === Infinity && filters.radiusKm === option.value && styles.worldwideButtonActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, radiusKm: option.value }))}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.radiusKm === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                      {option.value === Infinity && ' 🌍'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Open Status Filter */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <Text style={styles.sectionTitle}>Nur geöffnete Studios</Text>
                <Switch
                  value={filters.isOpen}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, isOpen: value }))}
                  trackColor={{ false: '#e2e8f0', true: '#ff6b35' }}
                  thumbColor={filters.isOpen ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mindestbewertung</Text>
              <View style={styles.optionsGrid}>
                {RATING_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.minRating === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, minRating: option.value }))}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.minRating === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Angebote</Text>
              <View style={styles.amenitiesGrid}>
                {AMENITY_OPTIONS.map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.amenityButton,
                      (filters.amenities || []).includes(amenity) && styles.amenityButtonActive,
                    ]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <Text
                      style={[
                        styles.amenityText,
                        (filters.amenities || []).includes(amenity) && styles.amenityTextActive,
                      ]}
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Zurücksetzen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Anwenden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  optionButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  worldwideButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  optionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#fff',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  amenityButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  amenityText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  amenityTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FilterModal;
