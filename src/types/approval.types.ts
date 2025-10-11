// Service configuration for appointment approval settings
export interface ServiceApprovalSettings {
    requiresApproval: boolean; // Whether this service needs approval
    autoApprove: boolean; // Auto-approve after certain conditions
    approvalTimeoutHours?: number; // Hours until auto-approve (if autoApprove is true)
}

// Extended service interface with approval settings
export interface ServiceWithApproval {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    approval: ServiceApprovalSettings;
}

// Appointment status extended with pending approval
export type AppointmentStatusExtended =
    | "pending_approval" // Waiting for professional/admin approval
    | "approved" // Manually approved
    | "scheduled" // Approved and confirmed
    | "confirmed"
    | "in_progress"
    | "completed"
    | "canceled"
    | "rejected" // Approval rejected
    | "no_show";

// Notification types
export type NotificationType = "email" | "sms" | "whatsapp";

// Notification template for appointment actions
export interface AppointmentNotification {
    type: NotificationType[];
    recipient: {
        name: string;
        email?: string;
        phone?: string;
    };
    template: "pending_approval" | "approved" | "rejected" | "rescheduled";
    data: {
        appointmentId: string;
        serviceName: string;
        originalDate?: string;
        newDate?: string;
        reason?: string;
        professionalName: string;
        businessName: string;
    };
}

// Reschedule suggestion
export interface RescheduleOption {
    date: string;
    time: string;
    professionalId: string;
    professionalName: string;
    available: boolean;
}
