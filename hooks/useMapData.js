import { useState, useEffect, useCallback } from "react";
import { fetchCollectCenters } from "../services/fetchCollectCenters";
import { fetchBins } from "../services/fetchBins";
import {
  formatCollectCentersForMap,
  validateCollectCenter,
} from "../utils/CollectCenterPin";
import { formatBinsForMap, validateBin, getBinsStats } from "../utils/BinPin";

/**
 * Hook personnalisé pour gérer les données de la carte (centres + bins)
 * @param {Object} options - Options de configuration
 * @param {boolean} options.autoLoad - Charger automatiquement au montage
 * @returns {Object} État et fonctions pour gérer les données
 */
export const useMapData = (options = {}) => {
  const { autoLoad = true } = options;

  const [centers, setCenters] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    centersCount: 0,
    binsCount: 0,
    totalPoints: 0,
  });

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Chargement de toutes les données...");

      const [rawCenters, rawBins] = await Promise.all([
        fetchCollectCenters(),
        fetchBins(),
      ]);

      let validCenters = [];
      if (rawCenters && rawCenters.length > 0) {
        const formatted = formatCollectCentersForMap(rawCenters);
        validCenters = formatted.filter(validateCollectCenter);
        setCenters(validCenters);
      } else {
        setCenters([]);
      }

      let validBins = [];
      if (rawBins && rawBins.length > 0) {
        const formatted = formatBinsForMap(rawBins);
        validBins = formatted.filter(validateBin);
        setBins(validBins);
      } else {
        setBins([]);
      }

      const binsStatsData =
        validBins.length > 0 ? getBinsStats(validBins) : null;

      setStats({
        centersCount: validCenters.length,
        binsCount: validBins.length,
        totalPoints: validCenters.length + validBins.length,
        binsStats: binsStatsData,
      });

      console.log(
        `Chargement terminé: ${validCenters.length} centres, ${validBins.length} bins`
      );

      if (validCenters.length === 0 && validBins.length === 0) {
        setError("Aucune donnée disponible");
      }
    } catch (err) {
      console.error("Erreur loadAll:", err);
      setError(err.message || "Erreur de chargement");
      setCenters([]);
      setBins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCenters = useCallback(async () => {
    try {
      setLoading(true);
      const rawCenters = await fetchCollectCenters();

      if (rawCenters && rawCenters.length > 0) {
        const formatted = formatCollectCentersForMap(rawCenters);
        const valid = formatted.filter(validateCollectCenter);
        setCenters(valid);

        setStats((prev) => ({
          ...prev,
          centersCount: valid.length,
          totalPoints: valid.length + prev.binsCount,
        }));
      }
    } catch (err) {
      console.error("Erreur loadCenters:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBins = useCallback(async () => {
    try {
      setLoading(true);
      const rawBins = await fetchBins();

      if (rawBins && rawBins.length > 0) {
        const formatted = formatBinsForMap(rawBins);
        const valid = formatted.filter(validateBin);
        setBins(valid);

        const binsStatsData = getBinsStats(valid);

        setStats((prev) => ({
          ...prev,
          binsCount: valid.length,
          totalPoints: prev.centersCount + valid.length,
          binsStats: binsStatsData,
        }));
      }
    } catch (err) {
      console.error("Erreur loadBins:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    return loadAll();
  }, [loadAll]);

  const filterBinsByType = useCallback(
    (garbageType) => {
      if (!garbageType) return bins;

      return bins.filter(
        (bin) =>
          bin.garbageType &&
          bin.garbageType.toLowerCase().includes(garbageType.toLowerCase())
      );
    },
    [bins]
  );

  const filterCentersByGarbageType = useCallback(
    (garbageType) => {
      if (!garbageType) return centers;

      return centers.filter(
        (center) =>
          center.garbageTypes &&
          center.garbageTypes.some((type) =>
            type.toLowerCase().includes(garbageType.toLowerCase())
          )
      );
    },
    [centers]
  );

  const searchAll = useCallback(
    (query) => {
      if (!query || query.trim() === "") {
        return { centers, bins };
      }

      const searchTerm = query.toLowerCase();

      const filteredCenters = centers.filter(
        (center) =>
          center.name.toLowerCase().includes(searchTerm) ||
          center.address?.toLowerCase().includes(searchTerm) ||
          center.community?.toLowerCase().includes(searchTerm)
      );

      const filteredBins = bins.filter(
        (bin) =>
          bin.garbageType?.toLowerCase().includes(searchTerm) ||
          bin.community?.toLowerCase().includes(searchTerm)
      );

      return { centers: filteredCenters, bins: filteredBins };
    },
    [centers, bins]
  );

  useEffect(() => {
    if (autoLoad) {
      loadAll();
    }
  }, [autoLoad, loadAll]);

  return {
    centers,
    bins,
    loading,
    error,
    stats,
    loadAll,
    loadCenters,
    loadBins,
    refresh,
    filterBinsByType,
    filterCentersByGarbageType,
    searchAll,
  };
};
