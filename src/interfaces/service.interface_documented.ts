/**
 * Service Interface - Representa um serviço oferecido pelo negócio
 * 
 * Este arquivo define a estrutura de dados para serviços, incluindo informações
 * de preço, duração, disponibilidade e configurações de comissão.
 * 
 * @module interfaces/service
 */

/**
 * Categoria de Serviço
 * Agrupa serviços relacionados para melhor organização
 */
export interface ServiceCategory {
    /** Identificador único da categoria */
    id: string;

    /** Nome da categoria (ex: "Cabelo", "Estética", "Massagem") */
    name: string;

    /** Descrição opcional da categoria */
    description?: string;

    /** Nome do ícone (Lucide React) para exibição */
    icon?: string;

    /** Ordem de exibição na listagem */
    displayOrder?: number;

    /** Se a categoria está ativa */
    isActive: boolean;

    /** ID do negócio/commerce que criou a categoria */
    commerceId: number;

    /** Timestamps */
    createdAt: string;
    updatedAt: string;
}

/**
 * Política de Cancelamento
 * Define regras para cancelamento de agendamentos
 */
export interface CancellationPolicy {
    /** Horas de antecedência mínima para cancelar sem taxa */
    minHours: number;

    /** Taxa fixa de cancelamento (em moeda local) */
    cancellationFee?: number;

    /** Percentual do valor do serviço cobrado como taxa */
    cancellationFeePercentage?: number;

    /** Permite reembolso total se cancelado dentro do prazo */
    allowFullRefund: boolean;
}

/**
 * Horário de Disponibilidade
 * Define quando um serviço pode ser agendado
 */
export interface TimeSlot {
    /** Horário de início (formato 24h: "09:00") */
    start: string;

    /** Horário de término (formato 24h: "18:00") */
    end: string;
}

/**
 * Configuração de Comissão por Serviço
 * Permite definir comissões específicas por serviço
 */
export interface ServiceCommission {
    /** ID do serviço */
    serviceId: number;

    /** Percentual do profissional (0-100) */
    professionalPercentage: number;

    /** Percentual do estabelecimento (0-100) */
    establishmentPercentage: number;

    /** Se deve usar comissão personalizada ou padrão do negócio */
    useCustomCommission: boolean;

    /** IDs de profissionais específicos com comissão diferente */
    professionalOverrides?: {
        professionalId: number;
        percentage: number;
    }[];
}

/**
 * Serviço - Representa um serviço oferecido pelo negócio
 * 
 * Esta é a interface principal para serviços. Contém todas as informações
 * necessárias para criar, atualizar e gerenciar serviços no sistema.
 * 
 * @example
 * ```typescript
 * const service: Service = {
 *   id: 1,
 *   name: "Corte de Cabelo Masculino",
 *   description: "Corte completo com finalização",
 *   duration: 60,
 *   price: 50.00,
 *   commerceId: 1,
 *   isActive: true,
 *   categoryId: "cat-hair",
 *   commissionPercentage: 70,
 *   allowDiscounts: true,
 *   maxDiscountPercentage: 20,
 *   availableDays: [1, 2, 3, 4, 5], // Segunda a sexta
 *   professionals: [1, 2, 3],
 *   createdAt: "2025-01-01T00:00:00Z",
 *   updatedAt: "2025-01-01T00:00:00Z"
 * };
 * ```
 */
export interface Service {
    // ===== IDENTIFICAÇÃO =====
    /** Identificador único do serviço (gerado pelo backend) */
    id: number;

    /** Nome do serviço (ex: "Corte de Cabelo", "Manicure") */
    name: string;

    /** Descrição detalhada do serviço */
    description: string;

    /** ID do negócio que oferece o serviço */
    commerceId: number;

    /** ID da categoria do serviço (FK para ServiceCategory) */
    categoryId?: string;

    /** Objeto da categoria (populado em queries com join) */
    category?: ServiceCategory;

    // ===== PREÇO E DURAÇÃO =====
    /** Duração do serviço em minutos */
    duration: number;

    /** Preço base do serviço (em moeda local) */
    price: number;

    /** Custo estimado do serviço (para cálculo de margem) */
    cost?: number;

    // ===== STATUS E CONFIGURAÇÕES =====
    /** Se o serviço está ativo e disponível para agendamento */
    isActive: boolean;

    /** Se requer confirmação manual antes de confirmar agendamento */
    requiresConfirmation: boolean;

    /** Se permite agendamento online ou só presencial/telefone */
    allowOnlineBooking: boolean;

    // ===== COMISSÃO E DESCONTOS =====
    /** Percentual de comissão do profissional (0-100) */
    commissionPercentage: number;

    /** Se permite aplicar descontos neste serviço */
    allowDiscounts: boolean;

    /** Percentual máximo de desconto permitido (0-100) */
    maxDiscountPercentage?: number;

    /** Configurações de comissão específicas (sobrescreve padrão) */
    commissionConfig?: ServiceCommission;

    // ===== PROFISSIONAIS =====
    /** IDs dos profissionais habilitados a realizar este serviço */
    professionals: number[];

