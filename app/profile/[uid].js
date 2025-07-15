// app/profile/[uid].js - Refactored mit Hook-Layer
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import { Timestamp } from 'firebase/firestore';

// ✅ Hook-Layer einbinden - Komponente weiß nur, dass sie User-Daten braucht
import { useUser, useCreateUser, useUpdateUser } from '../../src/hooks/useUser';

export default function ProfileScreen() {
  const { uid } = useLocalSearchParams();
  const router = useRouter();
  
  // ✅ Hooks für deklaratives Data Fetching und Mutations
  const { data: existingUser, isLoading: isLoadingUser, error: userError } = useUser(uid);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(uid);
  
  // Local state für Form-Daten
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ✅ Existierende User-Daten laden (falls vorhanden)
  useEffect(() => {
    if (existingUser) {
      setFirstName(existingUser.firstName || '');
      setLastName(existingUser.lastName || '');
      setSex(existingUser.sex || '');
      if (existingUser.birthdate) {
        // Convert Firestore Timestamp to Date
        const date = existingUser.birthdate instanceof Timestamp 
          ? existingUser.birthdate.toDate() 
          : new Date(existingUser.birthdate);
        setBirthdate(date);
      }
    }
  }, [existingUser]);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getMaximumDate = () => {
    const today = new Date();
    const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return sixteenYearsAgo;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
  };

  // ✅ Vereinfachter Save-Handler - nutzt Hook-Layer
  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !sex || !birthdate) {
      return Alert.alert('Fehler', 'Bitte fülle alle Felder aus.');
    }

    const age = calculateAge(birthdate);
    if (age < 16) {
      return Alert.alert(
        'Altersvalidierung fehlgeschlagen', 
        'Du musst mindestens 16 Jahre alt sein, um dich zu registrieren.'
      );
    }

    // ✅ User-Daten für Service-Layer vorbereiten
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sex,
      birthdate: Timestamp.fromDate(birthdate),
      age,
      displayName: `${firstName.trim()} ${lastName.trim()}`,
      email: existingUser?.email || '', // Falls bereits vorhanden
    };

    try {
      if (existingUser) {
        // ✅ Update existierender User über Hook
        await updateUserMutation.mutateAsync(userData);
        Alert.alert('Erfolg', 'Profil erfolgreich aktualisiert!');
      } else {
        // ✅ Neuen User erstellen über Hook
        await createUserMutation.mutateAsync({
          uid,
          ...userData,
        });
        Alert.alert('Erfolg', 'Profil erfolgreich erstellt!');
      }
      
      router.replace('/(tabs)/home'); // Navigate to main app
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Fehler', 'Profil konnte nicht gespeichert werden. Bitte versuche es erneut.');
    }
  };

  // ✅ Loading State
  if (isLoadingUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>Lade Profildaten...</Text>
      </View>
    );
  }

  // ✅ Error State
  if (userError && userError.message !== 'User not found') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Fehler beim Laden der Profildaten</Text>
        <Button title="Erneut versuchen" onPress={() => window.location.reload()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil erstellen</Text>
      
      <View style={styles.nameContainer}>
        <TextInput
          placeholder="Vorname"
          style={[styles.input, styles.nameInput]}
          value={firstName}
          onChangeText={setFirstName}
        />
        
        <TextInput
          placeholder="Nachname"
          style={[styles.input, styles.nameInput]}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      
      <Text style={styles.label}>Geschlecht:</Text>
      <View style={styles.sexContainer}>
        <TouchableOpacity
          style={[styles.sexButton, sex === 'M' && styles.selectedSex]}
          onPress={() => setSex('M')}
        >
          <Text style={[styles.sexText, sex === 'M' && styles.selectedSexText]}>
            Männlich
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sexButton, sex === 'F' && styles.selectedSex]}
          onPress={() => setSex('F')}
        >
          <Text style={[styles.sexText, sex === 'F' && styles.selectedSexText]}>
            Weiblich
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.label}>Geburtsdatum:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(birthdate)}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birthdate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          maximumDate={getMaximumDate()}
        />
      )}
      
      <TouchableOpacity
        style={[
          styles.saveButton,
          (createUserMutation.isPending || updateUserMutation.isPending) && styles.disabledButton
        ]}
        onPress={handleSave}
        disabled={createUserMutation.isPending || updateUserMutation.isPending}
      >
        {(createUserMutation.isPending || updateUserMutation.isPending) ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {existingUser ? 'Profil aktualisieren' : 'Profil speichern'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#fff'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sexButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedSex: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  sexText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSexText: {
    color: '#fff',
    fontWeight: '600',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 0,
  },
  saveButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A78BFA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
});
