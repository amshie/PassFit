import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');



export default function WelcomeScreen() {
  return (
    
    <LinearGradient
      colors={['#6B46C1', '#805AD5']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Placeholder logo */}
        <Image
          source={{ uri: 'https://placehold.co/120x120.png?text=FitApp' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to FitApp</Text>
        <Text style={styles.subtitle}>Your corporate fitness journey starts here</Text>

    <Link href="/LoginScreen" asChild>
  <TouchableOpacity style={styles.primaryButton}>
    <Text style={styles.primaryText}>Log In</Text>
  </TouchableOpacity>
</Link>

<Link href="/SignUpScreen" asChild>
  <TouchableOpacity style={styles.secondaryButton}>
    <Text style={styles.secondaryText}>Sign Up</Text>
  </TouchableOpacity>
</Link>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    fontSize: 12,
    color: '#E2E8F0',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
