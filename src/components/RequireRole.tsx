import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface RequireRoleProps {
  children: ReactNode;
  roles: string[];
}

export default function RequireRole({ children, roles }: RequireRoleProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-card border border-border rounded-md text-center">
          <h2 className="text-lg font-semibold">Acesso negado</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Você não tem permissão para acessar essa página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
