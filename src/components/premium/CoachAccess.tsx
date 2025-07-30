import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  avatar: string;
  isOnline: boolean;
}

const mockCoaches: Coach[] = [
  {
    id: '1',
    name: 'Sarah Mueller',
    specialty: 'Krafttraining & Bodybuilding',
    rating: 4.9,
    experience: '8 Jahre Erfahrung',
    avatar: 'https://via.placeholder.com/60x60/4CAF50/FFFFFF?text=SM',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Marcus Weber',
    specialty: 'Cardio & Ausdauer',
    rating: 4.8,
    experience: '6 Jahre Erfahrung',
    avatar: 'https://via.placeholder.com/60x60/2196F3/FFFFFF?text=MW',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Lisa Schmidt',
    specialty: 'Yoga & Flexibilität',
    rating: 4.9,
    experience: '10 Jahre Erfahrung',
    avatar: 'https://via.placeholder.com/60x60/9C27B0/FFFFFF?text=LS',
    isOnline: true,
  },
];

export function CoachAccess() {
  const { getTextColor, getSurfaceColor, getBorderColor } = useTheme();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: getSurfaceColor() }]}>
      <View style={styles.header}>
        <Ionicons name="people" size={24} color="#FF8C00" />
        <Text style={[styles.title, { color: getTextColor('primary') }]}>
          Exklusive Coaches
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {mockCoaches.map((coach) => (
          <TouchableOpacity
            key={coach.id}
            style={[styles.coachCard, { borderColor: getBorderColor() }]}
          >
            <View style={styles.coachInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: coach.avatar }}
                  style={styles.avatar}
                />
                <View
                  style={[
                    styles.onlineIndicator,
                    { backgroundColor: coach.isOnline ? '#4CAF50' : '#9E9E9E' },
                  ]}
                />
              </View>

              <View style={styles.coachDetails}>
                <Text style={[styles.coachName, { color: getTextColor('primary') }]}>
                  {coach.name}
                </Text>
                <Text style={[styles.coachSpecialty, { color: getTextColor('secondary') }]}>
                  {coach.specialty}
                </Text>
                <Text style={[styles.coachExperience, { color: getTextColor('secondary') }]}>
                  {coach.experience}
                </Text>
                
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {renderStars(coach.rating)}
                  </View>
                  <Text style={[styles.ratingText, { color: getTextColor('secondary') }]}>
                    {coach.rating}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.chatButton,
                  {
                    backgroundColor: coach.isOnline ? '#4CAF50' : '#9E9E9E',
                  },
                ]}
                disabled={!coach.isOnline}
              >
                <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
                <Text style={styles.chatButtonText}>
                  {coach.isOnline ? 'Chat' : 'Offline'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.viewAllButton, { borderColor: getBorderColor() }]}
        >
          <Text style={[styles.viewAllText, { color: getTextColor('primary') }]}>
            Alle Coaches anzeigen
          </Text>
          <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  coachCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  coachInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  coachDetails: {
    flex: 1,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  coachSpecialty: {
    fontSize: 14,
    marginBottom: 2,
  },
  coachExperience: {
    fontSize: 12,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
