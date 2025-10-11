import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/interfaces/appointment.interface";
import {
  ServiceCompletionDialog,
  type ServiceCompletionData,
} from "./ServiceCompletionDialog";
import { toast } from "sonner";
import {
  ConfirmCancelDialog,
  ConfirmStartDialog,
  ConfirmCompleteDialog,
} from "@/components/dialogs/ConfirmDialogs";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => void;
}

export function AppointmentCard({
  appointment,
  onStatusChange,
}: AppointmentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<
    "cancel" | "start" | "complete" | null
  >(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      in_progress:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      no_show: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const getStatusText = (status: Appointment["status"]) => {
    const texts = {
      scheduled: "Agendado",
      confirmed: "Confirmado",
      in_progress: "Em Andamento",
      completed: "Concluído",
      canceled: "Cancelado",
      no_show: "Não Compareceu",
    };
    return texts[status] || status;
  };

  const handleStatusChange = async (newStatus: Appointment["status"]) => {
    setIsLoading(true);
    try {
      if (onStatusChange) {
        await onStatusChange(appointment.id, newStatus);
        toast(`Agendamento ${getStatusText(newStatus).toLowerCase()}`);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status do agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceCompletion = (completionData: ServiceCompletionData) => {
    // Aqui você pode salvar os dados de finalização do serviço
    console.log("Dados de finalização:", completionData);

    // Atualizar o status do agendamento para concluído
    handleStatusChange("completed");

    // Aqui seria integrado com o backend para:
    // 1. Criar perfil do cliente (se solicitado)
    // 2. Registrar informações de pagamento
    // 3. Salvar dados de comissão
    // 4. Enviar notificações

    toast.success(
      `Serviço finalizado! ${
        completionData.createCustomerProfile ? "Perfil do cliente criado." : ""
      }`
    );
  };

  const hasDiscounts = appointment.totalDiscountAmount > 0;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {appointment.serviceName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {appointment.customer} • {formatDate(appointment.date)} às{" "}
              {appointment.time}
            </p>
          </div>
          <Badge
            className={`${getStatusColor(
              appointment.status
            )} text-xs ml-2 shrink-0`}
          >
            {getStatusText(appointment.status)}
          </Badge>
        </div>

        {/* Grid de informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Contato */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Contato
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
              {appointment.email}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {appointment.phone}
            </p>
          </div>

          {/* Profissional */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Profissional
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {appointment.professionalName}
            </p>
          </div>

          {/* Valores */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Valores
            </h4>
            <div className="space-y-0.5">
              {hasDiscounts && (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 line-through">
                      {formatCurrency(appointment.originalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Desconto:</span>
                    <span>
                      -{formatCurrency(appointment.totalDiscountAmount)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-xs font-medium">
                <span>Total:</span>
                <span>{formatCurrency(appointment.finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vouchers aplicados */}
        {appointment.appliedVouchers &&
          appointment.appliedVouchers.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vouchers Aplicados
              </h4>
              <div className="flex flex-wrap gap-1">
                {appointment.appliedVouchers.map((voucher) => (
                  <Badge
                    key={voucher.id}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    {voucher.code} - {voucher.description}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Comissão e Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comissão
            </h4>
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Profissional ({appointment.commission.professionalPercentage}
                  %):
                </span>
                <span className="font-medium">
                  {formatCurrency(appointment.commission.professionalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Estabelecimento (
                  {appointment.commission.establishmentPercentage}%):
                </span>
                <span className="font-medium">
                  {formatCurrency(appointment.commission.establishmentAmount)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pagamento
            </h4>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  appointment.payment.status === "paid"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {appointment.payment.status === "paid" ? "Pago" : "Pendente"}
              </Badge>
              <span className="text-xs text-gray-600">
                {appointment.payment.method === "pending"
                  ? "Método não definido"
                  : appointment.payment.method.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Observações */}
        {(appointment.customerNotes || appointment.professionalNotes) && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações
            </h4>
            <div className="space-y-1">
              {appointment.customerNotes && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Cliente:</span>{" "}
                  {appointment.customerNotes}
                </p>
              )}
              {appointment.professionalNotes && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Profissional:</span>{" "}
                  {appointment.professionalNotes}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Avaliação */}
        {appointment.rating && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avaliação
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${
                      star <= appointment.rating!.score
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {appointment.rating.score}/5
              </span>
            </div>
            {appointment.rating.comment && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                "{appointment.rating.comment}"
              </p>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          {appointment.status === "scheduled" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("confirmed")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDialog("start")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Iniciar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmDialog("cancel")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Cancelar
              </Button>
            </>
          )}

          {appointment.status === "confirmed" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDialog("start")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Iniciar
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmDialog("complete")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Finalizar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmDialog("cancel")}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                Cancelar
              </Button>
            </>
          )}

          {appointment.status === "in_progress" && (
            <Button
              size="sm"
              onClick={() => setConfirmDialog("complete")}
              disabled={isLoading}
              className="h-7 px-2 text-xs"
            >
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>

      {/* Confirmation Dialogs */}
      <ConfirmCancelDialog
        open={confirmDialog === "cancel"}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          setConfirmDialog(null);
          handleStatusChange("canceled");
        }}
        appointmentId={appointment.id}
        customerName={appointment.customer}
      />
      <ConfirmStartDialog
        open={confirmDialog === "start"}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          setConfirmDialog(null);
          handleStatusChange("in_progress");
        }}
        customerName={appointment.customer}
      />
      <ConfirmCompleteDialog
        open={confirmDialog === "complete"}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          setConfirmDialog(null);
          setShowCompletionDialog(true);
        }}
        customerName={appointment.customer}
      />

      {/* Diálogo de finalização do serviço */}
      <ServiceCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        appointment={appointment}
        onComplete={handleServiceCompletion}
      />
    </Card>
  );
}
