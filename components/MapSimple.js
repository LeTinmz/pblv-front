import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapData } from "../hooks/useMapData";

export const MapSimple = () => {
  const webref = useRef(null);
  const [webReady, setWebReady] = useState(false);
  const [showCenters, setShowCenters] = useState(true);
  const [showBins, setShowBins] = useState(true);
  const insets = useSafeAreaInsets();

  // Utiliser le hook pour gérer les données
  const { centers, bins, loading, error, stats, refresh } = useMapData({
    autoLoad: false,
  });

  const source =
    Platform.OS === "android"
      ? require("../assets/leaflet.html")
      : require("../assets/leaflet.html");

  // Charger les données quand la WebView est prête
  useEffect(() => {
    if (webReady) {
      refresh();
    }
  }, [webReady]);

  // Envoyer les centres à la WebView
  useEffect(() => {
    if (webReady && centers.length > 0) {
      sendToWeb("collect_centers", { centers });
    }
  }, [webReady, centers]);

  // Envoyer les bins à la WebView
  useEffect(() => {
    if (webReady && bins.length > 0) {
      sendToWeb("bins", { bins });
    }
  }, [webReady, bins]);

  // Gérer la localisation
  useEffect(() => {
    let subscription;

    const setupLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        if (webReady) {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          sendToWeb("user_location", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });

          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 5000,
              distanceInterval: 10,
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
      } catch (err) {
        console.error("Erreur localisation:", err);
      }
    };

    setupLocation();
    return () => subscription?.remove();
  }, [webReady]);

  // Gestion des filtres
  const toggleCenters = () => {
    const newValue = !showCenters;
    setShowCenters(newValue);
    sendToWeb("toggle_centers", { show: newValue });
  };

  const toggleBins = () => {
    const newValue = !showBins;
    setShowBins(newValue);
    sendToWeb("toggle_bins", { show: newValue });
  };

  const sendToWeb = (type, payload) => {
    webref.current?.postMessage(JSON.stringify({ type, ...payload }));
  };

  return (
    <View
      style={[
        styles.container,
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
          } catch {}
        }}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      )}

      {!loading && stats.totalPoints > 0 && (
        <>
          <View style={styles.filterContainer}>
            {stats.centersCount > 0 && (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showCenters ? styles.filterActive : styles.filterInactive,
                ]}
                onPress={toggleCenters}
              >
                <Text style={styles.filterIcon}>🏢</Text>
                <Text style={styles.filterText}>
                  Centres ({stats.centersCount})
                </Text>
              </TouchableOpacity>
            )}

            {stats.binsCount > 0 && (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showBins ? styles.filterActive : styles.filterInactive,
                ]}
                onPress={toggleBins}
              >
                <Text style={styles.filterIcon}>🗑️</Text>
                <Text style={styles.filterText}>Bins ({stats.binsCount})</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statsBadge}>
            <Text style={styles.statsBadgeText}>
              {stats.totalPoints} point{stats.totalPoints > 1 ? "s" : ""}
            </Text>
          </View>
        </>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  webview: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  filterContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterActive: {
    backgroundColor: "#27ae60",
  },
  filterInactive: {
    backgroundColor: "#95a5a6",
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  statsBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  errorBanner: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});
