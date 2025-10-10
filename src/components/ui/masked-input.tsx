import * as React from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

export interface MaskedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // allow string identifiers for masks; concrete mask passed to IMaskInput
  mask: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, ...props }, ref) => {
    const getMask = () => {
      switch (mask) {
        case "phone":
          return { mask: "(00) 00000-0000" } as any;
        case "cnpj":
          return { mask: "00.000.000/0000-00" } as any;
        default:
          return { mask: "" } as any;
      }
    };

    return (
      <IMaskInput
        {...getMask()}
        {...props}
        ref={ref}
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
