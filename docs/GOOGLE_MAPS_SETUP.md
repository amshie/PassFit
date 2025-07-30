# Google Maps API Setup Guide for PassFit

## 🗺️ Overview

PassFit requires Google Maps API integration for core functionality including:
- Studio location display on interactive maps
- User location detection and geocoding
- Distance calculations and radius filtering
- Place search and autocomplete

## 🚨 Current Status

**❌ CRITICAL ISSUE**: The app currently uses a placeholder Google Maps API key, which will cause:
- Maps to fail loading completely
- Location services to be non-functional
- Studio search to break
- App crashes on map-related screens

## 🔧 Step-by-Step Setup

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project (`fitnesspass-a54cb`)
3. If you don't have a project, create one that matches your Firebase project

### 2. Enable Required APIs

Navigate to **APIs & Services** > **Library** and enable:

#### Required APIs:
- ✅ **Maps SDK for Android** - For Android app maps
- ✅ **Maps SDK for iOS** - For iOS app maps  
- ✅ **Maps JavaScript API** - For web version
- ✅ **Geocoding API** - For address/coordinate conversion
- ✅ **Places API** - For location search (optional but recommended)

```bash
# You can also enable via CLI:
gcloud services enable maps-android-backend.googleapis.com
gcloud services enable maps-ios-backend.googleapis.com
gcloud services enable maps-backend.googleapis.com
gcloud services enable geocoding-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
```

### 3. Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API key**
3. Copy the generated API key immediately
4. Click **RESTRICT KEY** (very important for security)

### 4. Configure API Key Restrictions

#### Application Restrictions:
Choose **Android apps** and add:
- **Package name**: `com.anonymous.PassFit`
- **SHA-1 certificate fingerprint**:
  ```bash
  # For development (debug keystore):
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
  
  # For production (your release keystore):
  keytool -list -v -keystore path/to/your/release.keystore -alias your-alias
  ```

Choose **iOS apps** and add:
- **Bundle ID**: `com.anonymous.PassFit`

#### API Restrictions:
Restrict to only the APIs you need:
- Maps SDK for Android
- Maps SDK for iOS
- Maps JavaScript API
- Geocoding API
- Places API (if using)

### 5. Update Environment Configuration

Add your API key to your `.env` file:
```bash
# Replace with your actual API key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6. Verify Configuration

Test your setup:
```bash
# Validate environment
npm run validate-env

# Should show: ✅ EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is set
```

## 🔒 Security Best Practices

### API Key Security
- ✅ **Always restrict your API key** to specific apps and APIs
- ✅ **Never commit API keys** to version control
- ✅ **Use different keys** for development and production
- ✅ **Monitor usage** in Google Cloud Console
- ✅ **Set up billing alerts** to avoid unexpected charges

### Bundle ID Security
- ✅ **Verify bundle IDs match** your app.json configuration
- ✅ **Use production certificates** for release builds
- ✅ **Test on actual devices** before release

## 💰 Pricing & Quotas

### Google Maps Pricing (as of 2024):
- **Maps SDK**: $7 per 1,000 requests
- **Geocoding**: $5 per 1,000 requests
- **Places API**: $17 per 1,000 requests

### Free Tier:
- **$200 monthly credit** for new accounts
- **Maps SDK**: ~28,500 free map loads per month
- **Geocoding**: ~40,000 free requests per month

### Cost Optimization:
```javascript
// Implement in your app:
// 1. Cache geocoding results
// 2. Limit map re-renders
// 3. Use static maps for thumbnails
// 4. Implement request throttling
```

## 🧪 Testing Your Setup

### 1. Test API Key Validity
```bash
# Test with curl (replace YOUR_API_KEY):
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Berlin&key=YOUR_API_KEY"

# Should return JSON with location data, not an error
```

### 2. Test in Development
```bash
# Start the app
npm start

# Navigate to home screen with map
# Maps should load without errors
```

### 3. Check Console for Errors
Common error messages and solutions:

**"This API key is not authorized to use this service or API"**
- ✅ Enable the required APIs in Google Cloud Console
- ✅ Check API restrictions on your key

**"The provided API key is invalid"**
- ✅ Verify the key is copied correctly
- ✅ Check for extra spaces or characters

**"RefererNotAllowedMapError"**
- ✅ Add your bundle ID to iOS app restrictions
- ✅ Add your package name and SHA-1 to Android restrictions

## 🚀 Production Deployment

### For EAS Build:
```bash
# Set the API key as a secret
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value "your_actual_api_key"

# Build with secrets
eas build --platform all
```

### For App Store/Play Store:
1. **Create separate production API key**
2. **Use production certificates** for SHA-1 fingerprints
3. **Test thoroughly** on TestFlight/Internal Testing
4. **Monitor usage** after release

## 🔧 Troubleshooting

### Common Issues:

#### Maps Not Loading
```bash
# Check environment variable
echo $EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

# Verify in app logs
npx react-native log-android  # or log-ios
```

#### "Billing not enabled" Error
1. Go to Google Cloud Console > Billing
2. Enable billing for your project
3. Set up billing alerts

#### Performance Issues
```javascript
// Optimize map performance:
const mapConfig = {
  initialRegion: {
    latitude: 52.5200,
    longitude: 13.4050,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  showsUserLocation: true,
  showsMyLocationButton: true,
  loadingEnabled: true,
  // Reduce re-renders:
  pitchEnabled: false,
  rotateEnabled: false,
  scrollEnabled: true,
  zoomEnabled: true,
};
```

## 📋 Verification Checklist

Before deploying to production:

- [ ] Google Maps APIs are enabled in Cloud Console
- [ ] API key is created and properly restricted
- [ ] Bundle IDs match app.json configuration
- [ ] SHA-1 fingerprints are added for Android
- [ ] Environment variable is set correctly
- [ ] Maps load successfully in development
- [ ] Location services work properly
- [ ] Billing is enabled with alerts set up
- [ ] Production API key is configured for EAS Build
- [ ] App has been tested on physical devices

## 🔗 Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [Google Cloud Console](https://console.cloud.google.com)

## 🆘 Getting Help

If you encounter issues:
1. Check the [Google Maps Platform Status](https://status.cloud.google.com/)
2. Review your API usage in Google Cloud Console
3. Test with a simple curl request first
4. Verify all restrictions are correctly configured
5. Check Expo/React Native Maps GitHub issues

---

**⚠️ IMPORTANT**: Without a valid Google Maps API key, the core functionality of PassFit will not work. This is a critical blocker for app deployment.
