// app/(tabs)/settings.jsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const user = {
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  avatar: 'https://placehold.co/60',
};

const sections = [
  {
    title: 'ACCOUNT',
    items: [
      { key: 'profile', label: 'Profile Information', icon: <Ionicons name="person-outline" size={20} color="#4B5563" /> },
      { key: 'security', label: 'Security', icon: <MaterialIcons name="security" size={20} color="#10B981" /> },
      {
        key: 'billing',
        label: 'Subscriptions & Billing',
        icon: <FontAwesome5 name="file-invoice-dollar" size={20} color="#8B5CF6" />,
        sub: 'Corporate Plan · Active',
      },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { key: 'notifications', label: 'Notifications', icon: <Ionicons name="notifications-outline" size={20} color="#EF4444" /> },
      {
        key: 'language',
        label: 'Language',
        icon: <Ionicons name="language-outline" size={20} color="#F59E0B" />,
        sub: 'English (US)',
      },
      {
        key: 'appearance',
        label: 'Appearance',
        icon: <Ionicons name="color-palette-outline" size={20} color="#3B82F6" />,
        sub: 'Light Mode',
      },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { key: 'help', label: 'Help Center', icon: <Ionicons name="help-circle-outline" size={20} color="#6B7280" /> },
      { key: 'feedback', label: 'Send Feedback', icon: <Ionicons name="chatbubble-ellipses-outline" size={20} color="#6B7280" /> },
    ],
  },
];

export default function SettingsTab({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* User Card */}
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-6"
          onPress={() => navigation.navigate('Profile')}
        >
          <Image source={{ uri: user.avatar }} className="w-14 h-14 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">{user.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.title} className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 mb-2">
              {section.title}
            </Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.key}
                className="flex-row items-center bg-white rounded-lg px-4 py-3 mb-2"
                onPress={() => {
                  /* navigation logic */
                }}
              >
                <View className="w-8 items-center">{item.icon}</View>
                <View className="flex-1 ml-3">
                  <Text className="text-base text-gray-900">{item.label}</Text>
                  {item.sub && (
                    <Text className="text-xs text-gray-400 mt-0.5">{item.sub}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
