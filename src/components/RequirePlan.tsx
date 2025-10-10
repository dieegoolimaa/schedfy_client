import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePlan } from "@/contexts/PlanContext";
import type { PlanType, PlanFeatures } from "@/interfaces/plan.interface";

interface RequirePlanProps {
  children: ReactNode;
  plans: PlanType[];
  fallback?: string;
}

/**
 * Component to protect routes based on plan type
 * Only allows access if user has one of the specified plans
 */
export function RequirePlan({
  children,
  plans,
  fallback = "/",
}: RequirePlanProps) {
  const { currentPlan } = usePlan();

  if (!plans.includes(currentPlan.type)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

interface RequireFeatureProps {
  children: ReactNode;
  feature: keyof PlanFeatures;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render based on plan features
 * Shows children only if the feature is enabled in the current plan
 */
export function RequireFeature({
  children,
  feature,
  fallback = null,
}: RequireFeatureProps) {
  const { canAccess } = usePlan();

  if (!canAccess(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PlanGateProps {
  children: ReactNode;
  showFor: PlanType[];
  fallback?: ReactNode;
}

/**
 * Component to conditionally render based on plan type
 * Similar to RequirePlan but returns fallback instead of redirecting
 */
export function PlanGate({
  children,
  showFor,
  fallback = null,
}: PlanGateProps) {
  const { currentPlan } = usePlan();

  if (!showFor.includes(currentPlan.type)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
