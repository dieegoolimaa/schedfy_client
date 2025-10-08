import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CreditCard, DollarSign, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "@/interfaces/appointment.interface";

interface ServiceCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onComplete: (completionData: ServiceCompletionData) => void;
}

export interface ServiceCompletionData {
  createCustomerProfile: boolean;
  customerProfileData?: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  payment: {
    method: 'cash' | 'card' | 'pix' | 'pending';
    amount: number;
    status: 'completed' | 'pending';
    notes?: string;
  };
}

export function ServiceCompletionDialog({ 
  isOpen, 
  onClose, 
  appointment, 
  onComplete 
}: ServiceCompletionDialogProps) {
  const [step, setStep] = useState(1);
  const [createProfile, setCreateProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: appointment.customer,
    email: appointment.email,
    phone: appointment.phone,
    notes: ""
  });
  const [paymentData, setPaymentData] = useState({
    method: 'cash' as const,
    amount: appointment.finalPrice,
    status: 'completed' as const,
    notes: ""
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleComplete = () => {
    const completionData: ServiceCompletionData = {
      createCustomerProfile: createProfile,
      customerProfileData: createProfile ? profileData : undefined,
      payment: paymentData
    };

    onComplete(completionData);
    toast.success("Serviço finalizado com sucesso!");
    onClose();
    
    // Reset form
    setStep(1);
    setCreateProfile(false);
    setProfileData({
      name: appointment.customer,
      email: appointment.email,
      phone: appointment.phone,
      notes: ""
    });
    setPaymentData({
      method: 'cash',
      amount: appointment.finalPrice,
      status: 'completed',
      notes: ""
    });
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      cash: 'Dinheiro',
      card: 'Cartão',
      pix: 'PIX',
      pending: 'Pagamento Pendente'
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Finalizar Serviço
          </DialogTitle>
          <DialogDescription>
            Complete o processo de finalização do serviço para {appointment.customer}
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Resumo do serviço */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Serviço:</span>
                <span className="font-medium">{appointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{appointment.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Total:</span>
                <span className="font-medium text-green-600">{formatCurrency(appointment.finalPrice)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Etapa 1: Perfil do Cliente */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium">Criar Perfil do Cliente</h4>
                <p className="text-sm text-gray-600">
                  Deseja criar um perfil permanente para este cliente?
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={!createProfile ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreateProfile(false)}
                >
                  Não
                </Button>
                <Button
                  variant={createProfile ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreateProfile(true)}
                >
                  Sim
                </Button>
              </div>
            </div>

            {createProfile && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h5 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados do Perfil
                </h5>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="profile-name">Nome Completo *</Label>
                    <Input
                      id="profile-name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo do cliente"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-email">Email *</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@cliente.com"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-phone">Telefone *</Label>
                    <MaskedInput
                      id="profile-phone"
                      mask="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-notes">Observações (opcional)</Label>
                    <Input
                      id="profile-notes"
                      value={profileData.notes}
                      onChange={(e) => setProfileData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Preferências, alergias, etc."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleNext}>
                Próximo: Pagamento
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 2: Pagamento */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h4 className="font-medium">Registrar Pagamento</h4>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Método de Pagamento</Label>
                <Select 
                  value={paymentData.method} 
                  onValueChange={(value: any) => setPaymentData(prev => ({ ...prev, method: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">💵 Dinheiro</SelectItem>
                    <SelectItem value="card">💳 Cartão</SelectItem>
                    <SelectItem value="pix">📱 PIX</SelectItem>
                    <SelectItem value="pending">⏳ Pagamento Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-amount">Valor Recebido</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment-status">Status do Pagamento</Label>
                <Select 
                  value={paymentData.status} 
                  onValueChange={(value: any) => setPaymentData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">✅ Concluído</SelectItem>
                    <SelectItem value="pending">⏳ Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-notes">Observações (opcional)</Label>
                <Input
                  id="payment-notes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Troco, observações sobre o pagamento..."
                  className="mt-2"
                />
              </div>
            </div>

            <Separator />

            {/* Resumo final */}
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Resumo da Finalização</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Perfil do cliente:</span>
                  <span className="font-medium">
                    {createProfile ? "✅ Será criado" : "❌ Não será criado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pagamento:</span>
                  <span className="font-medium">
                    {getPaymentMethodText(paymentData.method)} - {formatCurrency(paymentData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">
                    {paymentData.status === 'completed' ? '✅ Pago' : '⏳ Pendente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Finalizar Serviço
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}