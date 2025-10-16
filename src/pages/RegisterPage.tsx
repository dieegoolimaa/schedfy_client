import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Loader2, Eye, EyeOff, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useCountryLocalization } from "../hooks/useCountryLocalization";
import { PhoneInput } from "../components/ui/phone-input";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const { 
    formatPhoneNumber, 
    validatePhoneNumber, 
    localization,
    getCountryFlag 
  } = useCountryLocalization();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    // Apply mask for phone field
    const processedValue = field === "phone" ? formatPhoneNumber(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    setLocalError(null);
    
    // Clear field-specific error
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): string | null => {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    const errors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!firstName.trim()) {
      errors.firstName = "Nome é obrigatório";
    }
    
    if (!lastName.trim()) {
      errors.lastName = "Sobrenome é obrigatório";
    }
    
    if (!email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!email.includes("@")) {
      errors.email = "Por favor, insira um email válido";
    }
    
    if (!phone.trim()) {
      errors.phone = "Telefone é obrigatório";
    } else if (!validatePhoneNumber(phone)) {
      errors.phone = `Telefone inválido. Use o formato: ${localization.phoneFormat}`;
    }
    
    if (password.length < 8) {
      errors.password = "Senha deve ter pelo menos 8 caracteres";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      errors.password = "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial";
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = "Senhas não coincidem";
    }

    setFieldErrors(errors);

    // Return first error message
    const errorMessages = Object.values(errors);
    return errorMessages.length > 0 ? errorMessages[0] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      // Get country code based on localization
      const countryCode = localization.country === "BR" ? "+55" : 
                         localization.country === "PT" ? "+351" : 
                         "+1";
      
      const userData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        phone: `${countryCode}${formData.phone.replace(/[^\d]/g, "")}`, // Formato internacional dinâmico
        password: formData.password,
        role: "customer" as const,
      };

      await register(userData);
      toast.success("Conta criada com sucesso! Bem-vindo ao Schedfy!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no registro:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Faça login
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Registro de Usuário
            </CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta no Schedfy
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {displayError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                  <p className="text-sm text-destructive">{displayError}</p>
                </div>
              )}

              {/* Country Selector */}
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">País selecionado:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag()}</span>
                    <span className="text-sm font-medium">{localization.country === "BR" ? "Brasil" : localization.country === "PT" ? "Portugal" : "Internacional"}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Para alterar o país, volte à seleção inicial ou acesse as configurações.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={loading}
                    required
                    className={fieldErrors.firstName ? "border-destructive" : ""}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Seu sobrenome"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={loading}
                    required
                    className={fieldErrors.lastName ? "border-destructive" : ""}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${fieldErrors.email ? "border-destructive" : ""}`}
                    disabled={loading}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefone {getCountryFlag()}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    className="pl-10"
                    disabled={loading}
                    required
                    error={fieldErrors.phone}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={loading}
                    required
                    minLength={8}
                    className={fieldErrors.password ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive">{fieldErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    disabled={loading}
                    required
                    className={fieldErrors.confirmPassword ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:text-primary/80"
                >
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link
                  to="/privacy"
                  className="text-primary hover:text-primary/80"
                >
                  Política de Privacidade
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Quer registrar um negócio?{" "}
            <Link
              to="/register/business"
              className="font-medium text-primary hover:text-primary/80"
            >
              Cadastre sua empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
