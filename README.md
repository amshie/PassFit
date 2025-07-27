# PassFit 💪

Eine moderne React Native/Expo-App für die Suche und Verwaltung von Fitness-Studios. PassFit ermöglicht es Benutzern, Studios in ihrer Nähe zu finden, sich über Google zu authentifizieren und QR-Codes für Check-ins zu scannen.

## 🚀 Features

### ✅ Implementiert
- **Studio-Suche mit Karte** - Google Maps Integration zur Anzeige von Studios
- **Standortbasierte Suche** - Automatische GPS-Erkennung oder manuelle Standortauswahl
- **Google Authentication** - Sichere Anmeldung über Google Sign-In
- **QR-Code Scanner** - Check-in System für Studios
- **Mehrsprachigkeit** - Vollständige Unterstützung für Deutsch und Englisch
- **TypeScript Architektur** - Typsichere, modulare Codebase
- **Responsive Design** - Optimiert für iOS, Android und Web
- **Realtime Updates** - Firebase Firestore Integration
- **Professionelle UI** - Moderne Benutzeroberfläche mit Loading-States

### 🔄 Kürzlich Refactoriert
- **Modulare Komponenten** - Home-Screen in wiederverwendbare Komponenten aufgeteilt
- **Custom Hooks** - Logik-Trennung für bessere Wartbarkeit
- **TypeScript Migration** - Vollständige Typisierung aller Komponenten
- **Performance Optimierung** - Viewport-basierte Studio-Filterung

## 🏗️ Projektstruktur

```
PassFit/
├── app/                          # Expo Router Pages
│   ├── (auth)/                   # Authentifizierung
│   ├── (tabs)/                   # Haupt-Navigation
│   │   ├── _layout.jsx          # Tab-Layout
│   │   ├── home.jsx             # Original Home (Legacy)
│   │   └── home.tsx             # Refactored Home (TypeScript)
│   ├── profile/                 # Benutzerprofile
│   ├── studio/                  # Studio-Details
│   ├── _layout.tsx              # Root Layout
│   ├── index.jsx                # Landing Page
│   └── scanner.tsx              # QR-Code Scanner
├── src/
│   ├── components/              # UI Komponenten
│   │   ├── ui/                  # Basis UI-Komponenten
│   │   │   ├── Loading/         # Loading-States & Skeletons
│   │   │   ├── Button/          # Button-Komponenten
│   │   │   ├── Card/            # Card-Layouts
│   │   │   ├── StudioCard/      # Studio-Karten
│   │   │   └── StudioList/      # Studio-Listen
│   │   ├── home/                # Home-spezifische Komponenten
│   │   │   ├── SearchBar/       # Suchleiste
│   │   │   ├── LocationStatus/  # Standort-Anzeige
│   │   │   ├── MapView/         # Google Maps
│   │   │   ├── StudioBottomSheet/ # Studio-Liste
│   │   │   └── FloatingActionButton/ # Action-Button
│   │   └── forms/               # Formular-Komponenten
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useUserLocation.ts   # GPS & Standort-Management
│   │   ├── useMapRegion.ts      # Karten-Region Management
│   │   ├── useVisibleStudios.ts # Studio-Filterung
│   │   └── useRecenter.ts       # Karten-Zentrierung
│   ├── services/                # Business Logic & APIs
│   │   ├── api/                 # Service Layer
│   │   ├── firebase/            # Firebase Integration
│   │   └── qr-scanner.service.ts # QR-Code Service
│   ├── store/                   # State Management
│   │   ├── slices/              # Redux-ähnliche Slices
│   │   └── providers/           # Context Provider
│   ├── types/                   # TypeScript Definitionen
│   │   ├── map.types.ts         # Karten-Typen
│   │   ├── home.types.ts        # Home-Komponenten Typen
│   │   └── user.types.ts        # Benutzer-Typen
│   ├── locales/                 # Internationalisierung
│   │   ├── de.json              # Deutsche Übersetzungen
│   │   ├── en.json              # Englische Übersetzungen
│   │   └── i18n.ts              # i18n Konfiguration
│   ├── models/                  # Datenmodelle
│   ├── utils/                   # Utility Functions
│   └── styles/                  # Theme & Styling
└── docs/                        # Dokumentation
    ├── GOOGLE_AUTH_SETUP.md     # Google Auth Setup
    └── REACT_QUERY_HOOKS_GUIDE.md # React Query Guide
```

