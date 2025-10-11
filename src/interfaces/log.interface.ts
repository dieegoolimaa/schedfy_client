export type LogAction =
    | "user_login"
    | "user_logout"
    | "user_created"
    | "user_updated"
    | "user_deleted"
    | "company_created"
    | "company_updated"
    | "company_suspended"
    | "company_activated"
    | "company_canceled"
    | "subscription_created"
    | "subscription_updated"
    | "subscription_canceled"
    | "subscription_renewed"
    | "plan_changed"
    | "payment_succeeded"
    | "payment_failed"
    | "appointment_created"
    | "appointment_updated"
    | "appointment_canceled"
    | "appointment_completed"
    | "professional_created"
    | "professional_updated"
    | "professional_deactivated"
    | "service_created"
    | "service_updated"
    | "service_deleted"
    | "settings_updated";

export type LogLevel = "info" | "warning" | "error" | "critical";

export interface SystemLog {
    id: string;
    timestamp: string;
    action: LogAction;
    level: LogLevel;
    userId?: number;
    userName?: string;
    userEmail?: string;
    companyId?: string;
    companyName?: string;
    details: Record<string, any>;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        location?: string;
    };
}

export interface ActivityLog extends SystemLog {
    description: string;
}
