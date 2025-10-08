import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { HomePageButton } from "../components/HomePageButton";
import { useUserStore } from "../stores/userStore";
import { useState, useEffect } from "react";

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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        coucou depuis home, {user.username} ! Bio : {user?.bio || "Pas de bio"},
        gros fdp
      </Text>
      <View style={styles.buttonContainer}>
        <HomePageButton
          imgSrc={require("../assets/bin-icon.png")}
          onPress={() => navigation.navigate("Signalement")}
        />
        <HomePageButton
          imgSrc={require("../assets/location-icon.png")}
          onPress={() => navigation.navigate("Map")}
        />
        <HomePageButton imgSrc={require("../assets/calendar-icon.png")} />
        <HomePageButton
          imgSrc={require("../assets/user-icon.png")}
          onPress={() => navigation.navigate("Details")}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        <Text>Caméra</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 20,
        }}
      >
        {/* Changer les QRCode si rechargement du back */}
        <BinQRCode binId={"618d005c-f5f0-45c7-8ac8-533b2ce75eab"} />
        <BinQRCode binId={"75a23d79-3a7b-4d19-9420-f7bb4ae17039"} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
