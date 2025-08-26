import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/authContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}

