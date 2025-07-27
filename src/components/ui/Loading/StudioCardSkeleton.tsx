import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export interface StudioCardSkeletonProps {
  showDistance?: boolean;
}

export const StudioCardSkeleton: React.FC<StudioCardSkeletonProps> = ({
  showDistance = true,
}) => {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Studio wird geladen">
      <View style={styles.content}>
        {/* Studio image placeholder */}
        <SkeletonLoader
          width={60}
          height={60}
          borderRadius={8}
          style={styles.image}
        />
        
        <View style={styles.info}>
          {/* Studio name */}
          <SkeletonLoader
            width="70%"
            height={18}
            borderRadius={4}
            style={styles.name}
          />
          
          {/* Studio address */}
          <SkeletonLoader
            width="90%"
            height={14}
            borderRadius={4}
            style={styles.address}
          />
          
          {/* Rating and amenities */}
          <View style={styles.details}>
            <SkeletonLoader
              width={80}
              height={12}
              borderRadius={4}
              style={styles.rating}
            />
            <SkeletonLoader
              width={100}
              height={12}
              borderRadius={4}
              style={styles.amenities}
            />
          </View>
        </View>
        
        {showDistance && (
          <View style={styles.distance}>
            <SkeletonLoader
              width={50}
              height={14}
              borderRadius={4}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 6,
  },
  address: {
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    marginRight: 8,
  },
  amenities: {},
  distance: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default StudioCardSkeleton;
