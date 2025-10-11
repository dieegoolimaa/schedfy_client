import { LoginForm } from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";
import professionals from "@/mock-data/professional";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);

      // Wait a bit for state to update
      setTimeout(() => {
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );

        toast.success("Login bem-sucedido!");

        // Platform Admin - Schedfy administrator
        if (currentUser.role === "platform_admin") {
          navigate(`/schedfy/dashboard`);
        }
        // Para profissionais, navegar para a página usando o ID do profissional, não do usuário
        else if (currentUser.role === "professional") {
          const professional = professionals.find(
            (p) => p.email === currentUser.username
          );
          if (professional) {
            navigate(`/appointments/${professional.id}`);
          } else {
            toast.error("Profissional não encontrado!");
            return;
          }
        } else if (
          currentUser.role === "owner" ||
          currentUser.role === "admin"
        ) {
          // Para owner/admin, ir para o dashboard
          navigate(`/dashboard`);
        } else if (currentUser.role === "simple") {
          // Para simple booking, ir para appointments
          navigate(`/simple/appointments`);
        } else {
          // Fallback para admin appointments
          navigate(`/admin/appointments`);
        }
      }, 100);
    } catch (error) {
      toast.error("Credenciais inválidas. Tente novamente. 🚨");
    }
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} />
      </div>
    </main>
  );
};

export default LoginPage;
