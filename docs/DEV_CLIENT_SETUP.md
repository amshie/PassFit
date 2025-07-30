# Development Client Setup Guide

## Problem Overview

When using Expo Go to scan QR codes, you may encounter "Keine Daten verfügbar" (No data available) because:

- Your app uses a custom URL scheme: `passfit://expo-development-client`
- Expo Go only understands standard `exp://` URLs
- Your development client registers custom schemes that Expo Go doesn't recognize

## Solution: Use Development Client Instead of Expo Go

### 1. Build Development Client

#### For Android:
```bash
npm run build:dev-client:android
# or
eas build --profile development --platform android
```

#### For iOS:
```bash
npm run build:dev-client:ios
# or
eas build --profile development --platform ios
```

#### For Both Platforms:
```bash
npm run build:dev-client:all
# or
eas build --profile development --platform all
```

### 2. Install Development Client

#### Option A: Download from EAS Build Dashboard
1. Go to [expo.dev](https://expo.dev) → Your Project → Builds
2. Find your development build
3. Download and install the APK (Android) or IPA (iOS)

#### Option B: Install via EAS CLI
```bash
npm run install:dev-client
# or
eas build:run --profile development
```

### 3. Start Metro in Development Client Mode

#### Standard Development Client Mode:
```bash
npm run start:dev-client
# or
npx expo start --dev-client
```

#### With Tunnel (for network issues):
```bash
npm run start:dev-client:tunnel
# or
npx expo start --dev-client --tunnel
```

#### Clear Cache:
```bash
npm run start:dev-client:clear
# or
npx expo start --dev-client --clear
```

### 4. Connect Your Device

1. **Open your PassFit Development Client** (NOT Expo Go)
2. **Tap "Scan QR Code"**
3. **Scan the QR code** displayed in your terminal
4. Your app will load with the custom `passfit://` scheme

## Alternative Methods

### Direct Device Installation (No QR Code)

#### Android:
```bash
npm run android
# or
expo run:android
```

#### iOS:
```bash
npm run ios
# or
expo run:ios
```

### Emulator/Simulator
Development clients also work in emulators:
- Android: Use Android Studio emulator
- iOS: Use Xcode Simulator

## Troubleshooting

### QR Code Still Shows "No Data Available"
- ✅ Ensure you're using your **PassFit Development Client**, not Expo Go
- ✅ Verify Metro is running with `--dev-client` flag
- ✅ Check that your device and computer are on the same network

### Build Fails
- ✅ Run `npm run validate-env` to check environment variables
- ✅ Ensure EAS CLI is logged in: `eas login`
- ✅ Check your Expo account has sufficient build credits

### Network Issues
- ✅ Try tunnel mode: `npm run start:dev-client:tunnel`
- ✅ Check firewall settings
- ✅ Ensure port 8081 is not blocked

### App Won't Load After Scanning
- ✅ Clear Metro cache: `npm run start:dev-client:clear`
- ✅ Restart Metro server
- ✅ Reinstall development client

## Development Workflow

### Daily Development:
1. Start Metro: `npm run start:dev-client`
2. Open PassFit Development Client on device
3. Scan QR code
4. Develop and test

### When You Need Fresh Build:
1. Make significant native changes
2. Update dependencies
3. Rebuild: `npm run build:dev-client:android` or `npm run build:dev-client:ios`
4. Reinstall on device

## Key Differences from Expo Go

| Feature | Expo Go | Development Client |
|---------|---------|-------------------|
| URL Scheme | `exp://` | `passfit://expo-development-client` |
| Custom Native Code | ❌ | ✅ |
| Custom Plugins | Limited | ✅ |
| Build Required | ❌ | ✅ |
| App Store Distribution | ❌ | ✅ |

## Commands Reference

```bash
# Start development server
npm run start:dev-client

# Start with tunnel (network issues)
npm run start:dev-client:tunnel

# Start with cache cleared
npm run start:dev-client:clear

# Build development client
npm run build:dev-client:android
npm run build:dev-client:ios
npm run build:dev-client:all

# Install development client
npm run install:dev-client

# Run directly on device (no QR)
npm run android
npm run ios
```

## Next Steps

After setting up your development client:
1. Test QR code scanning functionality
2. Verify all app features work correctly
3. Use this setup for daily development
4. Only rebuild when native changes are made

---

**Note**: Always use your PassFit Development Client instead of Expo Go for this project due to the custom URL scheme requirements.
