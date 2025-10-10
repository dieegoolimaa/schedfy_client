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
import type { VoucherTemplate } from "../../interfaces/promotion.interface";

interface CreateVoucherDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (voucher: VoucherTemplate) => void;
  services: { id: string; name: string }[];
}

export function CreateVoucherDialog({
  open,
  onClose,
  onSuccess,
  services,
}: CreateVoucherDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    type: "percentage" as
      | "percentage"
      | "fixed_amount"
      | "buy_x_get_y"
      | "free_service",
    value: "",
    serviceIds: [] as string[],
    startDate: "",
    endDate: "",
    usageLimit: "",
    usageLimitPerCustomer: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!formData.code.trim()) {
      toast.error("Código é obrigatório");
      return;
    }
    if (!formData.value || parseFloat(formData.value) <= 0) {
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

    // Criar voucher
    const newVoucher: VoucherTemplate = {
      id: `voucher_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      isActive: true,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit)
        : undefined,
      usageLimitPerCustomer: formData.usageLimitPerCustomer
        ? parseInt(formData.usageLimitPerCustomer)
        : undefined,
      rules: {
        minPurchaseAmount: formData.minPurchaseAmount
          ? parseFloat(formData.minPurchaseAmount)
          : undefined,
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : undefined,
        applicableServiceIds: formData.serviceIds,
      },
      usages: [],
      totalUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current_user_id", // TODO: Get from auth context
    };

    // Salvar no localStorage (mock)
    const vouchers = JSON.parse(localStorage.getItem("mock_vouchers") || "[]");
    vouchers.push(newVoucher);
    localStorage.setItem("mock_vouchers", JSON.stringify(vouchers));

    toast.success("Voucher criado com sucesso!");
    onSuccess(newVoucher);
    onClose();

    // Limpar formulário
    setFormData({
      name: "",
      description: "",
      code: "",
      type: "percentage",
      value: "",
      serviceIds: [],
      startDate: "",
      endDate: "",
      usageLimit: "",
      usageLimitPerCustomer: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Voucher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Voucher *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Desconto Primeira Visita"
                />
              </div>

              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ex: PRIMEIRAVISITA"
                />
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
                placeholder="Descreva o voucher..."
                rows={3}
              />
            </div>
          </div>

          {/* Configuração de Desconto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Configuração de Desconto</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Desconto *</Label>
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
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed_amount">
                      Valor Fixo (R$)
                    </SelectItem>
                    <SelectItem value="buy_x_get_y">
                      Compre X, Ganhe Y
                    </SelectItem>
                    <SelectItem value="free_service">Serviço Grátis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">
                  Valor * {formData.type === "percentage" ? "(%)" : "(R$)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.type === "percentage" ? "100" : undefined}
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder={
                    formData.type === "percentage" ? "0-100" : "0.00"
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
                <Label htmlFor="maxDiscountAmount">Desconto Máximo (R$)</Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.maxDiscountAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountAmount: e.target.value,
                    })
                  }
                  placeholder="0.00"
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

          {/* Limites de Uso */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Limites de Uso</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">Limite Total de Usos</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  placeholder="Ilimitado"
                />
              </div>

              <div>
                <Label htmlFor="usageLimitPerCustomer">
                  Limite por Cliente
                </Label>
                <Input
                  id="usageLimitPerCustomer"
                  type="number"
                  min="1"
                  value={formData.usageLimitPerCustomer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimitPerCustomer: e.target.value,
                    })
                  }
                  placeholder="Ilimitado"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Voucher</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
