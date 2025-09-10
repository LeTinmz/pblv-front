import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
  } catch (error) {
    console.error("Erreur fetch user :", error.response?.data || error);
    return null;
  }
};
