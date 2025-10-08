"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import professionals from "@/mock-data/professional";

// Mock data para serviços
const services = [
  { id: "1", name: "Corte de Cabelo", price: 50, duration: 60, professionalIds: [1, 2] },
  { id: "2", name: "Manicure", price: 35, duration: 45, professionalIds: [2, 3] },
  { id: "3", name: "Pedicure", price: 40, duration: 50, professionalIds: [2, 3] },
  { id: "4", name: "Massagem", price: 80, duration: 90, professionalIds: [5] },
  { id: "5", name: "Limpeza de Pele", price: 120, duration: 120, professionalIds: [3] },
];

// Mock data para horários disponíveis
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

const BookAppointmentPage = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProfessional, setIsProfessional] = useState(false);

  // Pre-preencher dados se for profissional logado
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    const user = loggedUser ? JSON.parse(loggedUser) : null;
    const isProf = user?.role === "professional";

    setCurrentUser(user);
    setIsProfessional(isProf);

    if (isProf && user) {
      const professionalData = professionals.find(p => p.email === user.username);
      if (professionalData) {
        setCustomerData(prev => ({
          ...prev,
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone || ""
        }));
      }
    }
  }, []); // Executar apenas uma vez na montagem do componente

  // Filtrar profissionais baseado no serviço selecionado
  const availableProfessionals = selectedService 
    ? professionals.filter(prof => {
        const service = services.find(s => s.id === selectedService);
        return service?.professionalIds.includes(Number(prof.id));
      })
    : [];

  // Obter serviço selecionado
  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedProfessionalData = professionals.find(p => p.id?.toString() === selectedProfessional);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast.error("Por favor, preencha suas informações de contato");
      return;
    }

    // Simular criação do agendamento
    const appointment = {
      service: selectedServiceData?.name,
      professional: selectedProfessionalData?.name,
      date: selectedDate.toLocaleDateString('pt-BR'),
      time: selectedTime,
      customer: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      price: selectedServiceData?.price
    };

    console.log("Agendamento criado:", appointment);
    toast("Agendamento realizado com sucesso! Aguarde confirmação.");
    
    // Reset form
    setSelectedService("");
    setSelectedProfessional("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setCustomerData({ name: "", email: "", phone: "", notes: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isProfessional ? "Agendar para Cliente" : "Agendar Serviço"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isProfessional 
            ? "Agende um serviço para seu cliente" 
            : "Escolha o serviço, profissional e horário desejado"
          }
        </p>
        {isProfessional && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Modo Profissional
              </Badge>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Agendando como: {professionals.find(p => p.email === currentUser?.username)?.name}
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seleção de Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>1. Escolha o Serviço</CardTitle>
            <CardDescription>Selecione o serviço que deseja agendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-select">Serviço</Label>
                <Select 
                  value={selectedService} 
                  onValueChange={(value) => {
                    setSelectedService(value);
                    setSelectedProfessional(""); // Reset professional when service changes
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({service.duration} min)</span>
                          </div>
                          <span className="font-bold text-blue-600 ml-4">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seleção de Profissional */}
        {selectedService && (
          <Card>
            <CardHeader>
              <CardTitle>2. Escolha o Profissional</CardTitle>
              <CardDescription>Profissionais disponíveis para este serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="professional-select">Profissional</Label>
                <Select 
                  value={selectedProfessional} 
                  onValueChange={setSelectedProfessional}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProfessionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id?.toString() || ""}>
                        <div className="flex items-center gap-2 w-full">
                          <Avatar className="w-7 h-7 flex-shrink-0">
                            <AvatarImage src={professional.photo} alt={professional.name} />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium">
                              {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium text-sm truncate">{professional.name}</span>
                            <span className="text-xs text-gray-500 truncate">{professional.specialty}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seleção de Data e Horário */}
        {selectedProfessional && (
          <Card>
            <CardHeader>
              <CardTitle>3. Escolha Data e Horário</CardTitle>
              <CardDescription>Selecione quando deseja ser atendido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seleção de Data */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Data</Label>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    placeholder="Selecione uma data"
                    className="w-full mt-2"
                  />
                  {selectedDate && (
                    <p className="text-sm text-muted-foreground">
                      Data selecionada: {selectedDate.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Horários */}
                {selectedDate && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Horário Disponível</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="text-xs h-9"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações do Cliente */}
        {selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isProfessional ? "4. Informações do Cliente" : "4. Suas Informações"}
              </CardTitle>
              <CardDescription>
                {isProfessional 
                  ? "Dados do cliente para contato e confirmação" 
                  : "Dados para contato e confirmação"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    {isProfessional ? "Nome do Cliente *" : "Nome Completo *"}
                  </Label>
                  <Input
                    id="name"
                    className="mt-2"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isProfessional ? "Nome do cliente" : "Seu nome completo"}
                    required
                    disabled={isProfessional && !!professionals.find(p => p.email === currentUser?.username)}
                  />
                  {isProfessional && professionals.find(p => p.email === currentUser?.username) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Campo preenchido automaticamente. Para agendar para outro cliente, limpe e digite o nome.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">
                    {isProfessional ? "Email do Cliente *" : "Email *"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-2"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={isProfessional ? "email@cliente.com" : "seu@email.com"}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    {isProfessional ? "Telefone do Cliente *" : "Telefone *"}
                  </Label>
                  <MaskedInput
                    id="phone"
                    mask="phone"
                    className="mt-2"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                {isProfessional && (
                  <div>
                    <Label htmlFor="professional-notes">Observações Profissionais</Label>
                    <Input
                      id="professional-notes"
                      className="mt-2"
                      value={customerData.notes}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre o atendimento"
                    />
                  </div>
                )}
              </div>
              {!isProfessional && (
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Input
                    id="notes"
                    className="mt-2"
                    value={customerData.notes}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Alguma observação especial?"
                  />
                </div>
              )}
              
              {isProfessional && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Agendamento Profissional
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Este agendamento será registrado como realizado por você. Confirme os dados do cliente antes de prosseguir.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resumo do Agendamento */}
        {selectedTime && customerData.name && (
          <Card>
            <CardHeader>
              <CardTitle>5. Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profissional:</span>
                  <span className="font-medium">{selectedProfessionalData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{selectedServiceData?.duration} minutos</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedServiceData?.price || 0)}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                {isProfessional ? "Agendar para Cliente" : "Confirmar Agendamento"}
              </Button>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default BookAppointmentPage;