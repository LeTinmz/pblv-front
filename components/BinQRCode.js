import React from "react";
import { View, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function BinQRCode({ binId }) {
  const apiUrl = `http://192.168.1.55:8080/api/bins/${binId}`;

  return (
    <View style={styles.container}>
      <Text>QR Code pour la poubelle {binId}</Text>
      <QRCode value={apiUrl} size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
