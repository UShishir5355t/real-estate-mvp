// Firebase configuration
// This file contains the Firebase configuration that will be shared between
// the mobile app and admin panel

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your_api_key_here",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your_auth_domain_here",
  projectId: process.env.FIREBASE_PROJECT_ID || "your_project_id_here",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your_storage_bucket_here",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your_sender_id_here",
  appId: process.env.FIREBASE_APP_ID || "your_app_id_here"
};

// Firestore collection names
export const COLLECTIONS = {
  PROPERTIES: 'properties',
  INQUIRIES: 'inquiries',
  USERS: 'users'
};

// Property types
export const PROPERTY_TYPES = {
  FLAT: 'flat',
  HOUSE: 'house',
  COMMERCIAL: 'commercial'
};

// Transaction types
export const TRANSACTION_TYPES = {
  RENT: 'rent',
  SALE: 'sale'
};

// Property status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  SOLD: 'sold',
  PENDING: 'pending'
};
