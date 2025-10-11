import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companies, subscriptions, planConfigs } from "@/mock-data/companies";
import { activityLogs } from "@/mock-data/logs";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Package,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SchedfyAdminDashboard = () => {
  const navigate = useNavigate();

  // Calculate statistics
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.status === "active").length;
  const trialCompanies = companies.filter((c) => c.status === "trial").length;
  const suspendedCompanies = companies.filter(
    (c) => c.status === "suspended"
  ).length;

  const totalRevenue = companies.reduce(
    (sum, c) => sum + c.stats.totalRevenue,
    0
  );

  // Calculate Schedfy commission
  const schedfyCommission = companies.reduce((sum, company) => {
    const plan = planConfigs.find((p) => p.id === company.planType);
    const commission = plan
      ? (company.stats.totalRevenue * plan.commission.percentage) / 100
      : 0;
    return sum + commission;
  }, 0);

  const totalAppointments = companies.reduce(
    (sum, c) => sum + c.stats.totalAppointments,
    0
  );
  const totalProfessionals = companies.reduce(
    (sum, c) => sum + c.stats.activeProfessionals,
    0
  );

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;
  const mrr = subscriptions
    .filter((s) => s.status === "active" && s.billingCycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0);

  const recentLogs = activityLogs.slice(0, 10);
  const errorLogs = activityLogs.filter(
    (l) => l.level === "error" || l.level === "critical"
  ).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLevelColor = (level: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      critical:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return colors[level as keyof typeof colors] || colors.info;
  };

  // Company growth by plan
  const planDistribution = {
    simple_booking: companies.filter((c) => c.planType === "simple_booking")
      .length,
    individual: companies.filter((c) => c.planType === "individual").length,
    business: companies.filter((c) => c.planType === "business").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Schedfy</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visão geral da plataforma e métricas principais
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/schedfy/companies")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Empresas
                </p>
                <p className="text-3xl font-bold">{totalCompanies}</p>
                <p className="text-xs text-green-600 mt-1">
                  {activeCompanies} ativas • {trialCompanies} trial
                </p>
              </div>
              <Building2 className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receita Total Clientes
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Processado na plataforma
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comissão Schedfy
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(schedfyCommission)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Receita da plataforma
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">MRR</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(mrr)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Receita Recorrente Mensal
                </p>
              </div>
              <Calendar className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Agendamentos
                </p>
                <p className="text-2xl font-bold">
                  {totalAppointments.toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Profissionais
                </p>
                <p className="text-2xl font-bold">{totalProfessionals}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assinaturas Ativas
                </p>
                <p className="text-2xl font-bold">{activeSubscriptions}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/schedfy/logs")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Erros no Sistema
                </p>
                <p className="text-2xl font-bold text-red-600">{errorLogs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Distribuição por Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {planDistribution.simple_booking}
                </div>
                <div>
                  <p className="font-semibold">Simple Booking</p>
                  <p className="text-sm text-gray-600">
                    {(
                      (planDistribution.simple_booking / totalCompanies) *
                      100
                    ).toFixed(1)}
                    % do total
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-500 text-white">R$ 149/mês</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {planDistribution.individual}
                </div>
                <div>
                  <p className="font-semibold">Individual</p>
                  <p className="text-sm text-gray-600">
                    {(
                      (planDistribution.individual / totalCompanies) *
                      100
                    ).toFixed(1)}
                    % do total
                  </p>
                </div>
              </div>
              <Badge className="bg-purple-500 text-white">R$ 249/mês</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {planDistribution.business}
                </div>
                <div>
                  <p className="font-semibold">Business</p>
                  <p className="text-sm text-gray-600">
                    {(
                      (planDistribution.business / totalCompanies) *
                      100
                    ).toFixed(1)}
                    % do total
                  </p>
                </div>
              </div>
              <Badge className="bg-orange-500 text-white">R$ 499/mês</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/schedfy/companies")}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Gerenciar Empresas
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/schedfy/plans")}
            >
              <Package className="h-4 w-4 mr-2" />
              Configurar Planos
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/schedfy/logs")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Ver Logs do Sistema
            </Button>
            {suspendedCompanies > 0 && (
              <Button
                className="w-full justify-start bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950 dark:text-red-200"
                variant="outline"
                onClick={() => navigate("/schedfy/companies?filter=suspended")}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {suspendedCompanies} Empresas Suspensas
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/schedfy/logs")}
            >
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge className={getLevelColor(log.level)}>
                    {log.level}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {log.userName && (
                        <span className="text-xs text-gray-500">
                          {log.userName}
                        </span>
                      )}
                      {log.companyName && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {log.companyName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedfyAdminDashboard;
