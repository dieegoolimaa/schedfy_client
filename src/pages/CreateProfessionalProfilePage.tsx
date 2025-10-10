import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const CreateProfessionalProfilePage = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Here you would handle the form submission
    navigate("/"); // Navigate to login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Complete seu perfil profissional
          </CardTitle>
          <CardDescription>
            Como administrador, você também pode ser um profissional. Complete
            seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Input id="specialty" placeholder="Ex: Manicure e Pedicure" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="services">Serviços (separados por vírgula)</Label>
              <Input
                id="services"
                placeholder="Manicure, Pedicure, Unhas de Gel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Fale um pouco sobre você e sua experiência."
              />
            </div>
            <Button onClick={handleFinish} className="w-full">
              Finalizar Cadastro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProfessionalProfilePage;
