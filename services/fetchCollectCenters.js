import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Récupère tous les centres de collecte depuis l'API
 * @returns {Promise<Array>} Liste des centres de collecte
 */
export const fetchCollectCenters = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.warn("Pas de token disponible pour fetchCollectCenters");
      throw new Error("Authentification requise");
    }

    console.log("Requête API: GET collect-center");

    const response = await api.get("collect-center", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      console.error("Réponse API vide");
      return [];
    }

    const centers = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.content || [];

    console.log(`${centers.length} centres reçus de l'API`);

    return centers;
  } catch (error) {
    if (error.response) {
      console.error("Erreur serveur:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      if (error.response.status === 401) {
        console.error("🔒 Token invalide ou expiré");
      }
    } else if (error.request) {
      console.error("Erreur réseau:", error.message);
    } else {
      console.error("Erreur:", error.message);
    }

    return [];
  }
};

/**
 * Récupère un centre de collecte par son ID
 * @param {string} centerId - UUID du centre
 * @returns {Promise<Object|null>} Centre de collecte ou null
 */
export const fetchCollectCenterById = async (centerId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await api.get(`/api/collect-center/${centerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      `Erreur fetch center ${centerId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};
