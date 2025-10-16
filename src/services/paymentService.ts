import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';
import { localizationService } from './localizationService';

// Interfaces para Payments
export interface CreatePaymentDto {
    appointmentId: string;
    amount: number;
    method: 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer';
    description?: string;
    installments?: number;
    cardToken?: string; // Para pagamentos com cartão
    pixExpirationTime?: number; // Para PIX (em minutos)
}

export interface PaymentFilter {
    appointmentId?: string;
    businessId?: string;
    customerId?: string;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'amount' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export interface PaymentStats {
    total: number;
    byStatus: {
        pending: number;
        processing: number;
        completed: number;
        failed: number;
        canceled: number;
        refunded: number;
    };
    byMethod: {
        credit_card: number;
        debit_card: number;
        pix: number;
        cash: number;
        bank_transfer: number;
    };
    totalAmount: number;
    totalRevenue: number; // apenas completed
    averageTicket: number;
    refundRate: number;
}

export interface Payment {
    _id: string;
    appointmentId: string;
    amount: number;
    method: 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled' | 'refunded';
    description?: string;

    // Dados específicos do método de pagamento
    installments?: number;
    transactionId?: string;
    authorizationCode?: string;
    pixCode?: string;
    pixExpirationTime?: string;

    // Dados do provedor de pagamento
    providerTransactionId?: string;
    providerResponse?: any;

    // Refund information
    refundedAmount?: number;
    refundReason?: string;
    refundedAt?: string;

    // Relacionamentos
    appointment?: {
        _id: string;
        date: string;
        startTime: string;
        customer: {
            firstName: string;
            lastName: string;
            email: string;
        };
        service: {
            name: string;
        };
        business: {
            name: string;
        };
    };

    // Metadata
    createdAt: string;
    updatedAt: string;
    processedAt?: string;
}

export interface RefundRequest {
    paymentId: string;
    amount?: number; // Se não fornecido, reembolsa o valor total
    reason: string;
}

class PaymentService {
    private baseUrl = '/payments';

