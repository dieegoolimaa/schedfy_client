import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activityLogs } from "@/mock-data/logs";
import type { LogLevel, LogAction } from "@/interfaces/log.interface";
import {
  FileText,
  Search,
  Filter,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
} from "lucide-react";

const SchedfyLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const getLevelColor = (level: LogLevel) => {
    const colors = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      critical:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return colors[level];
  };

  const getLevelIcon = (level: LogLevel) => {
    const icons = {
      info: <Info className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4" />,
      critical: <XCircle className="h-4 w-4" />,
    };
    return icons[level];
  };

  const getActionText = (action: LogAction): string => {
    const texts: Record<LogAction, string> = {
      user_login: "Login de Usuário",
      user_logout: "Logout de Usuário",
      user_created: "Usuário Criado",
      user_updated: "Usuário Atualizado",
      user_deleted: "Usuário Deletado",
      company_created: "Empresa Criada",
      company_updated: "Empresa Atualizada",
      company_suspended: "Empresa Suspensa",
      company_activated: "Empresa Ativada",
      company_canceled: "Empresa Cancelada",
      subscription_created: "Assinatura Criada",
      subscription_updated: "Assinatura Atualizada",
      subscription_canceled: "Assinatura Cancelada",
      subscription_renewed: "Assinatura Renovada",
      plan_changed: "Plano Alterado",
      payment_succeeded: "Pagamento Realizado",
      payment_failed: "Falha no Pagamento",
      appointment_created: "Agendamento Criado",
      appointment_updated: "Agendamento Atualizado",
      appointment_canceled: "Agendamento Cancelado",
      appointment_completed: "Agendamento Concluído",
      professional_created: "Profissional Criado",
      professional_updated: "Profissional Atualizado",
      professional_deactivated: "Profissional Desativado",
      service_created: "Serviço Criado",
      service_updated: "Serviço Atualizado",
      service_deleted: "Serviço Deletado",
      settings_updated: "Configurações Atualizadas",
    };
    return texts[action] || action;
  };

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesCompany =
      companyFilter === "all" ||
      log.companyName?.toLowerCase().includes(companyFilter.toLowerCase());

    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const logDate = new Date(log.timestamp);
      const today = new Date();

      switch (dateFilter) {
        case "today":
          return logDate.toDateString() === today.toDateString();
        case "week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return logDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return logDate >= monthAgo;
        }
        default:
          return true;
      }
    };

    return (
      matchesSearch &&
      matchesLevel &&
      matchesAction &&
      matchesCompany &&
      matchesDate()
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  // Calculate statistics
  const stats = {
    total: activityLogs.length,
    info: activityLogs.filter((l) => l.level === "info").length,
    warning: activityLogs.filter((l) => l.level === "warning").length,
    error: activityLogs.filter((l) => l.level === "error").length,
    critical: activityLogs.filter((l) => l.level === "critical").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Logs do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitore todas as atividades da plataforma
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Info</p>
                <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Warning
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.warning}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Error
                </p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Critical
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.critical}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="user_login">Login</SelectItem>
                <SelectItem value="company_created">Empresa Criada</SelectItem>
                <SelectItem value="payment_failed">Falha Pagamento</SelectItem>
                <SelectItem value="plan_changed">Mudança de Plano</SelectItem>
                <SelectItem value="appointment_created">Agendamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Empresas</SelectItem>
                <SelectItem value="barbearia">Barbearia Moderna</SelectItem>
                <SelectItem value="salao">Salão Elegante</SelectItem>
                <SelectItem value="clinica">Clínica Bem-Estar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Atividades ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Data/Hora</TableHead>
                  <TableHead className="whitespace-nowrap">Nível</TableHead>
                  <TableHead className="whitespace-nowrap">Ação</TableHead>
                  <TableHead className="min-w-[200px]">Descrição</TableHead>
                  <TableHead className="whitespace-nowrap">Usuário</TableHead>
                  <TableHead className="whitespace-nowrap">Empresa</TableHead>
                  <TableHead className="whitespace-nowrap">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm font-mono">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getLevelColor(
                          log.level
                        )} flex items-center gap-1 w-fit`}
                      >
                        {getLevelIcon(log.level)}
                        {log.level.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getActionText(log.action)}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm truncate">{log.description}</p>
                    </TableCell>
                    <TableCell>
                      {log.userName && (
                        <div className="text-sm">
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-gray-500 text-xs">
                            {log.userEmail}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.companyName || "-"}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {log.metadata?.ipAddress || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedfyLogsPage;
