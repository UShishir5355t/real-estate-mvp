# Real Estate Brokerage MVP - Setup Guide

This guide will help you set up and run the Real Estate Brokerage MVP application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Google Maps API key
- React Native development environment (for mobile app)
  - Xcode (for iOS development on macOS)
  - Android Studio (for Android development)

## 1. Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable the following services:
   - Authentication
   - Firestore Database
   - Storage

### Step 2: Configure Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Create an admin user account

### Step 3: Set up Firestore Database

1. Go to Firestore Database
2. Create database in production mode
3. Deploy the security rules (see deployment section)

### Step 4: Configure Storage

1. Go to Storage
2. Set up storage bucket
3. Deploy storage rules (see deployment section)

### Step 5: Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click "Add app" and choose Web
4. Copy the Firebase configuration

## 2. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Maps SDK for Android and iOS
4. Enable Places API (optional, for future features)
5. Create API key and restrict it appropriately
6. Copy the API key

## 3. Environment Configuration

### Mobile App

1. Copy `mobile-app/.env.example` to `mobile-app/.env`
2. Fill in your Firebase configuration:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   BROKER_NAME=Your Name
   BROKER_PHONE=+919876543210
   BROKER_WHATSAPP=919876543210
   ```

### Admin Panel

1. Copy `admin-panel/.env.example` to `admin-panel/.env`
2. Fill in your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

## 4. Installation

### Install Dependencies

```bash
# Install mobile app dependencies
cd mobile-app
npm install

# Install admin panel dependencies
cd ../admin-panel
npm install
```

### iOS Setup (Additional)

```bash
cd mobile-app/ios
pod install
```

## 5. Running the Applications

### Mobile App

```bash
cd mobile-app

# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

### Admin Panel

```bash
cd admin-panel
npm start
```

The admin panel will be available at `http://localhost:3000`

## 6. Deployment

### Deploy Firebase Rules and Indexes

```bash
# From project root
firebase login
firebase init # Select your Firebase project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Deploy Admin Panel

```bash
# Make the script executable
chmod +x scripts/deploy-admin.sh

# Run deployment script
./scripts/deploy-admin.sh
```

## 7. Testing

### Testing Checklist

#### Admin Panel
- [ ] Login with admin credentials
- [ ] View dashboard statistics
- [ ] Navigate between pages
- [ ] Responsive design on different screen sizes

#### Mobile App
- [ ] App launches successfully
- [ ] Property listings load (will be empty initially)
- [ ] Search functionality works
- [ ] Navigation between screens works
- [ ] Contact buttons work (call and WhatsApp)

### Adding Test Data

1. Login to the admin panel
2. Add a few sample properties
3. Test the mobile app with real data
4. Verify that properties appear in the mobile app

## 8. Troubleshooting

### Common Issues

#### Firebase Connection Issues
- Verify environment variables are correct
- Check Firebase project configuration
- Ensure authentication is properly set up

#### React Native Issues
- Clear cache: `npx react-native start --reset-cache`
- Clean builds: 
  - iOS: `cd ios && xcodebuild clean`
  - Android: `cd android && ./gradlew clean`

#### Maps Not Loading
- Verify Google Maps API key is correct
- Check API key restrictions
- Ensure Maps SDK is enabled

### Getting Help

If you encounter issues:
1. Check the error messages in the console
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check Firebase project configuration

## 9. Next Steps

After successful setup:
1. Customize the app colors and branding
2. Add your property listings
3. Test thoroughly on different devices
4. Deploy to app stores (iOS App Store, Google Play Store)
5. Set up analytics and monitoring

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific Firebase projects (dev/staging/prod)
- Regularly review and update Firebase security rules
- Monitor usage and costs in Firebase and Google Cloud Console
