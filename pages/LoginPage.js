import React, { useRef, useState } from "react";
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
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.navigate("Home", { userName });
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.title}>Coucou bg !</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <GoNextButton label="Login" onPress={handleLogin} />
      <Text style={globalStyles.lightText}>Pas encore de compte ?</Text>
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
