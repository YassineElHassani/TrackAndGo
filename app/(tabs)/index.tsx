import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track & Go</Text>
        <Text style={styles.subtitle}>Package Tracking Made Simple</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => router.push("/package/smart-scan")}
        >
          <Text style={styles.actionButtonIcon}>🔍</Text>
          <View style={styles.actionButtonContent}>
            <Text style={[styles.actionButtonTitle, styles.primaryButtonText]}>
              Smart Scan
            </Text>
            <Text
              style={[styles.actionButtonDescription, styles.primaryButtonText]}
            >
              AI-powered barcode scanning
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/package/scan")}
        >
          <Text style={styles.actionButtonIcon}>📷</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Quick Scan</Text>
            <Text style={styles.actionButtonDescription}>
              Fast barcode or QR code scanning
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/package/incident")}
        >
          <Text style={styles.actionButtonIcon}>⚠️</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Report Incident</Text>
            <Text style={styles.actionButtonDescription}>
              Document package issues
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/map")}
        >
          <Text style={styles.actionButtonIcon}>🗺️</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>View Map</Text>
            <Text style={styles.actionButtonDescription}>
              Track packages on map
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No recent scans</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap "Scan Package" to get started
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#fff",
  },
  actionButtonIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 3,
  },
  actionButtonDescription: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
  },
});
