import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { businessService } from "@/services/businessService";
import { Mail, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  expiresAt?: Date;
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  email,
  expiresAt,
}: EmailVerificationDialogProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate time left until code expires
  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.floor((expiry - now) / 1000);
      return Math.max(0, diff);
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError("Código deve ter 6 dígitos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Verify email with code (this also logs the user in)
      await authService.verifyEmailWithCode(email, code);

      // Step 2: Check if there's pending business data to create
      const pendingBusinessData = localStorage.getItem("pendingBusinessData");

      if (pendingBusinessData) {
        try {
          const businessData = JSON.parse(pendingBusinessData);

          // Step 3: Convert businessHours from object format to array format
          const businessHoursArray = Object.entries(
            businessData.businessHours || {}
          ).map(([day, hours]: [string, any]) => ({
            day,
            openTime: hours.open,
            closeTime: hours.close,
            isOpen: hours.isOpen,
          }));

          // Step 4: Create business in the database
          await businessService.createBusiness({
            name: businessData.businessName,
            description: businessData.description,
            category: businessData.category,
            phone: businessData.businessPhone,
            email: businessData.businessEmail,
            website: businessData.website || undefined,
            address: {
              street: businessData.address.street,
              number: businessData.address.number,
              complement: businessData.address.complement,
              neighborhood: businessData.address.neighborhood,
              city: businessData.address.city,
              state: businessData.address.state,
              zipCode: businessData.address.zipCode,
              country: businessData.address.country,
            },
            businessHours: businessHoursArray,
            logo: businessData.logo,
            coverImage: businessData.coverImage,
            settings: businessData.settings,
          });

          // Step 5: Clear pending business data
          localStorage.removeItem("pendingBusinessData");
        } catch (businessError: any) {
          console.error("Error creating business:", businessError);
          setError(
            businessError.response?.data?.message ||
              "E-mail verificado, mas erro ao criar negócio. Entre em contato com o suporte."
          );
          setLoading(false);
          return;
        }
      }

      setSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        onOpenChange(false);
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Código inválido ou expirado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError(null);

    try {
      await authService.resendEmailVerification(email);
      setCode("");
      setError(null);

      // Reset timer to 10 minutes (default expiry)
      setTimeLeft(600);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao reenviar código. Tente novamente."
      );
    } finally {
      setResending(false);
    }
  };

  const handleCodeInput = (value: string) => {
    // Only allow digits and limit to 6 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 6);
    setCode(sanitized);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            Verifique seu E-mail
          </DialogTitle>
          <DialogDescription className="text-center">
            Enviamos um código de 6 dígitos para <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-semibold text-center">
              E-mail verificado com sucesso!
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Redirecionando...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificação</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeInput(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-semibold"
                disabled={loading || resending}
                autoFocus
              />

              {timeLeft > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Código expira em <strong>{formatTime(timeLeft)}</strong>
                </p>
              )}

              {timeLeft === 0 && (
                <p className="text-xs text-center text-destructive">
                  Código expirado. Solicite um novo código.
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || code.length !== 6 || timeLeft === 0}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verificar Código
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={resending || loading}
              >
                {resending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Reenviar Código
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Não recebeu o código? Verifique sua pasta de spam ou solicite um
              novo.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