## 🛠️ Tech Stack

### Frontend
- **React Native** `0.79.5` - Mobile App Framework
- **Expo** `53.0.20` - Development Platform & SDK
- **TypeScript** `5.8.3` - Type Safety
- **Expo Router** `5.1.4` - File-based Navigation
- **NativeWind** `4.1.23` - Tailwind CSS für React Native

### Backend & Services
- **Firebase** `11.10.0` - Backend-as-a-Service
- **Firestore** - NoSQL Datenbank
- **Firebase Auth** - Benutzerauthentifizierung
- **Google Sign-In** `15.0.0` - OAuth Integration

### Maps & Location
- **React Native Maps** `1.20.1` - Google Maps Integration
- **Expo Location** `18.1.6` - GPS & Standortdienste
- **Community Geolocation** `3.4.0` - Erweiterte Standortfunktionen

### State Management & Data
- **TanStack React Query** `5.81.5` - Server State Management
- **AsyncStorage** `2.1.2` - Lokale Datenpersistierung
- **Zustand** `5.0.6` - Client State Management

### UI & UX
- **React Native Reanimated** `3.17.4` - Animationen
- **React Native Gesture Handler** `2.24.0` - Touch-Gesten
- **React Native Screens** `4.11.1` - Native Screen-Komponenten
- **Expo Camera** `16.1.11` - QR-Code Scanner

### Internationalization
- **i18next** `25.3.2` - Internationalisierung Framework
- **react-i18next** `15.6.1` - React Integration
- **Expo Localization** `16.1.6` - Geräte-Lokalisierung

### Development Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript Strict Mode** - Maximale Type Safety

## 📱 Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (für iOS) oder Android Studio (für Android)

### 1. Repository klonen
```bash
git clone <repository-url>
cd "PassFit 3"
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Firebase konfigurieren

#### Firebase Projekt erstellen
1. Gehe zur [Firebase Console](https://console.firebase.google.com)
2. Erstelle ein neues Projekt oder wähle ein bestehendes aus
3. Aktiviere **Authentication** und **Firestore Database**

#### Firebase Konfigurationsdateien
1. **Android**: Lade `google-services.json` herunter und platziere sie im Projektroot
2. **iOS**: Lade `GoogleService-Info.plist` herunter und platziere sie im Projektroot

#### Environment Variables
Erstelle eine `.env` Datei im Projektroot:
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sign-In
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Google Authentication Setup
Folge der detaillierten Anleitung in [`docs/GOOGLE_AUTH_SETUP.md`](docs/GOOGLE_AUTH_SETUP.md) für:
- OAuth Client IDs erstellen
- SHA-1 Fingerprints konfigurieren
- Bundle IDs einrichten

### 5. Google Maps API aktivieren
1. Gehe zur [Google Cloud Console](https://console.cloud.google.com)
2. Aktiviere die **Maps SDK for Android** und **Maps SDK for iOS**
3. Erstelle einen API-Schlüssel für Google Maps

### 6. App starten
```bash
# Entwicklungsserver starten
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (eingeschränkte Funktionalität)
npm run web
```

## 🎯 Verwendung

### Hauptfunktionen

#### Studio-Suche
- **Kartenansicht**: Interaktive Google Maps mit Studio-Markern
- **Standorterkennung**: Automatische GPS-Lokalisierung oder manuelle Auswahl
- **Suchfilter**: Suche nach Studio-Namen oder Standorten
- **Radius-Filter**: Studios im gewählten Umkreis anzeigen

#### Authentifizierung
- **Google Sign-In**: Sichere Anmeldung über Google-Konto
- **Profilverwaltung**: Benutzerprofile anzeigen und bearbeiten
- **Sitzungsmanagement**: Automatische Anmeldung bei App-Start

#### QR-Code System
- **Scanner**: Integrierte Kamera für QR-Code-Erkennung
- **Check-In**: Automatisches Check-In in Studios
- **Berechtigungen**: Kamera-Zugriff mit Benutzerfreundlichen Prompts

### Navigation
- **Home** (`/(tabs)/home`): Hauptbildschirm mit Karte und Studio-Suche
- **Profile** (`/profile/[uid]`): Benutzerprofile anzeigen
- **Studio Details** (`/studio/[studioId]`): Detailansicht einzelner Studios
- **Scanner** (`/scanner`): QR-Code Scanner für Check-Ins

## 🏛️ Architektur-Prinzipien

### Clean Architecture
```
Presentation Layer (Components/Screens)
    ↓
