import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  PlanType,
  PlanConfig,
  UserWithPlan,
  UserRole,
} from "@/interfaces/plan.interface";
import { PLAN_CONFIGS } from "@/interfaces/plan.interface";

interface PlanContextType {
  currentPlan: PlanConfig;
  user: UserWithPlan | null;
  features: PlanConfig["features"];
  canAccess: (feature: keyof PlanConfig["features"]) => boolean;
  switchPlan: (planType: PlanType) => void;
  setUser: (user: UserWithPlan | null) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const [user, setUserState] = useState<UserWithPlan | null>(null);
  const [currentPlanType, setCurrentPlanType] =
    useState<PlanType>("simple_booking");

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Map old user structure to new UserWithPlan
        const userWithPlan: UserWithPlan = {
          id: parsedUser.id?.toString() || "1",
          name: parsedUser.username || "User",
          email: parsedUser.email || "",
          role: (parsedUser.role as UserRole) || "owner",
          planType: parsedUser.planType || "business", // Default to business for existing users
          commerceId: parsedUser.commerceId,
          professionalId: parsedUser.professionalId,
        };
        setUserState(userWithPlan);
        setCurrentPlanType(userWithPlan.planType);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [user]);

  const currentPlan = PLAN_CONFIGS[currentPlanType];

  const canAccess = (feature: keyof PlanConfig["features"]): boolean => {
    return currentPlan.features[feature];
  };

  const switchPlan = (planType: PlanType) => {
    setCurrentPlanType(planType);
    if (user) {
      setUserState({ ...user, planType });
    }
  };

  const setUser = (newUser: UserWithPlan | null) => {
    setUserState(newUser);
    if (newUser) {
      setCurrentPlanType(newUser.planType);
    }
  };

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        user,
        features: currentPlan.features,
        canAccess,
        switchPlan,
        setUser,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
