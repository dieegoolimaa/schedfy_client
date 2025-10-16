import React from "react";
import { Input } from "./input";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  ...props
}) => {
  const { formatPhoneNumber, localization } = useCountryLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    onChange(formattedValue);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={localization.phonePlaceholder}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
