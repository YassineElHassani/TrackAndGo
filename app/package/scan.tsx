import { BarcodeScanner } from "@/components/barcode-scanner";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const router = useRouter();
  const [lastScanned, setLastScanned] = useState<{
    data: string;
    type: string;
  } | null>(null);

  const handleBarcodeScanned = (data: string, type: string) => {
    setLastScanned({ data, type });

    // Show success alert with options
    Alert.alert(
      "Barcode Scanned",
      `Type: ${type}\nData: ${data}\n\nWhat would you like to do?`,
      [
        {
          text: "View Package",
          onPress: () => {
            router.push(`/package/${data}`);
          },
        },
        {
          text: "Scan Another",
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Scan Package",
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <BarcodeScanner
          onBarcodeScanned={handleBarcodeScanned}
          onClose={handleClose}
        />

        {lastScanned && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Last scanned: {lastScanned.data}
            </Text>
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
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
