"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Calendar } from "@/components/ui/calendar";
import appointments from "@/mock-data/appointments";
import professionals from "@/mock-data/professional";
import type { Appointment } from "@/interfaces/appointment.interface";
import { toast } from "sonner";

const ProfessionalDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Obter usuário logado e encontrar profissional correspondente
  const loggedUser = localStorage.getItem("loggedInUser");
  const currentUser = loggedUser ? JSON.parse(loggedUser) : null;
  const currentProfessional = professionals.find(p => p.email === currentUser?.username);
  const currentProfessionalId = currentProfessional?.id?.toString() || "1";
  
  // Filtrar appointments do profissional atual
  const professionalAppointments = appointments.filter(
    apt => apt.professionalId === currentProfessionalId
  );

  // Separar appointments por status
  const todayAppointments = professionalAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date).toDateString();
    const today = new Date().toDateString();
    return appointmentDate === today;
  });

  const upcomingAppointments = professionalAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const today = new Date();
    return appointmentDate > today;
  });

  const pendingAppointments = professionalAppointments.filter(
    apt => apt.status === 'scheduled'
  );

  const completedAppointments = professionalAppointments.filter(
    apt => apt.status === 'completed'
  );

  // Calcular estatísticas do dia
  const todayStats = {
    total: todayAppointments.length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length,
    pending: todayAppointments.filter(apt => apt.status === 'scheduled').length,
    revenue: todayAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.commission.professionalAmount, 0)
  };

  // Calcular estatísticas do mês
  const currentMonth = new Date().getMonth();
  const monthlyAppointments = professionalAppointments.filter(apt => {
    return new Date(apt.date).getMonth() === currentMonth;
  });

  const monthlyStats = {
    total: monthlyAppointments.length,
    completed: monthlyAppointments.filter(apt => apt.status === 'completed').length,
    revenue: monthlyAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.commission.professionalAmount, 0),
    commission: monthlyAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.commission.professionalAmount, 0)
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    // Simular atualização no backend
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
    toast(`Agendamento atualizado para: ${newStatus}`);
  };

  // Appointments do dia selecionado no calendário
  const selectedDayAppointments = selectedDate 
    ? professionalAppointments.filter(apt => {
        const appointmentDate = new Date(apt.date).toDateString();
        const selectedDateString = selectedDate.toDateString();
        return appointmentDate === selectedDateString;
      })
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Dashboard do Profissional
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus agendamentos e acompanhe seu desempenho
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hoje</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{todayStats.total}</span>
            <div className="text-xs text-gray-500 mt-2 space-y-0.5">
              <div>✅ {todayStats.completed} concluídos</div>
              <div>⏳ {todayStats.pending} pendentes</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita Hoje</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(todayStats.revenue)}
            </span>
            <span className="text-xs text-green-600 mt-2">
              Sua comissão dos serviços realizados
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Este Mês</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{monthlyStats.total}</span>
            <span className="text-xs text-gray-500 mt-2">
              {monthlyStats.completed} agendamentos concluídos
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita Mensal</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(monthlyStats.revenue)}
            </span>
            <span className="text-xs text-green-600 mt-2">
              Total de comissões este mês
            </span>
          </div>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes
            {pendingAppointments.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {pendingAppointments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        {/* Agendamentos de Hoje */}
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
              <CardDescription>
                {todayAppointments.length} agendamento(s) para hoje
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
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
                <div className="text-center py-8 text-gray-500">
                  Nenhum agendamento para hoje
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Próximos Agendamentos */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>
                Agendamentos futuros confirmados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
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
                <div className="text-center py-8 text-gray-500">
                  Nenhum agendamento futuro
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agendamentos Pendentes */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Pendentes</CardTitle>
              <CardDescription>
                Agendamentos que precisam de confirmação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum agendamento pendente
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualização de Calendário */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
                <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                  modifiers={{
                    hasAppointments: professionalAppointments.map(apt => new Date(apt.date))
                  }}
                  modifiersStyles={{
                    hasAppointments: { 
                      backgroundColor: '#3b82f6', 
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Agendamentos do Dia Selecionado */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Agendamentos - {selectedDate?.toLocaleDateString('pt-BR')}
                </CardTitle>
                <CardDescription>
                  {selectedDayAppointments.length} agendamento(s) neste dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDayAppointments
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
                  <div className="text-center py-8 text-gray-500">
                    Nenhum agendamento neste dia
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resumo de Performance */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resumo de Performance</CardTitle>
          <CardDescription>Suas estatísticas este mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((monthlyStats.completed / monthlyStats.total) * 100 || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Conclusão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(monthlyStats.revenue / monthlyStats.completed || 0)}
              </div>
              <div className="text-sm text-gray-600">Ticket Médio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(monthlyStats.total / 30 * 7)}
              </div>
              <div className="text-sm text-gray-600">Agendamentos/Semana</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;