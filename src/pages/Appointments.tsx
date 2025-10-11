import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import professionals from "@/mock-data/professional";
import type { Appointment } from "@/interfaces/appointment.interface";

// Mock data de agendamentos
const mockAppointments: Appointment[] = [
  {
    id: "1",
    serviceId: "1",
    serviceName: "Manicure",
    professionalId: "1",
    professionalName: "José da Silva",
    customer: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-1111",
    date: "2024-12-10T00:00:00.000Z",
    time: "09:00",
    duration: 60,
    status: "confirmed",
    originalPrice: 50,
    finalPrice: 50,
    totalDiscountAmount: 0,
    commission: {
      professionalPercentage: 70,
      establishmentPercentage: 30,
      baseAmount: 50,
      professionalAmount: 35,
      establishmentAmount: 15,
    },
    payment: {
      method: "card",
      status: "pending",
    },
    customerNotes: "Cliente prefere bem curto",
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: "2",
    serviceId: "2",
    serviceName: "Manicure Francesinha",
    professionalId: "1",
    professionalName: "José da Silva",
    customer: "João Santos",
    email: "joao@email.com",
    phone: "(11) 99999-2222",
    date: "2024-12-10T00:00:00.000Z",
    time: "14:30",
    duration: 90,
    status: "confirmed",
    originalPrice: 80,
    finalPrice: 80,
    totalDiscountAmount: 0,
    commission: {
      professionalPercentage: 70,
      establishmentPercentage: 30,
      baseAmount: 80,
      professionalAmount: 56,
      establishmentAmount: 24,
    },
    payment: {
      method: "pix",
      status: "paid",
      paidAmount: 80,
      paymentDate: "2024-12-01T00:00:00.000Z",
    },
    customerNotes: "Primeira vez, explicar procedimentos",
    createdAt: "2024-12-02T00:00:00.000Z",
    updatedAt: "2024-12-02T00:00:00.000Z",
  },
  {
    id: "3",
    serviceId: "3",
    serviceName: "Limpeza de Pele",
    professionalId: "3",
    professionalName: "Ana Costa",
    customer: "Ana Costa Cliente",
    email: "ana@email.com",
    phone: "(11) 99999-3333",
    date: "2024-12-11T00:00:00.000Z",
    time: "10:00",
    duration: 120,
    status: "scheduled",
    originalPrice: 120,
    finalPrice: 120,
    totalDiscountAmount: 0,
    commission: {
      professionalPercentage: 70,
      establishmentPercentage: 30,
      baseAmount: 120,
      professionalAmount: 84,
      establishmentAmount: 36,
    },
    payment: {
      method: "card",
      status: "pending",
    },
    customerNotes: "Cliente tem pele sensível",
    createdAt: "2024-12-03T00:00:00.000Z",
    updatedAt: "2024-12-03T00:00:00.000Z",
  },
  {
    id: "4",
    serviceId: "1",
    serviceName: "Manicure",
    professionalId: "1",
    professionalName: "José da Silva",
    customer: "Carlos Oliveira",
    email: "carlos@email.com",
    phone: "(11) 99999-4444",
    date: "2024-12-12T00:00:00.000Z",
    time: "16:00",
    duration: 60,
    status: "confirmed",
    originalPrice: 50,
    finalPrice: 50,
    totalDiscountAmount: 0,
    commission: {
      professionalPercentage: 70,
      establishmentPercentage: 30,
      baseAmount: 50,
      professionalAmount: 35,
      establishmentAmount: 15,
    },
    payment: {
      method: "cash",
      status: "pending",
    },
    createdAt: "2024-12-04T00:00:00.000Z",
    updatedAt: "2024-12-04T00:00:00.000Z",
  },
];

// Componente de Card Compacto
interface CompactAppointmentCardProps {
  appointment: Appointment;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const CompactAppointmentCard = ({
  appointment,
  isExpanded,
  onToggleExpand,
}: CompactAppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "no_show":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "scheduled":
        return "Agendado";
      case "in_progress":
        return "Em Andamento";
      case "completed":
        return "Finalizado";
      case "canceled":
        return "Cancelado";
      case "no_show":
        return "Não Compareceu";
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onToggleExpand}
    >
      <CardContent className="p-4">
        {/* Visualização Compacta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {appointment.customer
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm truncate">
                  {appointment.customer}
                </h3>
                <Badge
                  className={`text-xs px-2 py-0.5 ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusText(appointment.status)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{appointment.time}</span>
                </div>
                <div className="hidden sm:block truncate">
                  {appointment.serviceName}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hidden sm:block">
              {formatCurrency(appointment.finalPrice)}
            </span>
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </div>

        {/* Visualização Expandida */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-gray-400" />
                  <span className="font-medium">Cliente:</span>
                  <span>{appointment.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{appointment.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  <span className="font-medium">Telefone:</span>
                  <span>{appointment.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Serviço:</span>
                  <span>{appointment.serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Duração:</span>
                  <span>{appointment.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Valor:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(appointment.finalPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Pagamento:</span>
                  <Badge
                    variant={
                      appointment.payment.status === "paid"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {appointment.payment.status === "paid"
                      ? "Pago"
                      : "Pendente"}
                  </Badge>
                </div>
              </div>
            </div>

            {appointment.customerNotes && (
              <div className="flex items-start gap-2">
                <MessageSquare className="size-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium text-sm">Observações:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {appointment.customerNotes}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="text-xs">
                Editar
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Cancelar
              </Button>
              {appointment.status === "confirmed" && (
                <Button size="sm" className="text-xs">
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Appointments = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Encontrar o profissional
  const professional = professionals.find((p) => p.id?.toString() === id);

  // Filtrar agendamentos por profissional
  const professionalAppointments = useMemo(() => {
    return mockAppointments.filter(
      (appointment) => appointment.professionalId === id
    );
  }, [id]);

  // Aplicar filtros
  const filteredAppointments = useMemo(() => {
    return professionalAppointments.filter((appointment) => {
      const matchesSearch =
        appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = appointmentDate.getTime() === today.getTime();
      } else if (dateFilter === "week") {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        matchesDate =
          appointmentDate >= today && appointmentDate <= weekFromNow;
      } else if (dateFilter === "month") {
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(today.getMonth() + 1);
        matchesDate =
          appointmentDate >= today && appointmentDate <= monthFromNow;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [professionalAppointments, searchTerm, statusFilter, dateFilter]);

  const toggleCardExpansion = (appointmentId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

  if (!professional) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profissional não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            O profissional com ID {id} não foi encontrado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="size-12">
            <AvatarImage src={professional.photo} alt={professional.name} />
            <AvatarFallback className="bg-blue-500 text-white">
              {professional.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Agendamentos - {professional.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {professional.specialty} • {filteredAppointments.length}{" "}
              agendamento(s)
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <Input
                placeholder="Buscar por cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Finalizado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="no_show">Não Compareceu</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">7 dias</SelectItem>
                    <SelectItem value="month">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <CalendarDays className="size-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "Tente ajustar os filtros para ver mais resultados."
                    : "Este profissional ainda não possui agendamentos."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <CompactAppointmentCard
              key={appointment.id}
              appointment={appointment}
              isExpanded={expandedCards.has(appointment.id)}
              onToggleExpand={() => toggleCardExpansion(appointment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
