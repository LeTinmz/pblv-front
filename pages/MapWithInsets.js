import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export const MapWithInsets = () => {
  const webref = useRef(null);
  const [webReady, setWebReady] = useState(false);
  const insets = useSafeAreaInsets();

  // Charge le fichier local: Expo -> require, Bare Android -> file:///android_asset/...
  const source =
    Platform.OS === "android"
      ? require("../assets/leaflet.html") // si Expo; sinon: { uri: "file:///android_asset/leaflet.html" }
      : require("../assets/leaflet.html");

  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      if (webReady) {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        sendToWeb("user_location", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (p) => {
            sendToWeb("user_location", {
              lat: p.coords.latitude,
              lng: p.coords.longitude,
              accuracy: p.coords.accuracy,
            });
          }
        );
      }
    })();

    return () => sub && sub.remove();
  }, [webReady]);

  const sendToWeb = (type, payload) => {
    webref.current?.postMessage(JSON.stringify({ type, ...payload }));
  };

  return (
    <View
      style={[
        styles.container,
        // On applique les insets ici au lieu d'un SafeAreaView
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <WebView
        ref={webref}
        originWhitelist={["*"]}
        source={source}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        geolocationEnabled={true}
        onLoadEnd={() => setWebReady(true)}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === "web_ready") setWebReady(true);
            if (msg.type === "request_location") {
              // relancer un getCurrentPosition si besoin
            }
          } catch {}
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
