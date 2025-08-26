// utils/csrf.ts
// services/csrf.ts
import  api  from "./axios"; 

export async function fetchCsrfToken() {
  try {
    const response = await api.get("/csrf-token");
    const token = response.data.csrfToken;
    api.defaults.headers.common["X-CSRF-Token"] = token;
    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token CSRF", error);
    throw error;
  }
}
