import { getDefaultStore } from "jotai"
import { csrfTokenAtom } from '../stores/csrfAtom'
import api from "./axios"

const store = getDefaultStore()

/**
 * Vérifie si un token CSRF est déjà présent.
 * Sinon, le récupère via l'API et le stocke dans le store Jotai.
 */
export async function ensureCsrfToken(): Promise<void> {
  const existing = store.get(csrfTokenAtom)
  if (existing) return

  const res = await api.get("/csrf-token")
  store.set(csrfTokenAtom, res.data.csrfToken)
}