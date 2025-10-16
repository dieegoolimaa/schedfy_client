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
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Building2, User, Calendar } from "lucide-react";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

export type PlanType = "business" | "individual" | "simple_booking";

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  recommended?: boolean;
  icon: React.ReactNode;
  maxProfessionals?: number;
  maxLocations?: number;
}

const plans: Plan[] = [
  {
    id: "simple_booking",
    name: "Simple Booking",
    description: "Ideal para profissionais independentes",
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      "Gerenciar seus próprios agendamentos",
      "Calendário pessoal integrado",
      "Controlar horários disponíveis",
      "Receber notificações de novos agendamentos",
      "Histórico de atendimentos",
    ],
    icon: <User className="h-8 w-8" />,
    maxProfessionals: 1,
    maxLocations: 1,
  },
  {
    id: "individual",
    name: "Individual Pro",
    description: "Para profissionais que querem crescer",
    price: {
      monthly: 59,
      yearly: 590,
    },
    features: [
      "Tudo do Simple Booking",
      "Criar e gerenciar múltiplos serviços",
      "Definir preços e duração por serviço",
      "Relatórios de faturamento e performance",
      "Controle de agenda avançado",
      "Perfil público personalizado",
      "Sistema de avaliações",
    ],
    recommended: true,
    icon: <Calendar className="h-8 w-8" />,
    maxProfessionals: 1,
    maxLocations: 1,
  },
  {
    id: "business",
    name: "Business",
    description: "Para estabelecimentos com equipe",
    price: {
      monthly: 149,
      yearly: 1490,
    },
    features: [
      "Tudo do Individual Pro",
      "Gerenciar até 20 profissionais",
      "Criar múltiplas unidades/locais",
      "Dashboard administrativo completo",
      "Relatórios de equipe e performance",
      "Controle de comissões por profissional",
      "Gestão de promoções e vouchers",
      "Sistema de feedback de clientes",
    ],
    icon: <Building2 className="h-8 w-8" />,
    maxProfessionals: 20,
    maxLocations: 5,
  },
];

const PlanSelectionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const navigate = useNavigate();
  const { formatCurrency } = useCountryLocalization();

  useEffect(() => {
    // Verificar se o país foi selecionado
    const country = localStorage.getItem("selectedCountry");
    if (!country) {
      // Se não há país selecionado, redirecionar para seleção de país
      navigate("/onboarding/country-selection");
      return;
    }
    setSelectedCountry(country);
  }, [navigate]);

  const handleContinue = () => {
    if (!selectedPlan) return;

    // Armazenar a escolha do plano para usar nas próximas etapas
    localStorage.setItem("selectedPlan", selectedPlan);
    localStorage.setItem("billingCycle", billingCycle);

    // Redirecionar baseado no plano
    if (selectedPlan === "business") {
      navigate("/onboarding/register-business");
    } else {
      navigate("/onboarding/register-user");
    }
  };

  const getCurrencyInfo = () => {
    switch (selectedCountry) {
      case "BR":
        return { currency: "BRL", locale: "pt-BR", symbol: "R$" };
      case "PT":
        return { currency: "EUR", locale: "pt-PT", symbol: "€" };
      default:
        return { currency: "USD", locale: "en-US", symbol: "$" };
    }
  };

  const getPlanPrices = (plan: Plan) => {
    // Preços base em BRL
    let monthlyPrice = plan.price.monthly;
    let yearlyPrice = plan.price.yearly;

    // Converter preços baseado no país
    if (selectedCountry === "PT") {
      // Converter BRL para EUR (aproximadamente 1 BRL = 0.18 EUR)
      monthlyPrice = Math.round(monthlyPrice * 0.18);
      yearlyPrice = Math.round(yearlyPrice * 0.18);
    } else if (selectedCountry === "OTHER") {
      // Converter BRL para USD (aproximadamente 1 BRL = 0.20 USD)
      monthlyPrice = Math.round(monthlyPrice * 0.2);
      yearlyPrice = Math.round(yearlyPrice * 0.2);
    }

    return { monthly: monthlyPrice, yearly: yearlyPrice };
  };

  const formatPrice = (price: number): string => {
    return formatCurrency(price);
  };

  const getDiscountPercentage = (monthly: number, yearly: number): number => {
    const monthlyTotal = monthly * 12;
    const discount = ((monthlyTotal - yearly) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione o plano que melhor se adapta ao seu negócio. Você pode
            alterar ou cancelar a qualquer momento.
          </p>
        </div>

        {/* Selected Country Info */}
        {selectedCountry && (
          <div className="mb-8">
            <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Preços para:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">
                    {selectedCountry === "BR"
                      ? "🇧🇷"
                      : selectedCountry === "PT"
                      ? "🇵🇹"
                      : "🌍"}
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    {selectedCountry === "BR"
                      ? "Brasil"
                      : selectedCountry === "PT"
                      ? "Portugal"
                      : "Internacional"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Moeda: {getCurrencyInfo().currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-lg p-1 shadow-sm border border-border">
            <div className="flex">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className="px-6"
              >
                Mensal
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className="px-6 relative"
              >
                Anual
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs"
                >
                  -17%
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.id
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              } ${
                plan.recommended ? "border-primary shadow-md" : "border-border"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white">
                  Recomendado
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(getPlanPrices(plan)[billingCycle])}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{billingCycle === "monthly" ? "mês" : "ano"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Economize{" "}
                      {getDiscountPercentage(
                        getPlanPrices(plan).monthly,
                        getPlanPrices(plan).yearly
                      )}
                      %
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-foreground"
                    >
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limits */}
                {(plan.maxProfessionals || plan.maxLocations) && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground space-y-1">
                      {plan.maxProfessionals && (
                        <div>
                          Máx. {plan.maxProfessionals}{" "}
                          {plan.maxProfessionals === 1
                            ? "profissional"
                            : "profissionais"}
                        </div>
                      )}
                      {plan.maxLocations && (
                        <div>
                          Máx. {plan.maxLocations}{" "}
                          {plan.maxLocations === 1
                            ? "localização"
                            : "localizações"}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 flex justify-center">
                    <Badge variant="default" className="bg-blue-500 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Selecionado
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {!selectedPlan && (
            <p className="text-sm text-muted-foreground mt-2">
              Selecione um plano para continuar
            </p>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/onboarding/country-selection")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar para seleção de país
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mt-12">
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
                2
              </div>
              <span className="text-xs text-muted-foreground mt-1">Plano</span>
            </div>

            <div className="flex-1 h-px bg-border mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
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

export default PlanSelectionPage;
