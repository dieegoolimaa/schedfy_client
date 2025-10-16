import React, { useState, useEffect, useContext, createContext } from "react";
import { useLocalization } from "./useLocalization";

// Import dos arquivos de tradução existentes
import enTranslations from "../i18n/en.json";
import enCompleteTranslations from "../i18n/en_complete.json";
import ptBrTranslations from "../i18n/pt-BR.json";
import ptTranslations from "../i18n/pt.json";
import esTranslations from "../i18n/es.json";

// Interfaces
interface TranslationResources {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string | object;
    };
  };
}

interface I18nContextValue {
  locale: string;
  t: (
    key: string,
    options?: {
      ns?: string;
      defaultValue?: string;
      interpolation?: Record<string, any>;
    }
  ) => string;
  changeLanguage: (locale: string) => void;
  isLoading: boolean;
  resources: TranslationResources;

  // Formatters baseados na localização
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatNumber: (number: number) => string;

  // Helpers específicos
  getPaymentMethodName: (methodId: string) => string;
  getStatusLabel: (
    status: string,
    type: "appointment" | "payment" | "user"
  ) => string;
  getErrorMessage: (errorCode: string) => string;
}

// Recursos de tradução organizados
const translationResources: TranslationResources = {
  en: {
    common: enTranslations,
    complete: enCompleteTranslations,
  },
  "pt-BR": {
    common: ptBrTranslations,
    complete: ptTranslations, // Fallback
  },
  "pt-PT": {
    common: ptTranslations,
    complete: ptBrTranslations, // Fallback
  },
  es: {
    common: esTranslations,
    complete: esTranslations,
  },
};

// Traduções específicas para métodos de pagamento
const paymentMethodTranslations = {
  en: {
    pix: "PIX",
    mb_way: "MB WAY",
    multibanco: "ATM Reference",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    boleto: "Bank Slip",
    bank_transfer: "Bank Transfer",
    cash: "Cash",
  },
  "pt-BR": {
    pix: "PIX",
    mb_way: "MB WAY",
    multibanco: "Multibanco",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    boleto: "Boleto Bancário",
    bank_transfer: "Transferência Bancária",
    cash: "Dinheiro",
  },
  "pt-PT": {
    pix: "PIX",
    mb_way: "MB WAY",
    multibanco: "Multibanco",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    boleto: "Boleto",
    bank_transfer: "Transferência Bancária",
    cash: "Numerário",
  },
  es: {
    pix: "PIX",
    mb_way: "MB WAY",
    multibanco: "Referencia ATM",
    credit_card: "Tarjeta de Crédito",
    debit_card: "Tarjeta de Débito",
    boleto: "Boleto Bancario",
    bank_transfer: "Transferencia Bancaria",
    cash: "Efectivo",
  },
};

// Status labels
const statusTranslations = {
  en: {
    appointment: {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      no_show: "No Show",
    },
    payment: {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
      refunded: "Refunded",
    },
    user: {
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
      pending: "Pending Verification",
    },
  },
  "pt-BR": {
    appointment: {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado",
      no_show: "Não Compareceu",
    },
    payment: {
      pending: "Pendente",
      processing: "Processando",
      completed: "Concluído",
      failed: "Falhou",
      cancelled: "Cancelado",
      refunded: "Estornado",
    },
    user: {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso",
      pending: "Aguardando Verificação",
    },
  },
  "pt-PT": {
    appointment: {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado",
      no_show: "Faltou",
    },
    payment: {
      pending: "Pendente",
      processing: "A processar",
      completed: "Concluído",
      failed: "Falhado",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
    },
    user: {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso",
      pending: "Aguarda Verificação",
    },
  },
  es: {
    appointment: {
      pending: "Pendiente",
      confirmed: "Confirmado",
      completed: "Completado",
      cancelled: "Cancelado",
      no_show: "No Compareció",
    },
    payment: {
      pending: "Pendiente",
      processing: "Procesando",
      completed: "Completado",
      failed: "Falló",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
    },
    user: {
      active: "Activo",
      inactive: "Inactivo",
      suspended: "Suspendido",
      pending: "Pendiente Verificación",
    },
  },
};

