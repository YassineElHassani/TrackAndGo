import { Redirect } from 'expo-router';

// This file exists only to satisfy Expo Router's file-based routing.
// The actual splash screen is handled natively by expo-splash-screen.
export default function SplashRedirect() {
  return <Redirect href="/(tabs)" />;
}
