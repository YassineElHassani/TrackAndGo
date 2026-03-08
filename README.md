# Track&Go

**Track&Go** is a mobile solution for express delivery companies to manage the "last mile". In an industry where precision and traceability are vital, this application allows delivery drivers to manage their routes smoothly while providing indisputable proof of delivery via geolocation, barcode scanning, and photo captures.

## Acknowledgements

A massive thank you to the incredible development team who worked tirelessly to bring **Track&Go** to life. Your dedication to code quality, problem-solving, and collaboration made this project a success!

- **[Soulayman Jaafar]** - [@solixman](https://github.com/solixman)
- **[Smail Najim]** - [@Smailnajim](https://github.com/Smailnajim)
- **[Zakaria El Ouannasse]** - [@elouannasse](https://github.com/elouannasse)

## Key Features

- **Secure Authentication (US1)**: Secure login flow for delivery drivers to access their personal routes and local state persistence.
- **Interactive Dashboard (US2)**: Track the overall progress of the route, optimized with `FlatList` for massive dynamic data rendering.
- **Smart Scan Validation (US3)**: AI-powered barcode and QR code scanning via `expo-camera` to instantly verify package drops.
- **Geo-certified Proof (US4)**: Interactive Map tracking (`react-native-maps`) and automatic GPS coordinate capture (`expo-location`) upon delivery.
- **Complex Incident Management (US5)**: Report delivery exceptions (e.g., recipient absent, package damaged) with detailed forms and integrated photo capture.

## Technology Stack

- **Framework**: [React Native](https://reactnative.dev) & [Expo](https://expo.dev/)
- **Routing**: Expo Router (Hybrid file-based navigation flow)
- **Language**: TypeScript (Strict typing for robust data flow)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Hardware APIs**: `expo-camera`, `expo-location`
- **Visuals**: `react-native-maps`
- **Backend/API**: Dockerized Mock REST API (JSON-Server)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) & Docker Compose (for the mock API)
- [Expo Go](https://expo.dev/go) app on your physical device, or Android Studio / Xcode for emulators.

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Mock API (Backend)

The application consumes data from a containerized JSON server.

```bash
docker-compose up -d
```

> **Note**: The mock API defaults to port `3000`. By default, API calls point to the Android Emulator loopback `10.0.2.2:3000`. If you test on a physical device or iOS, update the `BASE_URL` in `services/api.ts` to your desktop's LAN IP address.

### 3. Run the Mobile App

```bash
npm run start:clean
```

In the terminal, you'll see a QR code. Scan it using **Expo Go** on your device, or press `a` to open the Android Emulator.

**(Test Credentials)**

- Email: `alice@trackandgo.com`
- Password: `password123`

## Project Structure

```text
TrackAndGo/
├── app/                  # File-based routing (Auth -> Tabs -> Nested Stacks)
├── components/           # Reusable UI components (Camera, BarcodeScanner, PackageCards)
├── constants/            # Theming and app constants
├── hooks/                # Custom React Hooks logic
├── mock/                 # db.json containing our remote source of truth
├── services/             # Three-tiered asynchronous API consumption logic
├── store/                # Global state management via Context Providers (Auth, Routes)
└── types/                # Strict TypeScript models and definitions
```

## CI/CD Pipeline

This project enforces high code quality through **GitHub Actions**. Upon every Pull Request or commit to the `main` branch, an automated workflow triggers to run:

- **Linting**: Runs ESLint to verify codebase standards and DRY principles.
- **Type-Checking**: Runs `npx tsc --noEmit` to strictly validate all TypeScript architectures and data structures.

---
