import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

interface Plan {
  id: string;
  title: string;
  duration: string;
  type: 'weekly' | 'monthly';
  description: string;
  workouts: number;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  isActive: boolean;
}

const mockPlans: Plan[] = [
  {
    id: '1',
    title: 'Kraftaufbau Intensiv',
    duration: 'Diese Woche',
    type: 'weekly',
    description: 'Fokus auf Muskelaufbau mit progressiver Überlastung',
    workouts: 4,
    difficulty: 'Fortgeschritten',
    isActive: true,
  },
  {
    id: '2',
    title: 'Ausdauer & Cardio',
    duration: 'Nächste Woche',
    type: 'weekly',
    description: 'Verbesserung der kardiovaskulären Fitness',
    workouts: 5,
    difficulty: 'Anfänger',
    isActive: false,
  },
  {
    id: '3',
    title: 'Ganzheitlicher Fitness Plan',
    duration: 'Dieser Monat',
    type: 'monthly',
    description: 'Ausgewogenes Training für alle Muskelgruppen',
    workouts: 16,
    difficulty: 'Fortgeschritten',
    isActive: false,
  },
];

export function PersonalizedPlans() {
  const { getTextColor, getSurfaceColor, getBorderColor } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly'>('weekly');

  const filteredPlans = mockPlans.filter(plan => plan.type === selectedTab);

  const getDifficultyColor = (difficulty: Plan['difficulty']) => {
    switch (difficulty) {
      case 'Anfänger':
        return '#4CAF50';
      case 'Fortgeschritten':
        return '#FF9800';
      case 'Experte':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getSurfaceColor() }]}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={24} color="#FF8C00" />
        <Text style={[styles.title, { color: getTextColor('primary') }]}>
          Personalisierte Pläne
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderColor: getBorderColor() }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'weekly' && styles.activeTab,
            { backgroundColor: selectedTab === 'weekly' ? '#FF8C00' : 'transparent' },
          ]}
          onPress={() => setSelectedTab('weekly')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'weekly' ? '#FFFFFF' : getTextColor('secondary') },
            ]}
          >
            Wochenpläne
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'monthly' && styles.activeTab,
            { backgroundColor: selectedTab === 'monthly' ? '#FF8C00' : 'transparent' },
          ]}
          onPress={() => setSelectedTab('monthly')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'monthly' ? '#FFFFFF' : getTextColor('secondary') },
            ]}
          >
            Monatspläne
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { borderColor: plan.isActive ? '#FF8C00' : getBorderColor() },
              plan.isActive && { borderWidth: 2 },
            ]}
          >
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={[styles.planTitle, { color: getTextColor('primary') }]}>
                  {plan.title}
                </Text>
                <Text style={[styles.planDuration, { color: getTextColor('secondary') }]}>
                  {plan.duration}
                </Text>
              </View>
              
              {plan.isActive && (
                <View style={styles.activeIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              )}
            </View>

            <Text style={[styles.planDescription, { color: getTextColor('secondary') }]}>
              {plan.description}
            </Text>

            <View style={styles.planDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="fitness" size={16} color={getTextColor('secondary')} />
                <Text style={[styles.detailText, { color: getTextColor('secondary') }]}>
                  {plan.workouts} Workouts
                </Text>
              </View>

              <View style={styles.detailItem}>
                <View
                  style={[
                    styles.difficultyDot,
                    { backgroundColor: getDifficultyColor(plan.difficulty) },
                  ]}
                />
                <Text style={[styles.detailText, { color: getTextColor('secondary') }]}>
                  {plan.difficulty}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: plan.isActive ? '#4CAF50' : '#FF8C00',
                },
              ]}
            >
              <Text style={styles.actionButtonText}>
                {plan.isActive ? 'Aktiver Plan' : 'Plan starten'}
              </Text>
              <Ionicons
                name={plan.isActive ? 'checkmark' : 'play'}
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.createPlanButton, { borderColor: getBorderColor() }]}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FF8C00" />
          <Text style={[styles.createPlanText, { color: getTextColor('primary') }]}>
            Neuen Plan erstellen lassen
          </Text>
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
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    // Styling handled by backgroundColor in component
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  planDuration: {
    fontSize: 12,
  },
  activeIndicator: {
    marginLeft: 8,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  planDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  createPlanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  createPlanText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
