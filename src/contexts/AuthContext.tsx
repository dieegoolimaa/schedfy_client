import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService, type User as AuthUser } from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  business: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterUserData) => Promise<void>;
  registerBusiness: (businessData: RegisterBusinessData) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "customer" | "professional" | "business_owner" | "admin";
  planType?: string;
}

interface RegisterBusinessData {
  // Business info
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  // Owner info
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPhone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          // Para business, precisamos buscar do businessProfile se existir
          setBusiness(userData.businessProfile || null);
        } else {
          authService.clearTokens();
        }
      }
    } catch (error) {
      console.error("Erro na inicialização da autenticação:", error);
      authService.clearTokens();
      setError("Erro ao verificar autenticação");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const authData = await authService.login({ email, password });
      setUser(authData.user);
      setBusiness(authData.user.businessProfile || null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);
      setBusiness(null);
      setLoading(false);
      setError(null);
    }
  };

  const register = async (userData: RegisterUserData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Adaptar dados para o formato do serviço existente
      const registrationData = {
        ...userData,
        role: userData.role || "customer",
      };

      const authData = await authService.register(registrationData);
      setUser(authData.user);
      setBusiness(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao registrar usuário";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerBusiness = async (
    businessData: RegisterBusinessData
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Por enquanto, registrar como usuário admin até implementar registro de negócios
      const registerData = {
        name: businessData.ownerName,
        email: businessData.ownerEmail,
        password: businessData.ownerPassword,
        phone: businessData.ownerPhone || "",
        role: "business_owner" as const,
      };

      const authData = await authService.register(registerData);
      setUser(authData.user);
      setBusiness(businessData); // Usar os dados temporariamente até integração completa
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao registrar negócio";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        login,
        logout,
        register,
        registerBusiness,
        isAuthenticated: !!user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
