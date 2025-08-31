import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Property } from '../types';
import { FirebaseService } from '../services/firebase';
import MapViewComponent from '../components/MapView';

const { width } = Dimensions.get('window');

type PropertyDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PropertyDetails'
>;
type PropertyDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'PropertyDetails'
>;

interface Props {
  navigation: PropertyDetailsScreenNavigationProp;
  route: PropertyDetailsScreenRouteProp;
}

const PropertyDetailsScreen: React.FC<Props> = ({ route }) => {
  const { property } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCall = () => {
    const phoneNumber = property.brokerContact.phone;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleWhatsApp = () => {
    const whatsappNumber = property.brokerContact.whatsapp;
    const message = `Hi, I'm interested in the property: ${property.title}`;
    const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    });
  };

  const handleShare = async () => {
    try {
      const message = `Check out this property: ${property.title}\nPrice: ${FirebaseService.formatPrice(property.price, property.priceType)}\nLocation: ${property.location.area}`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderImagePagination = () => (
    <View style={styles.paginationContainer}>
      {property.images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentImageIndex && styles.activePaginationDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}>
          {property.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image || 'https://via.placeholder.com/400x300' }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        {property.images.length > 1 && renderImagePagination()}
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Property Info */}
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyPrice}>
            {FirebaseService.formatPrice(property.price, property.priceType)}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{property.location.address}</Text>
          <Text style={styles.areaText}>{property.location.area}, {property.location.city}</Text>
        </View>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bedrooms</Text>
              <Text style={styles.detailValue}>{property.details.bedrooms}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bathrooms</Text>
              <Text style={styles.detailValue}>{property.details.bathrooms}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Area</Text>
              <Text style={styles.detailValue}>{property.details.area} sq ft</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Furnishing</Text>
              <Text style={styles.detailValue}>{property.details.furnishing}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{property.propertyType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>For</Text>
              <Text style={styles.detailValue}>{property.priceType}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{property.description}</Text>
        </View>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location Map */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapWrapper}>
            <MapViewComponent
              latitude={property.location.coordinates.latitude}
              longitude={property.location.coordinates.longitude}
              title={property.title}
              description={property.location.address}
              interactive={true}
            />
          </View>
        </View>

        {/* Broker Contact */}
        <View style={styles.brokerContainer}>
          <Text style={styles.sectionTitle}>Contact Broker</Text>
          <Text style={styles.brokerName}>{property.brokerContact.name}</Text>
        </View>
      </View>

      {/* Contact Buttons */}
      <View style={styles.contactButtonsContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.contactButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width,
    height: 300,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: '#fff',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  areaText: {
    fontSize: 14,
    color: '#999',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#1976d2',
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  brokerContainer: {
    marginBottom: 20,
  },
  brokerName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  contactButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PropertyDetailsScreen;
