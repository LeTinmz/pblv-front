import { React } from "react";
import { globalStyles } from "../utils/globalStyles";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";

export const HomePageButton = ({
  onPress = () => {
    Alert.alert("Bravo, tu sais cliquer ! (grosse merde)");
  },
  imgSrc = require("../assets/bin-icon.png"),
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image style={styles.image} source={imgSrc}></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
