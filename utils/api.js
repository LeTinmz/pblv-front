import axios from "axios";
import config from "react-native-config";

const api = axios.create({
  baseURL: "http://192.168.1.100:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
