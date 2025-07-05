import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: '💪',
      title: 'Workout Tracking',
      description: 'Verfolge deine Trainingseinheiten und Fortschritte'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Detaillierte Statistiken und Leistungsanalysen'
    },
    {
      icon: '🎯',
      title: 'Goal Setting',
      description: 'Setze und erreiche deine Fitnessziele'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Verbinde dich mit anderen Fitness-Enthusiasten'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>PassFit</Text>
          <Text style={styles.heroSubtitle}>
            Deine ultimative Fitness-App
          </Text>
          <Text style={styles.heroDescription}>
            Erreiche deine Fitnessziele mit personalisierten Workouts, 
            detailliertem Progress-Tracking und einer motivierenden Community.
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.primaryButtonText}>Jetzt starten</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryButtonText}>Anmelden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Warum PassFit?</Text>
        <Text style={styles.sectionSubtitle}>
          Alles was du für deine Fitness-Journey brauchst
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>PassFit in Zahlen</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Aktive Nutzer</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Zufriedenheit</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Bereit für deine Transformation?</Text>
        <Text style={styles.ctaDescription}>
          Starte noch heute deine Fitness-Journey mit PassFit
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.ctaButtonText}>Kostenlos registrieren</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Section */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>App erkunden</Text>
        <View style={styles.navGrid}>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.navIcon}>📱</Text>
            <Text style={styles.navTitle}>Dashboard</Text>
            <Text style={styles.navDescription}>Dein persönlicher Fitness-Hub</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={styles.navTitle}>Einstellungen</Text>
            <Text style={styles.navDescription}>App nach deinen Wünschen anpassen</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 PassFit. Alle Rechte vorbehalten.</Text>
        <Text style={styles.footerSubtext}>
          Entwickelt mit ❤️ für Fitness-Enthusiasten
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 140,
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    minWidth: 140,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: (width - 80 - 16) / 2, // Adjusted for gap
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    padding: 40,
    backgroundColor: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  ctaSection: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#11998e',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#11998e',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationSection: {
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 24,
  },
  navCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  navDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: 40,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
});
