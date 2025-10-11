"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import professionals from "@/mock-data/professional";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Calendar, User } from "lucide-react";

// Mock data para serviços
const services = [
  {
    id: "1",
    name: "Corte de Cabelo",
    price: 50,
    duration: 60,
    professionalIds: [1, 2],
  },
  {
    id: "2",
    name: "Manicure",
    price: 35,
    duration: 45,
    professionalIds: [2, 3],
  },
  {
    id: "3",
    name: "Pedicure",
    price: 40,
    duration: 50,
    professionalIds: [2, 3],
  },
  { id: "4", name: "Massagem", price: 80, duration: 90, professionalIds: [5] },
  {
    id: "5",
    name: "Limpeza de Pele",
    price: 120,
    duration: 120,
    professionalIds: [3],
  },
];

// Mock data para horários disponíveis
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

type BookingPreference = "by-date" | "by-professional";

const BookAppointmentPage = () => {
  const [bookingPreference, setBookingPreference] =
    useState<BookingPreference>("by-professional");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProfessional, setIsProfessional] = useState(false);
  const [isBusinessPlan, setIsBusinessPlan] = useState(false);

  const location = useLocation();
  const { t } = useI18n();

  // Pre-preencher dados se for profissional logado
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    const user = loggedUser ? JSON.parse(loggedUser) : null;
    const isProf = user?.role === "professional";
    const isBusiness = user?.role === "owner" || user?.role === "admin";

    setCurrentUser(user);
    setIsProfessional(isProf);
    setIsBusinessPlan(isBusiness);

    if (isProf && user) {
      const professionalData = professionals.find(
        (p) => p.email === user.username
      );
      if (professionalData) {
        setCustomerData((prev) => ({
          ...prev,
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone || "",
        }));
      }
    }
  }, []); // Executar apenas uma vez na montagem do componente

  // Prefill from query params (public booking landing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service");
    const professional = params.get("professional");
    const date = params.get("date");
    const time = params.get("time");
    const name = params.get("name");
    const phone = params.get("phone");

    if (service) setSelectedService(service);
    if (professional) setSelectedProfessional(professional);
    if (date) setSelectedDate(new Date(date));
    if (time) setSelectedTime(time);
    if (name || phone)
      setCustomerData((prev) => ({
        ...prev,
        name: name || prev.name,
        phone: phone || prev.phone,
      }));
  }, [location.search]);

  // Filtrar profissionais baseado no serviço selecionado
  const availableProfessionals = selectedService
    ? professionals.filter((prof) => {
        const service = services.find((s) => s.id === selectedService);
        return service?.professionalIds.includes(Number(prof.id));
      })
    : [];

  // Obter serviço selecionado
  const selectedServiceData = services.find((s) => s.id === selectedService);
  const selectedProfessionalData = professionals.find(
    (p) => p.id?.toString() === selectedProfessional
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedService ||
      !selectedProfessional ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast.error("Por favor, preencha suas informações de contato");
      return;
    }

    // Save appointment directly (no payment dialog)
    handleSaveAppointment();
  };

  const handleSaveAppointment = () => {
    const makeAppointmentForDate = (date: Date | undefined) => ({
      id: `apt_${Date.now()}`,
      serviceId: selectedServiceData?.id,
      serviceName: selectedServiceData?.name,
      professionalId: selectedProfessionalData?.id,
      professionalName: selectedProfessionalData?.name,
      customer: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      date: date ? date.toISOString() : selectedDate?.toISOString(),
      time: selectedTime,
      duration: selectedServiceData?.duration,
      status: "pending",
      originalPrice: selectedServiceData?.price || 0,
      finalPrice: selectedServiceData?.price || 0,
      totalDiscountAmount: 0,
      commission: {
        professionalPercentage: 70,
        establishmentPercentage: 30,
        baseAmount: selectedServiceData?.price || 0,
        professionalAmount: (selectedServiceData?.price || 0) * 0.7,
        establishmentAmount: (selectedServiceData?.price || 0) * 0.3,
      },
      payment: {
        method: "pending",
        status: "pending",
        paidAmount: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // build appointments array
    const appointments =
      isProfessional && selectedDates.length > 0
        ? selectedDates.map((d) => makeAppointmentForDate(d))
        : [makeAppointmentForDate(selectedDate)];

    try {
      const existing = JSON.parse(
        localStorage.getItem("mock_appointments") || "[]"
      );
      appointments.forEach((a) => existing.push(a));
      localStorage.setItem("mock_appointments", JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to save appointment", e);
    }

    // Optionally save customer
    try {
      const existingCust = JSON.parse(
        localStorage.getItem("mock_customers") || "[]"
      );
      existingCust.push({
        id: `cust_${Date.now()}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
      });
      localStorage.setItem("mock_customers", JSON.stringify(existingCust));
    } catch (e) {
      console.error("Failed to save customer", e);
    }

    toast.success("Agendamento realizado com sucesso! Aguardando confirmação.");

    // Reset form
    setSelectedService("");
    setSelectedProfessional("");
    setSelectedDate(undefined);
    setSelectedDates([]);
    setSelectedTime("");
    setCustomerData({ name: "", email: "", phone: "", notes: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">
          {isProfessional ? t("book.title") : t("book.title")}
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          {t("book.subtitle.client")}
        </p>
        {isProfessional && (
          <div className="mt-4 p-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              >
                Modo Profissional
              </Badge>
              <span className="text-sm text-[var(--color-primary)]">
                Agendando como:{" "}
                {
                  professionals.find((p) => p.email === currentUser?.username)
                    ?.name
                }
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
            <CardDescription>
              Selecione o serviço que deseja agendar
            </CardDescription>
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
                            <span className="text-sm text-gray-500 ml-2">
                              ({service.duration} min)
                            </span>
                          </div>
                          <span className="font-bold text-[var(--color-primary)] ml-4">
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

        {/* Booking Preference for Business Plan */}
        {selectedService && isBusinessPlan && (
          <Card>
            <CardHeader>
              <CardTitle>2. Como deseja agendar?</CardTitle>
              <CardDescription>
                Escolha sua preferência de agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={
                    bookingPreference === "by-professional"
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-6 flex flex-col items-center gap-2"
                  onClick={() => {
                    setBookingPreference("by-professional");
                    setSelectedDate(undefined);
                    setSelectedTime("");
                  }}
                >
                  <User className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Por Profissional</div>
                    <div className="text-xs font-normal opacity-80 mt-1">
                      Escolha o profissional e veja os horários disponíveis
                    </div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={
                    bookingPreference === "by-date" ? "default" : "outline"
                  }
                  className="h-auto py-6 flex flex-col items-center gap-2"
                  onClick={() => {
                    setBookingPreference("by-date");
                    setSelectedProfessional("");
                  }}
                >
                  <Calendar className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Por Data e Hora</div>
                    <div className="text-xs font-normal opacity-80 mt-1">
                      Escolha data/hora e veja os profissionais disponíveis
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seleção de Profissional - Shown when by-professional or simple/individual plan */}
        {selectedService &&
          (bookingPreference === "by-professional" || !isBusinessPlan) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isBusinessPlan ? "3" : "2"}. Escolha o Profissional
                </CardTitle>
                <CardDescription>
                  Profissionais disponíveis para este serviço
                </CardDescription>
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
                        <SelectItem
                          key={professional.id}
                          value={professional.id?.toString() || ""}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              <AvatarImage
                                src={professional.photo}
                                alt={professional.name}
                              />
                              <AvatarFallback className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
                                {professional.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-medium text-sm truncate">
                                {professional.name}
                              </span>
                              <span className="text-xs text-gray-500 truncate">
                                {professional.specialty}
                              </span>
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

        {/* Date and Time Selection - for by-date booking preference */}
        {selectedService &&
          isBusinessPlan &&
          bookingPreference === "by-date" && (
            <Card>
              <CardHeader>
                <CardTitle>3. Escolha Data e Horário</CardTitle>
                <CardDescription>
                  Selecione quando deseja ser atendido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Data</Label>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                      placeholder="Selecione uma data"
                      className="w-full"
                    />
                  </div>
                  {selectedDate && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Horário</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-md">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="text-xs"
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

        {/* Show available professionals after date/time selection */}
        {isBusinessPlan &&
          bookingPreference === "by-date" &&
          selectedDate &&
          selectedTime && (
            <Card>
              <CardHeader>
                <CardTitle>4. Profissionais Disponíveis</CardTitle>
                <CardDescription>
                  Profissionais que podem atender na data e horário selecionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="professional-select">Profissional</Label>
                  <Select
                    value={selectedProfessional}
                    onValueChange={setSelectedProfessional}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um profissional disponível" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProfessionals.map((professional) => (
                        <SelectItem
                          key={professional.id}
                          value={professional.id?.toString() || ""}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              <AvatarImage
                                src={professional.photo}
                                alt={professional.name}
                              />
                              <AvatarFallback className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
                                {professional.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-medium text-sm truncate">
                                {professional.name}
                              </span>
                              <span className="text-xs text-gray-500 truncate">
                                {professional.specialty}
                              </span>
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

        {/* Seleção de Data e Horário - for by-professional booking */}
        {selectedProfessional &&
          (bookingPreference === "by-professional" || !isBusinessPlan) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isBusinessPlan ? "4" : "3"}. Escolha Data e Horário
                </CardTitle>
                <CardDescription>
                  Selecione quando deseja ser atendido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Seleção de Data */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Data</Label>
                    {isProfessional ? (
                      <div className="space-y-2">
                        {selectedDates.map((d, idx) => (
                          <div key={idx}>
                            <DatePicker
                              date={d}
                              onDateChange={(date) => {
                                const copy = [...selectedDates];
                                copy[idx] = date as Date;
                                setSelectedDates(copy);
                              }}
                              placeholder={`Data ${idx + 1}`}
                              className="w-full mt-2"
                            />
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setSelectedDates((s) => [...s, undefined as any])
                            }
                          >
                            {t("booking.addAnotherDate")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSelectedDates([])}
                          >
                            {t("booking.clearDates")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <DatePicker
                          date={selectedDate}
                          onDateChange={setSelectedDate}
                          placeholder="Selecione uma data"
                          className="w-full mt-2"
                        />
                        {selectedDate && (
                          <p className="text-sm text-muted-foreground">
                            Data selecionada:{" "}
                            {selectedDate.toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Horários */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        Horário Disponível
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
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
                {isProfessional
                  ? isBusinessPlan
                    ? "5. Informações do Cliente"
                    : "4. Informações do Cliente"
                  : isBusinessPlan
                  ? "5. Suas Informações"
                  : "4. Suas Informações"}
              </CardTitle>
              <CardDescription>
                {isProfessional
                  ? "Dados do cliente para contato e confirmação"
                  : "Dados para contato e confirmação"}
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
                    onChange={(e) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder={
                      isProfessional ? "Nome do cliente" : "Seu nome completo"
                    }
                    required
                    disabled={
                      isProfessional &&
                      !!professionals.find(
                        (p) => p.email === currentUser?.username
                      )
                    }
                  />
                  {isProfessional &&
                    professionals.find(
                      (p) => p.email === currentUser?.username
                    ) && (
                      <p className="text-xs text-gray-500 mt-1">
                        Campo preenchido automaticamente. Para agendar para
                        outro cliente, limpe e digite o nome.
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
                    onChange={(e) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder={
                      isProfessional ? "email@cliente.com" : "seu@email.com"
                    }
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
                    onChange={(e) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                {isProfessional && (
                  <div>
                    <Label htmlFor="professional-notes">
                      Observações Profissionais
                    </Label>
                    <Input
                      id="professional-notes"
                      className="mt-2"
                      value={customerData.notes}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
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
                    onChange={(e) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Alguma observação especial?"
                  />
                </div>
              )}

              {isProfessional && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Agendamento Profissional
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Este agendamento será registrado como realizado por
                        você. Confirme os dados do cliente antes de prosseguir.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resumo do Agendamento - Só aparece quando todos os campos obrigatórios estão preenchidos */}
        {selectedService &&
          selectedProfessional &&
          selectedDate &&
          selectedTime &&
          customerData.name &&
          customerData.email &&
          customerData.phone && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isBusinessPlan ? "6" : "5"}. Resumo do Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("book.service")}:</span>
                    <span className="font-medium">
                      {selectedServiceData?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("book.professional")}:
                    </span>
                    <span className="font-medium">
                      {selectedProfessionalData?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("book.date")}:</span>
                    <span className="font-medium">
                      {isProfessional && selectedDates.length > 0
                        ? `${selectedDates.length} data(s) selecionada(s)`
                        : selectedDate?.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("book.time")}:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("book.duration")}:</span>
                    <span className="font-medium">
                      {selectedServiceData?.duration} minutos
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("book.total")}:</span>
                      <span>
                        {formatCurrency(
                          (selectedServiceData?.price || 0) *
                            (isProfessional && selectedDates.length > 0
                              ? selectedDates.length
                              : 1)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" size="lg">
                  {t("book.confirm")}
                </Button>
              </CardContent>
            </Card>
          )}
      </form>
    </div>
  );
};

export default BookAppointmentPage;
