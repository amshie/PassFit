import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { 
  useLanguage, 
  useThemeMode, 
  useIsChangingLanguage,
  useIsChangingTheme,
  useLanguageError,
  useThemeError,
  useChangeLanguage,
  useChangeThemeMode,
  useClearLanguageError,
  useClearThemeError,
  useInitializeSettings
} from '../../src/store';
import { useTheme } from '../../src/providers/ThemeProvider';
import { SettingsNotifications } from '../../src/components/settings';
import { FAQSection } from '../../src/components/settings/FAQSection';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const language = useLanguage();
  const themeMode = useThemeMode();
  const isChangingLanguage = useIsChangingLanguage();
  const isChangingTheme = useIsChangingTheme();
  const languageError = useLanguageError();
  const themeError = useThemeError();
  const changeLanguage = useChangeLanguage();
  const changeThemeMode = useChangeThemeMode();
  const clearLanguageError = useClearLanguageError();
  const clearThemeError = useClearThemeError();
  const initializeSettings = useInitializeSettings();
  const { getBackgroundColor, getTextColor, getSurfaceColor, getBorderColor, isDark } = useTheme();

  // Initialize settings when component mounts
  useEffect(() => {
    initializeSettings();
  }, []);

  // Clear errors when component mounts
  useEffect(() => {
    if (languageError) clearLanguageError();
    if (themeError) clearThemeError();
  }, []);

  const handleLanguageChange = async (newLanguage: 'de' | 'en') => {
    if (newLanguage === language) return;
    
    try {
      await changeLanguage(newLanguage);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('settings.language.error')
      );
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === themeMode) return;
    
    try {
      await changeThemeMode(newTheme);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('settings.theme.error')
      );
    }
  };

  const getLanguageDisplayName = (lang: 'de' | 'en') => {
    return lang === 'de' ? 'Deutsch' : 'English';
  };

  const getThemeDisplayName = (theme: 'light' | 'dark' | 'system') => {
    switch (theme) {
      case 'light':
        return t('settings.theme.light');
      case 'dark':
        return t('settings.theme.dark');
      case 'system':
        return t('settings.theme.system');
      default:
        return theme;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getSurfaceColor(), borderBottomColor: getBorderColor() }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={getTextColor('primary')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: getTextColor('primary') }]}>
          {t('settings.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: getSurfaceColor() }]}>
          <Text style={[styles.sectionTitle, { color: getTextColor('primary') }]}>
            {t('settings.language.title')}
          </Text>
          
          <View style={styles.optionsList}>
            {(['de', 'en'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.optionItem,
                  { borderBottomColor: getBorderColor() },
                  lang === 'en' && styles.lastOptionItem
                ]}
                onPress={() => handleLanguageChange(lang)}
                disabled={isChangingLanguage}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: getTextColor('primary') }]}>
                    {getLanguageDisplayName(lang)}
                  </Text>
                  {language === lang && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                  {isChangingLanguage && language === lang && (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {languageError && (
            <Text style={[styles.errorText, { color: '#ef4444' }]}>
              {languageError}
            </Text>
          )}
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: getSurfaceColor() }]}>
          <Text style={[styles.sectionTitle, { color: getTextColor('primary') }]}>
            {t('settings.theme.title')}
          </Text>
          
          <View style={styles.optionsList}>
            {(['light', 'dark', 'system'] as const).map((theme, index) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.optionItem,
                  { borderBottomColor: getBorderColor() },
                  index === 2 && styles.lastOptionItem
                ]}
                onPress={() => handleThemeChange(theme)}
                disabled={isChangingTheme}
              >
                <View style={styles.optionContent}>
                  <View style={styles.themeOption}>
                    <Ionicons 
                      name={
                        theme === 'light' ? 'sunny-outline' :
                        theme === 'dark' ? 'moon-outline' : 'phone-portrait-outline'
                      } 
                      size={20} 
                      color={getTextColor('secondary')} 
                    />
                    <Text style={[styles.optionText, { color: getTextColor('primary') }]}>
                      {getThemeDisplayName(theme)}
                    </Text>
                  </View>
                  {themeMode === theme && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                  {isChangingTheme && themeMode === theme && (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {themeError && (
            <Text style={[styles.errorText, { color: '#ef4444' }]}>
              {themeError}
            </Text>
          )}
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: getSurfaceColor() }]}>
          <Text style={[styles.sectionTitle, { color: getTextColor('primary') }]}>
            {t('settings.notifications.title')}
          </Text>
          
          <SettingsNotifications />
        </View>

        {/* FAQ Section */}
        <FAQSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
});
