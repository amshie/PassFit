# PassFit 💪

Eine moderne React Native/Expo-App für die Suche und Verwaltung von Fitness-Studios. PassFit ermöglicht es Benutzern, Studios in ihrer Nähe zu finden, sich über Google zu authentifizieren und QR-Codes für Check-ins zu scannen.

## 🚀 Features

### ✅ Vollständig Implementiert

#### 🏗️ Core Features
- **Studio-Suche mit Karte** - Google Maps Integration zur Anzeige von Studios
- **Standortbasierte Suche** - Automatische GPS-Erkennung oder manuelle Standortauswahl
- **Google Authentication** - Sichere Anmeldung über Google Sign-In
- **QR-Code Scanner** - Check-in System für Studios mit Kamera-Integration
- **Mehrsprachigkeit** - Vollständige Unterstützung für Deutsch und Englisch
- **TypeScript Architektur** - Typsichere, modulare Codebase
- **Responsive Design** - Optimiert für iOS, Android und Web

#### 🎨 UI/UX System
- **Theme System** - Light/Dark/System Modi mit automatischer Erkennung
- **Settings-System** - Vollständige Benutzereinstellungen mit Persistierung
- **Professionelle UI** - Moderne Benutzeroberfläche mit Loading-States
- **Navigation** - Expo Router mit Tab-basierter Navigation

#### 📊 Fortschritt & Tracking
- **Check-In System** - Vollständige Implementierung mit Firestore-Integration
- **Progress Tracking** - Kalender-basierte Fortschrittsverfolgung
- **Real-time Updates** - Live-Updates ohne App-Neustart
- **Check-In Kalender** - Interaktive Kalenderansicht mit Details

#### 💎 Premium Features
- **Subscription System** - Real-time Subscription Status Management
- **Premium Components** - KI-Empfehlungen, Coach-Zugang, personalisierte Pläne
- **Upgrade-System** - VIP/Gold Pläne mit Feature-Differenzierung
- **User Type Management** - Automatische Premium/Free User Erkennung

#### 🔧 Backend & Services
- **Firebase Integration** - Vollständige Firestore-Integration
- **Cloud Functions** - Automatische Subscription-Synchronisation
- **Real-time Listeners** - Live-Updates für alle Datenänderungen
- **Security Rules** - Umfassende Firestore-Sicherheitsregeln

### 🔄 Kürzlich Implementiert
- **Settings-System** - Sprache, Theme, Benachrichtigungen mit Zustand-Persistierung
- **Real-time Subscriptions** - Live-Updates für Subscription-Status
- **Premium Features** - KI-Empfehlungen, Coach-Zugang, personalisierte Pläne
- **Progress Tracking** - Vollständige Check-In Historie mit Kalender
- **Theme Provider** - Dynamisches Theme-System mit System-Integration
- **Cloud Function Sync** - Automatische Daten-Synchronisation

### 🚧 Teilweise Implementiert
- **Payment Integration** - Datenmodelle vorhanden, Stripe/PayPal Integration ausstehend
- **Workout Sharing** - Backend-Modelle implementiert, UI-Komponenten fehlen
- **Push Notifications** - Grundstruktur vorhanden, vollständige Integration ausstehend

### ❌ Noch Fehlend
- **Vollständige Payment-Integration** (Stripe/PayPal)
- **Social Features & Community**
- **Offline-Unterstützung**
- **Advanced Analytics**
- **Wearable Integration**
- **Enterprise Features**

## 🏗️ Projektstruktur

