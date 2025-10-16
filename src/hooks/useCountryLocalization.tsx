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
        if (numbers.length === 0) return "";
        if (numbers.length <= 2) return `(${numbers}`;
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        if (numbers.length <= 10) {
          return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        }
        // 11 digits (with 9)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;

      case "PT":
        // Portuguese format: XXX XXX XXX
        if (numbers.length === 0) return "";
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`;

      case "OTHER":
        // US format: (XXX) XXX-XXXX
        if (numbers.length === 0) return "";
        if (numbers.length <= 3) return `(${numbers}`;
        if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;

      default:
        return phone;
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const pattern = new RegExp(localization.phonePattern);
    return pattern.test(phone);
  };

  const formatTaxId = (taxId: string): string => {
    const numbers = taxId.replace(/\D/g, "");

    switch (localization.country) {
      case "BR":
        // CNPJ format: XX.XXX.XXX/XXXX-XX (14 digits)
        if (numbers.length === 0) return "";
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
        if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
        if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;

      case "PT":
        // NIF format: XXXXXXXXX (9 digits, no formatting)
        return numbers.slice(0, 9);

      case "OTHER":
        // Generic Tax ID (no specific format)
        return numbers;

      default:
        return taxId;
    }
  };

  const formatPostalCode = (postalCode: string): string => {
    const numbers = postalCode.replace(/\D/g, "");

    switch (localization.country) {
      case "BR":
        // CEP format: XXXXX-XXX (8 digits)
        if (numbers.length === 0) return "";
        if (numbers.length <= 5) return numbers;
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;

      case "PT":
        // Portuguese postal code format: XXXX-XXX (7 digits)
        if (numbers.length === 0) return "";
        if (numbers.length <= 4) return numbers;
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}`;

      case "OTHER":
        // US ZIP code: XXXXX or XXXXX-XXXX
        if (numbers.length === 0) return "";
        if (numbers.length <= 5) return numbers;
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`;

      default:
        return postalCode;
    }
  };

  const validateTaxId = (taxId: string): boolean => {
    const numbers = taxId.replace(/\D/g, "");

    switch (localization.country) {
      case "BR":
        return numbers.length === 14; // CNPJ has 14 digits
      case "PT":
        return numbers.length === 9; // NIF has 9 digits
      case "OTHER":
        return numbers.length >= 5; // Flexible for international
      default:
        return true;
    }
  };

  const validatePostalCode = (postalCode: string): boolean => {
    const numbers = postalCode.replace(/\D/g, "");

    switch (localization.country) {
      case "BR":
        return numbers.length === 8; // CEP has 8 digits
      case "PT":
        return numbers.length === 7; // Portuguese postal code has 7 digits
      case "OTHER":
        return numbers.length >= 5 && numbers.length <= 9; // US ZIP
      default:
        return true;
    }
  };

  const getTaxIdLabel = (): string => {
    switch (localization.country) {
      case "BR":
        return "CNPJ";
      case "PT":
        return "NIF";
      case "OTHER":
        return "Tax ID";
      default:
        return "Tax ID";
    }
  };

  const getTaxIdPlaceholder = (): string => {
    switch (localization.country) {
      case "BR":
        return "XX.XXX.XXX/XXXX-XX";
      case "PT":
        return "XXXXXXXXX";
      case "OTHER":
        return "Tax Identification Number";
      default:
        return "";
    }
  };

  const getPostalCodeLabel = (): string => {
    switch (localization.country) {
      case "BR":
        return "CEP";
      case "PT":
        return "Código Postal";
      case "OTHER":
        return "ZIP Code";
      default:
        return "Postal Code";
    }
  };

  const getPostalCodePlaceholder = (): string => {
    switch (localization.country) {
      case "BR":
        return "12345-678";
      case "PT":
        return "1234-567";
      case "OTHER":
        return "12345 or 12345-6789";
      default:
        return "";
    }
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
    formatTaxId,
    formatPostalCode,
    validateTaxId,
    validatePostalCode,
    getTaxIdLabel,
    getTaxIdPlaceholder,
    getPostalCodeLabel,
    getPostalCodePlaceholder,
    getCountryName,
    getCountryFlag,
    updateCountry,
  };
};

export default useCountryLocalization;
