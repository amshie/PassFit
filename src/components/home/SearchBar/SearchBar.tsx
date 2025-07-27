import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SearchBarProps } from '../../../types/home.types';

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.searchOverlay}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#fff" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('studios.partnerSearch')}
          placeholderTextColor="rgba(255,255,255,0.8)"
          value={searchQuery}
          onChangeText={onSearchChange}
          accessible={true}
          accessibilityLabel={t('accessibility.searchStudios')}
          accessibilityHint="Geben Sie Suchbegriffe ein um Studios zu finden"
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={onFilterPress}
          accessible={true}
          accessibilityLabel={t('accessibility.filterStudios')}
          accessibilityHint="Filter-Optionen öffnen"
        >
          <Ionicons name="options-outline" size={20} color="#ff6b35" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchOverlay: { 
    position: 'absolute', 
    top: 50, 
    left: 15, 
    right: 15, 
    zIndex: 10 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    paddingVertical: 12 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    color: '#fff', 
    fontSize: 16 
  },
  filterButton: { 
    marginLeft: 10, 
    padding: 5 
  },
});
