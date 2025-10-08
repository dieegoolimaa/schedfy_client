"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import appointments from "@/mock-data/appointments";
import professionals from "@/mock-data/professional";
import { useNavigate } from "react-router-dom";

const AnalyticsPage = () => {
  const [periodFilter, setPeriodFilter] = useState<string>("month");
  const navigate = useNavigate();

  const handleViewProfessionalAnalytics = (professionalId: string) => {
    navigate(`/analytics/professional/${professionalId}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Componente customizado para Tooltip
  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {formatter ? formatter(entry.value, entry.name) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Cores personalizadas para gráficos
  const chartColors = {
    primary: '#a3a3a3',    // neutral-400
    secondary: '#737373',  // neutral-500  
    tertiary: '#525252',   // neutral-600
    quaternary: '#404040', // neutral-700
    accent: '#262626',     // neutral-800
    success: '#16a34a',    // green-600 (keep for positive metrics)
    warning: '#ca8a04',    // yellow-600 (keep for warnings)
    info: '#525252',       // neutral-600
  };

  // Estatísticas gerais
  const totalRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.finalPrice, 0);

  const totalCommissions = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.commission.establishmentAmount, 0);

  const totalDiscounts = appointments
    .reduce((sum, apt) => sum + apt.totalDiscountAmount, 0);

  const averageTicket = totalRevenue / appointments.filter(apt => apt.status === 'completed').length;

  const conversionRate = (appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100;

  // Dados para gráfico de receita por dia (simulado)
  const revenueByDay = [
    { day: 'Seg', revenue: 850, appointments: 12 },
    { day: 'Ter', revenue: 920, appointments: 15 },
    { day: 'Qua', revenue: 1100, appointments: 18 },
    { day: 'Qui', revenue: 950, appointments: 14 },
    { day: 'Sex', revenue: 1250, appointments: 20 },
    { day: 'Sab', revenue: 1400, appointments: 22 },
    { day: 'Dom', revenue: 600, appointments: 8 }
  ];

  // Dados para gráfico de performance por profissional
  const professionalPerformance = professionals.map(prof => {
    const profAppointments = appointments.filter(apt => apt.professionalId === prof.id?.toString());
    const completedAppointments = profAppointments.filter(apt => apt.status === 'completed');
    const revenue = completedAppointments.reduce((sum, apt) => sum + apt.commission.professionalAmount, 0);
    
    return {
      id: prof.id,
      name: prof.name,
      appointments: profAppointments.length,
      completed: completedAppointments.length,
      revenue: revenue,
      rate: profAppointments.length > 0 ? (completedAppointments.length / profAppointments.length) * 100 : 0
    };
  });

  // Dados para gráfico de status dos agendamentos
  const statusData = [
    { name: 'Concluídos', value: appointments.filter(apt => apt.status === 'completed').length, color: chartColors.success },
    { name: 'Agendados', value: appointments.filter(apt => apt.status === 'scheduled').length, color: chartColors.primary },
    { name: 'Cancelados', value: appointments.filter(apt => apt.status === 'canceled').length, color: '#ef4444' }, // red-500 (keep for canceled)
    { name: 'Em Andamento', value: appointments.filter(apt => apt.status === 'in_progress').length, color: chartColors.secondary }
  ];

  // Dados para gráfico de serviços mais populares
  const servicePopularity = appointments.reduce((acc, apt) => {
    const service = apt.serviceName;
    if (!acc[service]) {
      acc[service] = { name: service, count: 0, revenue: 0 };
    }
    acc[service].count++;
    if (apt.status === 'completed') {
      acc[service].revenue += apt.finalPrice;
    }
    return acc;
  }, {} as Record<string, { name: string; count: number; revenue: number }>);

  const serviceData = Object.values(servicePopularity).sort((a, b) => b.count - a.count);

  // Dados de tendência mensal (simulado)
  const monthlyTrend = [
    { month: 'Jan', revenue: 8500, appointments: 120, growth: 5 },
    { month: 'Fev', revenue: 9200, appointments: 135, growth: 8 },
    { month: 'Mar', revenue: 10100, appointments: 148, growth: 10 },
    { month: 'Abr', revenue: 9800, appointments: 142, growth: -3 },
    { month: 'Mai', revenue: 11200, appointments: 165, growth: 14 },
    { month: 'Jun', revenue: 12500, appointments: 180, growth: 12 }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Análises e Relatórios
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Insights detalhados sobre performance e crescimento do negócio
        </p>
      </div>

      {/* Filtros de Período */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filtros</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                Exportar CSV
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                Relatório PDF
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 block">Período</label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Espaço para filtros adicionais no futuro */}
            <div className="md:col-span-3"></div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Receita Total</span>
            <span className="text-xl font-bold text-neutral-300">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-xs text-neutral-400 mt-2">
              +12% vs mês anterior
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Comissões</span>
            <span className="text-xl font-bold text-neutral-300">
              {formatCurrency(totalCommissions)}
            </span>
            <span className="text-xs text-neutral-400 mt-2">
              {((totalCommissions / totalRevenue) * 100).toFixed(1)}% da receita
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Ticket Médio</span>
            <span className="text-xl font-bold text-neutral-300">
              {formatCurrency(averageTicket)}
            </span>
            <span className="text-xs text-neutral-400 mt-2">
              +5% vs período anterior
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Taxa Conversão</span>
            <span className="text-xl font-bold text-neutral-300">
              {conversionRate.toFixed(1)}%
            </span>
            <span className="text-xs text-neutral-400 mt-2">
              Meta: 85%
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Descontos</span>
            <span className="text-xl font-bold text-neutral-300">
              {formatCurrency(totalDiscounts)}
            </span>
            <span className="text-xs text-red-600 mt-2">
              {((totalDiscounts / totalRevenue) * 100).toFixed(1)}% da receita
            </span>
          </div>
        </Card>
      </div>

      {/* Tabs de Análises */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="overview" className="text-xs px-2">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs px-2">Performance</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs px-2">Tendências</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs px-2">Insights</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Receita por Dia */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Receita por Dia da Semana</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Performance diária média</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    content={<CustomTooltip formatter={(value: number | string) => formatCurrency(Number(value))} />}
                  />
                  <Bar dataKey="revenue" fill={chartColors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Status dos Agendamentos */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Status dos Agendamentos</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Distribuição atual</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                    labelLine={false}
                    style={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip formatter={(value: number | string) => `${value} agendamentos`} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Serviços Mais Populares */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Serviços Mais Populares</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Ranking por número de agendamentos</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={serviceData.slice(0, 6)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(value: number | string) => `${value} agendamentos`} />}
                />
                <Bar dataKey="count" fill={chartColors.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          {/* Performance por Profissional */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Performance por Profissional</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Comparativo de desempenho</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={professionalPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(value: number | string, name?: string) => {
                    if (name === 'revenue') return formatCurrency(Number(value));
                    return `${value}`;
                  }} />}
                />
                <Bar dataKey="appointments" fill={chartColors.primary} name="Agendamentos" />
                <Bar dataKey="completed" fill={chartColors.secondary} name="Concluídos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Tabela de Performance */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Detalhes de Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-gray-700 dark:text-gray-300">Profissional</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-700 dark:text-gray-300">Agendamentos</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-700 dark:text-gray-300">Concluídos</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-700 dark:text-gray-300">Taxa (%)</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-700 dark:text-gray-300">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {professionalPerformance.map((prof, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium text-xs">
                        <button onClick={() => prof.id && handleViewProfessionalAnalytics(prof.id)} className="text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline" disabled={!prof.id}>
                          {prof.name}
                        </button>
                      </td>
                      <td className="text-right py-2 text-xs">{prof.appointments}</td>
                      <td className="text-right py-2 text-xs">{prof.completed}</td>
                      <td className="text-right py-2">
                        <Badge variant={prof.rate >= 80 ? "default" : "secondary"} className="text-xs px-1 py-0 h-4">
                          {prof.rate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="text-right py-2 text-xs">{formatCurrency(prof.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tendências */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          {/* Crescimento Mensal */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Tendência de Crescimento</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Evolução mensal de receita e agendamentos</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(value: number | string) => formatCurrency(Number(value))} />}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={chartColors.primary} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Taxa de Crescimento */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Taxa de Crescimento (%)</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Variação mensal</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fontFamily: 'system-ui, sans-serif', fill: '#6b7280' }}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(value: number | string) => `${value}%`} />}
                />
                <Line type="monotone" dataKey="growth" stroke={chartColors.secondary} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recomendações */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Recomendações</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ações sugeridas para otimização</p>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <h4 className="text-xs font-medium text-green-700">Aumento de Preços</h4>
                  <p className="text-xs text-gray-600">
                    Serviços de Massagem têm alta demanda. Considere aumentar preços em 10-15%.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="text-xs font-medium text-blue-700">Horários de Pico</h4>
                  <p className="text-xs text-gray-600">
                    Sábados são os dias mais movimentados. Considere promocionar outros dias.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <h4 className="text-xs font-medium text-orange-700">Capacitação</h4>
                  <p className="text-xs text-gray-600">
                    Alguns profissionais têm baixa taxa de conversão. Investir em treinamento.
                  </p>
                </div>
              </div>
            </Card>

            {/* Oportunidades */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Oportunidades de Crescimento</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Áreas com potencial de melhoria</p>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-3">
                  <h4 className="text-xs font-medium text-purple-700">Novos Serviços</h4>
                  <p className="text-xs text-gray-600">
                    Demanda por serviços de estética facial está crescendo 20% ao mês.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-3">
                  <h4 className="text-xs font-medium text-red-700">Retenção de Clientes</h4>
                  <p className="text-xs text-gray-600">
                    40% dos clientes só fazem um agendamento. Implementar programa de fidelidade.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <h4 className="text-xs font-medium text-yellow-700">Otimização de Horários</h4>
                  <p className="text-xs text-gray-600">
                    25% dos horários em dias úteis ficam vagos. Criar promoções para período.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Metas e Objetivos */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Metas e Objetivos</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progresso atual vs metas definidas</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">Receita Mensal</span>
                  <span className="text-xs">{formatCurrency(totalRevenue)} / {formatCurrency(15000)}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-neutral-600 dark:bg-neutral-400 h-2 rounded-full" 
                    style={{ width: `${(totalRevenue / 15000) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {((totalRevenue / 15000) * 100).toFixed(1)}% da meta
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">Taxa de Conversão</span>
                  <span className="text-xs">{conversionRate.toFixed(1)}% / 85%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-neutral-600 dark:bg-neutral-400 h-2 rounded-full" 
                    style={{ width: `${(conversionRate / 85) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {((conversionRate / 85) * 100).toFixed(1)}% da meta
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">Ticket Médio</span>
                  <span className="text-xs">{formatCurrency(averageTicket)} / {formatCurrency(100)}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-neutral-600 dark:bg-neutral-400 h-2 rounded-full" 
                    style={{ width: `${(averageTicket / 100) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {((averageTicket / 100) * 100).toFixed(1)}% da meta
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
// A implementação da página de análise geral e a navegação para a página de análise por profissional estão concluídas.