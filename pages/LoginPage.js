import React from "react";
import { globalStyles } from "../utils/globalStyles";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { GoNextButton } from "../components/GoNextButton";

export const LoginPage = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text style={globalStyles.title}>Coucou bg !</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <GoNextButton label="Login" onPress={() => navigation.navigate("Home")} />
      <GoNextButton
        label="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
    textAlign: "center",
  },
});

export default LoginPage;
