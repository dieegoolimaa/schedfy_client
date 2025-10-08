"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
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

  const professional = professionals.find(p => p.id === id);

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
  const profAppointments = appointments.filter(apt => apt.professionalId === professional.id);
  const completedAppointments = profAppointments.filter(apt => apt.status === 'completed');

  // KPIs
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);
  const commissionsEarned = completedAppointments.reduce((sum, apt) => sum + apt.commission.professionalAmount, 0);
  const averageRating = profAppointments.reduce((sum, apt) => sum + (apt.rating?.score || 0), 0) / profAppointments.filter(apt => apt.rating).length || 0;
  const totalRatings = profAppointments.filter(apt => apt.rating).length;

  // Chart data
  const revenueByMonth = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Fev', revenue: 1500 },
    { month: 'Mar', revenue: 1300 },
    { month: 'Abr', revenue: 1800 },
    { month: 'Mai', revenue: 1600 },
    { month: 'Jun', revenue: 2000 },
  ];

  const statusData = [
    { name: 'Concluídos', value: completedAppointments.length, color: '#22c55e' },
    { name: 'Cancelados', value: profAppointments.filter(apt => apt.status === 'canceled').length, color: '#ef4444' },
    { name: 'Não Compareceu', value: profAppointments.filter(apt => apt.status === 'no_show').length, color: '#71717a' },
  ];

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Análises
        </Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={professional.photo} alt={professional.name} />
            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {professional.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Análise de Performance Individual
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Receita Total</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Comissões</h3>
          <p className="text-2xl font-bold">{formatCurrency(commissionsEarned)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Avaliação Média</h3>
          <p className="text-2xl font-bold">{averageRating.toFixed(1)} ★</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total de Avaliações</h3>
          <p className="text-2xl font-bold">{totalRatings}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <h3 className="text-lg font-semibold mb-4">Distribuição de Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Services */}
      <Card className="mt-4 p-4">
        <h3 className="text-lg font-semibold mb-4">Top 5 Serviços por Receita</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topServicesData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value))} />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="revenue" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ProfessionalAnalyticsPage;
