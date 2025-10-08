/**
 * Utilitaires pour gérer les pins des bins (poubelles) sur la carte
 */

/**
 * Convertit les données du backend en format compatible avec Leaflet
 * @param {Array} bins - Bins du backend
 * @returns {Array} Bins formatés pour Leaflet
 */
export const formatBinsForMap = (bins) => {
  if (!Array.isArray(bins)) {
    console.warn("formatBinsForMap: bins n'est pas un tableau", bins);
    return [];
  }

  return bins
    .filter((bin) => {
      const hasValidCoords = bin.latitude && bin.longitude;
      if (!hasValidCoords) {
        console.warn(`Bin ${bin.id} sans coordonnées`);
      }
      return hasValidCoords;
    })
    .map((bin) => ({
      id: bin.id,
      latitude: parseFloat(bin.latitude),
      longitude: parseFloat(bin.longitude),
      garbageType: bin.garbageType || "Non spécifié",
      community: bin.community || "Communauté inconnue",
      qrCode: bin.qrCode || null,
    }));
};

/**
 * Valide qu'un bin a toutes les informations requises
 * @param {Object} bin - Bin à valider
 * @returns {boolean} True si valide
 */
export const validateBin = (bin) => {
  if (!bin) return false;

  const hasId = !!bin.id;
  const hasCoordinates =
    bin.latitude !== null &&
    bin.latitude !== undefined &&
    bin.longitude !== null &&
    bin.longitude !== undefined;

  const lat = parseFloat(bin.latitude);
  const lng = parseFloat(bin.longitude);
  const coordsInRange =
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  return hasId && hasCoordinates && coordsInRange;
};

/**
 * Crée le contenu HTML du popup pour un bin
 * @param {Object} bin - Bin
 * @returns {string} HTML du popup
 */
export const createBinPopupContent = (bin) => {
  let html = `<div style="min-width: 180px; max-width: 280px;">
    <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #2c3e50;">🗑️ Poubelle</h3>`;

  if (bin.garbageType) {
    const colorMap = {
      verre: "#4CAF50",
      plastique: "#FFC107",
      papier: "#2196F3",
      métal: "#9E9E9E",
      organique: "#795548",
      général: "#607D8B",
    };

    const garbageTypeLower = bin.garbageType.toLowerCase();
    let color = "#666";

    for (const [key, value] of Object.entries(colorMap)) {
      if (garbageTypeLower.includes(key)) {
        color = value;
        break;
      }
    }

    html += `<p style="margin: 6px 0; font-size: 13px;">
      <strong>♻️ Type:</strong> 
      <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">
        ${bin.garbageType}
      </span>
    </p>`;
  }

  if (bin.community) {
    html += `<p style="margin: 4px 0; font-size: 12px; color: #666;">
      <strong>🏘️ Communauté:</strong> ${bin.community}
    </p>`;
  }

  html += `<p style="margin: 6px 0 0 0; font-size: 11px; color: #999;">
    📍 ${bin.latitude.toFixed(5)}, ${bin.longitude.toFixed(5)}
  </p>`;

  if (bin.qrCode) {
    html += `<p style="margin: 8px 0 0 0; padding-top: 6px; border-top: 1px solid #eee;">
      <a href="${bin.qrCode}" target="_blank" style="color: #2196F3; text-decoration: none; font-size: 12px; font-weight: 500;">
        📱 QR Code →
      </a>
    </p>`;
  }

  html += "</div>";

  return html;
};

/**
 * Obtient la couleur d'icône selon le type de déchet
 * @param {string} garbageType - Type de déchet
 * @returns {string} Nom de couleur pour l'icône
 */
export const getBinIconColor = (garbageType) => {
  if (!garbageType) return "grey";

  const type = garbageType.toLowerCase();

  if (type.includes("verre")) return "green";
  if (type.includes("plastique") || type.includes("jaune")) return "yellow";
  if (type.includes("papier") || type.includes("carton")) return "blue";
  if (type.includes("métal")) return "grey";
  if (type.includes("organique") || type.includes("bio")) return "orange";

  return "red";
};

/**
 * Groupe les bins par type de déchet
 * @param {Array} bins - Liste des bins
 * @returns {Object} Bins groupés par type
 */
export const groupBinsByGarbageType = (bins) => {
  return bins.reduce((groups, bin) => {
    const type = bin.garbageType || "Non spécifié";
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(bin);
    return groups;
  }, {});
};

/**
 * Calcule les statistiques des bins
 * @param {Array} bins - Liste des bins
 * @returns {Object} Statistiques
 */
export const getBinsStats = (bins) => {
  const stats = {
    total: bins.length,
    byType: {},
    byCommunity: {},
  };

  bins.forEach((bin) => {
    const type = bin.garbageType || "Non spécifié";
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    const community = bin.community || "Inconnue";
    stats.byCommunity[community] = (stats.byCommunity[community] || 0) + 1;
  });

  return stats;
};
