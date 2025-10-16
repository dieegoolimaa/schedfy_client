import { useState, useEffect } from "react";

export type Country = "BR" | "PT" | "OTHER";

export interface CountryLocalization {
  country: Country;
  currency: string;
  currencySymbol: string;
  locale: string;
  language: string;
  dateFormat: string;
  phoneFormat: string;
  phonePlaceholder: string;
  phonePattern: string;
  timezone: string;
  businessHours: string;
}

const countryConfigs: Record<Country, CountryLocalization> = {
  BR: {
    country: "BR",
    currency: "BRL",
    currencySymbol: "R$",
    locale: "pt-BR",
    language: "pt-BR",
    dateFormat: "DD/MM/YYYY",
    phoneFormat: "(XX) XXXXX-XXXX",
    phonePlaceholder: "(11) 99999-9999",
    phonePattern: "^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$",
    timezone: "GMT-3",
    businessHours: "9h às 18h",
  },
  PT: {
    country: "PT",
    currency: "EUR",
    currencySymbol: "€",
    locale: "pt-PT",
    language: "pt-PT",
    dateFormat: "DD/MM/YYYY",
    phoneFormat: "XXX XXX XXX",
    phonePlaceholder: "912 345 678",
    phonePattern: "^\\d{3}\\s\\d{3}\\s\\d{3}$",
    timezone: "GMT+0/+1",
    businessHours: "9h às 18h",
  },
  OTHER: {
    country: "OTHER",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    phoneFormat: "(XXX) XXX-XXXX",
    phonePlaceholder: "(555) 123-4567",
    phonePattern: "^\\(\\d{3}\\)\\s\\d{3}-\\d{4}$",
    timezone: "Configurable",
    businessHours: "9 AM - 6 PM",
  },
};

export const useCountryLocalization = () => {
  const [localization, setLocalization] = useState<CountryLocalization>(
    countryConfigs.BR
  );

  useEffect(() => {
    const selectedCountry = localStorage.getItem("selectedCountry") as Country;
    if (selectedCountry && countryConfigs[selectedCountry]) {
      setLocalization(countryConfigs[selectedCountry]);
    }
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(localization.locale, {
      style: "currency",
      currency: localization.currency,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(localization.locale).format(date);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, "");

    switch (localization.country) {
      case "BR":
        // Brazilian format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
        if (numbers.length === 11) {
          return `(${numbers.slice(0, 2)}) ${numbers.slice(
            2,
            7
          )}-${numbers.slice(7)}`;
        } else if (numbers.length === 10) {
          return `(${numbers.slice(0, 2)}) ${numbers.slice(
            2,
            6
          )}-${numbers.slice(6)}`;
        }
        return numbers;

      case "PT":
        // Portuguese format: XXX XXX XXX
        if (numbers.length === 9) {
          return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
            6
          )}`;
        }
        return numbers;

      case "OTHER":
        // US format: (XXX) XXX-XXXX
        if (numbers.length === 10) {
          return `(${numbers.slice(0, 3)}) ${numbers.slice(
            3,
            6
          )}-${numbers.slice(6)}`;
        }
        return numbers;

      default:
        return phone;
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const pattern = new RegExp(localization.phonePattern);
    return pattern.test(phone);
  };

  const getCountryName = (): string => {
    switch (localization.country) {
      case "BR":
        return "Brasil";
      case "PT":
        return "Portugal";
      case "OTHER":
        return "International";
      default:
        return "Unknown";
    }
  };

  const getCountryFlag = (): string => {
    switch (localization.country) {
      case "BR":
        return "🇧🇷";
      case "PT":
        return "🇵🇹";
      case "OTHER":
        return "🌍";
      default:
        return "🌍";
    }
  };

  const updateCountry = (country: Country) => {
    localStorage.setItem("selectedCountry", country);
    setLocalization(countryConfigs[country]);
  };

  return {
    localization,
    formatCurrency,
    formatDate,
    formatPhoneNumber,
    validatePhoneNumber,
    getCountryName,
    getCountryFlag,
    updateCountry,
  };
};

export default useCountryLocalization;
