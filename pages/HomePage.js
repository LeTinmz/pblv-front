import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { HomePageButton } from "../components/HomePageButton";
import { useUserStore } from "../stores/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BinQRCode from "../components/BinQRCode";
import { fetchCurrentUser } from "../services/fetchCurrentUser";

export const HomePage = ({ navigation }) => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const userData = await fetchCurrentUser();
          if (userData) {
            setUser(userData);
            await AsyncStorage.setItem("user", JSON.stringify(userData));
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["token", "user"]);
            useUserStore.getState().clearUser();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, color: "#555" }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          👋 Salut, <Text style={styles.username}>{user?.username}</Text> !
        </Text>
        <Text style={styles.subtitle}>Citoyenne-moi tout là dedans, bbey</Text>

        <View style={styles.buttonGrid}>
          <HomePageButton
            imgSrc={require("../assets/bin-icon.png")}
            label="Signaler"
            onPress={() => navigation.navigate("Signalement")}
          />
          <HomePageButton
            imgSrc={require("../assets/location-icon.png")}
            label="Carte"
            onPress={() => navigation.navigate("Map")}
          />
          <HomePageButton
            imgSrc={require("../assets/calendar-icon.png")}
            label="Calendrier"
          />
          <HomePageButton
            imgSrc={require("../assets/user-icon.png")}
            label="Profil"
            onPress={() => navigation.navigate("Details")}
          />
        </View>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.cameraText}>📸 Ouvrir la caméra</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Déconnexion</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          © 2025 PoubelleLaVie • Tous droits réservés
        </Text>
      </ScrollView>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 5,
  },
  username: {
    color: "#007BFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cameraButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cameraText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#E0ECFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 30,
  },
});
