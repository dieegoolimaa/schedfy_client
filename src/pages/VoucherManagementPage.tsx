"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import type { VoucherTemplate } from "@/interfaces/promotion.interface";

// Mock data para vouchers
const mockVouchers: VoucherTemplate[] = [
  {
    id: "voucher_001",
    name: "Primeira Vez 20%",
    description: "20% de desconto para novos clientes",
    code: "PRIMEIRA20",
    type: "percentage",
    value: 20,
    isActive: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageLimit: 100,
    usageLimitPerCustomer: 1,
    rules: {
      minPurchaseAmount: 50,
      firstTimeCustomersOnly: true
    },
    usages: [
      {
        appointmentId: "apt_001",
        customerId: "customer_001",
        usedAt: "2025-10-01T14:30:00Z",
        discountApplied: 16
      }
    ],
    totalUsed: 15,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-10-07T10:00:00Z",
    createdBy: "admin_001"
  },
  {
    id: "voucher_002",
    name: "Desconto Fixo R$10",
    description: "R$10 de desconto em qualquer serviço",
    code: "DESC10",
    type: "fixed_amount",
    value: 10,
    isActive: true,
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2025-10-31T23:59:59Z",
    usageLimit: 50,
    usageLimitPerCustomer: 2,
    rules: {
      minPurchaseAmount: 30
    },
    usages: [
      {
        appointmentId: "apt_002",
        customerId: "customer_002",
        usedAt: "2025-10-02T10:00:00Z",
        discountApplied: 10
      }
    ],
    totalUsed: 8,
    createdAt: "2025-09-25T10:00:00Z",
    updatedAt: "2025-10-07T10:00:00Z",
    createdBy: "admin_001"
  },
  {
    id: "voucher_003",
    name: "Happy Hour 30%",
    description: "30% de desconto nas terças-feiras das 14h às 18h",
    code: "HAPPY30",
    type: "percentage",
    value: 30,
    isActive: true,
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageLimit: 200,
    rules: {
      dayOfWeekRestrictions: [2], // Terça-feira
      timeRestrictions: {
        start: "14:00",
        end: "18:00"
      }
    },
    usages: [],
    totalUsed: 23,
    createdAt: "2025-09-30T10:00:00Z",
    updatedAt: "2025-10-07T10:00:00Z",
    createdBy: "admin_001"
  }
];