```
PassFit/
├── app/                          # Expo Router Pages
│   ├── (auth)/                   # Authentifizierung
│   ├── (tabs)/                   # Haupt-Navigation
│   │   ├── _layout.jsx          # Tab-Layout mit Theme-Integration
│   │   ├── home.tsx             # Studio-Suche & Karte (TypeScript)
│   │   ├── workouts.tsx         # QR-Code Scanner & Check-In
│   │   ├── progress.tsx         # Fortschritt & Check-In Kalender
│   │   ├── upgrade.tsx          # Premium-Pläne & Upgrade-System
│   │   └── profile.tsx          # Benutzerprofil & Navigation
│   ├── account/                 # Account-Management
│   │   └── index.tsx            # Account-Übersicht mit Real-time Updates
│   ├── profile/                 # Benutzerprofile
│   │   ├── [uid].js             # Profil-Details
│   │   ├── settings.tsx         # Vollständige Settings-Implementierung
│   │   └── __tests__/           # Settings Tests
│   ├── studio/                  # Studio-Details
│   │   └── [studioId].tsx       # Studio-Detailansicht
│   ├── _layout.tsx              # Root Layout mit Theme Provider
│   ├── index.jsx                # Landing Page
│   └── scanner.tsx              # QR-Code Scanner
├── src/
│   ├── components/              # UI Komponenten
│   │   ├── ui/                  # Basis UI-Komponenten
│   │   │   ├── Loading/         # Loading-States & Skeletons
│   │   │   ├── Button/          # Button-Komponenten
│   │   │   ├── Card/            # Card-Layouts
│   │   │   ├── StudioCard/      # Studio-Karten
│   │   │   ├── StudioList/      # Studio-Listen
│   │   │   └── UpgradePrompt/   # Premium-Upgrade Prompts
│   │   ├── home/                # Home-spezifische Komponenten
│   │   │   ├── SearchBar/       # Suchleiste
│   │   │   ├── LocationStatus/  # Standort-Anzeige
│   │   │   ├── MapView/         # Google Maps
│   │   │   ├── StudioBottomSheet/ # Studio-Liste
│   │   │   └── FloatingActionButton/ # Action-Button
│   │   ├── account/             # Account-Management Komponenten
│   │   │   ├── SubscriptionSection/ # Subscription-Status & Management
│   │   │   ├── PaymentSection/  # Payment-Management
│   │   │   ├── BillingHistorySection/ # Rechnungshistorie
│   │   │   ├── SecuritySection/ # Sicherheitseinstellungen
│   │   │   └── PrivacySection/  # Datenschutz-Einstellungen
│   │   ├── settings/            # Settings-Komponenten
│   │   │   ├── SettingsNotifications.tsx # Benachrichtigungs-Toggle
│   │   │   └── index.ts         # Settings-Exports
│   │   ├── premium/             # Premium-Features
│   │   │   ├── AIRecommendations.tsx # KI-Empfehlungen
│   │   │   ├── CoachAccess.tsx  # Coach-Zugang
│   │   │   └── PersonalizedPlans.tsx # Personalisierte Pläne
│   │   ├── demo/                # Demo & Testing
│   │   │   └── RealtimeDemo.tsx # Real-time Subscription Demo
│   │   ├── test/                # Test-Komponenten
│   │   └── forms/               # Formular-Komponenten
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useUserLocation.ts   # GPS & Standort-Management
│   │   ├── useMapRegion.ts      # Karten-Region Management
│   │   ├── useVisibleStudios.ts # Studio-Filterung
│   │   ├── useRecenter.ts       # Karten-Zentrierung
│   │   ├── useUser.ts           # User-Management mit Real-time Updates
│   │   ├── useSubscription.ts   # Subscription-Management
│   │   ├── useUserType.ts       # Premium/Free User Detection
│   │   ├── useCheckIn.ts        # Check-In Management
│   │   ├── useStudio.ts         # Studio-Daten Management
│   │   └── usePlan.ts           # Plan-Management
│   ├── services/                # Business Logic & APIs
│   │   ├── api/                 # Service Layer
│   │   │   ├── checkin.service.ts # Check-In Service
│   │   │   └── studio.service.ts # Studio Service
│   │   ├── firebase/            # Firebase Integration
│   │   │   ├── config.ts        # Firebase Konfiguration
│   │   │   └── userService.ts   # User Service mit Real-time
│   │   └── qr-scanner.service.ts # QR-Code Service
│   ├── store/                   # State Management
│   │   ├── slices/              # Zustand Slices
│   │   │   ├── settingsSlice.ts # Settings State Management
│   │   │   └── __tests__/       # Store Tests
│   │   ├── providers/           # Context Provider
│   │   └── index.ts             # Store Configuration
│   ├── providers/               # React Context Providers
│   │   └── ThemeProvider.tsx    # Theme Provider mit System-Integration
│   ├── types/                   # TypeScript Definitionen
│   │   ├── map.types.ts         # Karten-Typen
│   │   ├── home.types.ts        # Home-Komponenten Typen
│   │   ├── user.types.ts        # Benutzer-Typen
│   │   ├── auth.types.ts        # Authentifizierungs-Typen
│   │   └── workout.types.ts     # Workout-Typen
│   ├── locales/                 # Internationalisierung
│   │   ├── de.json              # Deutsche Übersetzungen (erweitert)
│   │   ├── en.json              # Englische Übersetzungen (erweitert)
│   │   └── i18n.ts              # i18n Konfiguration mit Dynamic Loading
│   ├── models/                  # Datenmodelle
│   │   ├── users.ts             # User-Modell
│   │   ├── studio.ts            # Studio-Modell
│   │   ├── checkIn.ts           # Check-In Modell
│   │   ├── subscription.ts      # Subscription-Modell
│   │   ├── plan.ts              # Plan-Modell
│   │   ├── payment.ts           # Payment-Modell
│   │   ├── GymPass.ts           # GymPass-Modell
│   │   ├── workoutShare.ts      # Workout-Sharing Modell
│   │   └── index.ts             # Model-Exports
│   ├── utils/                   # Utility Functions
│   │   ├── constants.ts         # App-Konstanten
│   │   ├── formatters.ts        # Daten-Formatierung
│   │   ├── validation.ts        # Validierungs-Funktionen
│   │   └── web-mocks/           # Web-Platform Mocks
│   └── styles/                  # Theme & Styling
│       ├── theme.ts             # Theme-Definitionen
│       └── index.ts             # Style-Exports
├── functions/                   # Firebase Cloud Functions
│   ├── src/                     # Function Source Code
│   │   ├── index.ts             # Function Exports
│   │   ├── syncSubscriptionStatus.ts # Subscription Sync
│   │   └── setDefaultSubscription.ts # Default Subscription Setup
│   ├── package.json             # Function Dependencies
│   └── tsconfig.json            # TypeScript Config
└── docs/                        # Dokumentation
    ├── GOOGLE_AUTH_SETUP.md     # Google Auth Setup
    ├── GOOGLE_MAPS_SETUP.md     # Google Maps Setup
    ├── ENVIRONMENT_SETUP.md     # Environment Setup
    ├── DEV_CLIENT_SETUP.md      # Development Client Setup
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

#### Option 1: Development Client (Empfohlen für QR-Code Funktionalität)
Aufgrund des benutzerdefinierten URL-Schemas (`passfit://`) funktioniert Expo Go nicht korrekt. Verwende stattdessen den Development Client:

