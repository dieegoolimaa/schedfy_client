
// Interfaces auxiliares para estruturar melhor os dados de negócio
export interface Voucher {
    id: string;
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number; // Percentual (0-100) ou valor fixo
    description: string;
    expiryDate?: string;
    usageLimit?: number;
    usedCount?: number;
    minPurchase?: number; // Valor mínimo para aplicar o voucher
}

export interface Discount {
    id: string;
    type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
    value: number;
    description: string;
    appliedBy: 'system' | 'professional' | 'admin';
    reason?: string; // Ex: "Cliente fidelidade", "Primeira vez", etc
}

export interface Commission {
    professionalPercentage: number; // Percentual que vai para o profissional
    establishmentPercentage: number; // Percentual que fica com o estabelecimento
    baseAmount: number; // Valor base para cálculo
    professionalAmount: number; // Valor calculado para o profissional
    establishmentAmount: number; // Valor calculado para o estabelecimento
}

export interface PaymentInfo {
    method: 'cash' | 'card' | 'pix' | 'transfer' | 'voucher' | 'pending';
    status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
    paidAmount?: number;
    remainingAmount?: number;
    paymentDate?: string;
    transactionId?: string;
}

export interface Appointment {
    id: string;
    serviceId: string;
    serviceName: string; // Nome do serviço para facilitar exibição
    professionalId: string;
    professionalName: string; // Nome do profissional para facilitar exibição
    
    // Informações do cliente
    customer: string;
    email: string;
    phone: string;
    customerNotes?: string; // Observações do cliente
    
    // Agendamento
    date: string; // ISO 8601 format
    time: string; // e.g., "14:00"
    duration: number; // Duração em minutos
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'canceled' | 'no_show';
    
    // Valores e negócio
    originalPrice: number; // Preço original do serviço
    finalPrice: number; // Preço final após descontos/vouchers
    price?: number; // Preço (alias para finalPrice, para compatibilidade)
    
    // Descontos e vouchers aplicados
    appliedVouchers?: Voucher[];
    appliedDiscounts?: Discount[];
    totalDiscountAmount: number;
    
    // Comissão
    commission: Commission;
    
    // Pagamento
    payment: PaymentInfo;
    
    // Observações e controle
    professionalNotes?: string; // Observações do profissional
    adminNotes?: string; // Observações administrativas
    notes?: string; // Observações gerais (alias para compatibilidade)
    rejectionReason?: string;
    cancellationReason?: string;
    cancellationFee?: number; // Taxa de cancelamento
    
    // Controle temporal
    createdAt: string;
    updatedAt: string;
    confirmedAt?: string;
    completedAt?: string;
    canceledAt?: string;
    
    // Avaliação (opcional)
    rating?: {
        score: number; // 1-5
        comment?: string;
        ratedAt: string;
    };
    
    // Recorrência (para agendamentos recorrentes)
    isRecurring?: boolean;
    recurringPattern?: {
        frequency: 'weekly' | 'biweekly' | 'monthly';
        endDate?: string;
        occurrences?: number;
    };
}