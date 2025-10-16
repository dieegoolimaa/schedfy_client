import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { LocalizationProvider } from "../hooks/useLocalization";
import {
  DynamicI18nProvider,
  useDynamicI18n,
  useFormTranslations,
  useAppointmentTranslations,
  usePaymentTranslations,
} from "../hooks/useDynamicI18n";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { MapPin, CreditCard, Globe, Calendar, DollarSign } from "lucide-react";

// Componente demonstração completa
const LocalizationShowcase: React.FC = () => {
  const {
    locale,
    changeLanguage,
    formatCurrency,
    formatDate,
    formatTime,
    getPaymentMethodName,
    getStatusLabel,
    getErrorMessage,
  } = useDynamicI18n();

  const formTranslations = useFormTranslations();
  const appointmentTranslations = useAppointmentTranslations();
  const paymentTranslations = usePaymentTranslations();

  const testDate = new Date();
  const testAmount = 89.5;

  // Estados de teste
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<string>("");

  const getRegionInfo = () => {
    switch (locale) {
      case "pt-PT":
        return {
          region: "Portugal",
          currency: "EUR",
          flag: "🇵🇹",
          timezone: "Europe/Lisbon",
          tax: "23% IVA",
          primaryMethods: ["MB WAY", "Multibanco"],
        };
      case "pt-BR":
        return {
          region: "Brasil",
          currency: "BRL",
          flag: "🇧🇷",
          timezone: "America/Sao_Paulo",
          tax: "Sem IVA",
          primaryMethods: ["PIX", "Boleto"],
        };
      case "en":
        return {
          region: "USA",
          currency: "USD",
          flag: "🇺🇸",
          timezone: "America/New_York",
          tax: "Sales Tax varies",
          primaryMethods: ["Credit Card", "Debit Card"],
        };
      case "es":
        return {
          region: "España",
          currency: "EUR",
          flag: "🇪🇸",
          timezone: "Europe/Madrid",
          tax: "21% IVA",
          primaryMethods: ["Tarjeta de Crédito", "Transferencia"],
        };
      default:
        return {
          region: "Brasil",
          currency: "BRL",
          flag: "🇧🇷",
          timezone: "America/Sao_Paulo",
          tax: "Sem IVA",
          primaryMethods: ["PIX", "Boleto"],
        };
    }
  };

  const regionInfo = getRegionInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Globe className="h-8 w-8" />
              Sistema de Localização Dinâmica Schedfy
            </CardTitle>
            <p className="text-indigo-100 text-lg">
              Adaptação automática para Portugal e Brasil - Pagamentos, Moedas,
              Impostos e Traduções
            </p>
          </CardHeader>
        </Card>

        {/* Seletor de Região */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Escolha sua Região
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => changeLanguage("pt-BR")}
                variant={locale === "pt-BR" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                🇧🇷 Brasil
              </Button>
              <Button
                onClick={() => changeLanguage("pt-PT")}
                variant={locale === "pt-PT" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                🇵🇹 Portugal
              </Button>
              <Button
                onClick={() => changeLanguage("en")}
                variant={locale === "en" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                🇺🇸 English
              </Button>
              <Button
                onClick={() => changeLanguage("es")}
                variant={locale === "es" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                🇪🇸 Español
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Região Atual */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {regionInfo.flag} Configuração Atual: {regionInfo.region}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="font-semibold">{regionInfo.currency}</p>
                <p className="text-sm text-gray-600">Moeda</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold">{formatTime(testDate)}</p>
                <p className="text-sm text-gray-600">Horário Local</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">{regionInfo.tax}</p>
                <p className="text-sm text-gray-600">Impostos</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="w-full justify-center">
                  {formatDate(testDate)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formatação de Valores */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Formatação de Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Valor do Serviço:</span>
                  <Badge variant="secondary" className="text-lg">
                    {formatCurrency(testAmount)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Taxa de Processamento:</span>
                  <Badge variant="outline">
                    {formatCurrency(testAmount * 0.029)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                  <span className="font-semibold">Total Final:</span>
                  <Badge variant="default" className="text-lg bg-green-600">
                    {formatCurrency(testAmount * 1.029)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status e Labels */}
          <Card>
            <CardHeader>
              <CardTitle>🏷️ Status e Labels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Agendamentos:</h4>
                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "completed", "cancelled"].map(
                    (status) => (
                      <Badge key={status} variant="outline">
                        {getStatusLabel(status, "appointment")}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Pagamentos:</h4>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "completed", "failed"].map(
                    (status) => (
                      <Badge key={status} variant="outline">
                        {getStatusLabel(status, "payment")}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {paymentTranslations.paymentMethod}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Métodos disponíveis para {regionInfo.region}:{" "}
              {regionInfo.primaryMethods.join(", ")}
            </p>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector
              amount={testAmount}
              selectedMethodId={selectedPaymentMethod}
              onPaymentMethodChange={(
                methodId: string,
                feeCalculation: any
              ) => {
                setSelectedPaymentMethod(methodId);
                console.log(
                  "Método selecionado:",
                  methodId,
                  "Cálculo:",
                  feeCalculation
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Traduções de Interface */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📝 Formulários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nome:</span>
                <span className="font-medium">{formTranslations.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{formTranslations.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Telefone:</span>
                <span className="font-medium">{formTranslations.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Salvar:</span>
                <span className="font-medium">{formTranslations.save}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelar:</span>
                <span className="font-medium">{formTranslations.cancel}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📅 Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Agendar:</span>
                <span className="font-medium">
                  {appointmentTranslations.bookAppointment}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Serviço:</span>
                <span className="font-medium">
                  {appointmentTranslations.selectService}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Profissional:</span>
                <span className="font-medium">
                  {appointmentTranslations.selectProfessional}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Confirmar:</span>
                <span className="font-medium">
                  {appointmentTranslations.confirm}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duração:</span>
                <span className="font-medium">
                  {appointmentTranslations.duration(45)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💳 Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-medium">
                  {paymentTranslations.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resumo:</span>
                <span className="font-medium">
                  {paymentTranslations.paymentSummary}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {paymentTranslations.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa:</span>
                <span className="font-medium">{paymentTranslations.fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{paymentTranslations.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mensagens de Erro */}
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Mensagens de Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "network_error",
                "server_error",
                "payment_failed",
                "appointment_conflict",
              ].map((errorCode) => (
                <div
                  key={errorCode}
                  className="p-3 bg-red-50 border border-red-200 rounded"
                >
                  <p className="text-sm font-medium text-red-800">
                    {errorCode.replace("_", " ").toUpperCase()}
                  </p>
                  <p className="text-red-600 text-sm">
                    {getErrorMessage(errorCode)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer de informações técnicas */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                <strong>Localização Ativa:</strong> {locale} |{" "}
                <strong>Região:</strong> {regionInfo.region}
              </p>
              <p>
                <strong>Moeda:</strong> {regionInfo.currency} |{" "}
                <strong>Fuso:</strong> {regionInfo.timezone}
              </p>
              <p>
                <strong>Sistema Integrado:</strong> Localização + I18n +
                Formatação + Pagamentos
              </p>
              <Badge variant="outline" className="mt-2">
                Schedfy Dynamic Localization System v1.0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente principal com providers
const LocalizationComplete: React.FC = () => {
  return (
    <LocalizationProvider>
      <DynamicI18nProvider>
        <LocalizationShowcase />
      </DynamicI18nProvider>
    </LocalizationProvider>
  );
};

export default LocalizationComplete;
