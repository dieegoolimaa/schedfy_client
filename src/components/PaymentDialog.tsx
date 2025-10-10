import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  amount,
  onSuccess,
}) => {
  const handlePay = () => {
    // simulate payment delay
    setTimeout(() => {
      toast.success("Payment successful (mock)");
      onSuccess && onSuccess();
      onClose();
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagamento (Mock)</DialogTitle>
          <DialogDescription>
            Valor a pagar: R$ {amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-2">
          <Button onClick={handlePay} className="bg-[var(--color-accent)]">
            Pagar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
