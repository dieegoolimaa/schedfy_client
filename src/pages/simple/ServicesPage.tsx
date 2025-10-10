import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SimpleService {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  isActive: boolean;
  createdAt: string;
}

/**
 * Simple Booking Services Page
 * For simple_booking plan - focuses only on service scheduling
 * NO financial features (no price, no commission, no discounts)
 */
const SimpleBookingServicesPage = () => {
  const [services, setServices] = useState<SimpleService[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<SimpleService | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "60",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const stored = localStorage.getItem("simple_services");
    if (stored) {
      setServices(JSON.parse(stored));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error("Duração deve ser maior que 0");
      return;
    }

    if (editingService) {
      // Update
      const updated = services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: formData.name,
              description: formData.description,
              duration: parseInt(formData.duration),
            }
          : s
      );
      setServices(updated);
      localStorage.setItem("simple_services", JSON.stringify(updated));
      toast.success("Serviço atualizado com sucesso!");
    } else {
      // Create
      const newService: SimpleService = {
        id: `service_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration),
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      const updated = [...services, newService];
      setServices(updated);
      localStorage.setItem("simple_services", JSON.stringify(updated));
      toast.success("Serviço criado com sucesso!");
    }

    handleCloseDialog();
  };

  const handleEdit = (service: SimpleService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
    });
    setShowDialog(true);
  };

  const handleDelete = (serviceId: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    localStorage.setItem("simple_services", JSON.stringify(updated));
    toast.success("Serviço excluído com sucesso!");
  };

  const handleToggleActive = (serviceId: string) => {
    const updated = services.map((s) =>
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    );
    setServices(updated);
    localStorage.setItem("simple_services", JSON.stringify(updated));
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      duration: "60",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">
              Serviços
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Gerencie os serviços disponíveis para agendamento
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--color-muted-foreground)] mb-4">
                Nenhum serviço cadastrado ainda.
              </p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={!service.isActive ? "opacity-60" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {service.description || "Sem descrição"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                      <span>{service.duration} minutos</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(service.id)}
                      >
                        {service.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Corte de Cabelo"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o serviço..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="60"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingService ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SimpleBookingServicesPage;