const VoucherManagementPage = () => {
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>(mockVouchers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Form state para criação
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    type: "percentage" as VoucherTemplate['type'],
    value: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    usageLimit: 0,
    usageLimitPerCustomer: 0,
    minPurchaseAmount: 0,
    firstTimeOnly: false,
    selectedDays: [] as number[],
    timeStart: "",
    timeEnd: ""
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (type: VoucherTemplate['type']) => {
    const labels = {
      percentage: 'Percentual',
      fixed_amount: 'Valor Fixo',
      buy_x_get_y: 'Compre X Leve Y',
      free_service: 'Serviço Grátis'
    };
    return labels[type];
  };

  const getTypeColor = (type: VoucherTemplate['type']) => {
    const colors = {
      percentage: 'bg-blue-100 text-blue-800',
      fixed_amount: 'bg-green-100 text-green-800',
      buy_x_get_y: 'bg-purple-100 text-purple-800',
      free_service: 'bg-orange-100 text-orange-800'
    };
    return colors[type];
  };

  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && voucher.isActive) ||
                         (statusFilter === "inactive" && !voucher.isActive) ||
                         (statusFilter === "expired" && new Date(voucher.endDate) < new Date());
    
    const matchesType = typeFilter === "all" || voucher.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeVouchers = vouchers.filter(v => v.isActive && new Date(v.endDate) >= new Date());
  const totalVouchers = vouchers.length;
  const totalUsages = vouchers.reduce((sum, v) => sum + v.totalUsed, 0);
  const totalDiscountGiven = vouchers.reduce((sum, v) => 
    sum + v.usages.reduce((usageSum, usage) => usageSum + usage.discountApplied, 0), 0
  );

  const handleCreateVoucher = () => {
    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Verificar se o código já existe
    if (vouchers.some(v => v.code.toLowerCase() === formData.code.toLowerCase())) {
      toast.error("Este código já existe. Escolha outro código.");
      return;
    }

    const newVoucher: VoucherTemplate = {
      id: `voucher_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: formData.value,
      isActive: true,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      usageLimit: formData.usageLimit || undefined,
      usageLimitPerCustomer: formData.usageLimitPerCustomer || undefined,
      rules: {
        minPurchaseAmount: formData.minPurchaseAmount || undefined,
        firstTimeCustomersOnly: formData.firstTimeOnly || undefined,
        dayOfWeekRestrictions: formData.selectedDays.length > 0 ? formData.selectedDays : undefined,
        timeRestrictions: formData.timeStart && formData.timeEnd ? {
          start: formData.timeStart,
          end: formData.timeEnd
        } : undefined
      },
      usages: [],
      totalUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current_user"
    };

    setVouchers([...vouchers, newVoucher]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast("Voucher criado com sucesso!");
  };

  const handleToggleActive = (voucherId: string) => {
    setVouchers(vouchers.map(voucher => 
      voucher.id === voucherId 
        ? { ...voucher, isActive: !voucher.isActive, updatedAt: new Date().toISOString() }
        : voucher
    ));
    toast("Status do voucher atualizado!");
  };

  const handleDeleteVoucher = (voucherId: string) => {
    setVouchers(vouchers.filter(voucher => voucher.id !== voucherId));
    toast("Voucher removido com sucesso!");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      code: "",
      type: "percentage",
      value: 0,
      startDate: undefined,
      endDate: undefined,
      usageLimit: 0,
      usageLimitPerCustomer: 0,
      minPurchaseAmount: 0,
      firstTimeOnly: false,
      selectedDays: [],
      timeStart: "",
      timeEnd: ""
    });
  };

  const handleDayToggle = (dayNumber: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayNumber)
        ? prev.selectedDays.filter(d => d !== dayNumber)
        : [...prev.selectedDays, dayNumber]
    }));
  };

  const getUsagePercentage = (voucher: VoucherTemplate) => {
    if (!voucher.usageLimit) return 0;
    return (voucher.totalUsed / voucher.usageLimit) * 100;
  };

  const isExpired = (voucher: VoucherTemplate) => {
    return new Date(voucher.endDate) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Gerenciamento de Vouchers
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crie e distribua códigos de desconto para seus clientes
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 px-3 text-xs">Novo Voucher</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Voucher</DialogTitle>
                <DialogDescription>
                  Configure um novo código de desconto
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Voucher *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Desconto Primeira Vez"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Código *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="CODIGO123"
                      />
                      <Button type="button" variant="outline" onClick={generateVoucherCode}>
                        Gerar
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o voucher"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Desconto</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentual (%)</SelectItem>
                        <SelectItem value="fixed_amount">Valor Fixo (R$)</SelectItem>
                        <SelectItem value="buy_x_get_y">Compre X Leve Y</SelectItem>
                        <SelectItem value="free_service">Serviço Grátis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">
                      Valor {formData.type === 'percentage' ? '(%)' : '(R$)'}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                      placeholder="0"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Início *</Label>
                    <DatePicker
                      date={formData.startDate}
                      onDateChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      placeholder="Selecione a data de início"
                      className="w-full mt-2"
                    />
                  </div>
                  <div>
                    <Label>Data de Expiração *</Label>
                    <DatePicker
                      date={formData.endDate}
                      onDateChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      placeholder="Selecione a data de expiração"
                      className="w-full mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="usageLimit">Limite Total de Uso</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                      placeholder="0 = ilimitado"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="usageLimitPerCustomer">Limite por Cliente</Label>
                    <Input
                      id="usageLimitPerCustomer"
                      type="number"
                      value={formData.usageLimitPerCustomer}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimitPerCustomer: Number(e.target.value) }))}
                      placeholder="0 = ilimitado"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="minPurchase">Valor Mínimo de Compra (R$)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minPurchaseAmount: Number(e.target.value) }))}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="firstTimeOnly"
                    checked={formData.firstTimeOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstTimeOnly: e.target.checked }))}
                  />
                  <Label htmlFor="firstTimeOnly">Apenas para novos clientes</Label>
                </div>

                <div>
                  <Label>Dias da Semana (opcional)</Label>
                  <div className="flex gap-2 mt-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={formData.selectedDays.includes(index) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(index)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeStart">Horário Início (opcional)</Label>
                    <Input
                      id="timeStart"
                      type="time"
                      value={formData.timeStart}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeStart: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeEnd">Horário Fim (opcional)</Label>
                    <Input
                      id="timeEnd"
                      type="time"
                      value={formData.timeEnd}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeEnd: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateVoucher}>
                    Criar Voucher
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Vouchers</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalVouchers}</span>
            <div className="text-xs text-gray-500 mt-2">
              ✅ {activeVouchers.length} ativos
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Utilizações</span>
            <span className="text-xl font-bold text-blue-600">{totalUsages}</span>
            <span className="text-xs text-blue-600 mt-2">
              Todos os vouchers
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Desconto Total</span>
            <span className="text-xl font-bold text-red-600">
              {formatCurrency(totalDiscountGiven)}
            </span>
            <span className="text-xs text-red-600 mt-2">
              Em todos os resgates
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Taxa de Uso Média</span>
            <span className="text-xl font-bold text-green-600">
              {vouchers.length > 0 
                ? (vouchers.reduce((sum, v) => sum + getUsagePercentage(v), 0) / vouchers.length).toFixed(1)
                : 0
              }%
            </span>
            <span className="text-xs text-green-600 mt-2">
              Limite vs utilizado
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
              {filteredVouchers.length} de {vouchers.length} vouchers
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Buscar</label>
              <Input
                placeholder="Nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="expired">Expirados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="percentage">Percentual</SelectItem>
                  <SelectItem value="fixed_amount">Valor Fixo</SelectItem>
                  <SelectItem value="buy_x_get_y">Compre X Leve Y</SelectItem>
                  <SelectItem value="free_service">Serviço Grátis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vouchers */}
      <div className="space-y-4">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{voucher.name}</CardTitle>
                    <Badge className={getTypeColor(voucher.type)}>
                      {getTypeLabel(voucher.type)}
                    </Badge>
                    <Badge 
                      variant={voucher.isActive && !isExpired(voucher) ? "default" : "secondary"}
                    >
                      {isExpired(voucher) ? "Expirado" : voucher.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {voucher.code}
                    </Badge>
                  </div>
                  <CardDescription>{voucher.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Desconto</h4>
                  <p className="text-sm text-gray-600">
                    {voucher.type === 'percentage' 
                      ? `${voucher.value}%`
                      : formatCurrency(voucher.value)
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Período</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Utilizações</h4>
                  <p className="text-sm text-gray-600">
                    {voucher.totalUsed}{voucher.usageLimit ? ` / ${voucher.usageLimit}` : ''}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Desconto Dado</h4>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(voucher.usages.reduce((sum, usage) => sum + usage.discountApplied, 0))}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso de Uso */}
              {voucher.usageLimit && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progresso de Uso</span>
                    <span>{getUsagePercentage(voucher).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(getUsagePercentage(voucher), 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Regras e Restrições */}
              {(voucher.rules.minPurchaseAmount || voucher.rules.firstTimeCustomersOnly || 
                voucher.rules.dayOfWeekRestrictions || voucher.rules.timeRestrictions) && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Regras e Restrições:</h4>
                  <div className="flex flex-wrap gap-2">
                    {voucher.rules.minPurchaseAmount && (
                      <Badge variant="outline">
                        Compra mín: {formatCurrency(voucher.rules.minPurchaseAmount)}
                      </Badge>
                    )}
                    {voucher.rules.firstTimeCustomersOnly && (
                      <Badge variant="outline">
                        Apenas novos clientes
                      </Badge>
                    )}
                    {voucher.rules.dayOfWeekRestrictions && (
                      <Badge variant="outline">
                        Dias: {voucher.rules.dayOfWeekRestrictions.map(day => 
                          ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day]
                        ).join(', ')}
                      </Badge>
                    )}
                    {voucher.rules.timeRestrictions && (
                      <Badge variant="outline">
                        Horário: {voucher.rules.timeRestrictions.start} - {voucher.rules.timeRestrictions.end}
                      </Badge>
                    )}
                    {voucher.usageLimitPerCustomer && (
                      <Badge variant="outline">
                        Limite: {voucher.usageLimitPerCustomer}x por cliente
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Botões de Ação */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(voucher.id)}
                  disabled={isExpired(voucher)}
                >
                  {voucher.isActive ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteVoucher(voucher.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVouchers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum voucher encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoucherManagementPage;