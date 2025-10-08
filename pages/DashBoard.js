import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { HomePageButton } from "../components/HomePageButton";
import { useUserStore } from "../stores/userStore";
import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCurrentUser } from "../utils/fetchCurrentUser";

export const DashBoard = ({ navigation }) => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

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
      <Text style={styles.title}>coucou depuis home, {user.username}</Text>
      <View style={styles.buttonContainer}>
        <HomePageButton onPress={() => navigation.navigate("Signalement")} />
        <HomePageButton
          imgSrc={require("../assets/location-icon.png")}
          onPress={() => navigation.navigate("Map")}
        />
        <HomePageButton
          imgSrc={require("../assets/calendar-icon.png")}
          onPress={() => navigation.navigate("Calendar")}
        />
        <HomePageButton
          imgSrc={require("../assets/user-icon.png")}
          onPress={() => navigation.navigate("Details")}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        <Text>Caméra</Text>
      </TouchableOpacity>
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
