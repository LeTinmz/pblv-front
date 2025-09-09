import axios from "axios";

const api = axios.create({
  baseURL: "http://host.docker.internal:8080/api/",
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
