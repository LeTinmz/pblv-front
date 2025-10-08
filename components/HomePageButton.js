import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Platform,
  Alert,
} from "react-native";

export const HomePageButton = ({
  onPress = () =>
    Alert.alert(
      "Fonctionnalité à venir !",
      "Le calendrier des collectes sera bientôt disponible."
    ),
  imgSrc,
  label,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image style={styles.image} source={imgSrc} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: "#E0ECFF",
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
});
