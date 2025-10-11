import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Play } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success";
  icon?: ReactNode;
  isLoading?: boolean;
}

/**
 * Generic confirmation dialog
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "destructive":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Confirm cancel appointment
 */
interface ConfirmCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentId: string;
  customerName: string;
}

export function ConfirmCancelDialog({
  open,
  onClose,
  onConfirm,
  customerName,
}: ConfirmCancelDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancelar Agendamento"
      description={`Tem certeza que deseja cancelar o agendamento de ${customerName}? Esta ação não pode ser desfeita.`}
      confirmText="Sim, Cancelar"
      cancelText="Não, Manter"
      variant="destructive"
      icon={<XCircle className="h-6 w-6 text-red-500" />}
    />
  );
}

/**
 * Confirm start appointment
 */
interface ConfirmStartDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

export function ConfirmStartDialog({
  open,
  onClose,
  onConfirm,
  customerName,
}: ConfirmStartDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Iniciar Atendimento"
      description={`Deseja iniciar o atendimento de ${customerName}?`}
      confirmText="Sim, Iniciar"
      cancelText="Cancelar"
      icon={<Play className="h-6 w-6 text-blue-500" />}
    />
  );
}

/**
 * Confirm complete appointment (simple_booking)
 */
interface ConfirmCompleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

export function ConfirmCompleteDialog({
  open,
  onClose,
  onConfirm,
  customerName,
}: ConfirmCompleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Concluir Atendimento"
      description={`Deseja marcar o atendimento de ${customerName} como concluído?`}
      confirmText="Sim, Concluir"
      cancelText="Cancelar"
      variant="success"
      icon={<CheckCircle className="h-6 w-6 text-green-500" />}
    />
  );
}
