import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface CreateServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (service: any) => void;
}

export const CreateServiceDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateServiceDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 60,
    price: 0,
    commissionPercentage: 70,
    categoryId: "",
    allowDiscounts: true,
    maxDiscountPercentage: 20,
    availableDays: [1, 2, 3, 4, 5] as number[], // Segunda a sexta por padrão
    professionals: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newService = {
      id: Date.now(),
      ...formData,
      isActive: true,
      requiresConfirmation: false,
      allowOnlineBooking: true,
      allowRescheduling: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar no localStorage (mock)
    try {
      const existing = JSON.parse(
        localStorage.getItem("mock_services") || "[]"
      );
      existing.push(newService);
      localStorage.setItem("mock_services", JSON.stringify(existing));

      toast.success("Serviço criado com sucesso!");
      onSuccess(newService);
      onClose();

      // Reset form
      setFormData({
        name: "",
        description: "",
        duration: 60,
        price: 0,
        commissionPercentage: 70,
        categoryId: "",
        allowDiscounts: true,
        maxDiscountPercentage: 20,
        availableDays: [1, 2, 3, 4, 5],
        professionals: [],
      });
    } catch (error) {
      toast.error("Erro ao criar serviço");
      console.error(error);
    }
  };

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day].sort(),
    }));
  };

  const days = [
    { value: 0, label: "Dom" },
    { value: 1, label: "Seg" },
    { value: 2, label: "Ter" },
    { value: 3, label: "Qua" },
    { value: 4, label: "Qui" },
    { value: 5, label: "Sex" },
    { value: 6, label: "Sáb" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>
            Adicione um novo serviço ao seu negócio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Nome do Serviço <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Corte de Cabelo"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o serviço em detalhes"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">
                  Duração (minutos) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">
                  Preço (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabelo">Cabelo</SelectItem>
                  <SelectItem value="estetica">Estética</SelectItem>
                  <SelectItem value="manicure">Manicure/Pedicure</SelectItem>
                  <SelectItem value="massagem">Massagem</SelectItem>
                  <SelectItem value="depilacao">Depilação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comissão e Descontos */}
          <div className="space-y-4 p-4 bg-[var(--color-muted)]/30 rounded-lg">
            <h3 className="font-semibold">Comissão e Descontos</h3>

            <div>
              <Label htmlFor="commission">Comissão do Profissional (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                value={formData.commissionPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commissionPercentage: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                Estabelecimento: {100 - formData.commissionPercentage}%
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowDiscounts"
                checked={formData.allowDiscounts}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    allowDiscounts: checked as boolean,
                  })
                }
              />
              <Label htmlFor="allowDiscounts" className="cursor-pointer">
                Permitir descontos
              </Label>
            </div>

            {formData.allowDiscounts && (
              <div>
                <Label htmlFor="maxDiscount">Desconto Máximo (%)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.maxDiscountPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountPercentage: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* Dias Disponíveis */}
          <div className="space-y-3">
            <Label>Dias Disponíveis</Label>
            <div className="flex gap-2 flex-wrap">
              {days.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={
                    formData.availableDays.includes(day.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                  className="w-16"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Serviço</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
