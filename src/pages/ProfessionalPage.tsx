
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { toast } from "sonner";
import professionals from "@/mock-data/professional";
import { useNavigate } from "react-router";

const ProfessionalPage = () => {
  const navigate = useNavigate();

  const handleViewSchedule = (professionalId: string, professionalName: string) => {
    toast.info(`Visualizando agenda de ${professionalName}`);
    navigate(`/appointments/${professionalId}`);
  };

  const handleContact = (professionalName: string, email: string) => {
    toast.success(`Entrando em contato com ${professionalName}`);
    // Aqui você poderia abrir o cliente de email ou um modal de contato
    window.open(`mailto:${email}`, '_blank');
  };

  const handleViewAnalytics = (professionalId: string, professionalName: string) => {
    toast.info(`Visualizando análises de ${professionalName}`);
    navigate(`/analytics/professional/${professionalId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Nossos Profissionais
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Conheça nossa equipe de especialistas prontos para atendê-lo
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onViewSchedule={() => handleViewSchedule(professional.id, professional.name)}
            onContact={() => handleContact(professional.name, professional.email)}
            onViewAnalytics={() => handleViewAnalytics(professional.id, professional.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfessionalPage;
