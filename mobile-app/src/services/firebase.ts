import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Property, Inquiry, SearchFilters } from '../types';

export class FirebaseService {
  // Properties
  static async getProperties(filters?: SearchFilters): Promise<Property[]> {
    try {
      let query = firestore()
        .collection('properties')
        .where('status', '==', 'available')
        .orderBy('createdAt', 'desc');

      // Apply filters
      if (filters?.propertyType) {
        query = query.where('propertyType', '==', filters.propertyType);
      }
      
      if (filters?.transactionType) {
        query = query.where('priceType', '==', filters.transactionType);
      }

      const snapshot = await query.get();
      
      let properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Property[];

      // Apply client-side filters for complex queries
      if (filters?.location) {
        properties = properties.filter(p => 
          p.location.area.toLowerCase().includes(filters.location!.toLowerCase()) ||
          p.location.address.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters?.priceRange) {
        properties = properties.filter(p => 
          p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
        );
      }

      if (filters?.bedrooms) {
        properties = properties.filter(p => p.details.bedrooms === filters.bedrooms);
      }

      if (filters?.keywords) {
        const keywords = filters.keywords.toLowerCase();
        properties = properties.filter(p => 
          p.title.toLowerCase().includes(keywords) ||
          p.description.toLowerCase().includes(keywords) ||
          p.location.area.toLowerCase().includes(keywords)
        );
      }

      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  static async getProperty(propertyId: string): Promise<Property | null> {
    try {
      const doc = await firestore().collection('properties').doc(propertyId).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  // Inquiries
  static async createInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await firestore().collection('inquiries').add({
        ...inquiry,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  }

  // Utility methods
  static formatPrice(price: number, type: 'rent' | 'sale'): string {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formattedPrice}/month` : formattedPrice;
  }

  static getImageUrl(imagePath: string): Promise<string> {
    return storage().ref(imagePath).getDownloadURL();
  }
}
