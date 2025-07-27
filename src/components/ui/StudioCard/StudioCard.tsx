import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Studio } from '@/models/studio';

export interface StudioCardProps {
  studio: Studio;
  distance?: string;
  onPress?: (studio: Studio) => void;
  onFavoritePress?: (studio: Studio) => void;
  isFavorite?: boolean;
  isOpen?: boolean;
  amenities?: string[];
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studio,
  distance,
  onPress,
  onFavoritePress,
  isFavorite = false,
  isOpen = true,
  amenities = [],
}) => {
  const handlePress = () => {
    onPress?.(studio);
  };

  const handleFavoritePress = () => {
    onFavoritePress?.(studio);
  };

  const getStatusColor = (isOpenStatus: boolean) => {
    return isOpenStatus ? '#16a34a' : '#dc2626';
  };

  const getStatusText = (isOpenStatus: boolean) => {
    return isOpenStatus ? 'Geöffnet' : 'Geschlossen';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="fitness-outline" size={24} color="#ff6b35" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {studio.name}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {studio.address}
        </Text>
        
        <View style={styles.metaContainer}>
          {distance && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{distance}</Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={getStatusColor(isOpen)} 
            />
            <Text style={[styles.metaText, { color: getStatusColor(isOpen) }]}>
              {getStatusText(isOpen)}
            </Text>
          </View>
          
          {studio.averageRating && (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{studio.averageRating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        
        {amenities && amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            {amenities.slice(0, 3).map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{amenities.length - 3}</Text>
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
        <Ionicons 
          name={isFavorite ? "star" : "star-outline"} 
          size={20} 
          color={isFavorite ? "#FFD700" : "#ff6b35"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    alignSelf: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginTop: 4,
  },
});

export default StudioCard;
