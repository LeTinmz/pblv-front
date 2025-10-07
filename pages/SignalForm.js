import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Button, Alert } from "react-native";
// import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const SignalForm = ({ navigation }) => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState();

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("bins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBins(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBins();
  }, []);

  const sendReport = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        "reports",
        { binId: selectedBin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Succès", "Report sent successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error sending report:", error);
      Alert.alert("Erreur", "Failed to send report. Please try again.");
    }
  };

  const handleSendReport = () => {
    if (!selectedBin) {
      Alert.alert("Attention", "Veuillez sélectionner une poubelle.");
      return;
    }

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir envoyer ce rapport ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: sendReport },
      ]
    );
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
      <Button title="Envoyer" onPress={handleSendReport} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
