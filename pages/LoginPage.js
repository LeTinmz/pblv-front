import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCurrentUser } from "../services/fetchCurrentUser";
import { useUserStore } from "../stores/userStore";
import api from "../utils/api";

export const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("admin@poubellelavie.fr");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Attention", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("auth/login", {
        mail: email,
        password: password,
      });

      const token = response.data.data.token;
      await AsyncStorage.setItem("token", token);

      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        Alert.alert("Connexion réussie", `Bienvenue, ${userData.username} !`);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert(
          "Connexion réussie, mais impossible de récupérer les infos utilisateur."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Identifiants invalides ou problème serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenue sur PoubelleLaVie</Text>
          <Text style={styles.subtitle}>
            Connecte-toi pour continuer ton aventure éco-citoyenne 🌿
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#94A3B8"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#94A3B8"
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.primaryButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.secondaryButtonText}>Créer un compte</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.footerText}>
          © 2025 PoubelleLaVie • Tous droits réservés
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 15,
    color: "#1E293B",
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#E0ECFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#007BFF",
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 30,
  },
});

export default LoginPage;
