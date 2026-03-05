import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BarcodeScannerProps {
  onBarcodeScanned?: (data: string, type: string) => void;
  onClose?: () => void;
  expectedFormat?: string;
  showManualInput?: boolean;
}

export function BarcodeScanner({
  onBarcodeScanned,
  onClose,
  expectedFormat,
  showManualInput = false,
}: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scanResult) {
      // Fade in animation for result
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (scanResult.type === "success") {
          setScanResult(null);
        }
      });
    }
  }, [scanResult]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need your permission to scan barcodes
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned || isProcessing) return;

    setIsProcessing(true);
    setScanned(true);

    const { data, type } = result;

    // Validate barcode format if specified
    if (expectedFormat && type !== expectedFormat) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Scale animation for error
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setScanResult({
        type: "error",
        message: `Invalid barcode format. Expected ${expectedFormat}, got ${type}`,
      });

      setTimeout(() => {
        setScanned(false);
        setIsProcessing(false);
        setScanResult(null);
      }, 3000);
      return;
    }

    // Validate barcode data
    if (!data || data.trim().length === 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setScanResult({
        type: "error",
        message: "Invalid barcode: No data found",
      });

      setTimeout(() => {
        setScanned(false);
        setIsProcessing(false);
        setScanResult(null);
      }, 3000);
      return;
    }

    // Success feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setScanResult({
      type: "success",
      message: `Scanned: ${data}`,
    });

    if (onBarcodeScanned) {
      onBarcodeScanned(data, type);
    }

    // Auto-reset after success
    setTimeout(() => {
      setScanned(false);
      setIsProcessing(false);
    }, 1500);
  };

  const resetScanner = () => {
    setScanned(false);
    setIsProcessing(false);
    setScanResult(null);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "aztec",
            "ean13",
            "ean8",
            "qr",
            "pdf417",
            "upc_e",
            "datamatrix",
            "code39",
            "code93",
            "itf14",
            "codabar",
            "code128",
            "upc_a",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Scanning frame */}
          <View style={styles.scanningBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {scanned && (
              <View style={styles.scannedOverlay}>
                <Text style={styles.scannedText}>✓</Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>
              {scanned
                ? "Processing..."
                : "Align barcode within the frame to scan"}
            </Text>
            {expectedFormat && (
              <Text style={styles.formatHint}>
                Expected format: {expectedFormat}
              </Text>
            )}
          </View>

          {/* Result feedback */}
          {scanResult && (
            <Animated.View
              style={[
                styles.resultContainer,
                scanResult.type === "success"
                  ? styles.successContainer
                  : styles.errorContainer,
                { opacity: fadeAnim },
              ]}
            >
              <Text style={styles.resultText}>{scanResult.message}</Text>
            </Animated.View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            {scanned && (
              <TouchableOpacity style={styles.button} onPress={resetScanner}>
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
            {onClose && (
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  scanningBox: {
    width: 250,
    height: 250,
    position: "relative",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scannedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 255, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  scannedText: {
    fontSize: 80,
    color: "#fff",
    fontWeight: "bold",
  },
  instructionsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    maxWidth: "80%",
  },
  instructions: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  formatHint: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  resultContainer: {
    position: "absolute",
    top: "45%",
    left: "10%",
    right: "10%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  successContainer: {
    backgroundColor: "rgba(0, 200, 0, 0.9)",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.9)",
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(0, 122, 255, 0.9)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "rgba(128, 128, 128, 0.9)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