```bash
# Prerequisites prüfen
npm run dev-client:check

# Development Client bauen
npm run build:dev-client:android  # Für Android
npm run build:dev-client:ios      # Für iOS

# Development Server starten
npm run start:dev-client

# Bei Netzwerkproblemen: Tunnel-Modus
npm run start:dev-client:tunnel
```

**Wichtig**: Installiere die generierte APK/IPA auf deinem Gerät und verwende den **PassFit Development Client** (NICHT Expo Go) zum Scannen der QR-Codes.

#### Option 2: Direkte Geräte-Installation
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (eingeschränkte Funktionalität)
npm run web
```

#### Option 3: Standard Expo Go (Eingeschränkt)
```bash
# Entwicklungsserver starten
npm start
```

**Hinweis**: Bei "Keine Daten verfügbar" beim QR-Code scannen, siehe [Development Client Setup Guide](docs/DEV_CLIENT_SETUP.md).

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

#### Settings & Personalisierung
- **Sprache**: Dynamischer Wechsel zwischen Deutsch und Englisch
- **Theme**: Light/Dark/System Modi mit automatischer Erkennung
- **Benachrichtigungen**: Toggle für Push-Benachrichtigungen
- **Persistierung**: Alle Einstellungen werden automatisch gespeichert

#### Progress Tracking
- **Check-In Kalender**: Interaktive Kalenderansicht mit Check-In Historie
- **Studio-Details**: Detaillierte Informationen zu jedem Check-In
- **Real-time Updates**: Live-Updates ohne App-Neustart
- **Premium Features**: KI-Empfehlungen und Coach-Zugang für Premium-User

### Navigation
- **Home** (`/(tabs)/home`): Hauptbildschirm mit Karte und Studio-Suche
- **Check In** (`/(tabs)/workouts`): QR-Code Scanner für Check-Ins
- **Progress** (`/(tabs)/progress`): Fortschrittsverfolgung mit Kalender
- **Upgrade** (`/(tabs)/upgrade`): Premium-Pläne und Upgrade-Optionen
- **Profile** (`/(tabs)/profile`): Benutzerprofil und Settings-Zugang
- **Settings** (`/profile/settings`): Vollständige Einstellungen
- **Account** (`/account`): Account-Management mit Real-time Updates

## 🏛️ Architektur-Prinzipien

### Clean Architecture
```
Presentation Layer (Components/Screens)
    ↓
