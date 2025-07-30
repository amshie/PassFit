# 🔄 Echtzeit Subscription Status - PassFit App

## 📋 Überblick

Diese Implementierung ermöglicht **Echtzeit-Updates** für den `subscriptionStatus` in der PassFit App. Änderungen am Firestore-Feld `subscriptionStatus` werden sofort in der gesamten App sichtbar, ohne dass Benutzer die App neu laden müssen.

## 🎯 Ziel erreicht

✅ **Echtzeit-Listener für subscriptionStatus im useUser-Hook implementiert**
- Änderungen von "free" → "active" → "expired" sind sofort sichtbar
- Keine manuellen Reloads mehr erforderlich
- Automatische Synchronisation zwischen Subscription und User-Dokument

## 🏗️ Architektur

### Firebase Firestore Struktur
```
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── subscriptionStatus: 'active' | 'free' | 'expired'  ← ECHTZEIT
└── ...andere Felder

subscriptions/{subscriptionId}
├── userId: string
├── status: 'active' | 'pending' | 'canceled' | 'expired'
├── startedAt: Timestamp
├── expiresAt: Timestamp
└── planId: string
```

## 🔧 Neue Hooks

### 1. `useUserRealtime(uid: string)`
**Vollständige User-Daten mit Echtzeit-Updates**

```typescript
import { useUserRealtime } from '../hooks';

function UserProfile({ uid }) {
  const { data: user, isLoading, error } = useUserRealtime(uid);
  
  // user.subscriptionStatus wird automatisch aktualisiert!
  return (
    <View>
      <Text>{user?.displayName}</Text>
      <Text>Status: {user?.subscriptionStatus}</Text>
    </View>
  );
}
```

### 2. `useUserSubscriptionStatus(uid: string)`
**Nur Subscription Status - Performance optimiert**

```typescript
import { useUserSubscriptionStatus } from '../hooks';

function SubscriptionBadge({ uid }) {
  const { data: subscriptionStatus } = useUserSubscriptionStatus(uid);
  
  const getColor = () => {
    switch (subscriptionStatus) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'free': return 'gray';
    }
  };
  
  return (
    <View style={{ backgroundColor: getColor() }}>
      <Text>{subscriptionStatus || 'free'}</Text>
    </View>
  );
}
```

## ⚡ Automatische Synchronisation

Das System synchronisiert automatisch zwischen `subscriptions` Collection und User `subscriptionStatus`:

| Aktion | Subscription Status | User subscriptionStatus |
|--------|-------------------|------------------------|
| Abo erstellt | `active` | `active` |
| Abo abgelaufen | `expired` | `expired` |
| Abo gekündigt | `canceled` | `free` |
| Abo ausstehend | `pending` | `free` |

### Beispiel: Subscription Status ändern
```typescript
// Wenn sich der Subscription Status ändert...
const updateStatus = useUpdateSubscriptionStatus();

updateStatus.mutate({
  subscriptionId: 'sub_123',
  status: 'active'  // ← Ändert automatisch auch user.subscriptionStatus
});

// → User-Dokument wird automatisch auf 'active' gesetzt
// → Alle Komponenten mit useUserRealtime/useUserSubscriptionStatus 
//   zeigen sofort den neuen Status an!
```

## 🎨 Profile-Seite Integration

Die Profile-Seite (`app/(tabs)/profile.tsx`) wurde aktualisiert:

**Vorher:**
```typescript
// Verwendete useActiveUserSubscription (nicht Echtzeit)
const { data: activeSubscription } = useActiveUserSubscription(uid);

const getMembershipStatusText = () => {
  if (!activeSubscription) return 'Kein aktives Abo';
  // ...
};
```

**Nachher:**
```typescript
// Verwendet useUserSubscriptionStatus (Echtzeit!)
const { data: subscriptionStatus } = useUserSubscriptionStatus(uid);

const getMembershipStatusText = () => {
  switch (subscriptionStatus) {
    case 'active': return 'Aktives Mitglied';
    case 'expired': return 'Mitgliedschaft abgelaufen';
    case 'free': return 'Kostenlose Mitgliedschaft';
  }
};
```

## 🔄 Echtzeit-Demo

### Test-Szenario:
1. **Öffne die App in 2 Browser-Tabs**
2. **Tab 1**: Zeigt "Kostenlose Mitgliedschaft"
3. **Tab 2**: Ändere Subscription Status auf "active"
4. **Tab 1**: Zeigt sofort "Aktives Mitglied" ✨

### Test-Komponente verwenden:
```typescript
import { RealtimeSubscriptionTest } from '../components/test/RealtimeSubscriptionTest';

<RealtimeSubscriptionTest 
  uid="user123" 
  subscriptionId="sub456" 
/>
```

## 📁 Geänderte Dateien

### Core Implementation:
- **`src/services/firebase/userService.ts`** - Echtzeit-Listener Funktionen
- **`src/hooks/useUser.ts`** - Neue Echtzeit-Hooks
- **`src/hooks/useSubscription.ts`** - Automatische Synchronisation

### UI Integration:
- **`app/(tabs)/profile.tsx`** - Profile-Seite mit Echtzeit-Updates

### Documentation & Testing:
- **`REALTIME_SUBSCRIPTION_IMPLEMENTATION.md`** - Technische Dokumentation
- **`src/components/test/RealtimeSubscriptionTest.tsx`** - Test-Komponente

## 🚀 Migration Guide

### Bestehende Komponenten aktualisieren:

**Alt (ohne Echtzeit):**
```typescript
const { data: user } = useUser(uid);
```

**Neu (mit Echtzeit):**
```typescript
const { data: user } = useUserRealtime(uid);
```

**Nur Status benötigt (Performance optimiert):**
```typescript
const { data: subscriptionStatus } = useUserSubscriptionStatus(uid);
```

## 🔧 Technische Details

### Firestore Listener
- **`onSnapshot()`** für Echtzeit-Updates
- **Automatisches Cleanup** beim Component Unmount
- **Fehlerbehandlung** mit Fallback auf Cache

### React Query Integration
- **Manuelle Cache-Updates** für sofortige UI-Reaktion
- **`staleTime: Infinity`** für Echtzeit-Queries
- **Kompatibel** mit allen bestehenden Features

### Performance Optimierungen
- **Separate Hooks** für verschiedene Use Cases
- **Effiziente Listener-Cleanup**
- **Minimale Re-renders** durch gezieltes Caching

## ⚠️ Wichtige Hinweise

### Funktioniert nur mit:
- ✅ Echten Firebase-Instanzen (nicht Mocks)
- ✅ Aktiver Netzwerkverbindung
- ✅ Gültigen User IDs

### Automatisches Cleanup:
- 🔄 Listener werden beim Component Unmount beendet
- 🔄 Keine Memory Leaks
- 🔄 Effiziente Ressourcennutzung

## 🎉 Ergebnis

**Mission erfüllt!** 🎯

Die PassFit App zeigt jetzt **sofort** alle Änderungen am `subscriptionStatus` an:
- ✅ Profile-Seite zeigt Echtzeit-Status
- ✅ Keine manuellen Reloads erforderlich  
- ✅ Automatische Synchronisation zwischen Collections
- ✅ Performance optimiert
- ✅ Vollständig rückwärtskompatibel

**Benutzer sehen Subscription-Änderungen in Echtzeit - genau wie gewünscht!** ⚡
