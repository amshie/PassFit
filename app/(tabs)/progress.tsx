import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../../src/services/firebase/config';
import { CheckInService } from '../../src/services/api/checkin.service';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';


export default function ProgressScreen() {
  const { alreadyCheckedIn, newCheckIn } = useLocalSearchParams();
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        setLoading(true);
       const user = auth.currentUser

        if (!user) throw new Error('User not authenticated');

        const checkIns = await CheckInService.getUserCheckIns(user.uid);

        // Formatiere Datum für Kalender
        const marked: { [date: string]: any } = {};
        checkIns.forEach(ci => {
          const dateStr = dayjs(ci.checkinTime.toDate()).format('YYYY-MM-DD');
          marked[dateStr] = {
            marked: true,
            selected: true,
            selectedColor: '#4CAF50', // Grün für Check-in
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
      <Text style={styles.subtitle}>Grün = eingecheckt</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Calendar
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#FF5722',
          }}
        />
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
