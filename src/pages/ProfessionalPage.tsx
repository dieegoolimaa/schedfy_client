import { ProfessionalCard } from "@/components/ProfessionalCard";
import { toast } from "sonner";
import professionals from "@/mock-data/professional";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { PlusCircle } from "lucide-react";

const ProfessionalPage = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    bio: "",
    photo: "",
  });

  const handleViewSchedule = (
    professionalId: string,
    professionalName: string
  ) => {
    toast.info(`Visualizando agenda de ${professionalName}`);
    navigate(`/appointments/${professionalId}`);
  };

  const handleContact = (professionalName: string, email: string) => {
    toast.success(`Entrando em contato com ${professionalName}`);
    // Aqui você poderia abrir o cliente de email ou um modal de contato
    window.open(`mailto:${email}`, "_blank");
  };

  const handleViewAnalytics = (
    professionalId: string,
    professionalName: string
  ) => {
    toast.info(`Visualizando análises de ${professionalName}`);
    navigate(`/admin/analytics/professional/${professionalId}`);
  };

  const handleCreateProfessional = () => {
    // Validação básica
    if (
      !newProfessional.name ||
      !newProfessional.email ||
      !newProfessional.specialty
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // TODO: Implementar lógica de criação no localStorage ou backend
    toast.success(`Profissional ${newProfessional.name} criado com sucesso!`);
    setIsDialogOpen(false);
    setNewProfessional({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      bio: "",
      photo: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Nossos Profissionais
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conheça nossa equipe de especialistas prontos para atendê-lo
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Profissional
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onViewSchedule={() =>
              handleViewSchedule(professional.id, professional.name)
            }
            onContact={() =>
              handleContact(professional.name, professional.email)
            }
            onViewAnalytics={() =>
              handleViewAnalytics(professional.id, professional.name)
            }
          />
        ))}
      </div>

      {/* Dialog para criar novo profissional */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Profissional</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo profissional que fará parte da
              equipe.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={newProfessional.name}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Especialidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialty"
                  placeholder="Ex: Cabelereiro"
                  value={newProfessional.specialty}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      specialty: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@example.com"
                  value={newProfessional.email}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={newProfessional.phone}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto</Label>
              <Input
                id="photo"
                placeholder="https://exemplo.com/foto.jpg"
                value={newProfessional.photo}
                onChange={(e) =>
                  setNewProfessional({
                    ...newProfessional,
                    photo: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre a experiência e especialidades..."
                rows={4}
                value={newProfessional.bio}
                onChange={(e) =>
                  setNewProfessional({
                    ...newProfessional,
                    bio: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProfessional}>
              Criar Profissional
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalPage;
