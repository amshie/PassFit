// app/profile/uid].js[
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase';

const db = getFirestore(app);

export default function ProfileScreen() {
  const { uid } = useLocalSearchParams();  // holt den Pfad-Parameter
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    
    try {
      await setDoc(doc(db, 'users', uid), { 
        firstName, 
        lastName, 
        sex, 
        birthdate: formatDate(birthdate), 
        age: age,
        createdAt: new Date() 
      });
      router.replace('/Dashboard');
    } catch (err) {
      Alert.alert('Fehler', err.message);
    }
  };

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
      
      <Button title="Profil speichern" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#fff'
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
})
