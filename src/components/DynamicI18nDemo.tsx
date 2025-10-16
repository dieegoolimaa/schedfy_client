import React from "react";
import {
  DynamicI18nProvider,
  useDynamicI18n,
  useFormTranslations,
  useAppointmentTranslations,
  usePaymentTranslations,
} from "../hooks/useDynamicI18n";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LocalizationProvider } from "../hooks/useLocalization";

// Componente para testar as traduções
const I18nTestComponent: React.FC = () => {
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
  const testAmount = 150.75;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Localização Dinâmica</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{locale}</Badge>
            <Button
              size="sm"
              onClick={() => changeLanguage("pt-BR")}
              variant={locale === "pt-BR" ? "default" : "outline"}
            >
              Brasil
            </Button>
            <Button
              size="sm"
              onClick={() => changeLanguage("pt-PT")}
              variant={locale === "pt-PT" ? "default" : "outline"}
            >
              Portugal
            </Button>
            <Button
              size="sm"
              onClick={() => changeLanguage("en")}
              variant={locale === "en" ? "default" : "outline"}
            >
              English
            </Button>
            <Button
              size="sm"
              onClick={() => changeLanguage("es")}
              variant={locale === "es" ? "default" : "outline"}
            >
              Español
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formatação */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Formatação</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Moeda:</span>{" "}
                {formatCurrency(testAmount)}
              </div>
              <div>
                <span className="font-medium">Data:</span>{" "}
                {formatDate(testDate)}
              </div>
              <div>
                <span className="font-medium">Horário:</span>{" "}
                {formatTime(testDate)}
              </div>
              <div>
                <span className="font-medium">Número:</span>{" "}
                {formatCurrency(1234.56)}
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Métodos de Pagamento</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "pix",
                "mb_way",
                "multibanco",
                "credit_card",
                "debit_card",
                "boleto",
              ].map((method) => (
                <Badge key={method} variant="secondary">
                  {getPaymentMethodName(method)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Labels */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Agendamento:</span>
                <div className="flex gap-2 mt-1">
                  {["pending", "confirmed", "completed", "cancelled"].map(
                    (status) => (
                      <Badge key={status} variant="outline">
                        {getStatusLabel(status, "appointment")}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium">Pagamento:</span>
                <div className="flex gap-2 mt-1">
                  {["pending", "processing", "completed", "failed"].map(
                    (status) => (
                      <Badge key={status} variant="outline">
                        {getStatusLabel(status, "payment")}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagens de Erro */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Mensagens de Erro</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {[
                "network_error",
                "server_error",
                "payment_failed",
                "appointment_conflict",
              ].map((errorCode) => (
                <div key={errorCode} className="text-red-600">
                  <span className="font-medium">{errorCode}:</span>{" "}
                  {getErrorMessage(errorCode)}
                </div>
              ))}
            </div>
          </div>

          {/* Traduções de Formulário */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Traduções de Formulário
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Nome:</span>{" "}
                {formTranslations.name}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                {formTranslations.email}
              </div>
              <div>
                <span className="font-medium">Telefone:</span>{" "}
                {formTranslations.phone}
              </div>
              <div>
                <span className="font-medium">Data:</span>{" "}
                {formTranslations.date}
              </div>
              <div>
                <span className="font-medium">Salvar:</span>{" "}
                {formTranslations.save}
              </div>
              <div>
                <span className="font-medium">Cancelar:</span>{" "}
                {formTranslations.cancel}
              </div>
            </div>
          </div>

          {/* Traduções de Agendamento */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Traduções de Agendamento
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="font-medium">Agendar:</span>{" "}
                {appointmentTranslations.bookAppointment}
              </div>
              <div>
                <span className="font-medium">Escolher Serviço:</span>{" "}
                {appointmentTranslations.selectService}
              </div>
              <div>
                <span className="font-medium">Escolher Profissional:</span>{" "}
                {appointmentTranslations.selectProfessional}
              </div>
              <div>
                <span className="font-medium">Duração:</span>{" "}
                {appointmentTranslations.duration(45)}
              </div>
            </div>
          </div>

          {/* Traduções de Pagamento */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Traduções de Pagamento
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Método:</span>{" "}
                {paymentTranslations.paymentMethod}
              </div>
              <div>
                <span className="font-medium">Resumo:</span>{" "}
                {paymentTranslations.paymentSummary}
              </div>
              <div>
                <span className="font-medium">Subtotal:</span>{" "}
                {paymentTranslations.subtotal}
              </div>
              <div>
                <span className="font-medium">Taxa:</span>{" "}
                {paymentTranslations.fee}
              </div>
              <div>
                <span className="font-medium">Total:</span>{" "}
                {paymentTranslations.total}
              </div>
              <div>
                <span className="font-medium">Processando:</span>{" "}
                {paymentTranslations.processing}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente principal com os provedores
const DynamicI18nDemo: React.FC = () => {
  return (
    <LocalizationProvider>
      <DynamicI18nProvider>
        <I18nTestComponent />
      </DynamicI18nProvider>
    </LocalizationProvider>
  );
};

export default DynamicI18nDemo;
