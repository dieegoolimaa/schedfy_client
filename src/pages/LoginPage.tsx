import { LoginForm } from "@/components/LoginForm";
import { useNavigate } from "react-router";
import users from "@/mock-data/user";
import professionals from "@/mock-data/professional";
import { toast } from "sonner";

const LoginPage = () => {
    const navigate = useNavigate();
    const allUsers = users;

    const handleLogin = (username: string, password: string) => {
        const user = allUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            toast.success("Login bem-sucedido!");
            
            // Para profissionais, navegar para a página usando o ID do profissional, não do usuário
            if (user.role === "professional") {
                const professional = professionals.find(p => p.email === user.username);
                if (professional) {
                    navigate(`/appointments/${professional.id}`);
                } else {
                    toast.error("Profissional não encontrado!");
                    return;
                }
            } else {
                // Para admin, pode usar qualquer rota administrativa
                navigate(`/admin/appointments`);
            }
            
            localStorage.setItem("loggedInUser", JSON.stringify(user));
        } else {
            toast.error("Credenciais inválidas. Tente novamente. 🚨");
            localStorage.removeItem("loggedInUser");
        }
    };


    return (
        <main className="flex min-h-svh w-full items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
            <div className="w-full max-w-sm">
                <LoginForm onLogin={handleLogin} />
            </div>
        </main>
    );
}

export default LoginPage;