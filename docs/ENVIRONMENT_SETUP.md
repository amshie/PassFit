# Environment Configuration Setup Guide

## 🔧 Overview

PassFit requires several API keys and configuration values to function properly. This guide walks you through setting up all required environment variables for development and production.

## 📋 Required Environment Variables

### Firebase Configuration
- `EXPO_PUBLIC_FIREBASE_API_KEY` - Firebase Web API Key
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` - Firebase Project ID
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `EXPO_PUBLIC_FIREBASE_APP_ID` - Firebase App ID
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase Analytics Measurement ID

### Google Services
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` - Google OAuth Web Client ID
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` - Google OAuth iOS Client ID
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` - Google OAuth Android Client ID
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API Key

## 🚀 Quick Setup

### 1. Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

### 2. Validate Configuration
```bash
# Run validation script
npm run validate-env

# Should output: ✅ Environment validation passed
```

### 3. Test the App
```bash
# Start development server
npm start

# Run on specific platform
npm run android  # or npm run ios
```

## 🔑 Getting API Keys

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project" or select existing project
   - Follow the setup wizard

2. **Enable Required Services**
   ```
   Authentication > Sign-in method > Google (Enable)
   Firestore Database > Create database
   Analytics (optional but recommended)
   ```

3. **Get Configuration Values**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on Web app or create new one
   - Copy the config values:
     ```javascript
     const firebaseConfig = {
       apiKey: "...",           // EXPO_PUBLIC_FIREBASE_API_KEY
       authDomain: "...",       // EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
       projectId: "...",        // EXPO_PUBLIC_FIREBASE_PROJECT_ID
       storageBucket: "...",    // EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
       messagingSenderId: "...", // EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
       appId: "...",            // EXPO_PUBLIC_FIREBASE_APP_ID
       measurementId: "..."     // EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
     };
     ```

### Google Cloud Console Setup

1. **Enable APIs**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your Firebase project
   - Navigate to "APIs & Services" > "Library"
   - Enable these APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Places API (optional)

2. **Create API Key for Maps**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - Copy the key → `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Important**: Restrict the key to your app's bundle IDs

3. **Create OAuth Client IDs**
   - In "Credentials", click "Create Credentials" > "OAuth client ID"
   
   **For Android:**
   - Application type: Android
   - Package name: `com.anonymous.PassFit`
   - SHA-1 certificate fingerprint:
     ```bash
     # Debug certificate (development)
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     
     # Production certificate (for release)
     keytool -list -v -keystore path/to/your/release.keystore -alias your-alias
     ```
   
   **For iOS:**
   - Application type: iOS
   - Bundle ID: `com.anonymous.PassFit`
   
   **For Web:**
   - Application type: Web application
   - Authorized origins: Add your domains

4. **Copy Client IDs**
   - Android Client ID → `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
   - iOS Client ID → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
   - Web Client ID → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

## 🏗️ Build Configuration

### Development Build
```bash
# Validates environment automatically
npm run android
npm run ios
```

### Production Build with EAS
```bash
# Set environment variables in EAS
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "your_value"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "your_value"
# ... repeat for all variables

# Build for production
npm run build:all
```

### Alternative: EAS Build with .env
```bash
# Upload .env file to EAS (not recommended for production)
eas build --platform all --non-interactive
```

## 🔒 Security Best Practices

### Development
- ✅ Keep `.env` file local (never commit)
- ✅ Use `.env.example` for team sharing
- ✅ Validate environment before builds
- ✅ Use different Firebase projects for dev/prod

### Production
- ✅ Use EAS Secrets for sensitive values
- ✅ Restrict API keys to specific bundle IDs
- ✅ Enable Firebase App Check
- ✅ Set up proper Firestore security rules

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Validate Environment
  run: |
    npm run validate-env
  env:
    EXPO_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
    # ... other secrets
```

## 🐛 Troubleshooting

### Common Issues

**"Environment validation failed"**
```bash
# Check which variables are missing
npm run validate-env

# Verify .env file exists and has correct format
cat .env
```

**"Google Sign-In failed"**
- Verify OAuth client IDs are correct
- Check SHA-1 fingerprints match
- Ensure bundle IDs match app.json

**"Maps not loading"**
- Verify Google Maps API key is valid
- Check API key restrictions
- Ensure Maps SDK is enabled

**"Firebase connection failed"**
- Verify all Firebase config values
- Check Firebase project permissions
- Ensure services are enabled

### Debug Commands
```bash
# Check environment loading
node -e "require('dotenv').config(); console.log(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID)"

# Validate Firebase config
npm run start -- --clear

# Check bundle ID
grep -r "com.anonymous.PassFit" android/ ios/
```

## 📚 Additional Resources

- [Firebase Setup Guide](./GOOGLE_AUTH_SETUP.md)
- [Google Cloud Console](https://console.cloud.google.com)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

## ✅ Validation Checklist

Before deploying to production:

- [ ] All environment variables are set
- [ ] `npm run validate-env` passes
- [ ] Firebase services are enabled
- [ ] Google APIs are enabled and restricted
- [ ] OAuth client IDs are configured
- [ ] SHA-1 fingerprints are added
- [ ] App builds successfully on all platforms
- [ ] Authentication works in development
- [ ] Maps load correctly
- [ ] EAS secrets are configured for production
