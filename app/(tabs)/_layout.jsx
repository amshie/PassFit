import React from 'react';
import { Ionicons, MaterialCommunityIcons,AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="check_in"
        options={{
          title: 'Check In',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
          ),
        }}
      />

            <Tabs.Screen
        name="WelcomeScreen"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
          <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />

      
    </Tabs>
  );
}
