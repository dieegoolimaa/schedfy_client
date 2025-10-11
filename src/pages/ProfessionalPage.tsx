import { ProfessionalCard } from "@/components/ProfessionalCard";
import { toast } from "sonner";
import professionals from "@/mock-data/professional";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { PlusCircle, Upload, X } from "lucide-react";
import type { Profissional } from "@/interfaces/professional.interface";

const ProfessionalPage = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProfessionalId, setEditingProfessionalId] = useState<
    string | null
  >(null);
  const [localProfessionals, setLocalProfessionals] = useState<Profissional[]>(
    []
  );
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    bio: "",
    photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load professionals from localStorage or use default
    const stored = localStorage.getItem("professionals");
    if (stored) {
      setLocalProfessionals(JSON.parse(stored));
    } else {
      setLocalProfessionals(professionals);
    }
  }, []);

  const saveProfessionals = (profs: Profissional[]) => {
    localStorage.setItem("professionals", JSON.stringify(profs));
    setLocalProfessionals(profs);
  };

  const handleEdit = (professional: Profissional) => {
    setIsEditMode(true);
    setEditingProfessionalId(professional.id);
    setNewProfessional({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialty: professional.specialty,
      bio: "",
      photo: professional.photo || "",
    });
    setPhotoPreview(professional.photo || "");
    setIsDialogOpen(true);
  };

  const handleToggleActive = (professionalId: string) => {
    const updatedProfessionals = localProfessionals.map((prof) => {
      if (prof.id === professionalId) {
        const newStatus = !(prof.isActive !== false);
        toast.success(
          `Profissional ${newStatus ? "ativado" : "desativado"} com sucesso!`
        );
        return { ...prof, isActive: newStatus };
      }
      return prof;
    });
    saveProfessionals(updatedProfessionals);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setNewProfessional({ ...newProfessional, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setNewProfessional({ ...newProfessional, photo: result });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Por favor, faça upload de uma imagem.");
    }
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingProfessionalId(null);
    setNewProfessional({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      bio: "",
      photo: "",
    });
    setPhotoPreview("");
  };

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

    if (isEditMode && editingProfessionalId) {
      // Edit existing professional
      const updatedProfessionals = localProfessionals.map((prof) => {
        if (prof.id === editingProfessionalId) {
          return {
            ...prof,
            name: newProfessional.name,
            email: newProfessional.email,
            phone: newProfessional.phone,
            specialty: newProfessional.specialty,
            photo: newProfessional.photo,
          };
        }
        return prof;
      });
      saveProfessionals(updatedProfessionals);
      toast.success(
        `Profissional ${newProfessional.name} atualizado com sucesso!`
      );
    } else {
      // Create new professional
      const newProf: Profissional = {
        id: `prof-${Date.now()}`,
        name: newProfessional.name,
        email: newProfessional.email,
        phone: newProfessional.phone,
        specialty: newProfessional.specialty,
        commerce: 1, // Default commerce
        photo: newProfessional.photo,
        isActive: true,
      };
      saveProfessionals([...localProfessionals, newProf]);
      toast.success(`Profissional ${newProfessional.name} criado com sucesso!`);
    }

    resetDialog();
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
        {localProfessionals.map((professional) => (
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
            onEdit={() => handleEdit(professional)}
            onToggleActive={() => handleToggleActive(professional.id)}
          />
        ))}
      </div>

      {/* Dialog para criar/editar profissional */}
      <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Editar Profissional"
                : "Adicionar Novo Profissional"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Atualize as informações do profissional."
                : "Preencha as informações do novo profissional que fará parte da equipe."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Photo Upload with Drag and Drop */}
            <div className="space-y-2">
              <Label>Foto do Profissional</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-1/2 translate-x-16"
                      onClick={() => {
                        setPhotoPreview("");
                        setNewProfessional({ ...newProfessional, photo: "" });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Arraste e solte uma imagem aqui ou
                    </p>
                    <label className="mt-2 inline-block">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          Selecionar Arquivo
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </span>
                      </Button>
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF até 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

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
              <Label htmlFor="bio">Biografia (opcional)</Label>
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
            <Button variant="outline" onClick={resetDialog}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProfessional}>
              {isEditMode ? "Atualizar Profissional" : "Criar Profissional"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalPage;
