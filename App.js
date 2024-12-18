import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [openCamera, setOpenCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  if (!permission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera and save photos
        </Text>
        <Button
          onPress={() => {
            requestPermission();
            requestMediaLibraryPermission();
          }}
          title="Grant Permission"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function capturePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setOpenCamera(false);
    }
  }

  async function savePhoto() {
    if (photoUri) {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      Alert.alert("Photo saved!", "Your photo has been saved to your device.");
      setPhotoUri(null);
    }
  }

  return (
    <View style={styles.container}>
      {!openCamera ? (
        <View style={styles.container2}>
          <Text style={styles.text2}>Name: Juan Dela Cruz</Text>
          <Text style={styles.text2}>Age: 30</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setOpenCamera(true)}
          >
            <Text style={styles.text}>Open Camera</Text>
          </TouchableOpacity>
          {photoUri && (
            <>
              <Image source={{ uri: photoUri }} style={styles.capturedPhoto} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={savePhoto}>
                  <Text style={styles.text}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setPhotoUri(null)}
                >
                  <Text style={styles.text}>No</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.cameraText}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={capturePhoto}
            >
              <Text style={styles.cameraText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setOpenCamera(false)}
            >
              <Text style={styles.cameraText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  container2: {
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },
  cameraButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
  },
  cameraText: {
    fontSize: 16,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  text2: {
    textAlign: "left",
  },
  capturedPhoto: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
