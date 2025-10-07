import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import api from "../utils/api";

export default function QRCodeScan({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Alert title="Permission requise" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      if (!data.startsWith("http://") && !data.startsWith("https://")) {
        Alert.alert(
          "QR Code invalide",
          "L’URL scannée n’est pas valide pour l’API."
        );
        setScanned(false);
        return;
      }

      const response = await fetch(data);
      if (!response.ok) throw new Error("Network response was not ok");

      const bin = await response.json();
      Alert.alert("Succès", `Poubelle trouvée: ${bin.community}`);
      navigation.navigate("SignalForm", { scannedBin: bin });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de récupérer la poubelle depuis l'URL");
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
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
});
