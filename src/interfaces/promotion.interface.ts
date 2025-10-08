export interface VoucherRule {
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    applicableServiceIds?: string[];
    applicableProfessionalIds?: string[];
    applicableCustomerIds?: string[];
    firstTimeCustomersOnly?: boolean;
    dayOfWeekRestrictions?: number[]; // 0-6 (domingo a sábado)
    timeRestrictions?: {
        start: string; // "09:00"
        end: string; // "18:00"
    };
}

export interface VoucherUsage {
    appointmentId: string;
    customerId: string;
    usedAt: string;
    discountApplied: number;
}

export interface VoucherTemplate {
    id: string;
    name: string;
    description: string;
    code: string;
    type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_service';
    value: number;
    
    // Configurações de uso
    isActive: boolean;
    startDate: string;
    endDate: string;
    usageLimit?: number; // Limite total de usos
    usageLimitPerCustomer?: number; // Limite por cliente
    
    // Regras de aplicação
    rules: VoucherRule;
    
    // Controle de uso
    usages: VoucherUsage[];
    totalUsed: number;
    
    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CustomerLoyalty {
    customerId: string;
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    totalSpent: number;
    totalAppointments: number;
    joinDate: string;
    lastVisit?: string;
    
    // Benefícios do tier
    discountPercentage: number;
    priorityBooking: boolean;
    freeServicesEarned: number;
    
    // Histórico de pontos
    pointsHistory: {
        date: string;
        points: number;
        reason: string;
        appointmentId?: string;
    }[];
}

export interface PromotionCampaign {
    id: string;
    name: string;
    description: string;
    type: 'happy_hour' | 'seasonal' | 'first_time' | 'loyalty' | 'referral';
    
    // Configurações
    isActive: boolean;
    startDate: string;
    endDate: string;
    
    // Regras da promoção
    discountType: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
    discountValue: number;
    applicableServices?: string[];
    applicableProfessionals?: string[];
    
    // Condições
    dayOfWeekRestrictions?: number[];
    timeRestrictions?: {
        start: string;
        end: string;
    };
    minPurchaseAmount?: number;
    maxUsagesPerCustomer?: number;
    
    // Resultados
    totalUsages: number;
    totalRevenue: number;
    totalDiscount: number;
    
    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}