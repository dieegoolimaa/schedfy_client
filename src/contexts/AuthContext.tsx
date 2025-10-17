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
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          // Business info can be fetched separately if needed
          setBusiness(null); // Will be loaded separately when business module is ready
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
      setBusiness(null); // Will be loaded separately when business module is ready
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

      // O register agora retorna apenas uma resposta de verificação de email
      // O usuário será definido após a verificação do email via EmailVerificationDialog
      await authService.register(registrationData);

      // Não definimos user aqui porque o fluxo agora é:
      // register → verify email → login
      // O EmailVerificationDialog cuida da verificação e login
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

      // PASSO 1: Registrar usuário proprietário
      const registerData = {
        name: businessData.ownerName,
        email: businessData.ownerEmail,
        password: businessData.ownerPassword,
        phone: businessData.ownerPhone || "",
        role: "business_owner" as const,
      };

      // Registra o usuário (retorna resposta de verificação de email)
      await authService.register(registerData);

      // PASSO 2: Salvar dados do negócio no localStorage temporariamente
      // Será criado no banco após verificação de email
      localStorage.setItem("pendingBusinessData", JSON.stringify(businessData));

      // O fluxo agora é:
      // 1. register → email enviado
      // 2. verify email → usuário logado automaticamente
      // 3. EmailVerificationDialog detecta pendingBusinessData → cria business no banco
      // 4. Redireciona para dashboard
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
