import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRoute } from '@/store/route-context';
import type { Package } from '@/types';

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',    // Amber
  delivered: '#10B981',  // Green
  failed: '#EF4444',     // Red
};

export default function MapScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';
  const { packages } = useRoute();
  
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Initialize location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          setIsLoadingLocation(false);
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(initialLocation);

        // Optional: subscribe to background location for real tracking
        // (Keeping it simple for now, using initial location)
      } catch (err) {
        setLocationError('Failed to get location');
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  // Fit to markers once location & packages are ready
  const centerMapOnAllStops = () => {
    if (!mapRef.current) return;

    const coords = packages
      .filter((pkg) => pkg.coordinates)
      .map((pkg) => ({
        latitude: pkg.coordinates.latitude,
        longitude: pkg.coordinates.longitude,
      }));

    if (location) {
      coords.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    if (coords.length > 0) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (!isLoadingLocation) {
      // Small timeout to ensure map view has fully rendered
      setTimeout(centerMapOnAllStops, 800);
    }
  }, [isLoadingLocation, packages]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.tint }]}>
        <View>
          <Text style={styles.title}>Delivery Map</Text>
          <Text style={styles.subtitle}>Route Overview</Text>
        </View>
        <TouchableOpacity
          style={styles.recenterBtn}
          onPress={centerMapOnAllStops}
        >
          <Ionicons name="expand" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Map Content */}
      <View style={styles.mapContainer}>
        {isLoadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={c.tint} />
            <Text style={[styles.loadingText, { color: c.text }]}>Generating Map...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location?.coords.latitude ?? 48.8566, // Default to Paris if no location
              longitude: location?.coords.longitude ?? 2.3522,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            userInterfaceStyle={isDark ? 'dark' : 'light'}
          >
            {/* Driver Marker (Fallback if showsUserLocation fails or for debugging) */}
            {/* {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              >
                <View style={styles.driverMarker}>
                  <Ionicons name="car" size={16} color="#fff" />
                </View>
              </Marker>
            )} */}

            {/* Package Markers */}
            {packages.map((pkg) => {
              if (!pkg.coordinates) return null;
              
              const statusColor = STATUS_COLOR[pkg.status] || STATUS_COLOR.pending;
              
              return (
                <Marker
                  key={pkg.id}
                  coordinate={pkg.coordinates}
                >
                  <View style={[styles.pin, { backgroundColor: statusColor }]}>
                    <Ionicons 
                      name={pkg.status === 'delivered' ? 'checkmark' : pkg.status === 'failed' ? 'close' : 'cube'} 
                      size={16} 
                      color="#fff" 
                    />
                  </View>
                  <Callout tooltip onPress={() => router.push(`/package/${pkg.id}`)}>
                    <View style={[styles.calloutContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                      <Text style={[styles.calloutTitle, { color: isDark ? '#fff' : '#000' }]}>{pkg.recipientName}</Text>
                      <Text style={[styles.calloutAddress, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{pkg.address}</Text>
                      <Text style={[styles.calloutStatus, { color: statusColor }]}>
                        {pkg.status.toUpperCase()}
                      </Text>
                      <Text style={[styles.calloutAction, { color: c.tint }]}>View Details &rarr;</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        )}

        {/* Current stops overlay */}
        <View style={styles.overlayBottom}>
          <TouchableOpacity style={[styles.myLocationBtn, { backgroundColor: c.background }]} onPress={() => {
            if (location && mapRef.current) {
               mapRef.current.animateToRegion({
                 latitude: location.coords.latitude,
                 longitude: location.coords.longitude,
                 latitudeDelta: 0.01,
                 longitudeDelta: 0.01,
               });
            } else if (!location) {
               Alert.alert('Location unavailable', locationError || 'Make sure location services are enabled.');
            }
          }}>
             <Ionicons name="navigate" size={24} color={c.tint} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom List Panel (Kept the design, but simplified for bottom sheet feel) */}
      <View style={[styles.panel, { backgroundColor: isDark ? '#18212F' : '#fff', borderTopColor: c.border }]}>
        <View style={styles.panelHeader}>
          <Text style={[styles.panelTitle, { color: c.text }]}>Today's Stops ({packages.length})</Text>
        </View>
        
        {packages.slice(0, 3).map((pkg, idx) => (
          <TouchableOpacity 
            key={pkg.id} 
            style={[styles.stopRow, { borderBottomColor: isDark ? '#2D3A4A' : '#E5E7EB' }]}
            onPress={() => router.push(`/package/${pkg.id}`)}
          >
            <View style={[styles.stopIndex, { backgroundColor: STATUS_COLOR[pkg.status] ?? '#94A3B8' }]}>
              <Text style={styles.stopIndexText}>{idx + 1}</Text>
            </View>
            <View style={styles.stopInfo}>
              <Text style={[styles.stopName, { color: c.text }]}>{pkg.recipientName}</Text>
              <Text style={[styles.stopAddr, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={1}>{pkg.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>
        ))}
        {packages.length > 3 && (
          <View style={styles.moreWrap}>
             <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 13 }}>+{packages.length - 3} more stops mapped</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const panelShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  android: { elevation: 8 },
  default: {},
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
  recenterBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContainer: {
    width: 220,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 13,
    marginBottom: 6,
  },
  calloutStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  calloutAction: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    zIndex: 10,
  },
  myLocationBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    ...panelShadow,
  },
  panelHeader: {
    marginBottom: 12,
  },
  panelTitle: { fontSize: 16, fontWeight: '700' },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stopIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIndexText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  stopAddr: { fontSize: 13 },
  moreWrap: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 6,
  }
});
