import { CameraViewComponent } from "@/components/camera-view";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IncidentScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handlePhotoTaken = (uri: string) => {
    setCapturedPhoto(uri);
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <>
        <Stack.Screen options={{ title: "Capture Photo" }} />
        <CameraViewComponent
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Report Incident" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Report Package Incident</Text>

        {capturedPhoto ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: capturedPhoto }} style={styles.photo} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.buttonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Describe the incident:</Text>
          {/* Add form fields here */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
});
