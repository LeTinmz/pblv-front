import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  View,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const SignalForm = ({ navigation, route }) => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState();

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("bins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBins(response.data);
      } catch (error) {
        console.error("Error fetching bins:", error);
      }
    };
    fetchBins();
  }, []);

  useEffect(() => {
    if (route.params?.scannedBin) {
      setSelectedBin(route.params.scannedBin.id);
    }
  }, [route.params?.scannedBin]);

  const sendReport = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        "reports",
        { binId: selectedBin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Succès", "Report envoyé avec succès !", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      console.error("Error sending report:", error);
      Alert.alert("Erreur", "Échec de l'envoi du rapport.");
    }
  };

  const handleSendReport = () => {
    if (!selectedBin) {
      Alert.alert("Attention", "Veuillez sélectionner une poubelle.");
      return;
    }
    Alert.alert("Confirmation", "Envoyer ce rapport ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", onPress: sendReport },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Picker
        selectedValue={selectedBin}
        onValueChange={(itemValue) => setSelectedBin(itemValue)}
      >
        {bins.map((bin) => (
          <Picker.Item key={bin.id} label={bin.community} value={bin.id} />
        ))}
      </Picker>

      <View style={{ marginVertical: 10 }}>
        <Button
          title="Scan QR Code"
          onPress={() => navigation.navigate("Scan")}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button title="Envoyer" onPress={handleSendReport} />
      </View>

      {selectedBin && (
        <View style={{ marginTop: 20 }}>
          <Text>Bin sélectionné : {selectedBin}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});
