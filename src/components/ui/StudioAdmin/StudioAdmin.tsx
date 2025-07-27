import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { Studio } from '../../../models/studio';
import { useCreateStudio, useUpdateStudio } from '../../../hooks/useStudio';

interface StudioAdminProps {
  studio?: Studio;
  onSave?: (studio: Studio) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const STUDIO_TYPES = [
  'Fitnessstudio',
  'Yoga Studio',
  'Pilates Studio',
  'Crossfit Box',
  'Schwimmbad',
  'Wellness Center',
  'Kampfsport Studio',
  'Tanzstudio',
];

const AMENITIES_OPTIONS = [
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
  'Schwimmbad',
  'Whirlpool',
  'Massage',
  'Ernährungsberatung',
  'Personal Training',
  'Gruppenkurse',
  'Kinderbetreuung',
  'Parkplatz',
  'Umkleidekabinen',
  'Duschen',
];

const PRICE_RANGES = [
  { label: 'Günstig (€)', value: 'low' },
  { label: 'Mittel (€€)', value: 'medium' },
  { label: 'Teuer (€€€)', value: 'high' },
];

export const StudioAdmin: React.FC<StudioAdminProps> = ({
  studio,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: studio?.name || '',
    address: studio?.address || '',
    description: studio?.description || '',
    phone: studio?.phone || '',
    email: studio?.email || '',
    website: studio?.website || '',
    type: studio?.type || '',
    priceRange: studio?.priceRange || 'medium',
    isActive: studio?.isActive !== false,
    location: {
      lat: studio?.location?.lat || 0,
      lng: studio?.location?.lng || 0,
    },
    amenities: studio?.amenities || [],
    openingHours: studio?.openingHours || {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '20:00', closed: false },
    },
  });

  const createStudioMutation = useCreateStudio();
  const updateStudioMutation = useUpdateStudio(studio?.studioId || '');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: numValue,
      },
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleOpeningHoursChange = (
    day: string,
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Studio-Namen ein.');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie eine Adresse ein.');
      return false;
    }
    if (formData.location.lat === 0 || formData.location.lng === 0) {
      Alert.alert('Fehler', 'Bitte geben Sie gültige Koordinaten ein.');
      return false;
    }
    if (formData.email && !formData.email.includes('@')) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && studio) {
        const updateData = {
          ...formData,
          averageRating: studio.averageRating,
          totalRatings: studio.totalRatings,
        };
        await updateStudioMutation.mutateAsync(updateData);
        Alert.alert('Erfolg', 'Studio wurde erfolgreich aktualisiert.');
        onSave?.({ ...studio, ...updateData });
      } else {
        const createData = {
          ...formData,
          averageRating: 0,
          totalRatings: 0,
          createdAt: Timestamp.now(),
        };
        const newStudioId = await createStudioMutation.mutateAsync(createData);
        Alert.alert('Erfolg', 'Studio wurde erfolgreich erstellt.');
        onSave?.({ ...createData, studioId: newStudioId } as Studio);
      }
    } catch (error) {
      Alert.alert(
        'Fehler',
        `Studio konnte nicht ${isEditing ? 'aktualisiert' : 'erstellt'} werden.`
      );
    }
  };

  const renderOpeningHoursSection = () => {
    const days = [
      { key: 'monday', label: 'Montag' },
      { key: 'tuesday', label: 'Dienstag' },
      { key: 'wednesday', label: 'Mittwoch' },
      { key: 'thursday', label: 'Donnerstag' },
      { key: 'friday', label: 'Freitag' },
      { key: 'saturday', label: 'Samstag' },
      { key: 'sunday', label: 'Sonntag' },
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öffnungszeiten</Text>
        {days.map(({ key, label }) => (
          <View key={key} style={styles.hoursRow}>
            <Text style={styles.dayLabel}>{label}</Text>
            <View style={styles.hoursControls}>
              <Switch
                value={!formData.openingHours[key]?.closed}
                onValueChange={(value) =>
                  handleOpeningHoursChange(key, 'closed', !value)
                }
                trackColor={{ false: '#e2e8f0', true: '#007bff' }}
                thumbColor="#fff"
              />
              {!formData.openingHours[key]?.closed && (
                <>
                  <TextInput
                    style={styles.timeInput}
                    value={formData.openingHours[key]?.open || ''}
                    onChangeText={(value) =>
                      handleOpeningHoursChange(key, 'open', value)
                    }
                    placeholder="09:00"
                  />
                  <Text style={styles.timeSeparator}>-</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={formData.openingHours[key]?.close || ''}
                    onChangeText={(value) =>
                      handleOpeningHoursChange(key, 'close', value)
                    }
                    placeholder="18:00"
                  />
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Studio bearbeiten' : 'Neues Studio erstellen'}
        </Text>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grundinformationen</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Studio Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="z.B. FitnessPark München"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Musterstraße 123, 80331 München"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Beschreibung</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Beschreibung des Studios..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Studio-Typ</Text>
          <View style={styles.typeGrid}>
            {STUDIO_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.typeButtonActive,
                ]}
                onPress={() => handleInputChange('type', type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preisklasse</Text>
          <View style={styles.priceGrid}>
            {PRICE_RANGES.map((range) => (
              <TouchableOpacity
                key={range.value}
                style={[
                  styles.priceButton,
                  formData.priceRange === range.value && styles.priceButtonActive,
                ]}
                onPress={() => handleInputChange('priceRange', range.value)}
              >
                <Text
                  style={[
                    styles.priceButtonText,
                    formData.priceRange === range.value && styles.priceButtonTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Studio aktiv</Text>
          <Switch
            value={formData.isActive}
            onValueChange={(value) => handleInputChange('isActive', value)}
            trackColor={{ false: '#e2e8f0', true: '#007bff' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Standort</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Breitengrad *</Text>
            <TextInput
              style={styles.input}
              value={formData.location.lat.toString()}
              onChangeText={(value) => handleLocationChange('lat', value)}
              placeholder="48.1351"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Längengrad *</Text>
            <TextInput
              style={styles.input}
              value={formData.location.lng.toString()}
              onChangeText={(value) => handleLocationChange('lng', value)}
              placeholder="11.5820"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontaktinformationen</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="+49 89 123456"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="info@studio.de"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            placeholder="https://www.studio.de"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Amenities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Angebote & Ausstattung</Text>
        <View style={styles.amenitiesGrid}>
          {AMENITIES_OPTIONS.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityButton,
                formData.amenities.includes(amenity) && styles.amenityButtonActive,
              ]}
              onPress={() => handleAmenityToggle(amenity)}
            >
              <Text
                style={[
                  styles.amenityButtonText,
                  formData.amenities.includes(amenity) && styles.amenityButtonTextActive,
                ]}
              >
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Opening Hours */}
      {renderOpeningHoursSection()}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Abbrechen</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={createStudioMutation.isPending || updateStudioMutation.isPending}
        >
          <Text style={styles.saveButtonText}>
            {createStudioMutation.isPending || updateStudioMutation.isPending
              ? 'Speichern...'
              : 'Speichern'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  priceGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  priceButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  priceButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceButtonTextActive: {
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
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  amenityButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  amenityButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  amenityButtonTextActive: {
    color: '#fff',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  dayLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    width: 100,
  },
  hoursControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    width: 60,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
