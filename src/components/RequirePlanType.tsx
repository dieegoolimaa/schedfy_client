import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { PlanType } from "@/interfaces/user.interface";

interface RequirePlanTypeProps {
  children: ReactNode;
  allowedPlans: PlanType[];
  deniedMessage?: string;
}

export default function RequirePlanType({
  children,
  allowedPlans,
  deniedMessage = "Esta funcionalidade não está disponível no seu plano.",
}: RequirePlanTypeProps) {
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

  const userPlan = user.planType || "business"; // Default to business for backwards compatibility

  if (!allowedPlans.includes(userPlan)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-card border border-border rounded-md text-center max-w-md">
          <h2 className="text-lg font-semibold">
            Funcionalidade não disponível
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{deniedMessage}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Plano atual:{" "}
            <span className="font-medium capitalize">
              {userPlan.replace("_", " ")}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
