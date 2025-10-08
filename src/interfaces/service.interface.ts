export interface ServiceCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    duration: number; // duration in minutes
    price: number; // price in the local currency
    commerceId?: number; // ID of the commerce offering the service
    isActive: boolean; // whether the service is active
    requiresConfirmation?: boolean; // whether the service requires confirmation
    professionals?: number[]; // array of professional IDs who can perform this service
    
    // Expansões para negócio
    categoryId?: string;
    category?: ServiceCategory;
    
    // Configurações de negócio
    commissionPercentage: number; // Percentual padrão de comissão
    allowDiscounts: boolean;
    maxDiscountPercentage?: number;
    
    // Disponibilidade
    availableDays: number[]; // 0-6 (domingo a sábado)
    availableTimeSlots?: {
        start: string; // "09:00"
        end: string; // "18:00"
    };
    
    // Recursos necessários
    requiredEquipment?: string[];
    requiredSkills?: string[];
    
    // Configurações de agendamento
    advanceBookingDays?: number; // Quantos dias antes pode agendar
    cancellationPolicy?: {
        allowedHours: number; // Horas antes para cancelar sem taxa
        cancellationFee?: number;
        cancellationFeePercentage?: number;
    };
    
    // Metadata
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string; // ID do usuário que criou
}

export interface ServicePackage {
    id: string;
    name: string;
    description: string;
    serviceIds: number[];
    services?: Service[]; // Para facilitar exibição
    
    // Preços
    originalTotalPrice: number;
    packagePrice: number;
    savingsAmount: number;
    savingsPercentage: number;
    
    // Validade
    validityDays: number; // Quantos dias o pacote é válido após compra
    
    // Configurações
    isActive: boolean;
    maxPurchases?: number; // Limite de compras por cliente
    
    // Metadata
    createdAt: string;
    updatedAt: string;
}