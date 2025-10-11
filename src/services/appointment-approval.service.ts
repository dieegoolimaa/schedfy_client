import type { Appointment } from "@/interfaces/appointment.interface";
import type {
    AppointmentStatusExtended,
    RescheduleOption,
    AppointmentNotification,
} from "@/types/approval.types";
import { notificationService } from "./notification.service";
import { toast } from "sonner";

/**
 * Appointment Approval Service
 * Handles approval workflow for appointments that require professional/admin approval
 */
class AppointmentApprovalService {
    /**
     * Request approval for an appointment
     */
    async requestApproval(appointment: Appointment): Promise<boolean> {
        try {
            // Update appointment status to pending_approval
            await this.updateAppointmentStatus(appointment.id, "pending_approval");

            // Notify customer that appointment is pending
            const notification: AppointmentNotification = {
                type: ["email", "sms"],
                recipient: {
                    name: appointment.customer,
                    email: appointment.email,
                    phone: appointment.phone,
                },
                template: "pending_approval",
                data: {
                    appointmentId: appointment.id,
                    serviceName: appointment.serviceName,
                    originalDate: new Date(appointment.date).toLocaleString("pt-BR"),
                    professionalName: "Profissional", // Get from appointment
                    businessName: "Seu Negócio", // Get from context
                },
            };

            await notificationService.sendNotification(notification);

            toast.success("Solicitação de aprovação enviada!");
            return true;
        } catch (error) {
            console.error("Failed to request approval:", error);
            toast.error("Erro ao solicitar aprovação");
            return false;
        }
    }

    /**
     * Approve an appointment
     */
    async approveAppointment(
        appointment: Appointment,
        approvedBy: {
            id: number;
            name: string;
        }
    ): Promise<boolean> {
        try {
            // Update status to approved/scheduled
            await this.updateAppointmentStatus(appointment.id, "scheduled");

            // Log approval
            console.log(`Appointment ${appointment.id} approved by ${approvedBy.name}`);

            // Notify customer of approval
            const notification: AppointmentNotification = {
                type: ["email", "sms", "whatsapp"],
                recipient: {
                    name: appointment.customer,
                    email: appointment.email,
                    phone: appointment.phone,
                },
                template: "approved",
                data: {
                    appointmentId: appointment.id,
                    serviceName: appointment.serviceName,
                    originalDate: new Date(appointment.date).toLocaleString("pt-BR"),
                    professionalName: "Profissional",
                    businessName: "Seu Negócio",
                },
            };

            await notificationService.sendNotification(notification);

            toast.success("Agendamento aprovado!");
            return true;
        } catch (error) {
            console.error("Failed to approve appointment:", error);
            toast.error("Erro ao aprovar agendamento");
            return false;
        }
    }

    /**
     * Reject an appointment with reason
     */
    async rejectAppointment(
        appointment: Appointment,
        reason: string,
        rejectedBy: {
            id: number;
            name: string;
        }
    ): Promise<boolean> {
        try {
            // Update status to rejected
            await this.updateAppointmentStatus(appointment.id, "rejected");

            // Log rejection
            console.log(
                `Appointment ${appointment.id} rejected by ${rejectedBy.name}: ${reason}`
            );

            // Notify customer of rejection
            const notification: AppointmentNotification = {
                type: ["email", "sms", "whatsapp"],
                recipient: {
                    name: appointment.customer,
                    email: appointment.email,
                    phone: appointment.phone,
                },
                template: "rejected",
                data: {
                    appointmentId: appointment.id,
                    serviceName: appointment.serviceName,
                    originalDate: new Date(appointment.date).toLocaleString("pt-BR"),
                    reason,
                    professionalName: "Profissional",
                    businessName: "Seu Negócio",
                },
            };

            await notificationService.sendNotification(notification);

            toast.success("Cliente notificado sobre a rejeição");
            return true;
        } catch (error) {
            console.error("Failed to reject appointment:", error);
            toast.error("Erro ao rejeitar agendamento");
            return false;
        }
    }

    /**
     * Suggest reschedule with alternative time slots
     */
    async suggestReschedule(
        appointment: Appointment,
        newDate: string,
        reason: string
    ): Promise<boolean> {
        try {
            // Notify customer with reschedule suggestion
            const notification: AppointmentNotification = {
                type: ["email", "sms", "whatsapp"],
                recipient: {
                    name: appointment.customer,
                    email: appointment.email,
                    phone: appointment.phone,
                },
                template: "rescheduled",
                data: {
                    appointmentId: appointment.id,
                    serviceName: appointment.serviceName,
                    originalDate: new Date(appointment.date).toLocaleString("pt-BR"),
                    newDate: new Date(newDate).toLocaleString("pt-BR"),
                    reason,
                    professionalName: "Profissional",
                    businessName: "Seu Negócio",
                },
            };

            await notificationService.sendNotification(notification);

            toast.success("Sugestão de reagendamento enviada!");
            return true;
        } catch (error) {
            console.error("Failed to suggest reschedule:", error);
            toast.error("Erro ao sugerir reagendamento");
            return false;
        }
    }

    /**
     * Get available reschedule options
     */
    async getRescheduleOptions(
        _serviceId: string,
        _professionalId: string,
        _startDate: Date,
        _endDate: Date
    ): Promise<RescheduleOption[]> {
        try {
            // In production, this would call your backend API
            // For now, return mock data
            return this.getMockRescheduleOptions();
        } catch (error) {
            console.error("Failed to get reschedule options:", error);
            return [];
        }
    }

    /**
     * Update appointment status
     * In production, this would call your backend API
     */
    private async updateAppointmentStatus(
        appointmentId: string,
        status: AppointmentStatusExtended
    ): Promise<void> {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Appointment ${appointmentId} status updated to ${status}`);
    }

    /**
     * Get mock reschedule options
     */
    private getMockRescheduleOptions(): RescheduleOption[] {
        const now = new Date();
        const options: RescheduleOption[] = [];

        // Generate 5 available slots over the next few days
        for (let i = 1; i <= 5; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);

            options.push({
                date: date.toISOString().split("T")[0],
                time: "10:00",
                professionalId: "prof-1",
                professionalName: "João Silva",
                available: true,
            });

            options.push({
                date: date.toISOString().split("T")[0],
                time: "14:00",
                professionalId: "prof-1",
                professionalName: "João Silva",
                available: true,
            });
        }

        return options;
    }

    /**
     * Check if appointment requires approval
     */
    requiresApproval(serviceId: string): boolean {
        // In production, check service settings
        // For now, return true for certain services
        const servicesRequiringApproval = ["service-1", "service-3", "service-5"];
        return servicesRequiringApproval.includes(serviceId);
    }
}

export const appointmentApprovalService = new AppointmentApprovalService();