    /** Array de objetos de profissionais (populado em queries com join) */
    professionalDetails?: Array<{
        id: number;
        name: string;
        photo?: string;
        specialty?: string;
    }>;

    // ===== DISPONIBILIDADE =====
    /** Dias da semana disponíveis (0=Domingo, 1=Segunda, ..., 6=Sábado) */
    availableDays: number[];

    /** Horários disponíveis para este serviço */
    availableTimeSlots?: TimeSlot;

    /** Quantos dias de antecedência mínima para agendar */
    advanceBookingMinDays?: number;

    /** Quantos dias de antecedência máxima para agendar */
    advanceBookingMaxDays?: number;

    // ===== RECURSOS E REQUISITOS =====
    /** Equipamentos necessários para realizar o serviço */
    requiredEquipment?: string[];

    /** Habilidades/certificações necessárias */
    requiredSkills?: string[];

    /** Tempo de preparação antes do serviço (em minutos) */
    preparationTime?: number;

    /** Tempo de limpeza após o serviço (em minutos) */
    cleanupTime?: number;

    // ===== POLÍTICAS =====
    /** Política de cancelamento do serviço */
    cancellationPolicy?: CancellationPolicy;

    /** Se permite remarcar agendamento */
    allowRescheduling: boolean;

    /** Horas mínimas de antecedência para remarcar */
    reschedulingMinHours?: number;

    // ===== METADATA =====
    /** Data/hora de criação (ISO 8601) */
    createdAt: string;

    /** Data/hora da última atualização (ISO 8601) */
    updatedAt: string;

    /** ID do usuário que criou o serviço */
    createdBy?: number;

    /** ID do usuário que fez a última atualização */
    updatedBy?: number;

    /** Se o serviço foi deletado (soft delete) */
    deletedAt?: string | null;
}

/**
 * Pacote de Serviços
 * Agrupa múltiplos serviços com preço promocional
 */
export interface ServicePackage {
    /** Identificador único do pacote */
    id: string;

    /** Nome do pacote (ex: "Pacote Noiva Completo") */
    name: string;

    /** Descrição do pacote */
    description: string;

    /** ID do negócio que oferece o pacote */
    commerceId: number;

    /** IDs dos serviços incluídos */
    serviceIds: number[];

    /** Objetos dos serviços (populado em queries) */
    services?: Service[];

    // ===== PREÇOS =====
    /** Soma dos preços individuais dos serviços */
    originalTotalPrice: number;

    /** Preço promocional do pacote */
    packagePrice: number;

    /** Valor economizado (originalTotal - packagePrice) */
    savingsAmount: number;

    /** Percentual de economia */
    savingsPercentage: number;

    // ===== VALIDADE =====
    /** Dias de validade após compra */
    validityDays: number;

    /** Data de início da promoção (ISO 8601) */
    startDate?: string;

    /** Data de término da promoção (ISO 8601) */
    endDate?: string;

    // ===== CONFIGURAÇÕES =====
    /** Se o pacote está ativo */
    isActive: boolean;

    /** Limite de compras por cliente */
    maxPurchasesPerCustomer?: number;

    /** Limite total de vendas do pacote */
    maxTotalPurchases?: number;

    /** Quantidade vendida até o momento */
    purchaseCount: number;

    // ===== METADATA =====
    createdAt: string;
    updatedAt: string;
    createdBy?: number;
}

/**
 * DTO para criação de novo serviço
 * Usado no endpoint POST /api/services
 */
export interface CreateServiceDTO {
    name: string;
    description: string;
    duration: number;
    price: number;
    commerceId: number;
    categoryId?: string;
    commissionPercentage: number;
    allowDiscounts: boolean;
    maxDiscountPercentage?: number;
    professionals: number[];
    availableDays: number[];
    availableTimeSlots?: TimeSlot;
    isActive?: boolean; // default: true
    requiresConfirmation?: boolean; // default: false
    allowOnlineBooking?: boolean; // default: true
    cancellationPolicy?: CancellationPolicy;
    allowRescheduling?: boolean; // default: true
}

/**
 * DTO para atualização de serviço
 * Usado no endpoint PATCH /api/services/:id
 * Todos os campos são opcionais
 */
export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {
    updatedBy?: number;
}

/**
 * Filtros para listagem de serviços
 * Usado no endpoint GET /api/services
 */
export interface ServiceFilters {
    /** Filtrar por negócio */
    commerceId?: number;

    /** Filtrar por categoria */
    categoryId?: string;

    /** Filtrar apenas ativos */
    isActive?: boolean;

    /** Filtrar por profissional que realiza o serviço */
    professionalId?: number;

    /** Busca por nome */
    search?: string;

    /** Preço mínimo */
    minPrice?: number;

    /** Preço máximo */
    maxPrice?: number;

    /** Duração mínima (minutos) */
    minDuration?: number;

    /** Duração máxima (minutos) */
    maxDuration?: number;

    /** Ordenação */
    sortBy?: 'name' | 'price' | 'duration' | 'createdAt';
    sortOrder?: 'asc' | 'desc';

    /** Paginação */
    page?: number;
    limit?: number;
}

/**
 * Resposta paginada de serviços
 */
export interface ServiceListResponse {
    data: Service[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
