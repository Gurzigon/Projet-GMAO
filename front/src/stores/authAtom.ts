import { atom } from "jotai"
import type { IAuthUser } from "../types/IUser"


/**
 * Atom global contenant l'utilisateur connecté.
 * Ne contient jamais le mot de passe.
 */
export const authAtom = atom<IAuthUser | null>(null)
export const authLoadingAtom = atom<boolean>(true)