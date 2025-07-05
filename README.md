# PassFit 💪

Eine moderne, professionelle Fitness-App entwickelt mit React Native und Expo. PassFit bietet personalisierte Workouts, detailliertes Progress-Tracking und eine motivierende Community-Erfahrung.

## 🚀 Features

### ✅ Implementiert
- **Professionelle Architektur** - TypeScript, Service Layer, State Management
- **Benutzerauthentifizierung** - E-Mail und Telefonnummer Login/Registrierung
- **Responsive Design** - Optimiert für iOS und Android
- **State Management** - Zustand mit AsyncStorage Persistierung
- **Component Library** - Wiederverwendbare UI-Komponenten
- **Deutsche Lokalisierung** - Vollständig auf Deutsch

### 🔄 In Entwicklung
- Workout-System mit Timer und Set-Tracking
- Dashboard mit Statistiken und Charts
- Progress Tracking mit Foto-Upload
- Social Features und Community

## 🏗️ Architektur

```
PassFit/
├── app/                          # Expo Router Pages
│   ├── (auth)/                   # Authentifizierung
│   │   ├── login.tsx            # Login mit E-Mail/Telefon
│   │   └── register.tsx         # Registrierung
│   ├── (tabs)/                  # Haupt-Navigation
│   │   ├── index.tsx            # Dashboard
│   │   ├── workouts.tsx         # Workouts
│   │   ├── progress.tsx         # Fortschritt
│   │   └── profile.tsx          # Profil
│   ├── _layout.tsx              # Root Layout
│   └── index.jsx                # Landing Page
├── src/
│   ├── components/              # UI Komponenten
│   │   ├── ui/                  # Basis UI (Button, Input, Card)
│   │   ├── forms/               # Form Komponenten
│   │   ├── layout/              # Layout Komponenten
│   │   └── features/            # Feature-spezifische Komponenten
│   ├── services/                # Business Logic & API
│   │   ├── api/                 # Service Layer
│   │   ├── firebase/            # Firebase Konfiguration
│   │   └── storage/             # Storage Utilities
│   ├── store/                   # State Management (Zustand)
│   │   ├── slices/              # State Slices
│   │   └── providers/           # Store Provider
│   ├── types/                   # TypeScript Definitionen
│   ├── utils/                   # Utility Functions
│   └── styles/                  # Theme System
└── assets/                      # Statische Assets
```

## 🛠️ Tech Stack

### Core Technologies
- **React Native** - Mobile App Framework
- **Expo** - Development Platform
- **TypeScript** - Type Safety
- **Expo Router** - File-based Navigation

### State Management
- **Zustand** - Lightweight State Management
- **AsyncStorage** - Persistent Storage

### Backend & Services
- **Firebase** - Authentication & Database
- **Firestore** - NoSQL Database
- **Firebase Auth** - Benutzerauthentifizierung

### Styling & UI
- **NativeWind** - Tailwind CSS für React Native
- **Custom Theme System** - Konsistente Design-Tokens

### Development Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript Strict Mode** - Maximale Type Safety

## 📱 Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn
- Expo CLI
- iOS Simulator (für iOS) oder Android Studio (für Android)

### 1. Repository klonen
```bash
git clone <repository-url>
cd PassFit
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Firebase konfigurieren
1. Erstelle ein Firebase-Projekt auf [Firebase Console](https://console.firebase.google.com)
2. Aktiviere Authentication (E-Mail/Passwort)
3. Erstelle eine Firestore-Datenbank
4. Kopiere die Firebase-Konfiguration
5. Erstelle eine `.env` Datei:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. App starten
```bash
# Entwicklungsserver starten
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## 🎯 Verwendung

### Login-System
- **E-Mail Login**: Benutzer können sich mit ihrer E-Mail-Adresse anmelden
- **Telefon Login**: Alternative Anmeldung mit Telefonnummer
- **Toggle-Auswahl**: Einfacher Wechsel zwischen E-Mail und Telefon
- **Index-Navigation**: Direkter Zugang zur Haupt-App ohne Anmeldung

### Navigation
- **Landing Page** (`/`): Willkommensseite mit Features-Übersicht
- **Login** (`/(auth)/login`): Anmeldeseite mit dualer Option
- **Registrierung** (`/(auth)/register`): Neue Benutzer registrieren
- **Dashboard** (`/(tabs)/`): Haupt-App mit Tab-Navigation

## 🏛️ Architektur-Prinzipien

### Clean Architecture
```
Presentation Layer (Components/Screens)
    ↓
Business Logic Layer (Services/Hooks)
    ↓
Data Layer (Firebase/API)
```

### Design Patterns
- **Repository Pattern** - Datenabstraktion
- **Service Layer** - Business Logic Trennung
- **Component Composition** - Wiederverwendbare UI
- **Type Safety** - Vollständige TypeScript Integration

### State Management
- **Zustand Slices** - Modulare State-Organisation
- **Persistent Storage** - AsyncStorage Integration
- **Optimistic Updates** - Bessere UX durch sofortige UI-Updates

## 🧪 Testing

```bash
# Unit Tests ausführen
npm test

# E2E Tests (wenn konfiguriert)
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### Production Build
```bash
# EAS Build (empfohlen)
eas build --platform all
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Code Style
- Verwende TypeScript für alle neuen Dateien
- Folge den ESLint-Regeln
- Schreibe aussagekräftige Commit-Messages
- Dokumentiere neue Features

## 📋 Roadmap

### Phase 1: Core Features
- [ ] Workout-System implementieren
- [ ] Dashboard mit Statistiken
- [ ] Profil-Management erweitern

### Phase 2: Erweiterte Features
- [ ] Progress Tracking mit Charts
- [ ] Social Features
- [ ] Offline-Unterstützung

### Phase 3: Premium Features
- [ ] Push-Benachrichtigungen
- [ ] Premium-Workouts
- [ ] Advanced Analytics

## 🐛 Bekannte Probleme

- **Web-Kompatibilität**: Eingeschränkt durch `react-native-maps` Dependency
- **iOS/Android**: Vollständig funktionsfähig

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Team

- **Entwicklung**: PassFit Development Team
- **Design**: UI/UX Team
- **Backend**: Firebase Integration

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue auf GitHub
- Kontaktiere das Development Team
- Siehe [Dokumentation](docs/) für detaillierte Anleitungen

## 🙏 Danksagungen

- Expo Team für die großartige Entwicklungsplattform
- Firebase für Backend-Services
- React Native Community für Inspiration und Support

---

**PassFit** - Entwickelt mit ❤️ für Fitness-Enthusiasten
