import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import type { PromotionCampaign } from "../../interfaces/promotion.interface";

interface CreatePromotionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (promotion: PromotionCampaign) => void;
  services: { id: string; name: string }[];
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

export function CreatePromotionDialog({
  open,
  onClose,
  onSuccess,
  services,
}: CreatePromotionDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "seasonal" as
      | "happy_hour"
      | "seasonal"
      | "first_time"
      | "loyalty"
      | "referral",
    discountType: "percentage" as "percentage" | "fixed_amount" | "buy_x_get_y",
    discountValue: "",
    serviceIds: [] as string[],
    startDate: "",
    endDate: "",
    daysOfWeek: [] as number[],
    timeStart: "",
    timeEnd: "",
    minPurchaseAmount: "",
    maxUsagesPerCustomer: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error("Valor do desconto é obrigatório e deve ser maior que 0");
      return;
    }
    if (formData.serviceIds.length === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }
    if (!formData.startDate) {
      toast.error("Data de início é obrigatória");
      return;
    }
    if (!formData.endDate) {
      toast.error("Data de término é obrigatória");
      return;
    }

    // Criar promoção
    const newPromotion: PromotionCampaign = {
      id: `promotion_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      isActive: true,
      startDate: formData.startDate,
      endDate: formData.endDate,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      applicableServices: formData.serviceIds,
      dayOfWeekRestrictions:
        formData.daysOfWeek.length > 0 ? formData.daysOfWeek : undefined,
      timeRestrictions:
        formData.timeStart && formData.timeEnd
          ? {
              start: formData.timeStart,
              end: formData.timeEnd,
            }
          : undefined,
      minPurchaseAmount: formData.minPurchaseAmount
        ? parseFloat(formData.minPurchaseAmount)
        : undefined,
      maxUsagesPerCustomer: formData.maxUsagesPerCustomer
        ? parseInt(formData.maxUsagesPerCustomer)
        : undefined,
      totalUsages: 0,
      totalRevenue: 0,
      totalDiscount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current_user_id", // TODO: Get from auth context
    };

    // Salvar no localStorage (mock)
    const promotions = JSON.parse(
      localStorage.getItem("mock_promotions") || "[]"
    );
    promotions.push(newPromotion);
    localStorage.setItem("mock_promotions", JSON.stringify(promotions));

    toast.success("Promoção criada com sucesso!");
    onSuccess(newPromotion);
    onClose();

    // Limpar formulário
    setFormData({
      name: "",
      description: "",
      type: "seasonal",
      discountType: "percentage",
      discountValue: "",
      serviceIds: [],
      startDate: "",
      endDate: "",
      daysOfWeek: [],
      timeStart: "",
      timeEnd: "",
      minPurchaseAmount: "",
      maxUsagesPerCustomer: "",
    });
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const handleDayToggle = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Promoção</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Promoção *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Happy Hour - 20% OFF"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Promoção *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy_hour">Happy Hour</SelectItem>
                    <SelectItem value="seasonal">Sazonal</SelectItem>
                    <SelectItem value="first_time">Primeira Visita</SelectItem>
                    <SelectItem value="loyalty">Fidelidade</SelectItem>
                    <SelectItem value="referral">Indicação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva a promoção..."
                rows={3}
              />
            </div>
          </div>

          {/* Configuração de Desconto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Configuração de Desconto</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Tipo de Desconto *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed_amount">
                      Valor Fixo (R$)
                    </SelectItem>
                    <SelectItem value="buy_x_get_y">
                      Compre X, Ganhe Y
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  Valor *{" "}
                  {formData.discountType === "percentage" ? "(%)" : "(R$)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  max={
                    formData.discountType === "percentage" ? "100" : undefined
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  placeholder={
                    formData.discountType === "percentage" ? "0-100" : "0.00"
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPurchaseAmount">Compra Mínima (R$)</Label>
                <Input
                  id="minPurchaseAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minPurchaseAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minPurchaseAmount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="maxUsagesPerCustomer">Limite por Cliente</Label>
                <Input
                  id="maxUsagesPerCustomer"
                  type="number"
                  min="1"
                  value={formData.maxUsagesPerCustomer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUsagesPerCustomer: e.target.value,
                    })
                  }
                  placeholder="Ilimitado"
                />
              </div>
            </div>
          </div>

          {/* Serviços Aplicáveis */}
          <div className="space-y-2">
            <Label>Serviços Aplicáveis *</Label>
            <div className="border rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Nenhum serviço cadastrado. Cadastre serviços primeiro.
                </p>
              ) : (
                services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.serviceIds.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{service.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Período de Validade */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Período de Validade</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="endDate">Data de Término *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Restrições de Horário */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              Restrições de Horário (Opcional)
            </h3>

            <div className="space-y-3">
              <div>
                <Label>Dias da Semana</Label>
                <div className="flex gap-2 mt-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={
                        formData.daysOfWeek.includes(day.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className="flex-1"
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe vazio para aplicar em todos os dias
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeStart">Horário Inicial</Label>
                  <Input
                    id="timeStart"
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) =>
                      setFormData({ ...formData, timeStart: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="timeEnd">Horário Final</Label>
                  <Input
                    id="timeEnd"
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, timeEnd: e.target.value })
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Deixe vazio para aplicar em qualquer horário
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Promoção</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
