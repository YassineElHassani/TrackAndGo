import { BarcodeScanner } from "@/components/barcode-scanner";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRoute } from '@/store/route-context';
import { updatePackageStatus } from '@/services/package.service';
import * as Location from 'expo-location';

import {
  formatBarcodeType,
  useBarcodeScanner,
  validateBarcodeData,
} from "@/hooks/use-barcode-scanner";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SmartScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ packageId?: string }>();
  const expectedPackageId = params.packageId;

  const { packages, updatePackageStatus: updateContextStatus } = useRoute();
  
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const isDark = scheme === 'dark';

  const {
    result,
    error,
    scanHistory,
    handleScan,
    handleError,
    reset,
  } = useBarcodeScanner();

  const [showScanner, setShowScanner] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const onBarcodeScanned = async (data: string, type: string) => {
    // Basic format validation
    if (!validateBarcodeData(data, type)) {
      handleError(`Invalid ${formatBarcodeType(type)} data format`);
      return;
    }

    setShowScanner(false);
    setIsValidating(true);

    // Business Logic: Identify package by barcode or match with expected
    let foundPackage = packages.find(p => p.barcode === data || p.trackingNumber === data);
    
    // Fallback: maybe the expected package was scanned but the data perfectly matched ID 
    if (!foundPackage && expectedPackageId) {
       const exp = packages.find(p => p.id === expectedPackageId);
       if (exp && (exp.barcode === data || exp.trackingNumber === data || data === expectedPackageId)) {
          foundPackage = exp;
       }
    }

    if (expectedPackageId) {
       // Validate against expected
       if (foundPackage?.id !== expectedPackageId) {
          Alert.alert("Incorrect Package", "This barcode does not match the expected package.", [
            { text: "Try Again", onPress: () => { setShowScanner(true); setIsValidating(false); reset(); }}
          ]);
          return;
       }
    }

    if (foundPackage) {
       handleScan(data, type);
       
       // Success! Retrieve Location (US4)
       let coords = undefined;
       try {
         const { status } = await Location.requestForegroundPermissionsAsync();
         if (status === 'granted') {
           const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
           coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
         }
       } catch (err) {
         console.warn("Could not fetch location for proof of delivery", err);
       }

       try {
         // Update Remote API
         const now = new Date().toISOString();
         await updatePackageStatus(foundPackage.id, 'delivered', {
            deliveredAt: now,
            proofCoordinates: coords
         });
         // Update Local Context
         updateContextStatus(foundPackage.id, 'delivered', { 
            deliveredAt: now, 
            proofCoordinates: coords 
         });
         
         setIsValidating(false);
       } catch (err) {
         Alert.alert("Network Error", "Could not mark package as delivered.");
         setIsValidating(false);
       }
       
    } else {
       Alert.alert("Unrecognized Barcode", "This package is not in your route.", [
         { text: "Dismiss", onPress: () => { setShowScanner(true); setIsValidating(false); reset(); }}
       ]);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleRescan = () => {
    reset();
    setShowScanner(true);
  };

  if (!showScanner && isValidating) {
     return (
       <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={c.tint} />
          <Text style={{ color: c.text, marginTop: 16, fontSize: 16 }}>Validating delivery...</Text>
       </View>
     );
  }

  if (!showScanner && result) {
    const pkg = packages.find(p => p.barcode === result.data || p.trackingNumber === result.data || p.id === expectedPackageId);
    
    return (
      <>
        <Stack.Screen options={{ title: "Scan Complete", headerStyle: { backgroundColor: c.background }, headerTintColor: c.text }} />
        <View style={[styles.container, { backgroundColor: c.background }]}>
          <ScrollView contentContainerStyle={styles.resultContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={50} color="#fff" />
            </View>

            <Text style={[styles.resultTitle, { color: c.text }]}>Delivery Confirmed!</Text>

            {pkg && (
              <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#fff' }]}>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#374151' : '#f0f0f0' }]}>
                  <Text style={[styles.infoLabel, { color: c.icon }]}>Recipient:</Text>
                  <Text style={[styles.infoValue, { color: c.text }]}>{pkg.recipientName}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#374151' : '#f0f0f0' }]}>
                  <Text style={[styles.infoLabel, { color: c.icon }]}>Address:</Text>
                  <Text style={[styles.infoValue, { color: c.text }]} numberOfLines={2}>{pkg.address}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: isDark ? '#374151' : '#f0f0f0' }]}>
                  <Text style={[styles.infoLabel, { color: c.icon }]}>Tracking:</Text>
                  <Text style={[styles.infoValue, { color: c.text }]}>{pkg.trackingNumber}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomColor: 'transparent', paddingBottom: 0, marginBottom: 0 }]}>
                  <Text style={[styles.infoLabel, { color: c.icon }]}>GPS Recorded:</Text>
                  <Text style={[styles.infoValue, { color: c.text }]}>Yes</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: c.tint }]} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.actionButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>

            {!expectedPackageId && (
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton, { borderColor: c.tint, backgroundColor: 'transparent' }]} onPress={handleRescan}>
                <Text style={[styles.actionButtonText, { color: c.tint }]}>Scan Another Package</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: expectedPackageId ? "Verify Package" : "Smart Scan", headerTransparent: true, headerTintColor: '#fff', headerBackTitleVisible: false }} />
      <View style={styles.container}>
        <BarcodeScanner
          onBarcodeScanned={onBarcodeScanned}
          onClose={handleClose}
        />
        {expectedPackageId && showScanner && (
          <View style={styles.targetBanner}>
             <Text style={styles.targetBannerText}>
               Please scan barcode to confirm delivery
             </Text>
          </View>
        )}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>❌ {error.message}</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    padding: 20,
    minHeight: "100%",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 2,
  },
  targetBanner: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 12,
  },
  targetBannerText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: 'bold',
  },
  errorBanner: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
  },
  errorText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: '600'
  },
});
