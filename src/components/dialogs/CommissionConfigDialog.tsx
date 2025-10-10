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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

interface CommissionConfig {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalPercentage: number;
  establishmentPercentage: number;
  professionalOverrides?: {
    professionalId: string;
    professionalName: string;
    percentage: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface CommissionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (config: CommissionConfig) => void;
  services: { id: string; name: string }[];
  professionals?: { id: string; name: string }[];
}

export function CommissionConfigDialog({
  open,
  onClose,
  onSuccess,
  services,
  professionals = [],
}: CommissionConfigDialogProps) {
  const [formData, setFormData] = useState({
    serviceId: "",
    professionalPercentage: "70",
    establishmentPercentage: "30",
  });

  const [overrides, setOverrides] = useState<
    { professionalId: string; percentage: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.serviceId) {
      toast.error("Selecione um serviço");
      return;
    }

    const profPerc = parseFloat(formData.professionalPercentage);
    const estabPerc = parseFloat(formData.establishmentPercentage);

    if (isNaN(profPerc) || profPerc < 0 || profPerc > 100) {
      toast.error("Porcentagem do profissional deve estar entre 0 e 100");
      return;
    }

    if (isNaN(estabPerc) || estabPerc < 0 || estabPerc > 100) {
      toast.error("Porcentagem do estabelecimento deve estar entre 0 e 100");
      return;
    }

    if (profPerc + estabPerc !== 100) {
      toast.error("A soma das porcentagens deve ser 100%");
      return;
    }

    // Validar overrides
    for (const override of overrides) {
      const perc = parseFloat(override.percentage);
      if (isNaN(perc) || perc < 0 || perc > 100) {
        toast.error("Porcentagens dos overrides devem estar entre 0 e 100");
        return;
      }
    }

    const selectedService = services.find((s) => s.id === formData.serviceId);
    if (!selectedService) {
      toast.error("Serviço não encontrado");
      return;
    }

    // Criar configuração
    const newConfig: CommissionConfig = {
      id: `commission_${Date.now()}`,
      serviceId: formData.serviceId,
      serviceName: selectedService.name,
      professionalPercentage: profPerc,
      establishmentPercentage: estabPerc,
      professionalOverrides:
        overrides.length > 0
          ? overrides.map((o) => {
              const prof = professionals.find((p) => p.id === o.professionalId);
              return {
                professionalId: o.professionalId,
                professionalName: prof?.name || "Unknown",
                percentage: parseFloat(o.percentage),
              };
            })
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar no localStorage (mock)
    const configs = JSON.parse(
      localStorage.getItem("mock_commissions") || "[]"
    );
    configs.push(newConfig);
    localStorage.setItem("mock_commissions", JSON.stringify(configs));

    toast.success("Configuração de comissão criada com sucesso!");
    onSuccess(newConfig);
    onClose();

    // Limpar formulário
    setFormData({
      serviceId: "",
      professionalPercentage: "70",
      establishmentPercentage: "30",
    });
    setOverrides([]);
  };

  const handleProfessionalPercentageChange = (value: string) => {
    const profPerc = parseFloat(value) || 0;
    const estabPerc = 100 - profPerc;
    setFormData({
      ...formData,
      professionalPercentage: value,
      establishmentPercentage: estabPerc.toString(),
    });
  };

  const handleEstablishmentPercentageChange = (value: string) => {
    const estabPerc = parseFloat(value) || 0;
    const profPerc = 100 - estabPerc;
    setFormData({
      ...formData,
      establishmentPercentage: value,
      professionalPercentage: profPerc.toString(),
    });
  };

  const addOverride = () => {
    if (professionals.length === 0) {
      toast.error("Nenhum profissional cadastrado");
      return;
    }
    setOverrides([
      ...overrides,
      { professionalId: "", percentage: formData.professionalPercentage },
    ]);
  };

  const removeOverride = (index: number) => {
    setOverrides(overrides.filter((_, i) => i !== index));
  };

  const updateOverride = (
    index: number,
    field: "professionalId" | "percentage",
    value: string
  ) => {
    const newOverrides = [...overrides];
    newOverrides[index] = { ...newOverrides[index], [field]: value };
    setOverrides(newOverrides);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Comissão por Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selecionar Serviço */}
          <div>
            <Label htmlFor="serviceId">Serviço *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData({ ...formData, serviceId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Nenhum serviço cadastrado
                  </div>
                ) : (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Comissão Padrão */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Comissão Padrão</h3>
            <p className="text-sm text-muted-foreground">
              Define a divisão padrão da receita entre profissional e
              estabelecimento para este serviço.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="professionalPercentage">Profissional (%)</Label>
                <Input
                  id="professionalPercentage"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.professionalPercentage}
                  onChange={(e) =>
                    handleProfessionalPercentageChange(e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="establishmentPercentage">
                  Estabelecimento (%)
                </Label>
                <Input
                  id="establishmentPercentage"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.establishmentPercentage}
                  onChange={(e) =>
                    handleEstablishmentPercentageChange(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Total:{" "}
              {parseFloat(formData.professionalPercentage || "0") +
                parseFloat(formData.establishmentPercentage || "0")}
              %
              {parseFloat(formData.professionalPercentage || "0") +
                parseFloat(formData.establishmentPercentage || "0") !==
                100 && (
                <span className="text-destructive ml-2">(deve somar 100%)</span>
              )}
            </div>
          </div>

          {/* Exceções por Profissional */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  Exceções por Profissional
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure comissões específicas para profissionais individuais
                  (opcional)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOverride}
                disabled={professionals.length === 0}
              >
                + Adicionar
              </Button>
            </div>

            {overrides.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">
                Nenhuma exceção configurada. Use a comissão padrão para todos os
                profissionais.
              </div>
            ) : (
              <div className="space-y-3">
                {overrides.map((override, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-[1fr,120px,auto] gap-3">
                      <div>
                        <Label htmlFor={`professional-${index}`}>
                          Profissional
                        </Label>
                        <Select
                          value={override.professionalId}
                          onValueChange={(value) =>
                            updateOverride(index, "professionalId", value)
                          }
                        >
                          <SelectTrigger id={`professional-${index}`}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionals.map((prof) => (
                              <SelectItem key={prof.id} value={prof.id}>
                                {prof.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`percentage-${index}`}>
                          Comissão (%)
                        </Label>
                        <Input
                          id={`percentage-${index}`}
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={override.percentage}
                          onChange={(e) =>
                            updateOverride(index, "percentage", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOverride(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Configuração</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
