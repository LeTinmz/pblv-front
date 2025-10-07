import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Récupère tous les bins depuis l'API
 * @returns {Promise<Array>} Liste des bins
 */
export const fetchBins = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ Pas de token disponible pour fetchBins");
      throw new Error("Authentification requise");
    }

    console.log("🔄 Requête API: GET bins");
    const response = await api.get("bins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifier la structure de la réponse
    if (!response.data) {
      console.error("❌ Réponse API vide");
      return [];
    }

    // L'API peut retourner directement un tableau ou un objet avec une propriété data
    const bins = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.content || [];

    console.log(`✅ ${bins.length} bins reçus de l'API`);

    return bins;
  } catch (error) {
    if (error.response) {
      console.error("❌ Erreur serveur:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      if (error.response.status === 401) {
        console.error("🔒 Token invalide ou expiré");
      }
    } else if (error.request) {
      console.error("❌ Erreur réseau:", error.message);
    } else {
      console.error("❌ Erreur:", error.message);
    }

    return [];
  }
};

/**
 * Récupère un bin par son ID
 * @param {string} binId - UUID du bin
 * @returns {Promise<Object|null>} Bin ou null
 */
export const fetchBinById = async (binId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await api.get(`/api/bins/${binId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      `❌ Erreur fetch bin ${binId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

/**
 * Récupère les bins d'une communauté
 * @param {string} communityId - UUID de la communauté
 * @returns {Promise<Array>} Liste des bins
 */
export const fetchBinsByCommunity = async (communityId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await api.get(`/api/bins/community/${communityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const bins = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    return bins;
  } catch (error) {
    console.error(
      `❌ Erreur fetch bins community ${communityId}:`,
      error.response?.data || error.message
    );
    return [];
  }
};
