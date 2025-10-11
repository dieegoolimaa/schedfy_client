/**
 * Plan Types Interface
 * Defines the different subscription plans available in the system
 */

/**
 * Available subscription plans
 * - simple_booking: Basic appointment scheduling only (no financial features)
 * - individual: For autonomous professionals with financial management
 * - business: For establishments with team management and financial features
 */
export type PlanType = 'simple_booking' | 'individual' | 'business';

/**
 * Plan Features Configuration
 * Defines what features are enabled for each plan
 */
export interface PlanFeatures {
    // Core features (all plans)
    hasAppointmentScheduling: boolean;
    hasClientManagement: boolean;
    hasFeedbackSystem: boolean; // Available for all plans

    // Service features
    hasServices: boolean; // Can create optional services (simple_booking: optional, others: required)
    isServiceOptional: boolean; // If true, appointments can be made without selecting a service

    // Financial features (NOT available in simple_booking)
    hasPaymentProcessing: boolean; // Optional for business/individual
    hasCommissionManagement: boolean;
    hasFinancialReports: boolean;

    // Marketing features (NOT available in simple_booking)
    hasVouchers: boolean;
    hasPromotions: boolean;
    hasLoyaltyProgram: boolean;

    // Team features (only business)
    hasMultipleProfessionals: boolean;
    hasAttendants: boolean; // Users who manage appointments
    hasRoleManagement: boolean;

    // Advanced features (NOT available in simple_booking)
    hasAnalytics: boolean;
    hasCustomBranding: boolean;
    hasApiAccess: boolean;
}/**
 * Plan Configuration
 */
export interface PlanConfig {
    type: PlanType;
    name: string;
    description: string;
    features: PlanFeatures;
}

/**
 * Predefined plan configurations
 */
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
    simple_booking: {
        type: 'simple_booking',
        name: 'Simple Booking',
        description: 'Sistema puro de agendamento sem recursos de negócio',
        features: {
            // Core
            hasAppointmentScheduling: true,
            hasClientManagement: true,
            hasFeedbackSystem: true,

            // Services - OPTIONAL
            hasServices: true,
            isServiceOptional: true, // Appointments can be made without service selection

            // Financial - DISABLED
            hasPaymentProcessing: false,
            hasCommissionManagement: false,
            hasFinancialReports: false,

            // Marketing - DISABLED
            hasVouchers: false,
            hasPromotions: false,
            hasLoyaltyProgram: false,

            // Team
            hasMultipleProfessionals: false,
            hasAttendants: true, // Attendants can manage appointments
            hasRoleManagement: false,

            // Advanced - DISABLED
            hasAnalytics: false,
            hasCustomBranding: false,
            hasApiAccess: false,
        },
    },

    individual: {
        type: 'individual',
        name: 'Individual',
        description: 'Para profissionais autônomos com recursos de negócio',
        features: {
            // Core
            hasAppointmentScheduling: true,
            hasClientManagement: true,
            hasFeedbackSystem: true,

            // Services - REQUIRED
            hasServices: true,
            isServiceOptional: false,

            // Financial - ENABLED (optional payment)
            hasPaymentProcessing: true, // Can be disabled by business choice
            hasCommissionManagement: false, // Only one professional
            hasFinancialReports: true,

            // Marketing
            hasVouchers: true,
            hasPromotions: true,
            hasLoyaltyProgram: true,

            // Team
            hasMultipleProfessionals: false,
            hasAttendants: false,
            hasRoleManagement: false,

            // Advanced
            hasAnalytics: true,
            hasCustomBranding: false,
            hasApiAccess: false,
        },
    },

    business: {
        type: 'business',
        name: 'Business',
        description: 'Para estabelecimentos com equipe e gestão completa',
        features: {
            // Core
            hasAppointmentScheduling: true,
            hasClientManagement: true,
            hasFeedbackSystem: true,

            // Services - REQUIRED
            hasServices: true,
            isServiceOptional: false,

            // Financial - ENABLED (optional payment)
            hasPaymentProcessing: true, // Can be disabled by business choice
            hasCommissionManagement: true,
            hasFinancialReports: true,

            // Marketing
            hasVouchers: true,
            hasPromotions: true,
            hasLoyaltyProgram: true,

            // Team
            hasMultipleProfessionals: true,
            hasAttendants: true,
            hasRoleManagement: true,

            // Advanced
            hasAnalytics: true,
            hasCustomBranding: true,
            hasApiAccess: true,
        },
    },
};/**
 * User role within a plan
 */
export type UserRole =
    | 'owner'        // Owner of the business/account
    | 'admin'        // Administrator with full access
    | 'professional' // Professional who provides services
    | 'attendant'    // Attendant who manages appointments (simple_booking)
    | 'customer';    // Customer who books appointments

/**
 * User with plan context
 */
export interface UserWithPlan {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    planType: PlanType;
    commerceId?: string; // For business users
    professionalId?: string; // For individual professionals
}