Business Logic Layer (Hooks/Services)
    ↓
Data Layer (Firebase/API)
```

### Implementierungs-Erfolge
Das Projekt wurde erfolgreich von einer monolithischen Struktur zu einer modernen, modularen Architektur entwickelt:

- **Modulare Komponenten** - Klare Verantwortungstrennung
- **TypeScript Integration** - Vollständige Type Safety
- **Custom Hooks** - Wiederverwendbare Logik-Extraktion
- **Real-time System** - Live-Updates ohne App-Neustart
- **Theme System** - Dynamisches Theme-Management
- **Settings Persistierung** - Benutzereinstellungen überleben App-Neustarts

### Design Patterns
- **Component Composition** - Wiederverwendbare UI-Komponenten
- **Custom Hooks Pattern** - Logik-Extraktion und -Wiederverwendung
- **Service Layer Pattern** - API-Abstraktion
- **Observer Pattern** - Realtime Updates mit Firebase
- **Provider Pattern** - Theme und Settings Management

### State Management
- **React Query** - Server State Management mit Caching
- **Zustand** - Leichtgewichtiges Client State Management
- **AsyncStorage** - Persistente lokale Datenspeicherung
- **Context API** - Globale App-States (Theme, Settings)

## 🌍 Internationalisierung

Die App unterstützt vollständige Mehrsprachigkeit mit dynamischem Sprachwechsel:

### Unterstützte Sprachen
- **Deutsch** (`de`) - Vollständig implementiert
- **Englisch** (`en`) - Vollständig implementiert

### Erweiterte Übersetzungsstruktur
```json
{
  "common": { /* Allgemeine UI-Elemente */ },
  "location": { /* Standort-bezogene Texte */ },
  "studios": { /* Studio-Suche und -Anzeige */ },
  "auth": { /* Authentifizierung */ },
  "camera": { /* QR-Scanner */ },
  "settings": { /* Settings-System */ },
  "upgrade": { /* Premium-Features */ },
  "progress": { /* Fortschrittsverfolgung */ },
  "accessibility": { /* Barrierefreiheit */ }
}
```

### Verwendung
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const text = t('settings.language.german'); // "Deutsch"
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
- **Component Testing** - Settings-Komponenten vollständig getestet
- **Hook Testing** - Custom Hooks mit React Testing Library
- **Integration Testing** - Real-time Subscription Flow
- **Manual Testing** - Umfassende Checklisten für alle Features

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
npm start                        # Expo Development Server
npm run start:dev-client         # Development Client Server
npm run android                  # Android Development Build
npm run ios                      # iOS Development Build
npm run web                      # Web Development (eingeschränkt)
npm run build:dev-client:android # Android Development Client Build
npm run build:dev-client:ios     # iOS Development Client Build
```

### Entwicklungsworkflow
1. **Feature Branch** erstellen
2. **TypeScript** für neue Komponenten verwenden
3. **Übersetzungen** für neue Texte hinzufügen (Deutsch & Englisch)
4. **Tests** für neue Funktionalität schreiben
5. **Theme-Kompatibilität** sicherstellen
6. **Code Review** vor Merge

