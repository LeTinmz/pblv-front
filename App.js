import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterPage } from "./pages/RegisterPage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserDetails } from "./pages/UserDetails";
import { MapWithInsets } from "./pages/MapWithInsets";
import React from "react";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{ title: "Inscription" }}
          />
          <Stack.Screen name="Details" component={UserDetails} />
          <Stack.Screen name="Map" component={MapWithInsets} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
