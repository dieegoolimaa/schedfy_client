import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, CreditCard, User } from "lucide-react";

// Services
import {
  appointmentService,
  serviceService,
  professionalService,
  paymentService,
} from "../services";

// Components
import {
  PaymentMethodSelector,
  PaymentSummary,
} from "../components/PaymentMethodSelector";

// Hooks
import { useLocalization, useFormatters } from "../hooks/useLocalization";

interface BookingFormData {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  paymentMethodId: string;
}

export const EnhancedBookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const { isPortugal, isBrazil } = useLocalization();
  const { formatCurrencySync } = useFormatters();

  // State
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [paymentFeeCalculation, setPaymentFeeCalculation] = useState<any>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: "",
    professionalId: "",
    date: "",
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
    paymentMethodId: "",
  });

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  // Load data on mount
  useEffect(() => {
    if (businessId) {
      loadInitialData();
    }
  }, [businessId]);

  // Update professionals when service changes
  useEffect(() => {
    if (formData.serviceId) {
      loadProfessionalsForService(formData.serviceId);
    }
  }, [formData.serviceId]);

  // Load available slots when professional and date are selected
  useEffect(() => {
    if (formData.professionalId && formData.date) {
      loadAvailableSlots();
    }
  }, [formData.professionalId, formData.date]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const servicesData = await serviceService.getServices({
        businessId,
        isActive: true,
        page: 1,
        limit: 50,
      });
      setServices(servicesData.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar serviços disponíveis");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfessionalsForService = async (serviceId: string) => {
    try {
      const professionalsData = await professionalService.getProfessionals({
        businessId,
        serviceId: serviceId,
        isActive: true,
      });
      setProfessionals(professionalsData.data);

      // Find selected service
      const service = services.find((s) => s._id === serviceId);
      setSelectedService(service);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
      toast.error("Erro ao carregar profissionais");
    }
  };

  const loadAvailableSlots = async () => {
    try {
      // TODO: Implementar verificação de disponibilidade
      // const slots = await appointmentService.getAvailableSlots({
      //     businessId,
      //     professionalId: formData.professionalId,
      //     date: formData.date,
      //     serviceId: formData.serviceId
      // });

      // Mock slots para demonstração
      const mockSlots = [
        { time: "09:00", available: true },
        { time: "10:00", available: true },
        { time: "11:00", available: false },
        { time: "14:00", available: true },
        { time: "15:00", available: true },
        { time: "16:00", available: true },
      ];

      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      toast.error("Erro ao carregar horários disponíveis");
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceId,
      professionalId: "", // Reset professional
      date: "",
      time: "",
    }));
  };

  const handleProfessionalSelect = (professionalId: string) => {
    const professional = professionals.find((p) => p._id === professionalId);
    setSelectedProfessional(professional);
    setFormData((prev) => ({
      ...prev,
      professionalId,
      date: "",
      time: "",
    }));
  };

  const handlePaymentMethodChange = (methodId: string, feeCalculation: any) => {
    setFormData((prev) => ({ ...prev, paymentMethodId: methodId }));
    setPaymentFeeCalculation(feeCalculation);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (
        !formData.serviceId ||
        !formData.professionalId ||
        !formData.date ||
        !formData.time ||
        !formData.customerName ||
        !formData.customerEmail
      ) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Create appointment
      const appointmentData = {
        customerId: "temp_customer", // TODO: pegar do contexto de auth
        businessId: businessId!,
        serviceId: formData.serviceId,
        professionalId: formData.professionalId,
        date: formData.date,
        startTime: formData.time,
        notes: formData.notes,
      };

      const appointment = await appointmentService.createAppointment(
        appointmentData
      );

      // Create payment if method selected
      if (formData.paymentMethodId && selectedService?.price) {
        const paymentData = {
          appointmentId: appointment._id,
          amount: selectedService.price,
          method: formData.paymentMethodId as any,
          description: `Pagamento para ${selectedService.name}`,
        };

        // Use localized payment methods
        if (formData.paymentMethodId === "pix" && isBrazil()) {
          await paymentService.createPixPayment(paymentData);
        } else if (formData.paymentMethodId === "mb_way" && isPortugal()) {
          await paymentService.createMBWayPayment({
            ...paymentData,
            phoneNumber: formData.customerPhone,
          });
        } else if (formData.paymentMethodId === "multibanco" && isPortugal()) {
          const multibancoPayment =
            await paymentService.createMultibancoPayment(paymentData);
          toast.success(
            `Referência Multibanco: ${multibancoPayment.reference}`
          );
        } else {
          await paymentService.createPayment(paymentData);
        }
      }

      toast.success("Agendamento criado com sucesso!");
      navigate(`/appointment/${appointment._id}`);
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      toast.error(error.message || "Erro ao criar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${
                              step >= stepNumber
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }
                        `}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div
                className={`w-8 h-1 mx-2 ${
                  step > stepNumber ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Escolha o Serviço</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300
                            ${
                              formData.serviceId === service._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }
                        `}
            onClick={() => handleServiceSelect(service._id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration} min
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrencySync(service.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setStep(2)}
          disabled={!formData.serviceId}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const renderProfessionalSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Escolha o Profissional</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionals.map((professional) => (
          <div
            key={professional._id}
            className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300
                            ${
                              formData.professionalId === professional._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }
                        `}
            onClick={() => handleProfessionalSelect(professional._id)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  {professional.user?.firstName} {professional.user?.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {professional.specialties?.join(", ")}
                </p>
                {professional.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">
                      {professional.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 border border-gray-300 rounded-lg"
        >
          Voltar
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!formData.professionalId}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Escolha Data e Horário</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Data</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                date: e.target.value,
                time: "",
              }))
            }
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {formData.date && (
          <div>
            <label className="block text-sm font-medium mb-2">Horário</label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, time: slot.time }))
                  }
                  disabled={!slot.available}
                  className={`
                                        p-2 text-sm rounded-lg border
                                        ${
                                          formData.time === slot.time
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : slot.available
                                            ? "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                        }
                                    `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 border border-gray-300 rounded-lg"
        >
          Voltar
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!formData.date || !formData.time}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dados do Cliente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerName: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerEmail: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerPhone: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder={
              isPortugal() ? "+351 912 345 678" : "+55 11 99999-9999"
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Observações</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Alguma observação especial..."
          />
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Método de Pagamento</h3>
        <PaymentMethodSelector
          amount={selectedService?.price || 0}
          onPaymentMethodChange={handlePaymentMethodChange}
          selectedMethodId={formData.paymentMethodId}
          showFees={true}
        />
      </div>

      {/* Payment Summary */}
      {formData.paymentMethodId && selectedService && (
        <PaymentSummary
          amount={selectedService.price}
          paymentMethodId={formData.paymentMethodId}
        />
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 border border-gray-300 rounded-lg"
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            isLoading || !formData.customerName || !formData.customerEmail
          }
          className="px-6 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Criando...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Confirmar Agendamento</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isLoading && services.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center">
              {isPortugal() ? "Agendar Serviço" : "Agendar Atendimento"}
            </h1>
            <p className="text-gray-600 text-center mt-2">
              {isPortugal()
                ? "Reserve o seu horário de forma simples e rápida"
                : "Agende seu horário de forma rápida e fácil"}
            </p>
          </div>

          {renderStepIndicator()}

          {step === 1 && renderServiceSelection()}
          {step === 2 && renderProfessionalSelection()}
          {step === 3 && renderDateTimeSelection()}
          {step === 4 && renderCustomerInfo()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookAppointmentPage;
