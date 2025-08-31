export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: 'rent' | 'sale';
  propertyType: 'flat' | 'house' | 'commercial';
  location: {
    address: string;
    area: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq ft
    furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
  };
  amenities: string[];
  images: string[];
  videos: string[];
  status: 'available' | 'rented' | 'sold' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  brokerContact: {
    name: string;
    phone: string;
    whatsapp: string;
  };
}

export interface Inquiry {
  id: string;
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
}

export interface SearchFilters {
  propertyType?: 'flat' | 'house' | 'commercial';
  transactionType?: 'rent' | 'sale';
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number;
  keywords?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}
