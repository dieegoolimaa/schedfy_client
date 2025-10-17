import React from "react";
import { Input } from "./input";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

interface PostalCodeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  value,
  onChange,
  error,
  ...props
}) => {
  const { formatPostalCode, getPostalCodePlaceholder } =
    useCountryLocalization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPostalCode(rawValue);
    onChange(formattedValue);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={getPostalCodePlaceholder()}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
