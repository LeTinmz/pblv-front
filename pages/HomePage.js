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
export const HomePage = ({ route }) => {
  const { userName } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        coucou depuis home, {userName} (fdp, nonobstant)
      </Text>
      <View style={styles.buttonContainer}>
        <HomePageButton />
        <HomePageButton imgSrc={require("../assets/location-icon.png")} />
        <HomePageButton imgSrc={require("../assets/ellipsis-icon.png")} />
        <HomePageButton />
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
    flexDirection: "row", // aligne les boutons horizontalement
    flexWrap: "wrap", // passe à la ligne suivante si espace insuffisant
    justifyContent: "space-between", // espace égal entre les boutons
  },
});
