import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentCard } from "@/components/AppointmentCard";
import type { Appointment } from "@/interfaces/appointment.interface";
import { toast } from "sonner";

// Mock do agendamento similar ao da imagem
const mockAppointment: Appointment = {
  id: "demo_maria",
  serviceId: "service_002",
  serviceName: "Manicure",
  professionalId: "2",
  professionalName: "Maria Silva",

  customer: "Maria Silva",
  email: "maria@email.com",
  phone: "(11) 99999-1111",
  customerNotes: "Cliente prefere bem curto",

  date: "2025-10-12T00:00:00Z",
  time: "09:00",
  duration: 60,
  status: "confirmed",

  originalPrice: 50.0,
  finalPrice: 50.0,
  totalDiscountAmount: 0,

  commission: {
    professionalPercentage: 70,
    establishmentPercentage: 30,
    baseAmount: 50.0,
    professionalAmount: 35.0,
    establishmentAmount: 15.0,
  },

  payment: {
    method: "pending",
    status: "pending",
  },

  createdAt: "2025-10-11T10:00:00Z",
  updatedAt: "2025-10-11T11:00:00Z",
  confirmedAt: "2025-10-11T11:00:00Z",
};

export default function ProfessionalAppointmentDemo() {
  const [appointment, setAppointment] = useState<Appointment>(mockAppointment);

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    console.log(`📅 Agendamento ${appointmentId} alterado para: ${newStatus}`);

    setAppointment((prev) => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(newStatus === "completed" && {
        completedAt: new Date().toISOString(),
      }),
    }));

    toast.success(
      `Agendamento ${newStatus === "completed" ? "finalizado" : "atualizado"}!`
    );
  };

  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-emerald-100 text-emerald-800",
      canceled: "bg-red-100 text-red-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return colors[status];
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
    return texts[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              👩‍💼 Dashboard do Profissional
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p>
                🎯 <strong>Objetivo:</strong> Testar o pop-up de finalização de
                serviço
              </p>
              <p>
                📋 <strong>Cenário:</strong> Agendamento confirmado pronto para
                ser finalizado
              </p>
              <p>
                ✨ <strong>Funcionalidades:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Criação opcional de perfil do cliente</li>
                <li>Registro de informações de pagamento</li>
                <li>Fluxo guiado em 2 etapas</li>
                <li>Validação e confirmação final</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📅 Próximo Agendamento</h3>

          <AppointmentCard
            appointment={appointment}
            onStatusChange={handleStatusChange}
          />
        </div>

        {appointment.status === "completed" && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="font-semibold">Serviço Finalizado!</h4>
                  <p className="text-sm">
                    O agendamento foi concluído com sucesso. Os dados foram
                    processados e estão prontos para integração.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 Como usar:
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>
                Clique no botão <strong>"Finalizar"</strong> no card do
                agendamento
              </li>
              <li>Escolha se deseja criar um perfil para o cliente</li>
              <li>Preencha os dados de pagamento</li>
              <li>Confirme os detalhes no resumo final</li>
              <li>
                Clique em <strong>"Finalizar Serviço"</strong>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
