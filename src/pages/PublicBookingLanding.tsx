import React, { useState } from "react";
import services from "@/mock-data/service";
import professionals from "@/mock-data/professional";
import type { Service } from "@/interfaces/service.interface";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";

const PublicBookingLanding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const serviceOptions: Service[] = services;
  const serviceObj = serviceOptions.find(
    (s) => s.name === selectedService || s.id.toString() === selectedService
  );
  const professionalsForService =
    serviceObj && serviceObj.professionals
      ? professionals.filter((p) =>
          serviceObj.professionals?.includes(Number(p.id))
        )
      : professionals;

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleConfirm = () => {
    // For now navigate to BookAppointmentPage with query params
    const params = new URLSearchParams({
      service: selectedService || "",
      professional: selectedProfessional || "",
      date: selectedDate,
      time: selectedTime,
      name: contactName,
      phone: contactPhone,
    });
    navigate(`/book-appointment?${params.toString()}`);
  };

  const { t } = useI18n();

  const safeNext = () => {
    if (step === 1 && !selectedService) {
      toast.error(t("select.service") || "Selecione um serviço");
      return;
    }
    if (step === 2 && !selectedProfessional) {
      toast.error(t("select.professional") || "Selecione um profissional");
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast.error(t("select.datetime") || "Selecione data e horário");
      return;
    }
    if (step === 4 && (!contactName || !contactPhone)) {
      toast.error(t("enter.contact") || "Insira seu nome e telefone");
      return;
    }
    next();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Agendar serviço</h2>
        <p className="text-sm text-gray-500 mb-4">
          Fluxo público — escolha serviço, profissional e horário.
        </p>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`px-2 py-1 rounded ${
                  step === n
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                }`}
              >
                {n}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <label className="text-sm font-medium">Escolha um serviço</label>
              <div className="grid gap-2 mt-2">
                {serviceOptions.map((s: Service) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s.id.toString());
                      next();
                    }}
                    className={`text-left p-3 rounded border ${
                      selectedService === s.id.toString()
                        ? "border-[var(--color-primary)] bg-[var(--color-card)]"
                        : "border-[var(--color-border)] bg-[var(--color-card)]"
                    }`}
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.duration} min — R$ {s.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-sm font-medium">
                Escolha um profissional
              </label>
              <div className="grid gap-2 mt-2">
                {professionalsForService.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProfessional(p.id);
                      next();
                    }}
                    className={`text-left p-3 rounded border ${
                      selectedProfessional === p.id
                        ? "border-[var(--color-primary)] bg-[var(--color-card)]"
                        : "border-[var(--color-border)] bg-[var(--color-card)]"
                    }`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.specialty}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="text-sm font-medium">
                Escolha data e horário
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="text-sm font-medium">Seu contato</label>
              <div className="grid gap-2 mt-2">
                <input
                  placeholder="Seu nome"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Telefone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <label className="text-sm font-medium">Revisar</label>
              <div className="mt-2 text-sm text-gray-700 space-y-2">
                <div>
                  Serviço: <strong>{selectedService}</strong>
                </div>
                <div>
                  Profissional:{" "}
                  <strong>
                    {professionals.find((p) => p.id === selectedProfessional)
                      ?.name || "-"}
                  </strong>
                </div>
                <div>
                  Data: <strong>{selectedDate}</strong>
                </div>
                <div>
                  Horário: <strong>{selectedTime}</strong>
                </div>
                <div>
                  Contato:{" "}
                  <strong>
                    {contactName} — {contactPhone}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <button
            onClick={back}
            className="px-3 py-2 rounded border border-[var(--color-border)]"
          >
            {t("back") || "Voltar"}
          </button>
          {step < 5 ? (
            <button
              onClick={safeNext}
              className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded"
            >
              {t("continue") || "Continuar"}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] rounded"
            >
              {t("confirm") || "Confirmar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBookingLanding;
