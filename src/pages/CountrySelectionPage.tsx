import React, { useState } from "react";
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
import { ArrowRight, ArrowLeft, MapPin, Check } from "lucide-react";
import { useCountryLocalization } from "@/hooks/useCountryLocalization";

export type Country = "BR" | "PT" | "OTHER";

interface CountryOption {
  id: Country;
  name: string;
  flag: string;
  currency: string;
  features: string[];
  comingSoon?: boolean;
  popular?: boolean;
}

const countries: CountryOption[] = [
  {
    id: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    currency: "BRL (R$)",
    features: [
      "Horário comercial brasileiro",
      "Fuso horário GMT-3",
      "Formato de data brasileiro",
      "Suporte em português",
      "Preços em reais (R$)",
    ],
    popular: true,
  },
  {
    id: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    currency: "EUR (€)",
    features: [
      "Horário comercial português",
      "Fuso horário GMT+0/+1",
      "Formato de data europeu",
      "Suporte em português europeu",
      "Preços em euros (€)",
    ],
  },
  {
    id: "OTHER",
    name: "Outro País",
    flag: "🌍",
    currency: "USD ($)",
    features: [
      "Horário comercial personalizado",
      "Fuso horário configurável",
      "Formato internacional",
      "Suporte em inglês",
      "Preços em dólares ($)",
    ],
    comingSoon: true,
  },
];

const CountrySelectionPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const navigate = useNavigate();
  const { updateCountry } = useCountryLocalization();

  const handleContinue = () => {
    if (!selectedCountry) return;

    // Armazenar a escolha do país e atualizar o contexto de localização
    localStorage.setItem("selectedCountry", selectedCountry);
    updateCountry(selectedCountry);

    // Redirecionar para seleção de planos
    navigate("/onboarding/plan-selection");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Onde Você Está?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione seu país para personalizar sua experiência com métodos de
            pagamento, moeda e recursos específicos da região.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {countries.map((country) => (
            <Card
              key={country.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCountry === country.id
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              } ${
                country.comingSoon
                  ? "opacity-60"
                  : country.popular
                  ? "border-primary shadow-md"
                  : "border-border"
              }`}
              onClick={() =>
                !country.comingSoon && setSelectedCountry(country.id)
              }
            >
              {country.popular && !country.comingSoon && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-500 text-white">
                  Mais Popular
                </Badge>
              )}

              {country.comingSoon && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground">
                  Em Breve
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">{country.flag}</div>
                <CardTitle className="text-2xl font-bold">
                  {country.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {country.currency}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Features */}
                <ul className="space-y-2">
                  {country.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start text-foreground"
                    >
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedCountry === country.id && (
                  <div className="mt-4 flex justify-center">
                    <Badge variant="default" className="bg-blue-500 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Selecionado
                    </Badge>
                  </div>
                )}

                {country.comingSoon && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Disponível em breve
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
            className="px-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedCountry}
            size="lg"
            className="px-8"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {!selectedCountry && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Selecione um país para continuar
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mt-12">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="text-xs text-muted-foreground mt-1">País</span>
            </div>

            <div className="flex-1 h-px bg-border mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
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

export default CountrySelectionPage;
