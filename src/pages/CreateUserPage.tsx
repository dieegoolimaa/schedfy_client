import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

const CreateUserPage = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        // Here you would handle the form submission
        navigate('/create-professional-profile');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Crie sua conta de administrador</CardTitle>
                    <CardDescription>
                        Agora, crie o usuário que irá gerenciar o estabelecimento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Nome Completo</Label>
                            <Input id="full-name" placeholder="Ex: Ana da Silva" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="ana@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Senha</Label>
                            <Input id="confirm-password" type="password" />
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

export default CreateUserPage;