Business Logic Layer (Hooks/Services)
    ↓
Data Layer (Firebase/API)
```

### Refactoring-Erfolge
Das Projekt wurde kürzlich von einer monolithischen Struktur zu einer modularen Architektur refactoriert:

- **Vorher**: 600+ Zeilen in einer einzigen `home.jsx` Datei
- **Nachher**: Modulare Komponenten mit klarer Verantwortungstrennung
- **Verbesserungen**:
  - Bessere Wartbarkeit durch kleinere, fokussierte Komponenten
  - TypeScript Integration für Type Safety
  - Custom Hooks für Logik-Wiederverwendung
  - Performance-Optimierungen durch Viewport-Filterung

### Design Patterns
- **Component Composition** - Wiederverwendbare UI-Komponenten
- **Custom Hooks Pattern** - Logik-Extraktion und -Wiederverwendung
- **Service Layer Pattern** - API-Abstraktion
- **Observer Pattern** - Realtime Updates mit Firebase

### State Management
- **React Query** - Server State Management mit Caching
- **Zustand** - Leichtgewichtiges Client State Management
- **AsyncStorage** - Persistente lokale Datenspeicherung
- **Context API** - Globale App-States

## 🌍 Internationalisierung

Die App unterstützt vollständige Mehrsprachigkeit:

### Unterstützte Sprachen
- **Deutsch** (`de`) - Vollständig implementiert
- **Englisch** (`en`) - Vollständig implementiert

### Übersetzungsstruktur
```json
{
  "common": { /* Allgemeine UI-Elemente */ },
  "location": { /* Standort-bezogene Texte */ },
  "studios": { /* Studio-Suche und -Anzeige */ },
  "auth": { /* Authentifizierung */ },
  "camera": { /* QR-Scanner */ },
  "accessibility": { /* Barrierefreiheit */ }
}
```

### Verwendung
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const text = t('studios.loading'); // "Studios werden geladen..."
```

## 🧪 Testing & Qualitätssicherung

### Code-Qualität
```bash
# Linting
npm run lint

# Type-Checking
npx tsc --noEmit

# Prettier Formatting
npm run format
```

### Testing-Strategien
- **Component Testing** - Einzelne Komponenten isoliert testen
- **Hook Testing** - Custom Hooks mit React Testing Library
- **Integration Testing** - Vollständige User-Flows
- **E2E Testing** - End-to-End Tests mit Detox (geplant)

## 📦 Build & Deployment

### Development Build
```bash
# Expo Development Build
npx expo run:ios
npx expo run:android
```

### Production Build
```bash
# EAS Build (empfohlen)
npm install -g eas-cli
eas build --platform all

# Lokaler Build
npx expo build:ios
npx expo build:android
```

### Deployment
```bash
# App Store / Google Play
eas submit --platform all

# Expo Updates (OTA)
eas update --branch production
```

## 🔧 Entwicklung

