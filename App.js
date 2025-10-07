import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterPage } from "./pages/RegisterPage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserDetails } from "./pages/UserDetails";
import { MapSimple } from "./components/MapSimple";
import { SignalForm } from "./pages/SignalForm";
import React from "react";
import ExpoCameraExample from "./components/ExpoCameraExample";
import QRCodeScan from "./components/QRCodeScan";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Signalement" component={SignalForm} />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{ title: "Inscription" }}
          />
          <Stack.Screen name="Details" component={UserDetails} />

          <Stack.Screen name="Map" component={MapSimple} />

          <Stack.Screen name="Camera" component={ExpoCameraExample} />
          <Stack.Screen name="Scan" component={QRCodeScan} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
