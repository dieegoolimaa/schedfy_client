"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import appointments from "@/mock-data/appointments";
import professionals from "@/mock-data/professional";

const ProfessionalAnalyticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState<string>("month");

  const professional = professionals.find(p => p.id.toString() === id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!professional) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Profissional não encontrado</h2>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  // Filter data for the specific professional
  const profAppointments = appointments.filter(apt => apt.professionalId === professional.id.toString());
  
  // Filter by period
  const getDateFilter = (period: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return startDate;
  };

  const filteredAppointments = profAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const filterDate = getDateFilter(periodFilter);
    return appointmentDate >= filterDate;
  });

  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');

  // KPIs
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);
  const commissionsEarned = completedAppointments.reduce((sum, apt) => sum + apt.commission.professionalAmount, 0);
  const averageRating = filteredAppointments.reduce((sum, apt) => sum + (apt.rating?.score || 0), 0) / filteredAppointments.filter(apt => apt.rating).length || 0;
  const totalRatings = filteredAppointments.filter(apt => apt.rating).length;

  // Generate revenue by month based on appointments
  const generateRevenueByMonth = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const revenueData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      // Simular receita baseada nos appointments reais + dados simulados
      const baseRevenue = completedAppointments.length > 0 ? 
        completedAppointments.reduce((sum, apt) => sum + apt.commission.professionalAmount, 0) : 0;
      const simulatedRevenue = baseRevenue + (Math.random() * 800 + 400);
      revenueData.push({ month: monthName, revenue: Math.round(simulatedRevenue) });
    }
    
    return revenueData;
  };

  const revenueByMonth = generateRevenueByMonth();

  const statusData = [
    { 
      name: 'Concluídos', 
      value: completedAppointments.length, 
      color: '#10b981',
      percentage: filteredAppointments.length > 0 ? ((completedAppointments.length / filteredAppointments.length) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Em Andamento', 
      value: filteredAppointments.filter(apt => apt.status === 'in_progress').length, 
      color: '#3b82f6',
      percentage: filteredAppointments.length > 0 ? ((filteredAppointments.filter(apt => apt.status === 'in_progress').length / filteredAppointments.length) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Agendados', 
      value: filteredAppointments.filter(apt => apt.status === 'scheduled').length, 
      color: '#8b5cf6',
      percentage: filteredAppointments.length > 0 ? ((filteredAppointments.filter(apt => apt.status === 'scheduled').length / filteredAppointments.length) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Cancelados', 
      value: filteredAppointments.filter(apt => apt.status === 'canceled').length, 
      color: '#ef4444',
      percentage: filteredAppointments.length > 0 ? ((filteredAppointments.filter(apt => apt.status === 'canceled').length / filteredAppointments.length) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Não Compareceu', 
      value: filteredAppointments.filter(apt => apt.status === 'no_show').length, 
      color: '#6b7280',
      percentage: filteredAppointments.length > 0 ? ((filteredAppointments.filter(apt => apt.status === 'no_show').length / filteredAppointments.length) * 100).toFixed(1) : '0'
    },
  ].filter(item => item.value > 0); // Remove categorias sem dados

  const topServices = completedAppointments.reduce((acc, apt) => {
    const service = apt.serviceName;
    if (!acc[service]) {
      acc[service] = { name: service, count: 0, revenue: 0 };
    }
    acc[service].count++;
    acc[service].revenue += apt.finalPrice;
    return acc;
  }, {} as Record<string, { name: string; count: number; revenue: number }>);

  const topServicesData = Object.values(topServices).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const popularServicesData = Object.values(topServices).sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Análises
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src={professional.photo} alt={professional.name} />
              <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {professional.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Análise de Performance Individual
              </p>
            </div>
          </div>
          
          {/* Period Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-36 sm:w-40">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                <SelectItem value="semester">Últimos 6 meses</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Receita Total</h3>
          <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Comissões</h3>
          <p className="text-lg sm:text-2xl font-bold">{formatCurrency(commissionsEarned)}</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Avaliação Média</h3>
          <p className="text-lg sm:text-2xl font-bold">{averageRating.toFixed(1)} ★</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total de Avaliações</h3>
          <p className="text-lg sm:text-2xl font-bold">{totalRatings}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Chart */}
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Status dos Agendamentos</h3>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie 
                    data={statusData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={70}
                    innerRadius={25}
                    label={false}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} agendamentos`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.name}: {item.value} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Services by Count */}
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Serviços Mais Populares</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">Por número de agendamentos</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={popularServicesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={10} />
              <YAxis type="category" dataKey="name" width={80} fontSize={10} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} agendamentos`, 
                  name === 'count' ? 'Quantidade' : name
                ]} 
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Services by Revenue */}
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Top Serviços por Receita</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">Ordenados por valor total gerado</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topServicesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value))} fontSize={10} />
              <YAxis type="category" dataKey="name" width={80} fontSize={10} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalAnalyticsPage;
