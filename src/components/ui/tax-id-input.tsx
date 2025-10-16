import React from "react";
import { Input } from "./input";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

interface TaxIdInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TaxIdInput: React.FC<TaxIdInputProps> = ({
  value,
  onChange,
  error,
  ...props
}) => {
  const { formatTaxId, getTaxIdPlaceholder } = useCountryLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatTaxId(rawValue);
    onChange(formattedValue);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={getTaxIdPlaceholder()}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
