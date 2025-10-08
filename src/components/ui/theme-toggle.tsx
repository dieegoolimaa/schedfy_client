import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = "ghost", 
  size = "default", 
  showLabel = false,
  className = ""
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`${showLabel ? 'justify-start' : 'justify-center'} ${className}`}
      title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {showLabel && "Modo Escuro"}
        </>
      ) : (
        <>
          <Sun className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {showLabel && "Modo Claro"}
        </>
      )}
    </Button>
  );
}