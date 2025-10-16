import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

const OnboardingRegisterUserPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<string>("");

  const { register } = useAuth();
  const navigate = useNavigate();
  const {
    localization,
    formatPhoneNumber,
    validatePhoneNumber,
    getCountryName,
  } = useCountryLocalization();

  useEffect(() => {
    // Recuperar informações do onboarding
    const plan = localStorage.getItem("selectedPlan");
    const country = localStorage.getItem("selectedCountry");
    const billing = localStorage.getItem("billingCycle");

    if (!country) {
      // Se não há país selecionado, redirecionar para seleção de país
      navigate("/onboarding/country-selection");
      return;
    }

    if (!plan) {
      // Se não há plano selecionado, redirecionar para seleção de planos
      navigate("/onboarding/plan-selection");
      return;
    }

    setSelectedPlan(plan);
    setSelectedCountry(country);
    setBillingCycle(billing || "monthly");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phone)) {
      toast.error(
        `Telefone inválido. Use o formato: ${localization.phoneFormat}`
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "customer",
      });

      // Limpar dados de onboarding
      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("selectedCountry");
      localStorage.removeItem("billingCycle");

      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/plan-selection");
  };

  const getPlanInfo = () => {
    const planNames = {
      business: "Business",
      individual: "Individual Pro",
      simple_booking: "Simple Booking",
    };

    return {
      plan: planNames[selectedPlan as keyof typeof planNames] || selectedPlan,
      country: getCountryName(),
      billing: billingCycle === "yearly" ? "Anual" : "Mensal",
    };
  };

  if (!selectedPlan || !selectedCountry) {
    return null; // Aguardar redirecionamento
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Criar Sua Conta
          </h1>
          <p className="text-muted-foreground">
            Últimos passos para começar sua jornada
          </p>
        </div>

        {/* Selected Options Summary */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano:</span>
                <Badge variant="secondary">{getPlanInfo().plan}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">País:</span>
                <span className="font-medium text-foreground">
                  {getPlanInfo().country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cobrança:</span>
                <span className="font-medium text-foreground">
                  {getPlanInfo().billing}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Preencha seus dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-3">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: formatPhoneNumber(e.target.value),
                    })
                  }
                  placeholder={localization.phonePlaceholder}
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-3">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Digite a senha novamente"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Criando..." : "Criar Conta"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mt-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="text-xs text-muted-foreground mt-1">País</span>
            </div>

            <div className="flex-1 h-px bg-primary/30 mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="text-xs text-muted-foreground mt-1">Plano</span>
            </div>

            <div className="flex-1 h-px bg-primary/30 mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                Cadastro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRegisterUserPage;
