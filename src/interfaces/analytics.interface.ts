export interface FinancialSummary {
    period: {
        start: string;
        end: string;
    };
    
    // Receitas
    totalRevenue: number;
    grossRevenue: number; // Antes de descontos
    netRevenue: number; // Após descontos
    
    // Comissões
    totalCommissions: number;
    establishmentShare: number;
    professionalsShare: number;
    
    // Descontos e promoções
    totalDiscounts: number;
    voucherDiscounts: number;
    loyaltyDiscounts: number;
    promotionalDiscounts: number;
    
    // Cancelamentos
    cancellationFees: number;
    lostRevenue: number; // Receita perdida por cancelamentos
    
    // Estatísticas
    totalAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    noShowAppointments: number;
    
    // Médias
    averageAppointmentValue: number;
    averageCommissionRate: number;
    averageDiscountRate: number;
}

export interface ProfessionalPerformance {
    professionalId: string;
    professionalName: string;
    period: {
        start: string;
        end: string;
    };
    
    // Performance
    totalAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    noShowRate: number;
    
    // Financeiro
    totalRevenue: number;
    commissionsEarned: number;
    averageServiceValue: number;
    
    // Avaliações
    averageRating: number;
    totalRatings: number;
    
    // Serviços mais populares
    topServices: {
        serviceId: string;
        serviceName: string;
        count: number;
        revenue: number;
    }[];
    
    // Crescimento
    growthRate: number; // Comparado com período anterior
    newCustomers: number;
    returningCustomers: number;
}

export interface BusinessInsights {
    period: {
        start: string;
        end: string;
    };
    
    // Tendências
    peakHours: {
        hour: number;
        appointmentCount: number;
    }[];
    
    peakDays: {
        dayOfWeek: number;
        appointmentCount: number;
    }[];
    
    // Serviços
    topServices: {
        serviceId: string;
        serviceName: string;
        appointmentCount: number;
        revenue: number;
        growthRate: number;
    }[];
    
    // Clientes
    customerRetentionRate: number;
    averageCustomerValue: number;
    newCustomersCount: number;
    customerLifetimeValue: number;
    
    // Promoções
    mostEffectivePromotions: {
        promotionId: string;
        promotionName: string;
        usageCount: number;
        revenueGenerated: number;
        roi: number; // Return on Investment
    }[];
    
    // Recomendações
    recommendations: {
        type: 'pricing' | 'scheduling' | 'promotion' | 'service' | 'staff';
        priority: 'high' | 'medium' | 'low';
        description: string;
        potentialImpact: string;
    }[];
}