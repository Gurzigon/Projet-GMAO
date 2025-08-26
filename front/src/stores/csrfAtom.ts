import { atom } from "jotai"

export const csrfTokenAtom = atom<string | null>(null)