### Verfügbare Scripts
```bash
npm start          # Expo Development Server
npm run android    # Android Development Build
npm run ios        # iOS Development Build
npm run web        # Web Development (eingeschränkt)
```

### Entwicklungsworkflow
1. **Feature Branch** erstellen
2. **TypeScript** für neue Komponenten verwenden
3. **Übersetzungen** für neue Texte hinzufügen
4. **Tests** für neue Funktionalität schreiben
5. **Code Review** vor Merge

### Code-Standards
- **TypeScript First** - Alle neuen Dateien in TypeScript
- **Component-First** - Wiederverwendbare Komponenten bevorzugen
- **Hook-Pattern** - Logik in Custom Hooks extrahieren
- **Accessibility** - ARIA-Labels und Screen Reader Support

## 🐛 Bekannte Probleme & Lösungen

### Web-Kompatibilität
- **Problem**: `react-native-maps` funktioniert nicht vollständig im Web
- **Lösung**: Fallback-UI für Web-Plattform implementiert
- **Status**: Web-Version zeigt Warnung, aber App funktioniert

### Performance
- **Problem**: Große Anzahl von Studios kann Performance beeinträchtigen
- **Lösung**: Viewport-basierte Filterung implementiert
- **Status**: ✅ Gelöst durch Refactoring

### Standortberechtigungen
- **Problem**: GPS-Berechtigungen können verweigert werden
- **Lösung**: Fallback-Standortauswahl implementiert
- **Status**: ✅ Benutzerfreundliche Lösung verfügbar

## 📋 Roadmap

### Phase 1: Core Features (✅ Abgeschlossen)
- [x] Studio-Suche mit Google Maps
- [x] Google Authentication
- [x] QR-Code Scanner
- [x] Mehrsprachigkeit
- [x] TypeScript Migration

### Phase 2: Erweiterte Features (🔄 In Arbeit)
- [ ] Workout-Tracking System
- [ ] Benutzer-Dashboard mit Statistiken
- [ ] Push-Benachrichtigungen
- [ ] Offline-Unterstützung

### Phase 3: Premium Features (📋 Geplant)
- [ ] Social Features & Community
- [ ] Premium-Studio-Partnerschaften
- [ ] Advanced Analytics
- [ ] Wearable Integration

## 🤝 Contributing

### Beitragen
1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Implementiere deine Änderungen mit TypeScript
4. Füge Übersetzungen hinzu (Deutsch & Englisch)
5. Teste deine Änderungen
6. Committe mit aussagekräftigen Messages
7. Push zum Branch (`git push origin feature/AmazingFeature`)
8. Öffne einen Pull Request

### Code-Richtlinien
- **TypeScript verwenden** für alle neuen Dateien
- **Komponenten dokumentieren** mit JSDoc-Kommentaren
- **Accessibility beachten** - ARIA-Labels hinzufügen
- **Übersetzungen pflegen** - Texte in beiden Sprachen
- **Performance berücksichtigen** - useMemo/useCallback verwenden

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Team & Support

### Entwicklung
- **Frontend**: React Native/TypeScript Entwicklung
- **Backend**: Firebase Integration & Services
- **UI/UX**: Design System & Benutzerfreundlichkeit

### Support
Bei Fragen oder Problemen:
- 📧 **Issues**: Erstelle ein GitHub Issue
- 📚 **Dokumentation**: Siehe [`docs/`](docs/) Ordner
- 🔧 **Setup-Hilfe**: [`docs/GOOGLE_AUTH_SETUP.md`](docs/GOOGLE_AUTH_SETUP.md)

## 🙏 Danksagungen

- **Expo Team** - Für die hervorragende Entwicklungsplattform
- **Firebase** - Für Backend-as-a-Service Lösung
- **Google Maps** - Für Karten-Integration
- **React Native Community** - Für Open-Source Bibliotheken
- **TypeScript Team** - Für Type Safety und Developer Experience

---

**PassFit** - Entwickelt mit ❤️ für die Fitness-Community

*Letzte Aktualisierung: July 2025*
