import { useState, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Appointment } from "@/interfaces/appointment.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, List, X } from "lucide-react";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment?: (appointment: Appointment) => void;
  onDateClick?: (date: Date) => void;
}

export function AppointmentCalendar({
  appointments,
  onSelectAppointment,
  onDateClick,
}: AppointmentCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Convert appointments to calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return appointments.map((appointment) => {
      const start = new Date(appointment.date);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + appointment.duration);

      return {
        id: appointment.id,
        title: `${appointment.customer} - ${appointment.serviceName}`,
        start,
        end,
        resource: appointment,
      };
    });
  }, [appointments]);

  // Handle event selection
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEvent(event);
      setShowEventDialog(true);
      if (onSelectAppointment) {
        onSelectAppointment(event.resource);
      }
    },
    [onSelectAppointment]
  );

  // Handle date slot selection
  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      if (onDateClick) {
        onDateClick(slotInfo.start);
      }
    },
    [onDateClick]
  );

  // Custom event style based on appointment status
  const eventStyleGetter = (event: CalendarEvent) => {
    const appointment = event.resource;
    let backgroundColor = "#3b82f6"; // default blue

    switch (appointment.status) {
      case "scheduled":
        backgroundColor = "#3b82f6"; // blue
        break;
      case "confirmed":
        backgroundColor = "#10b981"; // green
        break;
      case "in_progress":
        backgroundColor = "#f59e0b"; // orange
        break;
      case "completed":
        backgroundColor = "#6366f1"; // indigo
        break;
      case "canceled":
        backgroundColor = "#ef4444"; // red
        break;
      case "no_show":
        backgroundColor = "#6b7280"; // gray
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.875rem",
        padding: "2px 5px",
      },
    };
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
    return colors[status] || colors.scheduled;
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Visualização de Agendamentos
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Mês
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Semana
              </Button>
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Dia
              </Button>
              <Button
                variant={view === "agenda" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("agenda")}
              >
                <List className="h-4 w-4 mr-1" />
                Agenda
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="text-sm">Em Andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-500"></div>
              <span className="text-sm">Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Cancelado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-500"></div>
              <span className="text-sm">Não Compareceu</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="appointment-calendar" style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há agendamentos neste período.",
                showMore: (total: number) => `+ ${total} mais`,
              }}
              culture="pt-BR"
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Detalhes do Agendamento
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>
                ID: {selectedEvent.resource.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <Badge
                  className={getStatusColor(selectedEvent.resource.status)}
                >
                  {getStatusText(selectedEvent.resource.status)}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Cliente
                  </label>
                  <p className="font-semibold">
                    {selectedEvent.resource.customer}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p>{selectedEvent.resource.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Telefone
                  </label>
                  <p>{selectedEvent.resource.phone}</p>
                </div>
              </div>

              {/* Service Info */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Serviço
                    </label>
                    <p className="font-semibold">
                      {selectedEvent.resource.serviceName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Duração
                    </label>
                    <p>{selectedEvent.resource.duration} minutos</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Valor
                    </label>
                    <p className="font-semibold text-green-600">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(
                          selectedEvent.resource.price ||
                            selectedEvent.resource.finalPrice
                        )}
                      </p>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Horário
                    </label>
                    <p>
                      {formatTime(selectedEvent.start)} -{" "}
                      {formatTime(selectedEvent.end)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedEvent.resource.notes && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-600">
                    Observações
                  </label>
                  <p className="text-sm mt-1">{selectedEvent.resource.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
