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
import { MaskedInput } from "@/components/ui/masked-input";
import { useNavigate } from "react-router-dom";

const CreateBusinessPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Here you would handle the form submission
    navigate("/create-user");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Crie a conta do seu negócio
          </CardTitle>
          <CardDescription>
            Primeiro, vamos cadastrar as informações do seu estabelecimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nome do Estabelecimento</Label>
              <Input
                id="business-name"
                placeholder="Ex: Salão de Beleza da Ana"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <MaskedInput
                id="cnpj"
                mask="cnpj"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <MaskedInput
                id="phone"
                mask="phone"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
              />
            </div>
            <Button onClick={handleContinue} className="w-full">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBusinessPage;
