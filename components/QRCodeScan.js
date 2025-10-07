import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QRCodeScan({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Alert
          title="Permission requise"
          message="L'accès à la caméra est nécessaire pour scanner les QR codes."
          onPress={requestPermission}
        />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      console.log("🔍 QR code scanné :", data);

      if (!data.startsWith("http://") && !data.startsWith("https://")) {
        Alert.alert(
          "QR Code invalide",
          "L’URL scannée n’est pas valide pour l’API."
        );
        return;
      }

      const token = await AsyncStorage.getItem("token");
      const response = await fetch(data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bin = await response.json();

      console.log("Données récupérées :", bin);

      Alert.alert(
        "Succès",
        `Poubelle trouvée : ${bin.community}`,
        [
          {
            text: "OK",
            onPress: () => {
              try {
                navigation.navigate("Signalement", { scannedBin: bin });
              } catch (err) {
                console.error("Erreur navigation :", err);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Erreur fetch :", error.message);
      Alert.alert(
        "Erreur",
        `Impossible de récupérer la poubelle depuis l'URL.\n\nURL scannée : ${data}`
      );
    } finally {
      setTimeout(() => {
        setScanned(false);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
