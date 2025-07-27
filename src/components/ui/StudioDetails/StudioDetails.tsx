import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Studio } from '../../../models/studio';

interface StudioDetailsProps {
  studio: Studio;
  distance?: string;
  onCheckIn?: (studio: Studio) => void;
  onFavoriteToggle?: (studio: Studio) => void;
  isFavorite?: boolean;
  canCheckIn?: boolean;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({
  studio,
  distance,
  onCheckIn,
  onFavoriteToggle,
  isFavorite = false,
  canCheckIn = true,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#DDD" />
      );
    }
    
    return stars;
  };

  const getPriceRangeText = (priceRange?: string) => {
    switch (priceRange) {
      case 'low': return 'Günstig (€)';
      case 'medium': return 'Mittel (€€)';
      case 'high': return 'Teuer (€€€)';
      default: return 'Preis nicht verfügbar';
    }
  };

  const handleCall = () => {
    if (studio.phone) {
      Linking.openURL(`tel:${studio.phone}`);
    }
  };

  const handleEmail = () => {
    if (studio.email) {
      Linking.openURL(`mailto:${studio.email}`);
    }
  };

  const handleWebsite = () => {
    if (studio.website) {
      Linking.openURL(studio.website);
    }
  };

  const handleDirections = () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(studio.address)}`;
    Linking.openURL(url);
  };

  const handleCheckIn = () => {
    if (!canCheckIn) {
      Alert.alert(
        'Check-in nicht möglich',
        'Sie haben bereits heute in diesem Studio eingecheckt oder Ihr Abonnement ist nicht aktiv.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Check-in bestätigen',
      `Möchten Sie sich in ${studio.name} einchecken?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Einchecken', 
          onPress: () => onCheckIn?.(studio),
          style: 'default'
        },
      ]
    );
  };

  const getCurrentDayHours = () => {
    if (!studio.openingHours) return 'Öffnungszeiten nicht verfügbar';
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const todayHours = studio.openingHours[today];
    
    if (!todayHours || todayHours.closed) {
      return 'Heute geschlossen';
    }
    
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const renderOpeningHours = () => {
    if (!studio.openingHours) return null;

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
        {days.map(({ key, label }) => {
          const hours = studio.openingHours![key];
          return (
            <View key={key} style={styles.hoursRow}>
              <Text style={styles.dayLabel}>{label}</Text>
              <Text style={styles.hoursText}>
                {hours?.closed ? 'Geschlossen' : `${hours?.open} - ${hours?.close}`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      {studio.images && studio.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: studio.images[selectedImageIndex] }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {studio.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {studio.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    selectedImageIndex === index && styles.activeIndicator,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{studio.name}</Text>
            {studio.type && (
              <Text style={styles.type}>{studio.type}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoriteToggle?.(studio)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#dc3545' : '#666'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.address}>{studio.address}</Text>
          {distance && (
            <Text style={styles.distance}>{distance}</Text>
          )}
        </View>

        {/* Rating and Price */}
        <View style={styles.metaRow}>
          {studio.averageRating && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(studio.averageRating)}
              </View>
              <Text style={styles.ratingText}>
                {studio.averageRating.toFixed(1)}
                {studio.totalRatings && ` (${studio.totalRatings} Bewertungen)`}
              </Text>
            </View>
          )}
          
          {studio.priceRange && (
            <Text style={styles.priceRange}>
              {getPriceRangeText(studio.priceRange)}
            </Text>
          )}
        </View>

        {/* Current Status */}
        <View style={styles.statusContainer}>
          <Ionicons
            name="time-outline"
            size={16}
            color={studio.isActive ? '#28a745' : '#dc3545'}
          />
          <Text style={[
            styles.statusText,
            { color: studio.isActive ? '#28a745' : '#dc3545' }
          ]}>
            {studio.isActive ? getCurrentDayHours() : 'Temporär geschlossen'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.checkInButton,
            !canCheckIn && styles.disabledButton
          ]}
          onPress={handleCheckIn}
          disabled={!canCheckIn}
        >
          <Ionicons name="qr-code-outline" size={20} color="#fff" />
          <Text style={styles.checkInButtonText}>
            {canCheckIn ? 'Einchecken' : 'Bereits eingecheckt'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <Ionicons name="navigate-outline" size={20} color="#007bff" />
          <Text style={styles.directionsButtonText}>Route</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {studio.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschreibung</Text>
          <Text style={styles.description}>{studio.description}</Text>
        </View>
      )}

      {/* Amenities */}
      {studio.amenities && studio.amenities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Angebote & Ausstattung</Text>
          <View style={styles.amenitiesGrid}>
            {studio.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Opening Hours */}
      {renderOpeningHours()}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontakt</Text>
        
        {studio.phone && (
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#007bff" />
            <Text style={styles.contactText}>{studio.phone}</Text>
          </TouchableOpacity>
        )}
        
        {studio.email && (
          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Ionicons name="mail-outline" size={20} color="#007bff" />
            <Text style={styles.contactText}>{studio.email}</Text>
          </TouchableOpacity>
        )}
        
        {studio.website && (
          <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
            <Ionicons name="globe-outline" size={20} color="#007bff" />
            <Text style={styles.contactText}>{studio.website}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priceRange: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  checkInButton: {
    flex: 2,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007bff',
    gap: 8,
  },
  directionsButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
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
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  amenitiesGrid: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
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
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#007bff',
    flex: 1,
  },
});
