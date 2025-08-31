import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Property, PropertyFormData, Inquiry } from '../types';

export class PropertyService {
  // Properties CRUD operations
  static async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  static async getProperty(propertyId: string): Promise<Property | null> {
    try {
      const docRef = doc(db, 'properties', propertyId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  static async createProperty(propertyData: PropertyFormData, imageFiles: File[]): Promise<string> {
    try {
      // Upload images first
      const imageUrls = await this.uploadImages(imageFiles);
      
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        images: imageUrls,
        videos: [], // For future implementation
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async updateProperty(
    propertyId: string, 
    propertyData: Partial<PropertyFormData>,
    newImageFiles?: File[]
  ): Promise<void> {
    try {
      const updateData: any = {
        ...propertyData,
        updatedAt: serverTimestamp(),
      };

      // Upload new images if provided
      if (newImageFiles && newImageFiles.length > 0) {
        const newImageUrls = await this.uploadImages(newImageFiles);
        // Get existing images
        const existingProperty = await this.getProperty(propertyId);
        const existingImages = existingProperty?.images || [];
        
        updateData.images = [...existingImages, ...newImageUrls];
      }

      const docRef = doc(db, 'properties', propertyId);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  static async deleteProperty(propertyId: string): Promise<void> {
    try {
      // Get property to delete associated images
      const property = await this.getProperty(propertyId);
      
      // Delete images from storage
      if (property?.images) {
        await Promise.all(
          property.images.map(imageUrl => this.deleteImageFromStorage(imageUrl))
        );
      }
      
      // Delete property document
      const docRef = doc(db, 'properties', propertyId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Image management
  private static async uploadImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const fileName = `properties/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);
        
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  private static async deleteImageFromStorage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error for image deletion failures
    }
  }

  static async deleteImageFromProperty(propertyId: string, imageUrl: string): Promise<void> {
    try {
      const property = await this.getProperty(propertyId);
      if (!property) throw new Error('Property not found');

      const updatedImages = property.images.filter(img => img !== imageUrl);
      
      await this.updateProperty(propertyId, { 
        images: updatedImages 
      } as any);
      
      await this.deleteImageFromStorage(imageUrl);
    } catch (error) {
      console.error('Error deleting image from property:', error);
      throw error;
    }
  }

  // Inquiries management
  static async getAllInquiries(): Promise<Inquiry[]> {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Inquiry[];
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  }

  static async updateInquiryStatus(inquiryId: string, status: 'pending' | 'responded' | 'closed'): Promise<void> {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  }

  static async deleteInquiry(inquiryId: string): Promise<void> {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
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

  static getPropertyTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'flat': 'Flat/Apartment',
      'house': 'House',
      'commercial': 'Commercial'
    };
    return labels[type] || type;
  }

  static getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'available': '#4CAF50',
      'rented': '#FF9800',
      'sold': '#F44336',
      'pending': '#2196F3'
    };
    return colors[status] || '#666';
  }
}