// Error messages
const errorTranslations = {
  en: {
    network_error: "Network connection error",
    server_error: "Server error, please try again",
    validation_error: "Please check the entered data",
    auth_required: "Authentication required",
    access_denied: "Access denied",
    not_found: "Resource not found",
    appointment_conflict: "Time slot already booked",
    payment_failed: "Payment processing failed",
    insufficient_balance: "Insufficient balance",
  },
  "pt-BR": {
    network_error: "Erro de conexão de rede",
    server_error: "Erro no servidor, tente novamente",
    validation_error: "Verifique os dados inseridos",
    auth_required: "Autenticação necessária",
    access_denied: "Acesso negado",
    not_found: "Recurso não encontrado",
    appointment_conflict: "Horário já reservado",
    payment_failed: "Falha no processamento do pagamento",
    insufficient_balance: "Saldo insuficiente",
  },
  "pt-PT": {
    network_error: "Erro de ligação à rede",
    server_error: "Erro no servidor, tente novamente",
    validation_error: "Verifique os dados inseridos",
    auth_required: "Autenticação necessária",
    access_denied: "Acesso negado",
    not_found: "Recurso não encontrado",
    appointment_conflict: "Horário já ocupado",
    payment_failed: "Falha no processamento do pagamento",
    insufficient_balance: "Saldo insuficiente",
  },
  es: {
    network_error: "Error de conexión de red",
    server_error: "Error del servidor, intente nuevamente",
    validation_error: "Verifique los datos ingresados",
    auth_required: "Autenticación requerida",
    access_denied: "Acceso denegado",
    not_found: "Recurso no encontrado",
    appointment_conflict: "Horario ya reservado",
    payment_failed: "Fallo en el procesamiento del pago",
    insufficient_balance: "Saldo insuficiente",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const DynamicI18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { locale: localizationLocale } = useLocalization();
  const [locale, setLocale] = useState<string>("pt-BR");
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar com o serviço de localização
  useEffect(() => {
    if (localizationLocale && localizationLocale !== locale) {
      setLocale(localizationLocale);
    }
  }, [localizationLocale, locale]);

  // Função principal de tradução
  const t = (
    key: string,
    options?: {
      ns?: string;
      defaultValue?: string;
      interpolation?: Record<string, any>;
    }
  ): string => {
    const namespace = options?.ns || "common";
    const defaultValue = options?.defaultValue || key;
    const interpolation = options?.interpolation || {};

    try {
      // Buscar a tradução
      const resource = translationResources[locale]?.[namespace];
      if (!resource) {
        console.warn(
          `Namespace '${namespace}' não encontrado para locale '${locale}'`
        );
        return defaultValue;
      }

      // Navegar pelas chaves aninhadas
      const keys = key.split(".");
      let translation: any = resource;

      for (const k of keys) {
        if (
          translation &&
          typeof translation === "object" &&
          k in translation
        ) {
          translation = translation[k];
        } else {
          translation = null;
          break;
        }
      }

      if (typeof translation === "string") {
        // Aplicar interpolação
        let result = translation;
        Object.entries(interpolation).forEach(([placeholder, value]) => {
          result = result.replace(
            new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"),
            String(value)
          );
        });
        return result;
      }

      console.warn(`Tradução não encontrada: ${key} (${locale}:${namespace})`);
      return defaultValue;
    } catch (error) {
      console.error("Erro na tradução:", error);
      return defaultValue;
    }
  };

  // Mudar idioma
  const changeLanguage = async (newLocale: string) => {
    setIsLoading(true);
    try {
      setLocale(newLocale);
      localStorage.setItem("schedfy_language", newLocale);
    } catch (error) {
      console.error("Erro ao alterar idioma:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatadores
  const formatCurrency = (amount: number): string => {
    try {
      const config = {
        "pt-BR": { currency: "BRL", locale: "pt-BR" },
        "pt-PT": { currency: "EUR", locale: "pt-PT" },
        en: { currency: "USD", locale: "en-US" },
        es: { currency: "EUR", locale: "es-ES" },
      };

      const currencyConfig =
        config[locale as keyof typeof config] || config["pt-BR"];
      return new Intl.NumberFormat(currencyConfig.locale, {
        style: "currency",
        currency: currencyConfig.currency,
      }).format(amount);
    } catch (error) {
      return `${amount}`;
    }
  };

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      return String(date);
    }
  };

  const formatTime = (date: Date | string): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(dateObj);
    } catch (error) {
      return String(date);
    }
  };

  const formatNumber = (number: number): string => {
    try {
      return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
      return String(number);
    }
  };

  // Helpers específicos
  const getPaymentMethodName = (methodId: string): string => {
    const translations =
      paymentMethodTranslations[
        locale as keyof typeof paymentMethodTranslations
      ] || paymentMethodTranslations["pt-BR"];
    return translations[methodId as keyof typeof translations] || methodId;
  };

  const getStatusLabel = (
    status: string,
    type: "appointment" | "payment" | "user"
  ): string => {
    const translations =
      statusTranslations[locale as keyof typeof statusTranslations] ||
      statusTranslations["pt-BR"];
    const typeTranslations = translations[type];
    return typeTranslations[status as keyof typeof typeTranslations] || status;
  };

  const getErrorMessage = (errorCode: string): string => {
    const translations =
      errorTranslations[locale as keyof typeof errorTranslations] ||
      errorTranslations["pt-BR"];
    return translations[errorCode as keyof typeof translations] || errorCode;
  };

  const contextValue: I18nContextValue = {
    locale,
    t,
    changeLanguage,
    isLoading,
    resources: translationResources,

    formatCurrency,
    formatDate,
    formatTime,
    formatNumber,

    getPaymentMethodName,
    getStatusLabel,
    getErrorMessage,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};

export const useDynamicI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      "useDynamicI18n deve ser usado dentro de DynamicI18nProvider"
    );
  }

  return context;
};

