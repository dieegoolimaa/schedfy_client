import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planConfigs } from "@/mock-data/companies";
import type { PlanConfig } from "@/interfaces/company.interface";
import {
  Package,
  Edit,
  Check,
  X,
  Users,
  Calendar,
  DollarSign,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

const SchedfyPlansPage = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedPlan, setEditedPlan] = useState<PlanConfig | null>(null);

  const handleEditPlan = (plan: PlanConfig) => {
    setEditedPlan({ ...plan });
    setShowEditDialog(true);
  };

  const handleSavePlan = () => {
    if (!editedPlan) return;

    toast.success(`Plano ${editedPlan.name} atualizado com sucesso!`);
    setShowEditDialog(false);
    // Aqui você adicionaria a lógica para salvar no backend
  };

  const getPlanColor = (planId: string) => {
    const colors = {
      simple_booking: "border-blue-500 bg-blue-50 dark:bg-blue-950",
      individual: "border-purple-500 bg-purple-50 dark:bg-purple-950",
      business: "border-orange-500 bg-orange-50 dark:bg-orange-950",
    };
    return colors[planId as keyof typeof colors] || "border-gray-500";
  };

  const getPlanIcon = (planId: string) => {
    const colors = {
      simple_booking: "text-blue-500",
      individual: "text-purple-500",
      business: "text-orange-500",
    };
    return colors[planId as keyof typeof colors] || "text-gray-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gerenciamento de Planos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure os planos disponíveis e seus preços
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {planConfigs.map((plan) => (
          <Card
            key={plan.id}
            className={`border-2 ${getPlanColor(
              plan.id
            )} transition-all hover:shadow-lg`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className={`h-6 w-6 ${getPlanIcon(plan.id)}`} />
                  {plan.name}
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditPlan(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Preços
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇺🇸 USD (mensal):</span>
                    <span className="font-semibold">
                      ${plan.pricing.USD.monthly}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇺🇸 USD (anual):</span>
                    <span className="font-semibold">
                      ${plan.pricing.USD.yearly}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇪🇺 EUR (mensal):</span>
                    <span className="font-semibold">
                      €{plan.pricing.EUR.monthly}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇪🇺 EUR (anual):</span>
                    <span className="font-semibold">
                      €{plan.pricing.EUR.yearly}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇧🇷 BRL (mensal):</span>
                    <span className="font-semibold">
                      R${plan.pricing.BRL.monthly}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🇧🇷 BRL (anual):</span>
                    <span className="font-semibold">
                      R${plan.pricing.BRL.yearly}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commission */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    Comissão Schedfy
                  </span>
                  <Badge variant="outline" className="font-semibold">
                    {plan.commission.percentage}%
                  </Badge>
                </div>
              </div>

              {/* Limits */}
              <div className="pt-2 border-t space-y-2">
                <h3 className="font-semibold text-sm">Limites</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Profissionais:
                    </span>
                    <span className="font-semibold">
                      {plan.limits.maxProfessionals === "unlimited"
                        ? "Ilimitado"
                        : plan.limits.maxProfessionals}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Serviços:
                    </span>
                    <span className="font-semibold">
                      {plan.limits.maxServices === "unlimited"
                        ? "Ilimitado"
                        : plan.limits.maxServices}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Agendamentos/mês:
                    </span>
                    <span className="font-semibold">
                      {plan.limits.maxAppointmentsPerMonth === "unlimited"
                        ? "Ilimitado"
                        : plan.limits.maxAppointmentsPerMonth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="pt-2 border-t">
                <h3 className="font-semibold text-sm mb-2">Funcionalidades</h3>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Plan Dialog */}
      {editedPlan && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Plano: {editedPlan.name}</DialogTitle>
              <DialogDescription>
                Atualize os detalhes, preços e funcionalidades do plano
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label>Nome do Plano</Label>
                  <Input
                    value={editedPlan.name}
                    onChange={(e) =>
                      setEditedPlan({ ...editedPlan, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={editedPlan.description}
                    onChange={(e) =>
                      setEditedPlan({
                        ...editedPlan,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preços
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>🇺🇸 USD - Mensal</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.USD.monthly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            USD: {
                              ...editedPlan.pricing.USD,
                              monthly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>🇺🇸 USD - Anual</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.USD.yearly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            USD: {
                              ...editedPlan.pricing.USD,
                              yearly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>🇪🇺 EUR - Mensal</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.EUR.monthly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            EUR: {
                              ...editedPlan.pricing.EUR,
                              monthly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>🇪🇺 EUR - Anual</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.EUR.yearly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            EUR: {
                              ...editedPlan.pricing.EUR,
                              yearly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>🇧🇷 BRL - Mensal</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.BRL.monthly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            BRL: {
                              ...editedPlan.pricing.BRL,
                              monthly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>🇧🇷 BRL - Anual</Label>
                    <Input
                      type="number"
                      value={editedPlan.pricing.BRL.yearly}
                      onChange={(e) =>
                        setEditedPlan({
                          ...editedPlan,
                          pricing: {
                            ...editedPlan.pricing,
                            BRL: {
                              ...editedPlan.pricing.BRL,
                              yearly: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Commission */}
              <div className="border-t pt-4">
                <div className="max-w-xs">
                  <Label>Comissão Schedfy (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editedPlan.commission.percentage}
                    onChange={(e) =>
                      setEditedPlan({
                        ...editedPlan,
                        commission: {
                          percentage: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Limits */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Limites</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Máx. Profissionais</Label>
                    <Input
                      placeholder="unlimited ou número"
                      value={editedPlan.limits.maxProfessionals}
                      onChange={(e) => {
                        const value =
                          e.target.value === "unlimited"
                            ? "unlimited"
                            : parseInt(e.target.value) || 0;
                        setEditedPlan({
                          ...editedPlan,
                          limits: {
                            ...editedPlan.limits,
                            maxProfessionals: value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Máx. Serviços</Label>
                    <Input
                      placeholder="unlimited ou número"
                      value={editedPlan.limits.maxServices}
                      onChange={(e) => {
                        const value =
                          e.target.value === "unlimited"
                            ? "unlimited"
                            : parseInt(e.target.value) || 0;
                        setEditedPlan({
                          ...editedPlan,
                          limits: {
                            ...editedPlan.limits,
                            maxServices: value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Máx. Agendamentos/mês</Label>
                    <Input
                      placeholder="unlimited ou número"
                      value={editedPlan.limits.maxAppointmentsPerMonth}
                      onChange={(e) => {
                        const value =
                          e.target.value === "unlimited"
                            ? "unlimited"
                            : parseInt(e.target.value) || 0;
                        setEditedPlan({
                          ...editedPlan,
                          limits: {
                            ...editedPlan.limits,
                            maxAppointmentsPerMonth: value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Funcionalidades</h3>
                <div className="space-y-2">
                  {editedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editedPlan.features];
                          newFeatures[index] = e.target.value;
                          setEditedPlan({
                            ...editedPlan,
                            features: newFeatures,
                          });
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newFeatures = editedPlan.features.filter(
                            (_, i) => i !== index
                          );
                          setEditedPlan({
                            ...editedPlan,
                            features: newFeatures,
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditedPlan({
                        ...editedPlan,
                        features: [
                          ...editedPlan.features,
                          "Nova funcionalidade",
                        ],
                      });
                    }}
                  >
                    + Adicionar Funcionalidade
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSavePlan}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SchedfyPlansPage;
