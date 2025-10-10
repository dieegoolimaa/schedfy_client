import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import en from "@/i18n/en.json";
import ptBR from "@/i18n/pt-BR.json";
import pt from "@/i18n/pt.json";
import es from "@/i18n/es.json";

type Locale = "en" | "pt-BR" | "pt" | "es";

const dictionaries: Record<Locale, Record<string, string>> = {
  en: en,
  "pt-BR": ptBR,
  pt: pt,
  es: es,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({
  children,
  defaultLocale = "en" as Locale,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = (key: string, fallback?: string) => {
    const dict = dictionaries[locale] || dictionaries["en"];
    return dict[key] || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export default I18nContext;
