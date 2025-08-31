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

export interface PropertyFormData {
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
    area: number;
    furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
  };
  amenities: string[];
  status: 'available' | 'rented' | 'sold' | 'pending';
  brokerContact: {
    name: string;
    phone: string;
    whatsapp: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
