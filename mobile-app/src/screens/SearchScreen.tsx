import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SearchFilters, Property } from '../types';
import { FirebaseService } from '../services/firebase';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { key: 'all', label: 'All Types' },
    { key: 'flat', label: 'Flat' },
    { key: 'house', label: 'House' },
    { key: 'commercial', label: 'Commercial' },
  ];

  const transactionTypes = [
    { key: 'all', label: 'All' },
    { key: 'rent', label: 'Rent' },
    { key: 'sale', label: 'Sale' },
  ];

  const bedroomOptions = [
    { key: 'all', label: 'Any' },
    { key: 1, label: '1 BHK' },
    { key: 2, label: '2 BHK' },
    { key: 3, label: '3 BHK' },
    { key: 4, label: '4+ BHK' },
  ];

  const handlePropertyTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: type === 'all' ? undefined : type as any,
    }));
  };

  const handleTransactionTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      transactionType: type === 'all' ? undefined : type as any,
    }));
  };

  const handleBedroomChange = (bedrooms: number | string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: bedrooms === 'all' ? undefined : bedrooms as number,
    }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({
      ...prev,
      location: location.trim() || undefined,
    }));
  };

  const handleKeywordsChange = (keywords: string) => {
    setFilters(prev => ({
      ...prev,
      keywords: keywords.trim() || undefined,
    }));
  };

  const handlePriceRangeChange = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
    
    if (minPrice || maxPrice) {
      setFilters(prev => ({
        ...prev,
        priceRange: { min, max },
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        priceRange: undefined,
      }));
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      handlePriceRangeChange();
      
      const results = await FirebaseService.getProperties(filters);
      
      // Navigate back to home with results
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Search failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({});
    setMinPrice('');
    setMaxPrice('');
  };

  const renderOptionGroup = (
    title: string,
    options: Array<{ key: string | number; label: string }>,
    selectedValue: any,
    onSelect: (value: any) => void
  ) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionButton,
              selectedValue === option.key && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.key)}>
            <Text
              style={[
                styles.optionText,
                selectedValue === option.key && styles.selectedOptionText,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Keywords Search */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Search Keywords</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Bandra, 2BHK, furnished"
            value={filters.keywords || ''}
            onChangeText={handleKeywordsChange}
          />
        </View>

        {/* Location */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Location</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter area or address"
            value={filters.location || ''}
            onChangeText={handleLocationChange}
          />
        </View>

        {/* Property Type */}
        {renderOptionGroup(
          'Property Type',
          propertyTypes,
          filters.propertyType || 'all',
          handlePropertyTypeChange
        )}

        {/* Transaction Type */}
        {renderOptionGroup(
          'Looking For',
          transactionTypes,
          filters.transactionType || 'all',
          handleTransactionTypeChange
        )}

        {/* Bedrooms */}
        {renderOptionGroup(
          'Bedrooms',
          bedroomOptions,
          filters.bedrooms || 'all',
          handleBedroomChange
        )}

        {/* Price Range */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Price Range (₹)</Text>
          <View style={styles.priceRangeContainer}>
            <TextInput
              style={[styles.textInput, styles.priceInput]}
              placeholder="Min"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
            <Text style={styles.priceRangeSeparator}>to</Text>
            <TextInput
              style={[styles.textInput, styles.priceInput]}
              placeholder="Max"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.searchButton]}
            onPress={handleSearch}
            disabled={loading}>
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceRangeSeparator: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#2196F3',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen;
