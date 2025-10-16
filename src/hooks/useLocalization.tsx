import React, { useState, useEffect, useContext, createContext } from "react";
import {
  localizationService,
  type LocaleConfig,
  type PaymentMethodConfig,
} from "../services/localizationService";

interface LocalizationContextValue {
  locale: string;
  config: LocaleConfig | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLocale: (locale: string) => Promise<void>;
  detectLocale: () => Promise<void>;

  // Formatters
  formatCurrency: (amount: number) => Promise<string>;
  formatDate: (date: Date) => Promise<string>;
  formatTime: (date: Date) => Promise<string>;
  formatDateTime: (date: Date) => Promise<string>;

  // Payment & Tax
  getAvailablePaymentMethods: () => Promise<PaymentMethodConfig[]>;
  calculatePaymentFee: (
    amount: number,
    paymentMethodId: string
  ) => Promise<any>;
  calculateTax: (amount: number) => Promise<any>;

  // Utilities
  isPortugal: () => boolean;
  isBrazil: () => boolean;
  getCurrencySymbol: () => string;
  getCountryName: () => string;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null
);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<string>("pt-BR");
  const [config, setConfig] = useState<LocaleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicialização
  useEffect(() => {
    initializeLocalization();
  }, []);

  const initializeLocalization = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar detectar localização
      const detectedLocale = await localizationService.detectLocale();
      setLocaleState(detectedLocale);

      // Carregar configuração
      const localeConfig = await localizationService.getLocaleConfig(
        detectedLocale
      );
      setConfig(localeConfig);
    } catch (err: any) {
      console.error("Erro ao inicializar localização:", err);
      setError(err.message || "Erro ao carregar configurações de localização");

      // Fallback para configuração padrão
      try {
        const fallbackConfig = await localizationService.getLocaleConfig(
          "pt-BR"
        );
        setConfig(fallbackConfig);
        setLocaleState("pt-BR");
      } catch (fallbackErr) {
        console.error("Erro no fallback de localização:", fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setLocale = async (newLocale: string) => {
    try {
      setIsLoading(true);
      setError(null);

      localizationService.setCurrentLocale(newLocale);
      const newConfig = await localizationService.getLocaleConfig(newLocale);

      setLocaleState(newLocale);
      setConfig(newConfig);

      // Salvar preferência do usuário
      localStorage.setItem("schedfy_locale", newLocale);
    } catch (err: any) {
      console.error("Erro ao alterar localização:", err);
      setError(err.message || "Erro ao alterar localização");
    } finally {
      setIsLoading(false);
    }
  };

  const detectLocale = async () => {
    try {
      setIsLoading(true);
      const detectedLocale = await localizationService.detectLocale();
      await setLocale(detectedLocale);
    } catch (err: any) {
      console.error("Erro ao detectar localização:", err);
      setError(err.message || "Erro ao detectar localização");
    } finally {
      setIsLoading(false);
    }
  };

  // Formatadores
  const formatCurrency = async (amount: number) => {
    return localizationService.formatCurrency(amount, locale);
  };

  const formatDate = async (date: Date) => {
    return localizationService.formatDate(date, locale);
  };

  const formatTime = async (date: Date) => {
    return localizationService.formatTime(date, locale);
  };

  const formatDateTime = async (date: Date) => {
    return localizationService.formatDateTime(date, locale);
  };

  // Pagamentos e impostos
  const getAvailablePaymentMethods = async () => {
    return localizationService.getAvailablePaymentMethods(locale);
  };

  const calculatePaymentFee = async (
    amount: number,
    paymentMethodId: string
  ) => {
    return localizationService.calculatePaymentFee(
      amount,
      paymentMethodId,
      locale
    );
  };

  const calculateTax = async (amount: number) => {
    return localizationService.calculateTax(amount, locale);
  };

  // Utilities
  const isPortugal = () => locale === "pt-PT";
  const isBrazil = () => locale === "pt-BR";
  const getCurrencySymbol = () => config?.currencySymbol || "R$";
  const getCountryName = () => config?.country || "Brasil";

  const contextValue: LocalizationContextValue = {
    locale,
    config,
    isLoading,
    error,

    setLocale,
    detectLocale,

    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,

    getAvailablePaymentMethods,
    calculatePaymentFee,
    calculateTax,

    isPortugal,
    isBrazil,
    getCurrencySymbol,
    getCountryName,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      "useLocalization deve ser usado dentro de LocalizationProvider"
    );
  }

  return context;
};

// Hook específico para formatação
export const useFormatters = () => {
  const {
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    locale,
    config,
  } = useLocalization();

  return {
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,

    // Formatadores síncronos para casos onde já temos a config
    formatCurrencySync: (amount: number) => {
      if (!config) return `${amount}`;
      return new Intl.NumberFormat(config.numberFormat, {
        style: "currency",
        currency: config.currency,
      }).format(amount);
    },

    formatDateSync: (date: Date) => {
      if (!config) return date.toLocaleDateString();
      return new Intl.DateTimeFormat(config.numberFormat, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    },

    formatTimeSync: (date: Date) => {
      if (!config) return date.toLocaleTimeString();
      return new Intl.DateTimeFormat(config.numberFormat, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    },

    locale,
    config,
  };
};

// Hook para métodos de pagamento
export const usePaymentMethods = () => {
  const { getAvailablePaymentMethods, calculatePaymentFee, locale, config } =
    useLocalization();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(
    []
  );
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);

  useEffect(() => {
    if (config) {
      loadPaymentMethods();
    }
  }, [config]);

  const loadPaymentMethods = async () => {
    try {
      setIsLoadingMethods(true);
      const methods = await getAvailablePaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Erro ao carregar métodos de pagamento:", error);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  const getPaymentMethodById = (id: string) => {
    return paymentMethods.find((method) => method.id === id);
  };

  const getPaymentMethodsByType = (type: string) => {
    return paymentMethods.filter((method) => method.type === type);
  };

  return {
    paymentMethods,
    isLoadingMethods,
    loadPaymentMethods,
    getPaymentMethodById,
    getPaymentMethodsByType,
    calculatePaymentFee,

    // Helpers específicos por país
    getPreferredMethods: () => {
      if (locale === "pt-PT") {
        return paymentMethods.filter((m) =>
          ["mb_way", "multibanco", "credit_card"].includes(m.id)
        );
      }
      return paymentMethods.filter((m) =>
        ["pix", "credit_card", "boleto"].includes(m.id)
      );
    },

    getInstantMethods: () => {
      return paymentMethods.filter((m) =>
        m.processingTime.includes("Instantâneo")
      );
    },

    getFreezeFeeMethods: () => {
      return paymentMethods.filter(
        (m) =>
          (!m.fees.fixed || m.fees.fixed === 0) &&
          (!m.fees.percentage || m.fees.percentage === 0)
      );
    },
  };
};

// Hook para impostos
export const useTaxCalculation = () => {
  const { calculateTax, config } = useLocalization();

  const calculateWithTax = async (amount: number) => {
    const taxResult = await calculateTax(amount);
    return {
      ...taxResult,
      displayTax: config?.taxConfig.vatIncluded ? "Incluído" : "A adicionar",
      taxLabel: config?.taxConfig.taxName || "Taxa",
    };
  };

  return {
    calculateTax,
    calculateWithTax,
    taxConfig: config?.taxConfig,
    hasTax: () => (config?.taxConfig.vatRate || 0) > 0,
    taxIncluded: () => config?.taxConfig.vatIncluded || false,
  };
};
