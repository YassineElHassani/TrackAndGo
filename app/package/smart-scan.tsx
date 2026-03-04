import { BarcodeScanner } from "@/components/barcode-scanner";
import {
  formatBarcodeType,
  useBarcodeScanner,
  validateBarcodeData,
} from "@/hooks/use-barcode-scanner";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SmartScanScreen() {
  const router = useRouter();
  const {
    result,
    error,
    scanHistory,
    handleScan,
    handleError,
    reset,
    clearHistory,
  } = useBarcodeScanner();

  const [showScanner, setShowScanner] = useState(true);

  const onBarcodeScanned = (data: string, type: string) => {
    // Validate barcode data
    if (!validateBarcodeData(data, type)) {
      handleError(`Invalid ${formatBarcodeType(type)} data format`);
      return;
    }

    // Process successful scan
    handleScan(data, type);

    // Optional: Automatically navigate to package details
    setTimeout(() => {
      router.push(`/package/${data}`);
    }, 1500);
  };

  const handleClose = () => {
    router.back();
  };

  const handleRescan = () => {
    reset();
    setShowScanner(true);
  };

  if (!showScanner && result) {
    return (
      <>
        <Stack.Screen options={{ title: "Scan Result" }} />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.resultContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>

            <Text style={styles.resultTitle}>Scan Successful!</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>
                  {formatBarcodeType(result.type)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data:</Text>
                <Text style={styles.infoValue}>{result.data}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Time:</Text>
                <Text style={styles.infoValue}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/package/${result.data}`)}
            >
              <Text style={styles.actionButtonText}>View Package Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleRescan}
            >
              <Text
                style={[styles.actionButtonText, styles.secondaryButtonText]}
              >
                Scan Another
              </Text>
            </TouchableOpacity>

            {scanHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Recent Scans</Text>
                {scanHistory.slice(0, 5).map((scan, index) => (
                  <TouchableOpacity
                    key={`${scan.data}-${scan.timestamp}`}
                    style={styles.historyItem}
                    onPress={() => router.push(`/package/${scan.data}`)}
                  >
                    <Text style={styles.historyType}>
                      {formatBarcodeType(scan.type)}
                    </Text>
                    <Text style={styles.historyData} numberOfLines={1}>
                      {scan.data}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Smart Scan" }} />
      <View style={styles.container}>
        <BarcodeScanner
          onBarcodeScanned={onBarcodeScanned}
          onClose={handleClose}
        />

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
    backgroundColor: "#f5f5f5",
    minHeight: "100%",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  successIconText: {
    fontSize: 50,
    color: "#fff",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  historySection: {
    marginTop: 30,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  historyItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  historyData: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  errorBanner: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
