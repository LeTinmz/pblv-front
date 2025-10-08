import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const SignalForm = ({ navigation, route }) => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState();
  const [loading, setLoading] = useState(true);

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
        Alert.alert("Erreur", "Impossible de récupérer les poubelles.");
      } finally {
        setLoading(false);
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
      Alert.alert("✅ Succès", "Le rapport a bien été envoyé !", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            }),
        },
      ]);
    } catch (error) {
      console.error("Error sending report:", error);
      Alert.alert("❌ Erreur", "Échec de l'envoi du rapport.");
    }
  };

  const handleSendReport = () => {
    if (!selectedBin) {
      Alert.alert("⚠️ Attention", "Veuillez sélectionner une poubelle.");
      return;
    }
    Alert.alert("Confirmation", "Souhaitez-vous envoyer ce rapport ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", onPress: sendReport },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Chargement des poubelles...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Nouveau signalement</Text>
      <Text style={styles.subtitle}>Choisissez une poubelle concernée :</Text>

      <View style={styles.card}>
        <Picker
          selectedValue={selectedBin}
          onValueChange={(itemValue) => setSelectedBin(itemValue)}
          style={styles.picker}
          dropdownIconColor="#007BFF"
        >
          <Picker.Item label="Sélectionnez une poubelle..." value={null} />
          {bins.map((bin) => (
            <Picker.Item key={bin.id} label={bin.community} value={bin.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={styles.secondaryButtonText}>📷 Scanner un QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSendReport}
        disabled={!selectedBin}
      >
        <Text style={styles.primaryButtonText}>🚀 Envoyer le rapport</Text>
      </TouchableOpacity>

      {selectedBin && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Poubelle sélectionnée :{" "}
            <Text style={styles.infoHighlight}>{selectedBin}</Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    color: "#475569",
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  picker: {
    color: "#1E293B",
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#E0ECFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: "#007BFF",
    fontWeight: "600",
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: "#E0ECFF",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  infoText: {
    color: "#1E293B",
    fontSize: 15,
  },
  infoHighlight: {
    color: "#007BFF",
    fontWeight: "600",
  },
});
