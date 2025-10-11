import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, Phone, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuspendedAccountPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
              <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
            Conta Suspensa
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensagem Principal */}
          <div className="text-center space-y-3">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Sua conta foi temporariamente suspensa
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              O acesso ao sistema está bloqueado devido a uma ou mais das
              seguintes razões:
            </p>
          </div>

          {/* Motivos Comuns */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Motivos comuns para suspensão:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Pagamento pendente ou fatura vencida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Violação dos termos de uso da plataforma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Atividade suspeita detectada na conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Solicitação administrativa</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Como reativar sua conta:
            </h3>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
              <li>Entre em contato com nosso suporte</li>
              <li>Resolva quaisquer pendências financeiras</li>
              <li>Aguarde a análise e reativação</li>
            </ol>
          </div>

          {/* Informações de Contato */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
              Suporte Schedfy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-sm">suporte@schedfy.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Telefone
                  </p>
                  <p className="font-medium text-sm">+55 (11) 9999-9999</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/login")}
            >
              Voltar ao Login
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                window.open("mailto:suporte@schedfy.com", "_blank")
              }
            >
              <Mail className="h-4 w-4 mr-2" />
              Contatar Suporte
            </Button>
          </div>

          {/* Nota */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-500 pt-4 border-t">
            Se você acredita que isso é um erro, entre em contato com nossa
            equipe de suporte imediatamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuspendedAccountPage;
