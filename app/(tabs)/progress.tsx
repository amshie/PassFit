import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../src/services/firebase/config';
import { CheckInService } from '../../src/services/api/checkin.service'; 
import { StudioService } from '../../src/services/api/studio.service'; 
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';

// Theme
import { useTheme } from '../../src/providers/ThemeProvider';

// User type and premium components
import { useUserType } from '../../src/hooks/useUserType';
import { AIRecommendations, CoachAccess, PersonalizedPlans } from '../../src/components/premium';
import { UpgradePrompt } from '../../src/components/ui/UpgradePrompt';

export default function ProgressScreen() {
  const { alreadyCheckedIn, newCheckIn } = useLocalSearchParams();
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [rawCheckIns, setRawCheckIns] = useState<any[]>([]); // alle Check-Ins speichern
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<{ studioName: string; time: string }[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { getBackgroundColor, getTextColor, getSurfaceColor, isDark } = useTheme();
  const userTypeInfo = useUserType();
  const { isPremium, isFree } = userTypeInfo;

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const checkIns = await CheckInService.getUserCheckIns(user.uid);
        setRawCheckIns(checkIns);

        // Markiere alle Tage mit Check-Ins grün
        const marked: { [date: string]: any } = {};
        checkIns.forEach(ci => {
          const dateStr = dayjs(ci.checkinTime.toDate()).format('YYYY-MM-DD');
          marked[dateStr] = {
            marked: true,
            selected: true,
            selectedColor: '#4CAF50',
          };
        });
        setMarkedDates(marked);
      } catch (error) {
        console.error('Fehler beim Laden der Check-ins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckIns();
  }, []);

  // Handler für Klick auf ein Datum
  const handleDayPress = async (day: DateData) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    // Filtere Check-Ins auf diesen Tag
    const checksToday = rawCheckIns.filter(ci =>
      dayjs(ci.checkinTime.toDate()).format('YYYY-MM-DD') === dateString
    );
    // Lade Studio-Namen und formatiere Zeit
    const details = await Promise.all(checksToday.map(async ci => {
      const studio = await StudioService.getStudio(ci.studioId);
      return {
        studioName: studio?.name ?? 'Unbekanntes Studio',
        time: dayjs(ci.checkinTime.toDate()).format('HH:mm'),
      };
    }));
    setDayDetails(details);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: getTextColor('primary') }]}>
          {isPremium ? 'Dein Fortschritt' : 'Deine Check-ins'}
        </Text>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>

      {/* Status Messages */}
      {alreadyCheckedIn === 'true' && (
        <Text style={[styles.statusMessage, { color: '#FF9800' }]}>
          Du hast heute bereits eingecheckt ✅
        </Text>
      )}
      {newCheckIn === 'true' && (
        <Text style={[styles.statusMessage, { color: '#4CAF50' }]}>
          Check-in erfolgreich 🎉
        </Text>
      )}

      {/* Premium Features for Premium Users */}
      {isPremium && (
        <>
          <AIRecommendations />
          <CoachAccess />
          <PersonalizedPlans />
        </>
      )}

      {/* Calendar Section */}
      <View style={[styles.calendarSection, { backgroundColor: getSurfaceColor() }]}>
        <Text style={[styles.sectionTitle, { color: getTextColor('primary') }]}>
          Check-in Kalender
        </Text>
        <Text style={[styles.subtitle, { color: getTextColor('secondary') }]}>
          Grün = eingecheckt (anklickbar)
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={getTextColor('primary')} />
        ) : (
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: '#4CAF50',
              todayTextColor: '#FF5722',
              backgroundColor: getSurfaceColor(),
              calendarBackground: getSurfaceColor(),
              textSectionTitleColor: getTextColor('primary'),
              dayTextColor: getTextColor('primary'),
              monthTextColor: getTextColor('primary'),
              arrowColor: getTextColor('primary'),
              textDisabledColor: getTextColor('disabled'),
            }}
          />
        )}

        {/* Details zum ausgewählten Tag */}
        {selectedDate && dayDetails.length > 0 && (
          <View style={[styles.detailsContainer, { backgroundColor: getSurfaceColor() }]}>
            <Text style={[styles.detailsTitle, { color: getTextColor('primary') }]}>
              Check-ins am {dayjs(selectedDate).format('DD.MM.YYYY')}:
            </Text>
            <FlatList
              data={dayDetails}
              keyExtractor={(_, idx) => `${selectedDate}-${idx}`}
              renderItem={({ item }) => (
                <Text style={[styles.detailsItem, { color: getTextColor('secondary') }]}>
                  {item.time} Uhr – {item.studioName}
                </Text>
              )}
            />
          </View>
        )}
      </View>

      {/* Upgrade Prompt for Free Users */}
      {isFree && (
        <TouchableOpacity
          style={[styles.upgradeCard, { backgroundColor: getSurfaceColor(), borderColor: '#FF8C00' }]}
          onPress={() => setShowUpgradePrompt(true)}
        >
          <View style={styles.upgradeContent}>
            <Ionicons name="star-outline" size={32} color="#FF8C00" />
            <View style={styles.upgradeText}>
              <Text style={[styles.upgradeTitle, { color: getTextColor('primary') }]}>
                Premium Features freischalten
              </Text>
              <Text style={[styles.upgradeDescription, { color: getTextColor('secondary') }]}>
                KI-Empfehlungen, exklusive Coaches und personalisierte Pläne
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF8C00" />
          </View>
        </TouchableOpacity>
      )}

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="Premium Fortschritts-Features"
        description="Erhalte KI-gestützte Trainingsempfehlungen, Zugriff auf exklusive Coaches und personalisierte Wochen- und Monatspläne!"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF8C00',
    marginLeft: 4,
  },
  statusMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  calendarSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  detailsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsItem: {
    marginBottom: 5,
  },
  upgradeCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeText: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
