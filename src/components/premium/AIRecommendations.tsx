import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'recovery';
  priority: 'high' | 'medium' | 'low';
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Krafttraining intensivieren',
    description: 'Basierend auf deinen letzten Check-ins empfehlen wir dir, mehr Krafttraining zu integrieren.',
    type: 'workout',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Regenerationstag einlegen',
    description: 'Du warst sehr aktiv diese Woche. Ein Regenerationstag würde dir gut tun.',
    type: 'recovery',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Cardio-Training variieren',
    description: 'Versuche verschiedene Cardio-Übungen für bessere Ergebnisse.',
    type: 'workout',
    priority: 'low',
  },
];

export function AIRecommendations() {
  const { getTextColor, getSurfaceColor, getBorderColor } = useTheme();

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'workout':
        return 'fitness-outline';
      case 'nutrition':
        return 'nutrition-outline';
      case 'recovery':
        return 'bed-outline';
      default:
        return 'bulb-outline';
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return '#FF5722';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getSurfaceColor() }]}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#FF8C00" />
        <Text style={[styles.title, { color: getTextColor('primary') }]}>
          KI-Empfehlungen
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {mockRecommendations.map((recommendation) => (
          <TouchableOpacity
            key={recommendation.id}
            style={[styles.recommendationCard, { borderColor: getBorderColor() }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.typeContainer}>
                <Ionicons
                  name={getTypeIcon(recommendation.type) as any}
                  size={20}
                  color={getTextColor('secondary')}
                />
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(recommendation.priority) },
                  ]}
                />
              </View>
              <Ionicons name="chevron-forward" size={20} color={getTextColor('secondary')} />
            </View>

            <Text style={[styles.recommendationTitle, { color: getTextColor('primary') }]}>
              {recommendation.title}
            </Text>

            <Text style={[styles.recommendationDescription, { color: getTextColor('secondary') }]}>
              {recommendation.description}
            </Text>
          </TouchableOpacity>
        ))}
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
  recommendationCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
