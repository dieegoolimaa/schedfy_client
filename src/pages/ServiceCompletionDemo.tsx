import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCompletionDialog, type ServiceCompletionData } from "@/components/ServiceCompletionDialog";
import type { Appointment } from "@/interfaces/appointment.interface";

// Mock de um agendamento para demonstração
const mockAppointment: Appointment = {
  id: "demo_001",
  serviceId: "service_001",
  serviceName: "Corte de Cabelo + Barba",
  professionalId: "prof_001",
  professionalName: "Maria Silva",
  
  customer: "João Oliveira",
  email: "joao.oliveira@email.com", 
  phone: "(11) 99999-8888",
  customerNotes: "Cliente preferencial",
  
  date: "2025-10-07T16:00:00Z",
  time: "16:00",
  duration: 60,
  status: "in_progress",
  
  originalPrice: 80.00,
  finalPrice: 72.00, // Com desconto
  totalDiscountAmount: 8.00,
  
  commission: {
    professionalPercentage: 70,
    establishmentPercentage: 30,
    baseAmount: 72.00,
    professionalAmount: 50.40,
    establishmentAmount: 21.60
  },
  
  payment: {
    method: 'pending',
    status: 'pending'
  },
  
  createdAt: "2025-10-07T15:00:00Z",
  updatedAt: "2025-10-07T16:00:00Z"
};

export default function ServiceCompletionDemo() {
  const [showDialog, setShowDialog] = useState(false);

  const handleCompletion = (data: ServiceCompletionData) => {
    console.log('🎉 Serviço finalizado!', data);
    alert(`Serviço finalizado!\n\n✅ Perfil do cliente: ${data.createCustomerProfile ? 'Criado' : 'Não criado'}\n💰 Pagamento: ${data.payment.method} - R$ ${data.payment.amount.toFixed(2)}\n📝 Status: ${data.payment.status}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Demo - Finalização de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h3 className="font-semibold">{mockAppointment.serviceName}</h3>
              <p className="text-sm text-gray-600">Cliente: {mockAppointment.customer}</p>
              <p className="text-sm text-gray-600">Valor: R$ {mockAppointment.finalPrice.toFixed(2)}</p>
              <p className="text-sm">
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Em Andamento
              </p>
            </div>
            
            <Button 
              onClick={() => setShowDialog(true)}
              className="w-full"
              size="lg"
            >
              🏁 Finalizar Serviço
            </Button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Este demo mostra o processo de finalização:</p>
              <p>• Pergunta sobre criação de perfil do cliente</p>
              <p>• Registra informações de pagamento</p>
              <p>• Prepara dados para integração futura</p>
            </div>
          </CardContent>
        </Card>

        <ServiceCompletionDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          appointment={mockAppointment}
          onComplete={handleCompletion}
        />
      </div>
    </div>
  );
}