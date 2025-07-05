# Google Authentication Setup Guide

## 1. Firebase Console Konfiguration

### Schritt 1: Google Sign-In aktivieren
1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com)
2. Wählen Sie Ihr PassFit-Projekt aus
3. Navigieren Sie zu **Authentication** > **Sign-in method**
4. Klicken Sie auf **Google** in der Liste der Anbieter
5. Aktivieren Sie den **Enable** Toggle
6. Geben Sie eine **Project support email** ein
7. Klicken Sie **Save**

### Schritt 2: OAuth Client IDs erstellen

#### Für Android:
1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com)
2. Wählen Sie Ihr Firebase-Projekt
3. Navigieren Sie zu **APIs & Services** > **Credentials**
4. Klicken Sie **+ CREATE CREDENTIALS** > **OAuth client ID**
5. Wählen Sie **Android** als Application type
6. Geben Sie einen Namen ein (z.B. "PassFit Android")
7. **Package name**: `com.anonymous.PassFit` (aus app.json)
8. **SHA-1 certificate fingerprint**: 
   ```bash
   # Debug-Zertifikat (für Entwicklung)
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
9. Klicken Sie **Create**

#### Für iOS:
1. In der gleichen Credentials-Seite
2. Klicken Sie **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Wählen Sie **iOS** als Application type
4. Geben Sie einen Namen ein (z.B. "PassFit iOS")
5. **Bundle ID**: `com.anonymous.PassFit` (aus app.json)
6. Klicken Sie **Create**

### Schritt 3: Client IDs notieren
Notieren Sie sich die folgenden IDs:
- **Android Client ID**: `xxx.apps.googleusercontent.com`
- **iOS Client ID**: `yyy.apps.googleusercontent.com`
- **Web Client ID**: (automatisch erstellt von Firebase)

## 2. App-Konfiguration

### app.json erweitern
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.REVERSED_IOS_CLIENT_ID"
        }
      ]
    ]
  }
}
```

### Environment Variables
Erstellen Sie eine `.env` Datei:
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
```

## 3. Testing

### Debug-Build testen:
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### Production-Build:
```bash
# EAS Build
eas build --platform all
```

## Troubleshooting

### Häufige Probleme:
1. **SHA-1 Fingerprint falsch**: Stellen Sie sicher, dass Sie den korrekten Debug/Release Fingerprint verwenden
2. **Bundle ID stimmt nicht überein**: Überprüfen Sie app.json und Google Console
3. **Client ID nicht gefunden**: Stellen Sie sicher, dass alle Environment Variables korrekt gesetzt sind

### Debug-Befehle:
```bash
# SHA-1 für Debug-Keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Bundle ID überprüfen
cat app.json | grep "package"
