import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";


type AuthProviderProps = {
  children: ReactNode
}

/**
 * Initialise la session utilisateur à l'échelle de l'application.
 */

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initAuth, isLoading } = useAuth()

  useEffect(() => {    
    initAuth()
  }, [initAuth])
    
  if (isLoading) {
    return (
      <div className="text-center mt-10 text-muted-foreground text-sm">
        Chargement de la session utilisateur...
      </div>
    )
  }

  return <>{children}</>
}