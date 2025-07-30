import React from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  useNotifications, 
  useIsChangingNotifications, 
  useNotificationsError, 
  useToggleNotifications, 
  useClearNotificationsError 
} from '../../store';
import { useTheme } from '../../providers/ThemeProvider';

interface SettingsNotificationsProps {
  style?: any;
}

export const SettingsNotifications: React.FC<SettingsNotificationsProps> = ({ style }) => {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const isChangingNotifications = useIsChangingNotifications();
  const notificationsError = useNotificationsError();
  const toggleNotifications = useToggleNotifications();
  const clearNotificationsError = useClearNotificationsError();
  const { getBackgroundColor, getTextColor, getBorderColor } = useTheme();

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      await toggleNotifications(enabled);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('settings.notifications.error')
      );
    }
  };

  // Clear error when component mounts
  React.useEffect(() => {
    if (notificationsError) {
      clearNotificationsError();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
      <View style={[styles.content, { borderColor: getBorderColor() }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: getTextColor('primary') }]}>
            {t('settings.notifications.title')}
          </Text>
          <Text style={[styles.subtitle, { color: getTextColor('secondary') }]}>
            {t('settings.notifications.description')}
          </Text>
        </View>

        <View style={styles.switchContainer}>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            disabled={isChangingNotifications}
            trackColor={{ 
              false: getBorderColor(), 
              true: '#4CAF50' 
            }}
            thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {notificationsError && (
        <Text style={[styles.errorText, { color: '#ef4444' }]}>
          {notificationsError}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  switchContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    marginHorizontal: 16,
  },
});
