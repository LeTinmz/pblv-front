import React, { useState } from "react";
import { globalStyles } from "../utils/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import api from "../utils/api";

export const LoginPage = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
    console.log(email, password);
  try {
    
    const response = await api.post("auth/login", {
      mail: email,
      password: password,
    });

    const token = response.data.data.token;
    await AsyncStorage.setItem("token", token);

    Alert.alert("Connexion réussie ✅", `Token : ${token}`);
    
    // navigation vers la page suivante
    navigation.navigate("Home");

  } catch (error) {
    console.error(error);
    Alert.alert("Erreur ❌", "Identifiants invalides ou problème serveur");
  }
};

	return (
		<SafeAreaView>
			<Text style={globalStyles.title}>Coucou bg !</Text>
			<TextInput
				style={styles.input}
				placeholder="Username"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				secureTextEntry={true}
			/>
			<GoNextButton label="Login" onPress={handleLogin} />
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
