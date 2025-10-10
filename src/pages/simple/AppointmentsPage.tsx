import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/interfaces/appointment.interface";

/**
 * Simple Booking Appointments Page
 * For simple_booking plan - focuses only on appointment management
 * NO financial features (payment, commission, etc)
 */
const SimpleBookingAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "confirmed" | "completed" | "canceled"
  >("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const stored = localStorage.getItem("mock_appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  };

  const handleStatusChange = (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    localStorage.setItem("mock_appointments", JSON.stringify(updated));
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-500";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500";
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "canceled":
        return "bg-red-500/10 text-red-500";
      case "in_progress":
        return "bg-purple-500/10 text-purple-500";
      case "no_show":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusLabel = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "canceled":
        return "Cancelado";
      case "in_progress":
        return "Em Andamento";
      case "no_show":
        return "Não Compareceu";
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">
            Agendamentos
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Gerencie os agendamentos dos seus clientes
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Todos ({appointments.length})
          </Button>
          <Button
            variant={filter === "scheduled" ? "default" : "outline"}
            onClick={() => setFilter("scheduled")}
            size="sm"
          >
            Agendados (
            {appointments.filter((a) => a.status === "scheduled").length})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            size="sm"
          >
            Confirmados (
            {appointments.filter((a) => a.status === "confirmed").length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            size="sm"
          >
            Concluídos (
            {appointments.filter((a) => a.status === "completed").length})
          </Button>
          <Button
            variant={filter === "canceled" ? "default" : "outline"}
            onClick={() => setFilter("canceled")}
            size="sm"
          >
            Cancelados (
            {appointments.filter((a) => a.status === "canceled").length})
          </Button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-[var(--color-muted-foreground)]" />
              <p className="text-[var(--color-muted-foreground)]">
                Nenhum agendamento encontrado.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {appointment.customer}
                      </CardTitle>
                      <CardDescription>
                        {appointment.email} • {appointment.phone}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Service Info */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Serviço:</span>
                      <span className="text-[var(--color-muted-foreground)]">
                        {appointment.serviceName}
                      </span>
                    </div>

                    {/* Professional Info */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Profissional:</span>
                      <span className="text-[var(--color-muted-foreground)]">
                        {appointment.professionalName}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.customerNotes && (
                      <div className="text-sm">
                        <span className="font-semibold">Observações:</span>
                        <p className="text-[var(--color-muted-foreground)] mt-1">
                          {appointment.customerNotes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      {appointment.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(appointment.id!, "confirmed")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(appointment.id!, "canceled")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(appointment.id!, "completed")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Concluído
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SimpleBookingAppointmentsPage;
