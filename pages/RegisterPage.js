import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
} from "react-native";

import api from "../utils/api";

export const RegisterPage = ({ navigation }) => {
	const [formData, setFormData] = useState({
		firstName: "Test",
		lastName: "testLastName",
		userName: "testUserName",
		mail: "test@test.com",
		phone: "0675753231",
		password: "@RaD1z%HgSn76MzJ",
		confirmPassword: "@RaD1z%HgSn76MzJ",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "Le prénom est requis";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Le nom est requis";
		}

		if (!formData.userName.trim()) {
			newErrors.userName = "un pseudo est requis";
		}

		if (!formData.mail.trim()) {
			newErrors.mail = "L'email est requis";
		} else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
			newErrors.mail = "Format d'email invalide";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Le téléphone est requis";
		} else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
			newErrors.phone = "Format de téléphone invalide";
		}

		if (!formData.password) {
			newErrors.password = "Le mot de passe est requis";
		} else if (formData.password.length < 8) {
			newErrors.password =
				"Le mot de passe doit contenir au moins 8 caractères";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirmez votre mot de passe";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await api.post("auth/register", {
				firstName: formData.firstName,
				lastName: formData.lastName,
				mail: formData.mail,
				//phone: formData.phone,
				password: formData.password,
				username: formData.userName,
			});
			Alert.alert(
				"Succès",
				"Inscription réussie ! Vous pouvez vous connecter."
			);
			navigation.navigate("Login");

			// Reset du formulaire
			setFormData({
				firstName: "",
				lastName: "",
				mail: "",
				phone: "",
				password: "",
				confirmPassword: "",
        userName: "",
			});
		} catch (error) {
			Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.header}>
						<Text style={styles.title}>Créer un compte</Text>
						<Text style={styles.subtitle}>Rejoignez-nous aujourd'hui</Text>
					</View>

					<View style={styles.form}>

            <View style={styles.inputGroup}>
							<Text style={styles.label}>Pseudo *</Text>
							<TextInput
								style={[styles.input, errors.userNameName && styles.inputError]}
								value={formData.userName}
								onChangeText={(value) => handleInputChange("userName", value)}
								placeholder="votre pseudo"
								autoCapitalize="words"
							/>
							{errors.firstName && (
								<Text style={styles.errorText}>{errors.userName}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Prénom *</Text>
							<TextInput
								style={[styles.input, errors.firstName && styles.inputError]}
								value={formData.firstName}
								onChangeText={(value) => handleInputChange("firstName", value)}
								placeholder="Votre prénom"
								autoCapitalize="words"
							/>
							{errors.firstName && (
								<Text style={styles.errorText}>{errors.firstName}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Nom *</Text>
							<TextInput
								style={[styles.input, errors.lastName && styles.inputError]}
								value={formData.lastName}
								onChangeText={(value) => handleInputChange("lastName", value)}
								placeholder="Votre nom"
								autoCapitalize="words"
							/>
							{errors.lastName && (
								<Text style={styles.errorText}>{errors.lastName}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Email *</Text>
							<TextInput
								style={[styles.input, errors.mail && styles.inputError]}
								value={formData.mail}
								onChangeText={(value) => handleInputChange("mail", value)}
								placeholder="votre@email.com"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>
							{errors.mail && (
								<Text style={styles.errorText}>{errors.mail}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Téléphone *</Text>
							<TextInput
								style={[styles.input, errors.phone && styles.inputError]}
								value={formData.phone}
								onChangeText={(value) => handleInputChange("phone", value)}
								placeholder="06 12 34 56 78"
								keyboardType="phone-pad"
							/>
							{errors.phone && (
								<Text style={styles.errorText}>{errors.phone}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Mot de passe *</Text>
							<TextInput
								style={[styles.input, errors.password && styles.inputError]}
								value={formData.password}
								onChangeText={(value) => handleInputChange("password", value)}
								placeholder="Minimum 8 caractères"
								secureTextEntry
							/>
							{errors.password && (
								<Text style={styles.errorText}>{errors.password}</Text>
							)}
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>Confirmer le mot de passe *</Text>
							<TextInput
								style={[
									styles.input,
									errors.confirmPassword && styles.inputError,
								]}
								value={formData.confirmPassword}
								onChangeText={(value) =>
									handleInputChange("confirmPassword", value)
								}
								placeholder="Retapez votre mot de passe"
								secureTextEntry
							/>
							{errors.confirmPassword && (
								<Text style={styles.errorText}>{errors.confirmPassword}</Text>
							)}
						</View>

						<TouchableOpacity
							style={[
								styles.registerButton,
								isLoading && styles.buttonDisabled,
							]}
							onPress={handleRegister}
							disabled={isLoading}
						>
							<Text style={styles.registerButtonText}>
								{isLoading ? "Inscription en cours..." : "S'inscrire"}
							</Text>
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Déjà un compte ? </Text>
							<TouchableOpacity onPress={() => navigation.navigate("Login")}>
								<Text style={styles.linkText}>Se connecter</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContent: {
		flexGrow: 1,
		padding: 20,
		justifyContent: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#2c3e50",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#7f8c8d",
		textAlign: "center",
	},
	form: {
		backgroundColor: "white",
		borderRadius: 12,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2c3e50",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#e1e8ed",
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		backgroundColor: "#f8f9fa",
	},
	inputError: {
		borderColor: "#e74c3c",
		backgroundColor: "#fdf2f2",
	},
	errorText: {
		color: "#e74c3c",
		fontSize: 14,
		marginTop: 4,
		marginLeft: 4,
	},
	registerButton: {
		backgroundColor: "#3498db",
		borderRadius: 8,
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 10,
		shadowColor: "#3498db",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	buttonDisabled: {
		backgroundColor: "#bdc3c7",
		shadowOpacity: 0,
		elevation: 0,
	},
	registerButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
	},
	footerText: {
		fontSize: 16,
		color: "#7f8c8d",
	},
	linkText: {
		fontSize: 16,
		color: "#3498db",
		fontWeight: "600",
	},
});