### Code-Standards
- **TypeScript First** - Alle neuen Dateien in TypeScript
- **Component-First** - Wiederverwendbare Komponenten bevorzugen
- **Hook-Pattern** - Logik in Custom Hooks extrahieren
- **Theme-Aware** - Alle Komponenten unterstützen Light/Dark Mode
- **Accessibility** - ARIA-Labels und Screen Reader Support
- **i18n Ready** - Alle Texte über Übersetzungssystem

## 🐛 Bekannte Probleme & Lösungen

### Web-Kompatibilität
- **Problem**: `react-native-maps` funktioniert nicht vollständig im Web
- **Lösung**: Fallback-UI für Web-Plattform implementiert
- **Status**: ✅ Web-Version zeigt Warnung, aber App funktioniert

### Performance
- **Problem**: Große Anzahl von Studios kann Performance beeinträchtigen
- **Lösung**: Viewport-basierte Filterung implementiert
- **Status**: ✅ Gelöst durch Refactoring

### Standortberechtigungen
- **Problem**: GPS-Berechtigungen können verweigert werden
- **Lösung**: Fallback-Standortauswahl implementiert
- **Status**: ✅ Benutzerfreundliche Lösung verfügbar

### Development Client
- **Problem**: QR-Code Scanner funktioniert nicht in Expo Go
- **Lösung**: Development Client Setup implementiert
- **Status**: ✅ Vollständige Anleitung in docs/DEV_CLIENT_SETUP.md

## 📋 Roadmap

### Phase 1: Core Features (✅ Vollständig Abgeschlossen)
- [x] Studio-Suche mit Google Maps
- [x] Google Authentication
- [x] QR-Code Scanner mit Kamera-Integration
- [x] Mehrsprachigkeit (Deutsch/Englisch)
- [x] TypeScript Migration
- [x] Theme System (Light/Dark/System)
- [x] Settings-System mit Persistierung
- [x] Real-time Firebase Integration

### Phase 2: Erweiterte Features (✅ Vollständig Abgeschlossen)
- [x] Check-In System mit Firestore-Integration
- [x] Progress Tracking mit Kalender-Ansicht
- [x] Real-time Subscription Status Updates
- [x] Premium/Free User Management
- [x] Cloud Functions für Daten-Synchronisation
- [x] Comprehensive Security Rules
- [x] Account-Management System

### Phase 3: Premium Features (✅ Grundstruktur Implementiert)
- [x] Premium Components (KI-Empfehlungen, Coach-Zugang)
- [x] Upgrade-System (VIP/Gold Pläne)
- [x] User Type Detection & Management
- [x] Premium Feature Gating
- [ ] **Vollständige Payment-Integration** (Stripe/PayPal) - 🚧 In Arbeit
- [ ] **Erweiterte KI-Empfehlungen** - 📋 Geplant
- [ ] **Live Coach-Sessions** - 📋 Geplant

### Phase 4: Social & Community Features (📋 Geplant)
- [ ] Workout-Sharing System (Backend-Modelle vorhanden)
- [ ] Social Features & Community
- [ ] Freunde-System & Challenges
- [ ] Leaderboards & Achievements
- [ ] Community-Events & Meetups

### Phase 5: Advanced Features (📋 Geplant)
- [ ] Push-Benachrichtigungen (Grundstruktur vorhanden)
- [ ] Offline-Unterstützung mit Sync
- [ ] Advanced Analytics & Insights
- [ ] Wearable Integration (Apple Watch, Fitbit)
- [ ] Premium-Studio-Partnerschaften
- [ ] Multi-Tenant Support

### Phase 6: Enterprise Features (🔮 Zukunft)
- [ ] Studio-Owner Dashboard
- [ ] Business Analytics für Studios
- [ ] White-Label Solutions
- [ ] API für Drittanbieter-Integration
- [ ] Advanced Reporting & Insights

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
- **Theme-Kompatibilität** sicherstellen (Light/Dark Mode)
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
- **TypeScript Team** - Für Type Safety