// Hook específico para traduções de formulários
export const useFormTranslations = () => {
  const { t } = useDynamicI18n();

  return {
    // Labels comuns
    name: t("form.name", { defaultValue: "Nome" }),
    email: t("form.email", { defaultValue: "Email" }),
    phone: t("form.phone", { defaultValue: "Telefone" }),
    date: t("form.date", { defaultValue: "Data" }),
    time: t("form.time", { defaultValue: "Horário" }),
    notes: t("form.notes", { defaultValue: "Observações" }),

    // Botões
    save: t("buttons.save", { defaultValue: "Salvar" }),
    cancel: t("buttons.cancel", { defaultValue: "Cancelar" }),
    confirm: t("buttons.confirm", { defaultValue: "Confirmar" }),
    back: t("buttons.back", { defaultValue: "Voltar" }),
    next: t("buttons.next", { defaultValue: "Próximo" }),

    // Mensagens
    required: t("validation.required", {
      defaultValue: "Este campo é obrigatório",
    }),
    invalidEmail: t("validation.invalidEmail", {
      defaultValue: "Email inválido",
    }),
    minLength: (min: number) =>
      t("validation.minLength", {
        defaultValue: `Mínimo ${min} caracteres`,
        interpolation: { min },
      }),

    // Status e ações
    loading: t("common.loading", { defaultValue: "Carregando..." }),
    success: t("common.success", { defaultValue: "Sucesso!" }),
    error: t("common.error", { defaultValue: "Erro" }),
  };
};

// Hook para traduções de agendamento
export const useAppointmentTranslations = () => {
  const { t, getStatusLabel } = useDynamicI18n();

  return {
    // Títulos
    bookAppointment: t("appointment.book", {
      defaultValue: "Agendar Atendimento",
    }),
    selectService: t("appointment.selectService", {
      defaultValue: "Escolha o Serviço",
    }),
    selectProfessional: t("appointment.selectProfessional", {
      defaultValue: "Escolha o Profissional",
    }),
    selectDateTime: t("appointment.selectDateTime", {
      defaultValue: "Escolha Data e Horário",
    }),
    customerInfo: t("appointment.customerInfo", {
      defaultValue: "Dados do Cliente",
    }),

    // Status
    getAppointmentStatus: (status: string) =>
      getStatusLabel(status, "appointment"),

    // Ações
    reschedule: t("appointment.reschedule", { defaultValue: "Reagendar" }),
    cancel: t("appointment.cancel", { defaultValue: "Cancelar" }),
    confirm: t("appointment.confirm", { defaultValue: "Confirmar" }),

    // Informações
    duration: (minutes: number) =>
      t("appointment.duration", {
        defaultValue: `${minutes} min`,
        interpolation: { minutes },
      }),
    price: t("appointment.price", { defaultValue: "Preço" }),
    total: t("appointment.total", { defaultValue: "Total" }),
  };
};

// Hook para traduções de pagamento
export const usePaymentTranslations = () => {
  const { t, getPaymentMethodName, getStatusLabel } = useDynamicI18n();

  return {
    // Títulos
    paymentMethod: t("payment.method", { defaultValue: "Método de Pagamento" }),
    paymentSummary: t("payment.summary", {
      defaultValue: "Resumo do Pagamento",
    }),

    // Métodos
    getMethodName: getPaymentMethodName,
    getPaymentStatus: (status: string) => getStatusLabel(status, "payment"),

    // Resumo
    subtotal: t("payment.subtotal", { defaultValue: "Subtotal" }),
    fee: t("payment.fee", { defaultValue: "Taxa" }),
    tax: t("payment.tax", { defaultValue: "Imposto" }),
    total: t("payment.total", { defaultValue: "Total" }),

    // Status
    processing: t("payment.processing", {
      defaultValue: "Processando pagamento...",
    }),
    success: t("payment.success", {
      defaultValue: "Pagamento realizado com sucesso",
    }),
    failed: t("payment.failed", { defaultValue: "Falha no pagamento" }),
  };
};
