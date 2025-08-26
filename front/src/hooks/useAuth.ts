import { getDefaultStore, useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import { authAtom, authLoadingAtom } from "../stores/authAtom";
import { csrfTokenAtom } from "../stores/csrfAtom";
import api from "../utils/axios";

// Hook d'authentification
export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const store = getDefaultStore();
  const navigate = useNavigate();

  // Initialise la session utilisateur
  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await userService.getCurrentUser();
      setAuth(user);      

      // Récupération du token CSRF
      const res = await api.get("/csrf-token");
      store.set(csrfTokenAtom, res.data.csrfToken);
    } catch (error) {
      console.error("Erreur lors de getCurrentUser:", error);
      setAuth(null);
    } finally {
      setIsLoading(false);
    }
  }, [setAuth, setIsLoading, store]);

  // Déconnexion de l'utilisateur
  const logout = useCallback(async () => {
    try {
      await userService.logout();
      setAuth(null);
      navigate("/"); 
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  }, [setAuth, navigate]);  

  return {
    user: auth,
    isLoading,
    initAuth,
    logout, 
  };
}
