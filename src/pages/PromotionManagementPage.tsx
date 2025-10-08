"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { Play, Pause, Trash2 } from "lucide-react";
import type { PromotionCampaign } from "@/interfaces/promotion.interface";

// Mock data para promoções
const mockPromotions: PromotionCampaign[] = [
  {
    id: "promo_001",
    name: "Happy Hour Terça",
    description: "30% de desconto em todos os serviços nas terças-feiras das 14h às 18h",
    type: "happy_hour",
    isActive: true,
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    discountType: "percentage",
    discountValue: 30,
    dayOfWeekRestrictions: [2], // Terça-feira
    timeRestrictions: {
      start: "14:00",
      end: "18:00"
    },
    totalUsages: 45,
    totalRevenue: 2800,
    totalDiscount: 1200,
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2025-10-07T10:00:00Z",
    createdBy: "admin_001"
  },
  {
    id: "promo_002",
    name: "Primeira Vez 20%",
    description: "20% de desconto para novos clientes",
    type: "first_time",
    isActive: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    discountType: "percentage",
    discountValue: 20,
    maxUsagesPerCustomer: 1,
    totalUsages: 78,
    totalRevenue: 4200,
    totalDiscount: 1050,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-10-07T10:00:00Z",
    createdBy: "admin_001"
  },
  {
    id: "promo_003",
    name: "Black Friday",
    description: "50% de desconto em serviços selecionados",
    type: "seasonal",
    isActive: false,
    startDate: "2024-11-29T00:00:00Z",
    endDate: "2024-11-29T23:59:59Z",
    discountType: "percentage",
    discountValue: 50,
    applicableServices: ["service_001", "service_003"],
    totalUsages: 156,
    totalRevenue: 8500,
    totalDiscount: 8500,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-30T10:00:00Z",
    createdBy: "admin_001"
  }
];

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<PromotionCampaign[]>(mockPromotions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state para criação/edição
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "happy_hour" as PromotionCampaign['type'],
    discountType: "percentage" as PromotionCampaign['discountType'],
    discountValue: 0,
    maxDiscount: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    minPurchaseAmount: 0,
    maxUsagesPerCustomer: 0,
    timeStart: "",
    timeEnd: "",
    selectedDays: [] as number[]
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

  const getTypeLabel = (type: PromotionCampaign['type']) => {
    const labels = {
      happy_hour: 'Happy Hour',
      seasonal: 'Sazonal',
      first_time: 'Primeira Vez',
      loyalty: 'Fidelidade',
      referral: 'Indicação'
    };
    return labels[type];
  };

  const getTypeColor = (type: PromotionCampaign['type']) => {
    const colors = {
      happy_hour: 'bg-orange-100 text-orange-800',
      seasonal: 'bg-purple-100 text-purple-800',
      first_time: 'bg-green-100 text-green-800',
      loyalty: 'bg-blue-100 text-blue-800',
      referral: 'bg-pink-100 text-pink-800'
    };
    return colors[type];
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[dayNumber];
  };

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && promo.isActive) ||
                         (statusFilter === "inactive" && !promo.isActive);
    return matchesSearch && matchesStatus;
  });

  const activePromotions = promotions.filter(p => p.isActive);
  const totalPromotions = promotions.length;
  const totalUsages = promotions.reduce((sum, p) => sum + p.totalUsages, 0);
  const totalRevenue = promotions.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalDiscounts = promotions.reduce((sum, p) => sum + p.totalDiscount, 0);

  const handleCreatePromotion = () => {
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newPromotion: PromotionCampaign = {
      id: `promo_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      isActive: true,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minPurchaseAmount: formData.minPurchaseAmount || undefined,
      maxUsagesPerCustomer: formData.maxUsagesPerCustomer || undefined,
      dayOfWeekRestrictions: formData.selectedDays.length > 0 ? formData.selectedDays : undefined,
      timeRestrictions: formData.timeStart && formData.timeEnd ? {
        start: formData.timeStart,
        end: formData.timeEnd
      } : undefined,
      totalUsages: 0,
      totalRevenue: 0,
      totalDiscount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current_user"
    };

    setPromotions([...promotions, newPromotion]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast("Promoção criada com sucesso!");
  };

  const handleToggleActive = (promotionId: string) => {
    setPromotions(promotions.map(promo => 
      promo.id === promotionId 
        ? { ...promo, isActive: !promo.isActive, updatedAt: new Date().toISOString() }
        : promo
    ));
    toast("Status da promoção atualizado!");
  };

  const handleDeletePromotion = (promotionId: string) => {
    setPromotions(promotions.filter(promo => promo.id !== promotionId));
    toast("Promoção removida com sucesso!");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "happy_hour",
      discountType: "percentage",
      discountValue: 0,
      maxDiscount: 0,
      startDate: undefined,
      endDate: undefined,
      minPurchaseAmount: 0,
      maxUsagesPerCustomer: 0,
      timeStart: "",
      timeEnd: "",
      selectedDays: []
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Gerenciamento de Promoções
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crie e gerencie campanhas promocionais para atrair clientes
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 px-3 text-xs">Nova Promoção</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Promoção</DialogTitle>
                <DialogDescription>
                  Configure uma nova campanha promocional
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Promoção *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Happy Hour Terça"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo de Promoção</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="happy_hour">Happy Hour</SelectItem>
                          <SelectItem value="seasonal">Sazonal</SelectItem>
                          <SelectItem value="first_time">Primeira Vez</SelectItem>
                          <SelectItem value="loyalty">Fidelidade</SelectItem>
                          <SelectItem value="referral">Indicação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva os detalhes da promoção"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Configuração do Desconto */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Configuração do Desconto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="discountType">Tipo de Desconto</Label>
                      <Select value={formData.discountType} onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value as any }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentual (%)</SelectItem>
                          <SelectItem value="fixed_amount">Valor Fixo (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="discountValue">
                        Valor do Desconto {formData.discountType === 'percentage' ? '(%)' : '(R$)'}
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                        placeholder="0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxDiscount">Desconto Máximo (R$)</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        step="0.01"
                        value={formData.maxDiscount || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: parseFloat(e.target.value) || 0 }))}
                        placeholder="100.00"
                        className="mt-2"
                        disabled={formData.discountType === 'fixed_amount'}
                      />
                    </div>
                  </div>
                </div>

                {/* Período de Validade */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Período de Validade</h3>
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
                      <Label>Data de Fim *</Label>
                      <DatePicker
                        date={formData.endDate}
                        onDateChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        placeholder="Selecione a data de fim"
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Restrições de Horário */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Restrições de Horário</h3>
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
                  
                  <div className="mt-4">
                    <Label>Dias da Semana (opcional)</Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
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
                </div>

                {/* Condições de Uso */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Condições de Uso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minPurchase">Compra Mínima (R$)</Label>
                      <Input
                        id="minPurchase"
                        type="number"
                        value={formData.minPurchaseAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, minPurchaseAmount: Number(e.target.value) }))}
                        placeholder="0"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxUsages">Limite por Cliente</Label>
                      <Input
                        id="maxUsages"
                        type="number"
                        value={formData.maxUsagesPerCustomer}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxUsagesPerCustomer: Number(e.target.value) }))}
                        placeholder="0 = ilimitado"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6 border-t">
                <Button onClick={handleCreatePromotion} className="flex-1">
                  Criar Promoção
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Promoções</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalPromotions}</span>
            <div className="text-xs text-gray-500 mt-2">
              ✅ {activePromotions.length} ativas
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Utilizações</span>
            <span className="text-xl font-bold text-blue-600">{totalUsages}</span>
            <span className="text-xs text-blue-600 mt-2">
              Todas as promoções
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita Gerada</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-xs text-green-600 mt-2">
              Vendas com promoções
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Descontos Dados</span>
            <span className="text-xl font-bold text-red-600">
              {formatCurrency(totalDiscounts)}
            </span>
            <span className="text-xs text-red-600 mt-2">
              {((totalDiscounts / totalRevenue) * 100).toFixed(1)}% da receita
            </span>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filtros</h3>
            <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {filteredPromotions.length} de {promotions.length} promoções
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Promoção
              </Label>
              <Input
                id="search"
                placeholder="Nome ou descrição da promoção..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Promoções */}
      <div className="space-y-3">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{promotion.name}</h3>
                  <Badge className={`${getTypeColor(promotion.type)} text-xs px-1 py-0 h-4`}>
                    {getTypeLabel(promotion.type)}
                  </Badge>
                  <Badge variant={promotion.isActive ? "default" : "secondary"} className="text-xs px-1 py-0 h-4">
                    {promotion.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{promotion.description}</p>
              </div>
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    promotion.isActive 
                      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300" 
                      : "text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                  }`}
                  onClick={() => handleToggleActive(promotion.id)}
                  title={promotion.isActive ? "Desativar promoção" : "Ativar promoção"}
                >
                  {promotion.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  onClick={() => handleDeletePromotion(promotion.id)}
                  title="Excluir promoção"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Desconto</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {promotion.discountType === 'percentage' 
                    ? `${promotion.discountValue}%`
                    : formatCurrency(promotion.discountValue)
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Período</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Utilizações</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {promotion.totalUsages} vezes
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Receita</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(promotion.totalRevenue)}
                </p>
              </div>
            </div>

            <CardContent>
              {/* Restrições */}
              {(promotion.dayOfWeekRestrictions || promotion.timeRestrictions || promotion.minPurchaseAmount || promotion.maxUsagesPerCustomer) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {promotion.dayOfWeekRestrictions && (
                      <Badge variant="outline">
                        Dias: {promotion.dayOfWeekRestrictions.map(day => getDayName(day)).join(', ')}
                      </Badge>
                    )}
                    {promotion.timeRestrictions && (
                      <Badge variant="outline">
                        Horário: {promotion.timeRestrictions.start} - {promotion.timeRestrictions.end}
                      </Badge>
                    )}
                    {promotion.minPurchaseAmount && (
                      <Badge variant="outline">
                        Compra mín: {formatCurrency(promotion.minPurchaseAmount)}
                      </Badge>
                    )}
                    {promotion.maxUsagesPerCustomer && (
                      <Badge variant="outline">
                        Limite: {promotion.maxUsagesPerCustomer}x por cliente
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma promoção encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromotionManagementPage;