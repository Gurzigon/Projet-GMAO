import axios from "axios";

// Détecte si on est dans le navigateur ou dans Node/Docker
const isBrowser = typeof window !== "undefined";

// Base URL selon le contexte
const baseURL = isBrowser
  ?  "/api" // Navigateur → proxy via Nginx
  : "http://gmao-backend:3000/api";        // Conteneur Docker → nom du service Docker

const api = axios.create({
  baseURL,
  withCredentials: true
});

export default api;
