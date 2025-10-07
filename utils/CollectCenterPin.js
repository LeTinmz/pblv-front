/**
 * Utilitaires pour gérer les pins des centres de collecte sur la carte
 */

/**
 * Convertit les données du backend en format compatible avec Leaflet
 * @param {Array} centers - Centres de collecte du backend
 * @returns {Array} Centres formatés pour Leaflet
 */
export const formatCollectCentersForMap = (centers) => {
  if (!Array.isArray(centers)) {
    console.warn(
      "formatCollectCentersForMap: centers n'est pas un tableau",
      centers
    );
    return [];
  }

  return centers
    .filter((center) => {
      // Filtrer les centres sans coordonnées valides
      const hasValidCoords = center.latitude && center.longitude;
      if (!hasValidCoords) {
        console.warn(`Centre sans coordonnées: ${center.name}`);
      }
      return hasValidCoords;
    })
    .map((center) => ({
      id: center.id,
      name: center.name || "Centre sans nom",
      address: center.address || "Adresse non disponible",
      latitude: parseFloat(center.latitude),
      longitude: parseFloat(center.longitude),
      website: center.website || null,
      garbageTypes: center.garbageTypes || [],
      community: center.community || "Communauté inconnue",
    }));
};

/**
 * Valide qu'un centre de collecte a toutes les informations requises
 * @param {Object} center - Centre à valider
 * @returns {boolean} True si valide
 */
export const validateCollectCenter = (center) => {
  if (!center) return false;

  const hasId = !!center.id;
  const hasName = !!center.name;
  const hasCoordinates =
    center.latitude !== null &&
    center.latitude !== undefined &&
    center.longitude !== null &&
    center.longitude !== undefined;

  const lat = parseFloat(center.latitude);
  const lng = parseFloat(center.longitude);
  const coordsInRange =
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  return hasId && hasName && hasCoordinates && coordsInRange;
};

/**
 * Crée le contenu HTML du popup pour un centre de collecte
 * @param {Object} center - Centre de collecte
 * @returns {string} HTML du popup
 */
export const createPopupContent = (center) => {
  let html = `<div style="min-width: 200px; max-width: 300px;">
    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2c3e50;">${center.name}</h3>`;

  if (center.address) {
    html += `<p style="margin: 4px 0; font-size: 13px; color: #555;">
      <strong>📍 Adresse:</strong><br/>${center.address}
    </p>`;
  }

  if (center.community) {
    html += `<p style="margin: 4px 0; font-size: 13px; color: #555;">
      <strong>🏘️ Communauté:</strong> ${center.community}
    </p>`;
  }

  if (center.garbageTypes && center.garbageTypes.length > 0) {
    html += `<p style="margin: 4px 0; font-size: 13px; color: #555;">
      <strong>♻️ Types de déchets:</strong><br/>
      ${center.garbageTypes
        .map(
          (type) =>
            `<span style="display: inline-block; background: #e8f5e9; padding: 2px 6px; margin: 2px; border-radius: 3px; font-size: 11px;">${type}</span>`
        )
        .join("")}
    </p>`;
  }

  if (center.website) {
    html += `<p style="margin: 8px 0 0 0;">
      <a href="${center.website}" target="_blank" style="color: #27ae60; text-decoration: none; font-weight: 500;">
        🔗 Visiter le site web →
      </a>
    </p>`;
  }

  html += "</div>";

  return html;
};

/**
 * Calcule la distance entre deux points GPS (en km)
 * @param {number} lat1 - Latitude du point 1
 * @param {number} lon1 - Longitude du point 1
 * @param {number} lat2 - Latitude du point 2
 * @param {number} lon2 - Longitude du point 2
 * @returns {number} Distance en kilomètres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Trouve les centres les plus proches d'une position
 * @param {Array} centers - Liste des centres
 * @param {number} userLat - Latitude de l'utilisateur
 * @param {number} userLng - Longitude de l'utilisateur
 * @param {number} maxResults - Nombre maximum de résultats
 * @returns {Array} Centres triés par distance
 */
export const findNearestCenters = (
  centers,
  userLat,
  userLng,
  maxResults = 5
) => {
  return centers
    .map((center) => ({
      ...center,
      distance: calculateDistance(
        userLat,
        userLng,
        center.latitude,
        center.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
};
