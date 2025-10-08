"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/AppointmentCard";
import appointments from "@/mock-data/appointments";
import type { Appointment } from "@/interfaces/appointment.interface";
import { toast } from "sonner";

const AppointmentManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [professionalFilter, setProfessionalFilter] = useState<string>("all");

  // Filtros
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    const matchesProfessional = professionalFilter === "all" || 
      appointment.professionalId === professionalFilter;

    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      
      switch (dateFilter) {
        case "today":
          return appointmentDate.toDateString() === today.toDateString();
        case "week":
          const weekFromNow = new Date();
          weekFromNow.setDate(today.getDate() + 7);
          return appointmentDate >= today && appointmentDate <= weekFromNow;
        case "month":
          return appointmentDate.getMonth() === today.getMonth() && 
                 appointmentDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    };

    return matchesSearch && matchesStatus && matchesProfessional && matchesDate();
  });

  // Estatísticas
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    canceled: appointments.filter(apt => apt.status === 'canceled').length,
    revenue: appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.finalPrice, 0),
    commission: appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.commission.establishmentAmount, 0)
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    console.log(`Admin updating appointment ${appointmentId} to ${newStatus}`);
    toast(`Agendamento ${appointmentId} atualizado para: ${newStatus}`);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log(`Bulk action ${action} for appointments:`, selectedIds);
    toast(`Ação ${action} aplicada a ${selectedIds.length} agendamento(s)`);
  };

  // Profissionais únicos para filtro
  const professionals = Array.from(
    new Set(appointments.map(apt => apt.professionalId))
  ).map(id => {
    const appointment = appointments.find(apt => apt.professionalId === id);
    return {
      id,
      name: appointment?.professionalName || `Profissional ${id}`
    };
  });

  // Separar appointments por categoria para as tabs
  const todayAppointments = filteredAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date).toDateString();
    const today = new Date().toDateString();
    return appointmentDate === today;
  });

  const pendingAppointments = filteredAppointments.filter(apt => 
    apt.status === 'scheduled'
  );

  const upcomingAppointments = filteredAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const today = new Date();
    return appointmentDate > today;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Gerenciamento de Agendamentos
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visão completa e controle de todos os agendamentos
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Agendamentos</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</span>
            <div className="text-xs text-gray-500 mt-2 space-y-0.5">
              <div>✅ {stats.completed} concluídos</div>
              <div>⏳ {stats.scheduled} agendados</div>
              <div>❌ {stats.canceled} cancelados</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita Total</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(stats.revenue)}
            </span>
            <span className="text-xs text-gray-500 mt-2">
              De agendamentos concluídos
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Comissão Casa</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(stats.commission)}
            </span>
            <span className="text-xs text-gray-500 mt-2">
              Sua parte dos agendamentos
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Taxa Conversão</span>
            <span className="text-xl font-bold text-purple-600">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 mt-2">
              Agendamentos concluídos
            </span>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filtros</h3>
            <span className="text-xs text-gray-500">
              {filteredAppointments.length} de {appointments.length} agendamentos
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Buscar</label>
              <Input
                placeholder="Nome, email, telefone ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                  <SelectItem value="no_show">Não Compareceu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Período</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Profissional</label>
              <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Exportar CSV
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Relatório PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="all" className="text-xs px-2">
            Todos ({filteredAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="today" className="text-xs px-2">
            Hoje ({todayAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs px-2">
            Pendentes
            {pendingAppointments.length > 0 && (
              <Badge className="ml-1 px-1 py-0 text-xs h-4" variant="secondary">
                {pendingAppointments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs px-2">
            Próximos ({upcomingAppointments.length})
          </TabsTrigger>
        </TabsList>

        {/* Todos os Agendamentos */}
        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredAppointments.length > 0 ? (
            <div className="space-y-3">
              {filteredAppointments
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">📋</div>
                  <p className="text-sm text-gray-500">
                    Nenhum agendamento encontrado com os filtros aplicados
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Agendamentos de Hoje */}
        <TabsContent value="today" className="space-y-3 mt-4">
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">📅</div>
                  <p className="text-sm text-gray-500">
                    Nenhum agendamento para hoje
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pendentes */}
        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingAppointments.length > 0 ? (
            <div className="space-y-3">
              {pendingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">⏳</div>
                  <p className="text-sm text-gray-500">
                    Nenhum agendamento pendente
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Próximos */}
        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">🔮</div>
                  <p className="text-sm text-gray-500">
                    Nenhum agendamento futuro
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentManagementPage;