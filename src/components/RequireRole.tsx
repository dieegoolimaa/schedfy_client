import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface RequireRoleProps {
  children: ReactNode;
  roles: string[];
}

export default function RequireRole({ children, roles }: RequireRoleProps) {
  try {
    const logged = localStorage.getItem('loggedInUser');
    if (!logged) return <Navigate to="/login" replace />;
    const user = JSON.parse(logged);
    if (!roles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-md text-center">
            <h2 className="text-lg font-semibold">Acesso negado</h2>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Você não tem permissão para acessar essa página.</p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}
