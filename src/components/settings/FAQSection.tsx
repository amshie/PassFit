import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'subscription' | 'technical' | 'account';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Wie kann ich mich in einem Studio einchecken?',
    answer: 'Als Premium-Nutzer kannst du den QR-Code Scanner verwenden, um dich schnell einzuchecken. Öffne einfach den Scanner und richte die Kamera auf den QR-Code im Studio.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Was ist der Unterschied zwischen Free und Premium?',
    answer: 'Free-Nutzer können Studios suchen und ihre Check-in Historie einsehen. Premium-Nutzer erhalten zusätzlich QR-Code Check-ins, KI-Empfehlungen, Zugang zu exklusiven Coaches, personalisierte Pläne und Priority-Support.',
    category: 'subscription',
  },
  {
    id: '3',
    question: 'Wie kann ich mein Abonnement kündigen?',
    answer: 'Du kannst dein Abonnement jederzeit in den Account-Einstellungen kündigen. Gehe zu "Mein Account" > "Abonnement" und wähle "Kündigen".',
    category: 'subscription',
  },
  {
    id: '4',
    question: 'Warum funktioniert der QR-Scanner nicht?',
    answer: 'Stelle sicher, dass du die Kamera-Berechtigung erteilt hast und eine stabile Internetverbindung besteht. Der QR-Scanner ist nur für Premium-Nutzer verfügbar.',
    category: 'technical',
  },
  {
    id: '5',
    question: 'Wie kann ich mein Profil bearbeiten?',
    answer: 'Gehe zu "Profil" > "Einstellungen" und bearbeite deine persönlichen Informationen wie Name, Foto und Biografie.',
    category: 'account',
  },
  {
    id: '6',
    question: 'Wie erhalte ich KI-Trainingsempfehlungen?',
    answer: 'KI-Empfehlungen sind für Premium-Nutzer verfügbar und basieren auf deiner Check-in Historie und Trainingsgewohnheiten. Sie erscheinen automatisch in deinem Fortschritts-Dashboard.',
    category: 'subscription',
  },
  {
    id: '7',
    question: 'Was mache ich, wenn ich mein Passwort vergessen habe?',
    answer: 'Verwende die "Passwort vergessen" Funktion auf der Login-Seite. Du erhältst eine E-Mail mit Anweisungen zum Zurücksetzen deines Passworts.',
    category: 'account',
  },
  {
    id: '8',
    question: 'Wie kontaktiere ich den Support?',
    answer: 'Premium-Nutzer erhalten Priority-Support per Chat oder E-Mail. Free-Nutzer können uns über das Kontaktformular in der App erreichen.',
    category: 'general',
  },
];

const categoryNames = {
  general: 'Allgemein',
  subscription: 'Abonnement',
  technical: 'Technisch',
  account: 'Account',
};

export function FAQSection() {
  const { getTextColor, getSurfaceColor, getBorderColor } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<FAQItem['category'] | 'all'>('all');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const categories: (FAQItem['category'] | 'all')[] = ['all', 'general', 'subscription', 'technical', 'account'];

  return (
    <View style={[styles.container, { backgroundColor: getSurfaceColor() }]}>
      <View style={styles.header}>
        <Ionicons name="help-circle" size={24} color="#4CAF50" />
        <Text style={[styles.title, { color: getTextColor('primary') }]}>
          Häufig gestellte Fragen
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category ? '#4CAF50' : 'transparent',
                borderColor: getBorderColor(),
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category 
                    ? '#FFFFFF' 
                    : getTextColor('secondary'),
                },
              ]}
            >
              {category === 'all' ? 'Alle' : categoryNames[category]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredFAQs.map((item) => (
          <View
            key={item.id}
            style={[styles.faqItem, { borderColor: getBorderColor() }]}
          >
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpanded(item.id)}
            >
              <Text style={[styles.question, { color: getTextColor('primary') }]}>
                {item.question}
              </Text>
              <Ionicons
                name={expandedItems.has(item.id) ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={getTextColor('secondary')}
              />
            </TouchableOpacity>

            {expandedItems.has(item.id) && (
              <View style={styles.answerContainer}>
                <Text style={[styles.answer, { color: getTextColor('secondary') }]}>
                  {item.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        {filteredFAQs.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={getTextColor('secondary')} />
            <Text style={[styles.emptyText, { color: getTextColor('secondary') }]}>
              Keine FAQs in dieser Kategorie gefunden
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Contact Support */}
      <TouchableOpacity
        style={[styles.supportButton, { backgroundColor: '#4CAF50' }]}
      >
        <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
        <Text style={styles.supportButtonText}>
          Weitere Hilfe benötigt? Support kontaktieren
        </Text>
      </TouchableOpacity>
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqItem: {
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 8,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    paddingBottom: 12,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
