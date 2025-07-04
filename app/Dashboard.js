// app/Dashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

const db = getFirestore(app);
const auth = getAuth(app);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser.uid;
    getDoc(doc(db, 'users', uid)).then(snapshot => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    });
  }, []);

  if (!profile) {
    return <Text style={styles.loading}>Lade Profil…</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Willkommen, {profile.name}!</Text>
      {/* …dein Dashboard UI… */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { flex: 1, textAlign: 'center', marginTop: 50 },
  welcome: { fontSize: 20, fontWeight: '600' },
});
