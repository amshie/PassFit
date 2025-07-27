import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { auth } from '../../src/services/firebase/config';
import { CheckInService } from '../../src/services/api/checkin.service'; 
import { StudioService } from '../../src/services/api/studio.service'; 
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';

export default function ProgressScreen() {
  const { alreadyCheckedIn, newCheckIn } = useLocalSearchParams();
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [rawCheckIns, setRawCheckIns] = useState<any[]>([]); // alle Check-Ins speichern
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<{ studioName: string; time: string }[]>([]);

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
    <View style={styles.container}>
      <Text style={styles.title}>Deine Check-ins</Text>
      {alreadyCheckedIn === 'true' && (
        <Text style={{ color: 'orange', marginBottom: 10 }}>
          Du hast heute bereits eingecheckt ✅
        </Text>
      )}
      {newCheckIn === 'true' && (
        <Text style={{ color: 'green', marginBottom: 10 }}>
          Check-in erfolgreich 🎉
        </Text>
      )}
      <Text style={styles.subtitle}>Grün = eingecheckt (anklickbar)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}  // hier aktivieren wir Klicks
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#FF5722',
          }}
        />
      )}

      {/* Details zum ausgewählten Tag */}
      {selectedDate && dayDetails.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>
            Check-ins am {dayjs(selectedDate).format('DD.MM.YYYY')}:
          </Text>
          <FlatList
            data={dayDetails}
            keyExtractor={(item, idx) => `${selectedDate}-${idx}`}
            renderItem={({ item }) => (
              <Text>
                {item.time} Uhr – {item.studioName}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});