    // Criar pagamento
    async createPayment(data: CreatePaymentDto): Promise<Payment> {
        const response = await apiUtils.post<ApiResponse<Payment>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar pagamentos
    async getPayments(filter?: PaymentFilter): Promise<PaginatedResponse<Payment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Payment>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter pagamento por ID
    async getPaymentById(id: string): Promise<Payment> {
        const response = await apiUtils.get<ApiResponse<Payment>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Obter pagamento por agendamento
    async getPaymentByAppointment(appointmentId: string): Promise<Payment | null> {
        try {
            const response = await apiUtils.get<ApiResponse<Payment>>(`${this.baseUrl}/appointment/${appointmentId}`);
            return response.data.data;
        } catch (error) {
            return null; // Agendamento pode não ter pagamento ainda
        }
    }

    // Processar pagamento
    async processPayment(paymentId: string): Promise<Payment> {
        const response = await apiUtils.post<ApiResponse<Payment>>(`${this.baseUrl}/${paymentId}/process`);
        return response.data.data;
    }

    // Cancelar pagamento
    async cancelPayment(paymentId: string, reason?: string): Promise<Payment> {
        const response = await apiUtils.patch<ApiResponse<Payment>>(
            `${this.baseUrl}/${paymentId}/cancel`,
            { reason }
        );
        return response.data.data;
    }

    // Solicitar reembolso
    async requestRefund(data: RefundRequest): Promise<Payment> {
        const response = await apiUtils.post<ApiResponse<Payment>>(
            `${this.baseUrl}/${data.paymentId}/refund`,
            { amount: data.amount, reason: data.reason }
        );
        return response.data.data;
    }

    // Confirmar pagamento em dinheiro
    async confirmCashPayment(paymentId: string): Promise<Payment> {
        const response = await apiUtils.patch<ApiResponse<Payment>>(
            `${this.baseUrl}/${paymentId}/confirm-cash`
        );
        return response.data.data;
    }

    // Obter estatísticas de pagamentos
    async getPaymentStats(businessId?: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<PaymentStats> {
        const params = new URLSearchParams();

        if (businessId) {
            params.append('businessId', businessId);
        }

        if (period) {
            params.append('period', period);
        }

        const response = await apiUtils.get<ApiResponse<PaymentStats>>(
            `${this.baseUrl}/stats?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter pagamentos de um negócio
    async getBusinessPayments(businessId: string, filter?: Omit<PaymentFilter, 'businessId'>): Promise<PaginatedResponse<Payment>> {
        const params = new URLSearchParams({
            businessId,
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Payment>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter histórico de pagamentos do cliente
    async getCustomerPayments(customerId: string, filter?: Omit<PaymentFilter, 'customerId'>): Promise<PaginatedResponse<Payment>> {
        const params = new URLSearchParams({
            customerId,
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Payment>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Gerar código PIX
    async generatePixCode(paymentId: string): Promise<{ pixCode: string; qrCode: string; expirationTime: string }> {
        const response = await apiUtils.post<ApiResponse<{ pixCode: string; qrCode: string; expirationTime: string }>>(
            `${this.baseUrl}/${paymentId}/generate-pix`
        );
        return response.data.data;
    }

    // Verificar status do pagamento PIX
    async checkPixPaymentStatus(paymentId: string): Promise<Payment> {
        const response = await apiUtils.get<ApiResponse<Payment>>(`${this.baseUrl}/${paymentId}/pix-status`);
        return response.data.data;
    }

    // Processar webhook de pagamento
    async processWebhook(providerTransactionId: string): Promise<Payment> {
        const response = await apiUtils.post<ApiResponse<Payment>>(
            `${this.baseUrl}/webhook`,
            { providerTransactionId }
        );
        return response.data.data;
    }

    // Utilities
    getStatusLabel(status: Payment['status']): string {
        const labels = {
            pending: 'Pendente',
            processing: 'Processando',
            completed: 'Completo',
            failed: 'Falhou',
            canceled: 'Cancelado',
            refunded: 'Reembolsado'
        };
        return labels[status];
    }

    getStatusColor(status: Payment['status']): string {
        const colors = {
            pending: 'text-yellow-600',
            processing: 'text-blue-600',
            completed: 'text-green-600',
            failed: 'text-red-600',
            canceled: 'text-gray-600',
            refunded: 'text-purple-600'
        };
        return colors[status];
    }

    getStatusBadgeColor(status: Payment['status']): string {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            canceled: 'bg-gray-100 text-gray-800',
            refunded: 'bg-purple-100 text-purple-800'
        };
        return colors[status];
    }

    getMethodLabel(method: Payment['method']): string {
        const labels = {
            credit_card: 'Cartão de Crédito',
            debit_card: 'Cartão de Débito',
            pix: 'PIX',
            cash: 'Dinheiro',
            bank_transfer: 'Transferência Bancária'
        };
        return labels[method];
    }

    getMethodIcon(method: Payment['method']): string {
        const icons = {
            credit_card: '💳',
            debit_card: '💳',
            pix: '⚡',
            cash: '💵',
            bank_transfer: '🏦'
        };
        return icons[method];
    }

    formatAmount(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    formatInstallments(payment: Payment): string {
        if (!payment.installments || payment.installments === 1) {
            return 'À vista';
        }
        return `${payment.installments}x de ${this.formatAmount(payment.amount / payment.installments)}`;
    }

    formatDateTime(payment: Payment): string {
        const date = new Date(payment.createdAt);
        return date.toLocaleString('pt-BR');
    }

    formatDate(payment: Payment): string {
        const date = new Date(payment.createdAt);
        return date.toLocaleDateString('pt-BR');
    }

    isExpired(payment: Payment): boolean {
        if (payment.status !== 'pending' || !payment.pixExpirationTime) return false;

        const expirationDate = new Date(payment.pixExpirationTime);
        return new Date() > expirationDate;
    }

    getTimeUntilExpiration(payment: Payment): string | null {
        if (!payment.pixExpirationTime) return null;

        const expirationDate = new Date(payment.pixExpirationTime);
        const now = new Date();
        const diffInMs = expirationDate.getTime() - now.getTime();

        if (diffInMs <= 0) return 'Expirado';

        const minutes = Math.floor(diffInMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h${remainingMinutes.toString().padStart(2, '0')}min`;
        }

        return `${remainingMinutes}min`;
    }

    canCancel(payment: Payment): boolean {
        return ['pending', 'processing'].includes(payment.status);
    }

    canRefund(payment: Payment): boolean {
        return payment.status === 'completed' && !payment.refundedAmount;
    }

    canPartialRefund(payment: Payment): boolean {
        const refundedAmount = payment.refundedAmount || 0;
        return payment.status === 'completed' && refundedAmount < payment.amount;
    }

    getRemainingRefundAmount(payment: Payment): number {
        const refundedAmount = payment.refundedAmount || 0;
        return payment.amount - refundedAmount;
    }

    getCustomerInfo(payment: Payment): string {
        if (payment.appointment?.customer) {
            const { firstName, lastName } = payment.appointment.customer;
            return `${firstName} ${lastName}`;
        }
        return 'Cliente não identificado';
    }

    getServiceInfo(payment: Payment): string {
        if (payment.appointment?.service) {
            return payment.appointment.service.name;
        }
        return 'Serviço não identificado';
    }

    getBusinessInfo(payment: Payment): string {
        if (payment.appointment?.business) {
            return payment.appointment.business.name;
        }
        return 'Negócio não identificado';
    }

    getAppointmentInfo(payment: Payment): string {
        if (payment.appointment) {
            const { date, startTime } = payment.appointment;
            const formattedDate = new Date(date).toLocaleDateString('pt-BR');
            return `${formattedDate} às ${startTime}`;
        }
        return 'Agendamento não identificado';
    }

    calculateSuccessRate(payments: Payment[]): number {
        if (payments.length === 0) return 0;

        const successfulPayments = payments.filter(p => p.status === 'completed').length;
        return Math.round((successfulPayments / payments.length) * 100);
    }

    calculateRefundRate(payments: Payment[]): number {
        const completedPayments = payments.filter(p => p.status === 'completed');
        if (completedPayments.length === 0) return 0;

        const refundedPayments = payments.filter(p => p.status === 'refunded').length;
        return Math.round((refundedPayments / completedPayments.length) * 100);
    }

    groupPaymentsByMethod(payments: Payment[]): Record<string, Payment[]> {
        return payments.reduce((groups, payment) => {
            const method = payment.method;
            if (!groups[method]) {
                groups[method] = [];
            }
            groups[method].push(payment);
            return groups;
        }, {} as Record<string, Payment[]>);
    }

    groupPaymentsByStatus(payments: Payment[]): Record<string, Payment[]> {
        return payments.reduce((groups, payment) => {
            const status = payment.status;
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(payment);
            return groups;
        }, {} as Record<string, Payment[]>);
    }

    calculateTotalRevenue(payments: Payment[]): number {
        return payments
            .filter(p => p.status === 'completed')
            .reduce((total, payment) => total + payment.amount, 0);
    }

    calculateAverageTicket(payments: Payment[]): number {
        const completedPayments = payments.filter(p => p.status === 'completed');
        if (completedPayments.length === 0) return 0;

        const totalRevenue = this.calculateTotalRevenue(completedPayments);
        return totalRevenue / completedPayments.length;
    }

    sortPaymentsByAmount(payments: Payment[], order: 'asc' | 'desc' = 'desc'): Payment[] {
        return [...payments].sort((a, b) => {
            return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        });
    }

    sortPaymentsByDate(payments: Payment[], order: 'asc' | 'desc' = 'desc'): Payment[] {
        return [...payments].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'asc'
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
        });
    }

    filterPaymentsByDateRange(payments: Payment[], startDate?: string, endDate?: string): Payment[] {
        return payments.filter(payment => {
            const paymentDate = payment.createdAt.split('T')[0]; // YYYY-MM-DD
            if (startDate && paymentDate < startDate) return false;
            if (endDate && paymentDate > endDate) return false;
            return true;
        });
    }

    filterPaymentsByAmountRange(payments: Payment[], minAmount?: number, maxAmount?: number): Payment[] {
        return payments.filter(payment => {
            if (minAmount !== undefined && payment.amount < minAmount) return false;
            if (maxAmount !== undefined && payment.amount > maxAmount) return false;
            return true;
        });
    }

    // === MÉTODOS DE LOCALIZAÇÃO PARA PAGAMENTOS ===

    async getLocalizedPaymentMethods(): Promise<any[]> {
        try {
            const methods = await localizationService.getAvailablePaymentMethods();
            return methods.map(method => ({
                ...method,
                icon: localizationService.getPaymentMethodIcon(method.id),
                color: localizationService.getPaymentMethodColor(method.id)
            }));
        } catch (error) {
            console.error('Erro ao obter métodos de pagamento localizados:', error);
            return [];
        }
    }

    async calculateLocalizedFees(amount: number, paymentMethodId: string): Promise<any> {
        try {
            return await localizationService.calculatePaymentFee(amount, paymentMethodId);
        } catch (error) {
            console.error('Erro ao calcular taxas:', error);
            return { feeAmount: 0, totalAmount: amount };
        }
    }

    async formatLocalizedAmount(amount: number): Promise<string> {
        try {
            return await localizationService.formatCurrency(amount);
        } catch (error) {
            console.error('Erro ao formatar valor:', error);
            return `${amount}`;
        }
    }

    async createLocalizedPaymentSummary(amount: number, paymentMethodId: string): Promise<any> {
        try {
            return await localizationService.formatPaymentSummary(amount, paymentMethodId);
        } catch (error) {
            console.error('Erro ao criar resumo de pagamento:', error);
            return null;
        }
    }

    // Método específico para PIX (Brasil)
    async createPixPayment(data: CreatePaymentDto & { pixKey?: string }): Promise<Payment> {
        if (localizationService.getCurrentLocale() !== 'pt-BR') {
            throw new Error('PIX só está disponível no Brasil');
        }

        const pixPaymentData = {
            ...data,
            method: 'pix' as const,
            pixExpirationTime: data.pixExpirationTime || 30, // 30 minutos padrão
            metadata: {
                pixKey: data.pixKey,
                qrCodeGenerated: false,
                locale: 'pt-BR'
            }
        };

        return this.createPayment(pixPaymentData);
    }

    // Método específico para MB WAY (Portugal)
    async createMBWayPayment(data: CreatePaymentDto & { phoneNumber?: string }): Promise<Payment> {
        if (localizationService.getCurrentLocale() !== 'pt-PT') {
            throw new Error('MB WAY só está disponível em Portugal');
        }

        const mbwayPaymentData = {
            ...data,
            method: 'mb_way' as any,
            metadata: {
                phoneNumber: data.phoneNumber,
                locale: 'pt-PT'
            }
        };

        return this.createPayment(mbwayPaymentData);
    }

    // Método específico para Multibanco (Portugal)
    async createMultibancoPayment(data: CreatePaymentDto): Promise<Payment & { reference?: string }> {
        if (localizationService.getCurrentLocale() !== 'pt-PT') {
            throw new Error('Multibanco só está disponível em Portugal');
        }

        const multibancoPaymentData = {
            ...data,
            method: 'multibanco' as any,
            metadata: {
                locale: 'pt-PT'
            }
        };

        const payment = await this.createPayment(multibancoPaymentData);

        // TODO: Gerar referência Multibanco
        const reference = this.generateMultibancoReference(payment.amount);

        return {
            ...payment,
            reference
        };
    }

    private generateMultibancoReference(amount: number): string {
        // TODO: Implementar geração real de referência Multibanco
        // Por enquanto, gerar uma referência fictícia
        const entity = '12345'; // Entidade fictícia
        const reference = Math.floor(Math.random() * 999999999).toString().padStart(9, '0');

        return `${entity} ${reference} ${amount.toFixed(2).replace('.', '')}`;
    }

    // Método para validar métodos de pagamento por localização
    validatePaymentMethodForLocale(methodId: string): boolean {
        const locale = localizationService.getCurrentLocale();

        const localeSpecificMethods = {
            'pt-PT': ['mb_way', 'multibanco', 'credit_card', 'debit_card', 'bank_transfer', 'cash'],
            'pt-BR': ['pix', 'credit_card', 'debit_card', 'boleto', 'bank_transfer', 'cash']
        };

        const allowedMethods = localeSpecificMethods[locale as keyof typeof localeSpecificMethods] || [];
        return allowedMethods.includes(methodId);
    }

    // Obter métodos preferidos por país
    getPreferredPaymentMethods(): string[] {
        const locale = localizationService.getCurrentLocale();

        if (locale === 'pt-PT') {
            return ['mb_way', 'multibanco', 'credit_card'];
        }

        return ['pix', 'credit_card', 'boleto'];
    }

    // Obter métodos instantâneos
    getInstantPaymentMethods(): string[] {
        const locale = localizationService.getCurrentLocale();

        if (locale === 'pt-PT') {
            return ['mb_way', 'multibanco', 'credit_card', 'debit_card'];
        }

        return ['pix', 'credit_card', 'debit_card'];
    }

    // Obter métodos sem taxa
    getFreePaymentMethods(): string[] {
        const locale = localizationService.getCurrentLocale();

        if (locale === 'pt-PT') {
            return ['cash', 'bank_transfer'];
        }

        return ['pix', 'cash', 'bank_transfer'];
    }

    // Formatadores localizados para status
    getLocalizedPaymentStatus(status: string): string {
        const locale = localizationService.getCurrentLocale();

        const statusLabels = {
            'pt-PT': {
                pending: 'Pendente',
                processing: 'A processar',
                completed: 'Completo',
                failed: 'Falhado',
                canceled: 'Cancelado',
                refunded: 'Reembolsado'
            },
            'pt-BR': {
                pending: 'Pendente',
                processing: 'Processando',
                completed: 'Concluído',
                failed: 'Falhou',
                canceled: 'Cancelado',
                refunded: 'Estornado'
            }
        };

        const labels = statusLabels[locale as keyof typeof statusLabels] || statusLabels['pt-BR'];
        return labels[status as keyof typeof labels] || status;
    }

    // Formatadores localizados para métodos
    getLocalizedPaymentMethodName(methodId: string): string {
        const locale = localizationService.getCurrentLocale();

        const methodNames = {
            'pt-PT': {
                mb_way: 'MB WAY',
                multibanco: 'Multibanco',
                credit_card: 'Cartão de Crédito',
                debit_card: 'Cartão de Débito',
                bank_transfer: 'Transferência Bancária',
                cash: 'Numerário'
            },
            'pt-BR': {
                pix: 'PIX',
                boleto: 'Boleto Bancário',
                credit_card: 'Cartão de Crédito',
                debit_card: 'Cartão de Débito',
                bank_transfer: 'Transferência Bancária',
                cash: 'Dinheiro'
            }
        };

        const names = methodNames[locale as keyof typeof methodNames] || methodNames['pt-BR'];
        return names[methodId as keyof typeof names] || methodId;
    }
}

export const paymentService = new PaymentService();
export default paymentService;