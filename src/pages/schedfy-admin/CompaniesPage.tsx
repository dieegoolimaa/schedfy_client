import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { companies, subscriptions } from "@/mock-data/companies";
import type { Company } from "@/interfaces/company.interface";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const SchedfyCompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Confirmation dialogs
  const [confirmSuspend, setConfirmSuspend] = useState<Company | null>(null);
  const [confirmActivate, setConfirmActivate] = useState<Company | null>(null);

  const getStatusColor = (status: Company["status"]) => {
    const colors = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      canceled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      trial: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return colors[status];
  };

  const getStatusText = (status: Company["status"]) => {
    const texts = {
      active: "Ativo",
      suspended: "Suspenso",
      canceled: "Cancelado",
      trial: "Trial",
    };
    return texts[status];
  };

  const getPlanBadge = (planType: Company["planType"]) => {
    const badges = {
      simple_booking: { color: "bg-blue-500", text: "Simple" },
      individual: { color: "bg-purple-500", text: "Individual" },
      business: { color: "bg-orange-500", text: "Business" },
    };
    const badge = badges[planType];
    return <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>;
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    const matchesPlan = planFilter === "all" || company.planType === planFilter;
    const matchesCountry =
      countryFilter === "all" || company.country === countryFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const companyDate = new Date(company.createdAt);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - companyDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
        case "quarter":
          matchesDate = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesPlan && matchesCountry && matchesDate;
  });

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetailsDialog(true);
  };

  const handleSuspendCompany = (company: Company) => {
    setConfirmSuspend(null);
    toast.success(`Empresa ${company.name} suspensa com sucesso`);
    // Aqui você adicionaria a lógica real de suspensão
  };

  const handleActivateCompany = (company: Company) => {
    setConfirmActivate(null);
    toast.success(`Empresa ${company.name} ativada com sucesso`);
    // Aqui você adicionaria a lógica real de ativação
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number, currency: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value);
  };

  // Calculate statistics
  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    trial: companies.filter((c) => c.status === "trial").length,
    suspended: companies.filter((c) => c.status === "suspended").length,
    totalRevenue: companies.reduce((sum, c) => sum + c.stats.totalRevenue, 0),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Gerenciamento de Empresas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administre todas as empresas cadastradas na plataforma
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Empresas
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ativas
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Em Trial
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.trial}
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
                  Suspensas
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.suspended}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
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
                placeholder="Buscar empresa, email ou proprietário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Planos</SelectItem>
                <SelectItem value="simple_booking">Simple Booking</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Países</SelectItem>
                <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
                <SelectItem value="US">🇺🇸 EUA</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Últimos 7 dias</SelectItem>
                <SelectItem value="month">Últimos 30 dias</SelectItem>
                <SelectItem value="quarter">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Empresas Cadastradas ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Empresa</TableHead>
                  <TableHead className="whitespace-nowrap">Proprietário</TableHead>
                  <TableHead className="whitespace-nowrap">Plano</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">País</TableHead>
                  <TableHead className="whitespace-nowrap">Agendamentos</TableHead>
                  <TableHead className="whitespace-nowrap">Receita</TableHead>
                  <TableHead className="whitespace-nowrap">Cadastro</TableHead>
                  <TableHead className="whitespace-nowrap">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => {
                const subscription = subscriptions.find(
                  (s) => s.companyId === company.id
                );
                return (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-500">
                          {company.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.ownerName}</div>
                        <div className="text-sm text-gray-500">
                          {company.ownerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(company.planType)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {getStatusText(company.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {company.country === "BR" && "🇧🇷"}
                      {company.country === "PT" && "🇵🇹"}
                      {company.country === "US" && "🇺🇸"}
                    </TableCell>
                    <TableCell>{company.stats.totalAppointments}</TableCell>
                    <TableCell>
                      {subscription &&
                        formatCurrency(
                          company.stats.totalRevenue,
                          subscription.currency
                        )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(company.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(company)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {company.status === "active" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmSuspend(company)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        {company.status === "suspended" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setConfirmActivate(company)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      {selectedCompany && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Empresa</DialogTitle>
              <DialogDescription>
                Informações completas sobre {selectedCompany.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nome da Empresa
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedCompany.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedCompany.status)}>
                      {getStatusText(selectedCompany.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p>{selectedCompany.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Telefone
                  </label>
                  <p>{selectedCompany.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Documento
                  </label>
                  <p>{selectedCompany.document}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    País
                  </label>
                  <p>
                    {selectedCompany.country === "BR" && "🇧🇷 Brasil"}
                    {selectedCompany.country === "PT" && "🇵🇹 Portugal"}
                    {selectedCompany.country === "US" && "🇺🇸 EUA"}
                  </p>
                </div>
              </div>

              {/* Owner Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Proprietário</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Nome
                    </label>
                    <p>{selectedCompany.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </label>
                    <p>{selectedCompany.ownerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {selectedCompany.stats.activeProfessionals}
                        </p>
                        <p className="text-xs text-gray-600">Profissionais</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Calendar className="h-6 w-6 mx-auto text-green-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {selectedCompany.stats.totalAppointments}
                        </p>
                        <p className="text-xs text-gray-600">Agendamentos</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <TrendingUp className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {selectedCompany.stats.totalServices}
                        </p>
                        <p className="text-xs text-gray-600">Serviços</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-2" />
                        <p className="text-lg font-bold">
                          {formatCurrency(selectedCompany.stats.totalRevenue)}
                        </p>
                        <p className="text-xs text-gray-600">Receita</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Subscription Info */}
              {selectedCompany.subscription && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Assinatura</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Plano
                      </label>
                      <p>{getPlanBadge(selectedCompany.planType)}</p>
                    </div>
                    {/* Add more subscription details here */}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={!!confirmSuspend}
        onOpenChange={(open) => !open && setConfirmSuspend(null)}
        title="Suspender Empresa"
        description={`Tem certeza que deseja suspender a empresa "${confirmSuspend?.name}"? Esta ação bloqueará o acesso da empresa ao sistema.`}
        confirmText="Sim, Suspender"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={() => confirmSuspend && handleSuspendCompany(confirmSuspend)}
      />

      <ConfirmationDialog
        open={!!confirmActivate}
        onOpenChange={(open) => !open && setConfirmActivate(null)}
        title="Ativar Empresa"
        description={`Tem certeza que deseja ativar a empresa "${confirmActivate?.name}"? Isto restaurará o acesso completo ao sistema.`}
        confirmText="Sim, Ativar"
        cancelText="Cancelar"
        variant="default"
        onConfirm={() => confirmActivate && handleActivateCompany(confirmActivate)}
      />
    </div>
  );
};

export default SchedfyCompaniesPage;
