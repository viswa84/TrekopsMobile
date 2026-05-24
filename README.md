# TrekOps Mobile

Cross-platform mobile app for the TrekOps platform — built with Expo, React Native, NativeWind, and Apollo/GraphQL. Mirrors the web app (TrailDesk) and connects to the same backend (WhatsApp_ChatBot_Trek).

## Quick start

```bash
cd /Users/vishwanath/TrekOpsMobile
npm install
cp .env.example .env   # edit GraphQL/Socket/API URLs
npm run start          # then press i (iOS) or a (Android)
```

## Environment

`EXPO_PUBLIC_GRAPHQL_URL` — GraphQL endpoint (default `http://localhost:8080/graphql`)
`EXPO_PUBLIC_SOCKET_URL` — Socket.IO origin (default `http://localhost:8080`)
`EXPO_PUBLIC_API_BASE_URL` — REST base (used for uploads and PDF downloads)

On a real device, replace `localhost` with your dev machine's LAN IP so the phone can reach the server.

## Tech stack

- **Expo SDK 52** (managed) + **Expo Router** (file-based)
- **Apollo Client 4** + GraphQL — same queries as the web
- **NativeWind v4** (Tailwind for RN)
- **socket.io-client** — live WhatsApp messages, calls, departure updates
- **lucide-react-native** icons
- **react-native-gifted-charts** for dashboard charts
- **expo-secure-store** for JWT storage

## App structure

- `app/` — Expo Router routes (file-based navigation)
  - `index.jsx` — splash + auth gate
  - `auth/login.jsx` — staff & customer login
  - `(admin)/` — staff/admin tab navigator (Dashboard, Bookings, Departures, Chat, More)
  - `(customer)/` — end-user tab navigator (Treks, Bookings, Chat, Profile)
- `src/theme/` — design tokens (mirrors the web)
- `src/graphql/` — Apollo client + queries/mutations (1:1 with web)
- `src/context/` — Auth, Toast, Socket providers
- `src/components/ui/` — reusable primitives (Button, Card, Input, …)
