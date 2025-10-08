import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchCollectCenters } from "../services/fetchCollectCenters";
import { fetchBins } from "../services/fetchBins";
import {
  formatCollectCentersForMap,
  validateCollectCenter,
} from "../utils/CollectCenterPin";
import { formatBinsForMap, validateBin } from "../utils/BinPin";

export const MapWithFilters = () => {
  const webref = useRef(null);
  const [webReady, setWebReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centersCount, setCentersCount] = useState(0);
  const [binsCount, setBinsCount] = useState(0);
  const [showCenters, setShowCenters] = useState(true);
  const [showBins, setShowBins] = useState(true);
  const insets = useSafeAreaInsets();

  const source =
    Platform.OS === "android"
      ? require("../assets/leaflet.html")
      : require("../assets/leaflet.html");

  useEffect(() => {
    if (!webReady) return;

    const loadMapData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Chargement des données de la carte...");
        const [rawCenters, rawBins] = await Promise.all([
          fetchCollectCenters(),
          fetchBins(),
        ]);
        if (rawCenters && rawCenters.length > 0) {
          const formattedCenters = formatCollectCentersForMap(rawCenters);
          const validCenters = formattedCenters.filter(validateCollectCenter);

          console.log(
            `${validCenters.length} centres valides sur ${rawCenters.length}`
          );

          if (validCenters.length > 0) {
            sendToWeb("collect_centers", { centers: validCenters });
            setCentersCount(validCenters.length);
          }
        } else {
          console.warn("Aucun centre de collecte trouvé");
          setCentersCount(0);
        }

        if (rawBins && rawBins.length > 0) {
          const formattedBins = formatBinsForMap(rawBins);
          const validBins = formattedBins.filter(validateBin);

          console.log(`${validBins.length} bins valides sur ${rawBins.length}`);

          if (validBins.length > 0) {
            sendToWeb("bins", { bins: validBins });
            setBinsCount(validBins.length);
          }
        } else {
          console.warn("Aucun bin trouvé");
          setBinsCount(0);
        }

        if ((rawCenters?.length || 0) === 0 && (rawBins?.length || 0) === 0) {
          setError("Aucune donnée à afficher sur la carte");
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement données:", err);
        setError("Impossible de charger les données");
        setLoading(false);
      }
    };

    loadMapData();
  }, [webReady]);

  useEffect(() => {
    let locationSubscription;

    const setupLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.warn("⚠️ Permission de localisation refusée");
          return;
        }

        if (webReady) {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          console.log(
            "Position utilisateur:",
            position.coords.latitude.toFixed(6),
            position.coords.longitude.toFixed(6)
          );

          sendToWeb("user_location", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });

          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (newPosition) => {
              sendToWeb("user_location", {
                lat: newPosition.coords.latitude,
                lng: newPosition.coords.longitude,
                accuracy: newPosition.coords.accuracy,
              });
            }
          );
        }
      } catch (err) {
        console.error("Erreur localisation:", err);
      }
    };

    setupLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [webReady]);

  const toggleCentersFilter = () => {
    const newValue = !showCenters;
    setShowCenters(newValue);
    sendToWeb("toggle_centers", { show: newValue });
    console.log("Centres:", newValue ? "affichés" : "masqués");
  };

  const toggleBinsFilter = () => {
    const newValue = !showBins;
    setShowBins(newValue);
    sendToWeb("toggle_bins", { show: newValue });
    console.log("Bins:", newValue ? "affichés" : "masqués");
  };

  const sendToWeb = (type, payload) => {
    const message = JSON.stringify({ type, ...payload });
    webref.current?.postMessage(message);
  };

  const handleWebViewMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (msg.type === "web_ready") {
        console.log("WebView prête");
        setWebReady(true);
      }

      if (msg.type === "map_ready") {
        console.log("Carte Leaflet initialisée");
      }
    } catch (err) {
      console.error("Erreur parsing message WebView:", err);
    }
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
        onLoadEnd={() => {
          console.log("📱 WebView chargée");
          setWebReady(true);
        }}
        onMessage={handleWebViewMessage}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("Erreur WebView:", nativeEvent);
          setError("Erreur de chargement de la carte");
        }}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      )}

      {!loading && (centersCount > 0 || binsCount > 0) && (
        <View style={styles.filterContainer}>
          {centersCount > 0 && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                showCenters
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
              onPress={toggleCentersFilter}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterIcon,
                  !showCenters && styles.filterIconInactive,
                ]}
              >
                🏢
              </Text>
              <Text
                style={[
                  styles.filterText,
                  !showCenters && styles.filterTextInactive,
                ]}
              >
                Centres ({centersCount})
              </Text>
            </TouchableOpacity>
          )}

          {binsCount > 0 && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                showBins
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
              onPress={toggleBinsFilter}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterIcon,
                  !showBins && styles.filterIconInactive,
                ]}
              >
                🗑️
              </Text>
              <Text
                style={[
                  styles.filterText,
                  !showBins && styles.filterTextInactive,
                ]}
              >
                Poubelles ({binsCount})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!loading && (centersCount > 0 || binsCount > 0) && (
        <View style={styles.statsBadge}>
          <Text style={styles.statsBadgeText}>
            {centersCount + binsCount} point
            {centersCount + binsCount > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
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
    flexDirection: "column",
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
  filterButtonActive: {
    backgroundColor: "#27ae60",
  },
  filterButtonInactive: {
    backgroundColor: "#95a5a6",
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterIconInactive: {
    opacity: 0.6,
  },
  filterText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextInactive: {
    opacity: 0.8,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});
