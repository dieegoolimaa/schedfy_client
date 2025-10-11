import type { PlanType } from "./user.interface";

export type CompanyStatus = "active" | "suspended" | "canceled" | "trial";

export interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string; // CNPJ, EIN, etc
    country: "BR" | "PT" | "US";
    planType: PlanType;
    status: CompanyStatus;
    createdAt: string;
    updatedAt: string;
    ownerId: number;
    ownerName: string;
    ownerEmail: string;
    subscription?: Subscription;
    stats: {
        totalAppointments: number;
        totalRevenue: number;
        activeProfessionals: number;
        totalServices: number;
    };
}

export interface Subscription {
    id: string;
    companyId: string;
    planType: PlanType;
    status: "active" | "past_due" | "canceled" | "trial";
    startDate: string;
    endDate?: string;
    trialEndDate?: string;
    billingCycle: "monthly" | "yearly";
    currency: "USD" | "EUR" | "BRL";
    amount: number;
    nextBillingDate: string;
    paymentMethod?: {
        type: "credit_card" | "debit_card" | "boleto" | "pix";
        last4?: string;
        brand?: string;
    };
    canceledAt?: string;
    cancelReason?: string;
}

export interface PlanConfig {
    id: PlanType;
    name: string;
    description: string;
    features: string[];
    limits: {
        maxProfessionals: number | "unlimited";
        maxServices: number | "unlimited";
        maxAppointmentsPerMonth: number | "unlimited";
    };
    pricing: {
        USD: {
            monthly: number;
            yearly: number;
        };
        EUR: {
            monthly: number;
            yearly: number;
        };
        BRL: {
            monthly: number;
            yearly: number;
        };
    };
    commission: {
        percentage: number; // Commission percentage for Schedfy
    };
}
