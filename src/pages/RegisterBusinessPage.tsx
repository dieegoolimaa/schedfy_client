import React, { useState, useEffect } from "react";
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
import { useCountryLocalization } from "../hooks/useCountryLocalization";
import {
  Loader2,
  Eye,
  EyeOff,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface BusinessRegisterFormData {
  // Dados do negócio
  businessName: string;
  businessType: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  businessPhone: string;
  businessEmail: string;

  // Dados do proprietário
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  confirmPassword: string;
}

const RegisterBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerBusiness, loading, error } = useAuth();
  const {
    localization,
    formatPhoneNumber,
    validatePhoneNumber,
    getCountryName,
  } = useCountryLocalization();

  const [isOnboardingFlow, setIsOnboardingFlow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [formData, setFormData] = useState<BusinessRegisterFormData>({
    businessName: "",
    businessType: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    businessPhone: "",
    businessEmail: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Verificar se está vindo do fluxo de onboarding
  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan");
    const country = localStorage.getItem("selectedCountry");

    if (plan && country) {
      setIsOnboardingFlow(true);
      setSelectedPlan(plan);
      setSelectedCountry(country);
    }
  }, []);

  const handleInputChange = (
    field: keyof BusinessRegisterFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError(null);
  };

  const validateStep1 = (): string | null => {
    const { businessName, businessType, businessEmail, businessPhone } =
      formData;

    if (!businessName.trim()) return "Nome do negócio é obrigatório";
    if (!businessType.trim()) return "Tipo de negócio é obrigatório";
    if (!businessEmail.trim()) return "Email do negócio é obrigatório";
    if (!businessEmail.includes("@"))
      return "Por favor, insira um email válido para o negócio";
    if (!businessPhone.trim()) return "Telefone do negócio é obrigatório";
    if (!validatePhoneNumber(businessPhone))
      return `Telefone inválido. Use o formato: ${localization.phoneFormat}`;

    return null;
  };

  const validateStep2 = (): string | null => {
    const {
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      password,
      confirmPassword,
    } = formData;

    if (!ownerFirstName.trim()) return "Nome do proprietário é obrigatório";
    if (!ownerLastName.trim()) return "Sobrenome do proprietário é obrigatório";
    if (!ownerEmail.trim()) return "Email do proprietário é obrigatório";
    if (!ownerEmail.includes("@")) return "Por favor, insira um email válido";
    if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres";
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      return "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial";
    }
    if (password !== confirmPassword) return "Senhas não coincidem";

    return null;
  };

  const handleNext = () => {
    const validationError = validateStep1();
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validateStep2();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      const businessData = {
        // Dados do negócio
        name: formData.businessName.trim(),
        slug: formData.businessName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        email: formData.businessEmail.trim().toLowerCase(),
        phone: formData.businessPhone.trim(),
        address: {
          street: formData.address.trim(),
          number: "",
          district: "",
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: getCountryName(),
        },
        businessHours: {
          monday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: localization.country === "OTHER" ? "18:00" : "18:00",
            isOpen: true,
          },
          tuesday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: localization.country === "OTHER" ? "18:00" : "18:00",
            isOpen: true,
          },
          wednesday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: localization.country === "OTHER" ? "18:00" : "18:00",
            isOpen: true,
          },
          thursday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: localization.country === "OTHER" ? "18:00" : "18:00",
            isOpen: true,
          },
          friday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: localization.country === "OTHER" ? "18:00" : "18:00",
            isOpen: true,
          },
          saturday: {
            open: localization.country === "OTHER" ? "09:00" : "08:00",
            close: "14:00",
            isOpen: true,
          },
          sunday: { open: "00:00", close: "00:00", isOpen: false },
        },

        // Dados do proprietário
        ownerName: `${formData.ownerFirstName.trim()} ${formData.ownerLastName.trim()}`,
        ownerEmail: formData.ownerEmail.trim().toLowerCase(),
        ownerPassword: formData.password,
        ownerPhone: formData.ownerPhone.trim(),
      };

      await registerBusiness(businessData);
      toast.success("Negócio registrado com sucesso! Bem-vindo ao Schedfy!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no registro do negócio:", error);
      toast.error("Erro ao registrar negócio. Tente novamente.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Registre seu Negócio
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
              <Building className="mr-2 h-5 w-5" />
              Registro de Negócio - Passo {step} de 2
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Informações sobre seu negócio"
                : "Dados do proprietário e acesso"}
            </CardDescription>
          </CardHeader>

          {step === 1 ? (
            <div>
              <CardContent className="space-y-6">
                {displayError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                    <p className="text-sm text-destructive">{displayError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="businessName">Nome do Negócio *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Ex: Salão Beleza & Cia"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="businessType">Tipo de Negócio *</Label>
                    <Input
                      id="businessType"
                      type="text"
                      placeholder="Ex: Salão de Beleza, Clínica"
                      value={formData.businessType}
                      onChange={(e) =>
                        handleInputChange("businessType", e.target.value)
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="cnpj">
                      {localization.country === "BR"
                        ? "CNPJ"
                        : localization.country === "PT"
                        ? "NIF"
                        : "Tax ID"}
                    </Label>
                    <Input
                      id="cnpj"
                      type="text"
                      placeholder={
                        localization.country === "BR"
                          ? "XX.XXX.XXX/0001-XX"
                          : localization.country === "PT"
                          ? "XXXXXXXXX"
                          : "Tax Identification Number"
                      }
                      value={formData.cnpj}
                      onChange={(e) =>
                        handleInputChange("cnpj", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="businessEmail">Email do Negócio *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessEmail"
                      type="email"
                      placeholder="contato@seunegocio.com"
                      value={formData.businessEmail}
                      onChange={(e) =>
                        handleInputChange("businessEmail", e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="businessPhone">Telefone do Negócio *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder={localization.phonePlaceholder}
                      value={formData.businessPhone}
                      onChange={(e) =>
                        handleInputChange(
                          "businessPhone",
                          formatPhoneNumber(e.target.value)
                        )
                      }
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Rua, número, bairro"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="SP"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="12345-678"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-6">
                <Link to="/login">
                  <Button variant="outline" disabled={loading}>
                    Cancelar
                  </Button>
                </Link>
                <Button onClick={handleNext} disabled={loading}>
                  Próximo
                </Button>
              </CardFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {displayError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                    <p className="text-sm text-destructive">{displayError}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="ownerFirstName">
                      Nome do Proprietário *
                    </Label>
                    <Input
                      id="ownerFirstName"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.ownerFirstName}
                      onChange={(e) =>
                        handleInputChange("ownerFirstName", e.target.value)
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="ownerLastName">Sobrenome *</Label>
                    <Input
                      id="ownerLastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      value={formData.ownerLastName}
                      onChange={(e) =>
                        handleInputChange("ownerLastName", e.target.value)
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ownerEmail">Email do Proprietário *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ownerEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.ownerEmail}
                      onChange={(e) =>
                        handleInputChange("ownerEmail", e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ownerPhone">Telefone do Proprietário</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ownerPhone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.ownerPhone}
                      onChange={(e) =>
                        handleInputChange("ownerPhone", e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password">Senha *</Label>
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
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
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
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Registrar Negócio
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Quer registrar como usuário individual?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Criar conta pessoal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterBusinessPage;
