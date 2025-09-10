import axios from "axios";
import config from 'react-native-config';


const api = axios.create({
  baseURL: config.URL_API,
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
