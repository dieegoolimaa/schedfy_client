import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Feedback
export interface CreateFeedbackDto {
    appointmentId: string;
    rating: number; // 1-5
    comment?: string;
    aspects?: {
        service: number;
        professional: number;
        environment: number;
        punctuality: number;
        valueForMoney: number;
    };
    wouldRecommend?: boolean;
}

export interface UpdateFeedbackDto {
    rating?: number;
    comment?: string;
    aspects?: {
        service?: number;
        professional?: number;
        environment?: number;
        punctuality?: number;
        valueForMoney?: number;
    };
    wouldRecommend?: boolean;
}

export interface FeedbackFilter {
    businessId?: string;
    professionalId?: string;
    serviceId?: string;
    customerId?: string;
    appointmentId?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    hasComment?: boolean;
    wouldRecommend?: boolean;
    startDate?: string;
    endDate?: string;
    search?: string; // busca no comentário
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'rating' | 'wouldRecommend';
    sortOrder?: 'asc' | 'desc';
}

export interface FeedbackStats {
    total: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    aspectsAverages: {
        service: number;
        professional: number;
        environment: number;
        punctuality: number;
        valueForMoney: number;
    };
    recommendationRate: number; // % que recomendariam
    withComments: number;
}

export interface Feedback {
    _id: string;
    rating: number; // 1-5
    comment?: string;
    aspects?: {
        service: number;
        professional: number;
        environment: number;
        punctuality: number;
        valueForMoney: number;
    };
    wouldRecommend?: boolean;
    isVerified: boolean; // se foi de um agendamento real

    // Relacionamentos
    appointmentId: string;
    appointment?: {
        _id: string;
        date: string;
        startTime: string;
        service: {
            _id: string;
            name: string;
        };
        business: {
            _id: string;
            name: string;
        };
        professional: {
            _id: string;
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };

    customerId: string;
    customer?: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };

    businessId: string;
    professionalId: string;
    serviceId: string;

    // Resposta do negócio
    businessResponse?: {
        message: string;
        respondedAt: string;
        respondedBy: string;
    };

    // Flags de moderação
    isHidden: boolean;
    moderationReason?: string;
    moderatedAt?: string;
    moderatedBy?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

export interface BusinessResponse {
    feedbackId: string;
    message: string;
}

class FeedbackService {
    private baseUrl = '/feedback';

    // Criar feedback
    async createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
        const response = await apiUtils.post<ApiResponse<Feedback>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar feedbacks
    async getFeedbacks(filter?: FeedbackFilter): Promise<PaginatedResponse<Feedback>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter feedback por ID
    async getFeedbackById(id: string): Promise<Feedback> {
        const response = await apiUtils.get<ApiResponse<Feedback>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Obter feedback por agendamento
    async getFeedbackByAppointment(appointmentId: string): Promise<Feedback | null> {
        try {
            const response = await apiUtils.get<ApiResponse<Feedback>>(`${this.baseUrl}/appointment/${appointmentId}`);
            return response.data.data;
        } catch (error) {
            return null; // Agendamento pode não ter feedback ainda
        }
    }

    // Atualizar feedback (apenas pelo cliente que criou)
    async updateFeedback(id: string, data: UpdateFeedbackDto): Promise<Feedback> {
        const response = await apiUtils.patch<ApiResponse<Feedback>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Deletar feedback (apenas pelo cliente que criou)
    async deleteFeedback(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Obter feedbacks de um negócio
    async getBusinessFeedbacks(businessId: string, filter?: Omit<FeedbackFilter, 'businessId'>): Promise<PaginatedResponse<Feedback>> {
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

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter feedbacks de um profissional
    async getProfessionalFeedbacks(professionalId: string, filter?: Omit<FeedbackFilter, 'professionalId'>): Promise<PaginatedResponse<Feedback>> {
        const params = new URLSearchParams({
            professionalId,
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter feedbacks de um serviço
    async getServiceFeedbacks(serviceId: string, filter?: Omit<FeedbackFilter, 'serviceId'>): Promise<PaginatedResponse<Feedback>> {
        const params = new URLSearchParams({
            serviceId,
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter meus feedbacks (cliente)
    async getMyFeedbacks(filter?: Omit<FeedbackFilter, 'customerId'>): Promise<PaginatedResponse<Feedback>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}/my-feedbacks?${params.toString()}`
        );

        return response.data;
    }

    // Obter estatísticas de feedback
    async getFeedbackStats(businessId?: string, professionalId?: string, serviceId?: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<FeedbackStats> {
        const params = new URLSearchParams();

        if (businessId) params.append('businessId', businessId);
        if (professionalId) params.append('professionalId', professionalId);
        if (serviceId) params.append('serviceId', serviceId);
        if (period) params.append('period', period);

        const response = await apiUtils.get<ApiResponse<FeedbackStats>>(
            `${this.baseUrl}/stats?${params.toString()}`
        );

        return response.data.data;
    }

    // Responder feedback (negócio)
    async respondToFeedback(data: BusinessResponse): Promise<Feedback> {
        const response = await apiUtils.post<ApiResponse<Feedback>>(
            `${this.baseUrl}/${data.feedbackId}/respond`,
            { message: data.message }
        );
        return response.data.data;
    }

    // Atualizar resposta do feedback
    async updateFeedbackResponse(feedbackId: string, message: string): Promise<Feedback> {
        const response = await apiUtils.patch<ApiResponse<Feedback>>(
            `${this.baseUrl}/${feedbackId}/respond`,
            { message }
        );
        return response.data.data;
    }

    // Remover resposta do feedback
    async removeFeedbackResponse(feedbackId: string): Promise<Feedback> {
        const response = await apiUtils.delete<ApiResponse<Feedback>>(
            `${this.baseUrl}/${feedbackId}/respond`
        );
        return response.data.data;
    }

    // Ocultar feedback (moderação)
    async hideFeedback(feedbackId: string, reason: string): Promise<Feedback> {
        const response = await apiUtils.patch<ApiResponse<Feedback>>(
            `${this.baseUrl}/${feedbackId}/hide`,
            { reason }
        );
        return response.data.data;
    }

    // Mostrar feedback novamente
    async showFeedback(feedbackId: string): Promise<Feedback> {
        const response = await apiUtils.patch<ApiResponse<Feedback>>(
            `${this.baseUrl}/${feedbackId}/show`
        );
        return response.data.data;
    }

    // Obter feedbacks pendentes de resposta
    async getPendingFeedbacks(businessId: string): Promise<Feedback[]> {
        const params = new URLSearchParams({
            businessId,
            hasBusinessResponse: 'false',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });

        const response = await apiUtils.get<PaginatedResponse<Feedback>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Utilities
    getRatingLabel(rating: number): string {
        const labels = {
            1: 'Muito Ruim',
            2: 'Ruim',
            3: 'Regular',
            4: 'Bom',
            5: 'Excelente'
        };
        return labels[rating as keyof typeof labels] || 'Sem avaliação';
    }

    getRatingColor(rating: number): string {
        const colors = {
            1: 'text-red-600',
            2: 'text-orange-600',
            3: 'text-yellow-600',
            4: 'text-green-600',
            5: 'text-emerald-600'
        };
        return colors[rating as keyof typeof colors] || 'text-gray-600';
    }

    getRatingStars(rating: number): string {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    formatRating(rating: number): string {
        return `${rating.toFixed(1)} ⭐`;
    }

    formatDateTime(feedback: Feedback): string {
        const date = new Date(feedback.createdAt);
        return date.toLocaleString('pt-BR');
    }

    formatDate(feedback: Feedback): string {
        const date = new Date(feedback.createdAt);
        return date.toLocaleDateString('pt-BR');
    }

    getCustomerName(feedback: Feedback): string {
        if (feedback.customer) {
            return `${feedback.customer.firstName} ${feedback.customer.lastName}`;
        }
        return 'Cliente anônimo';
    }

    getCustomerInitials(feedback: Feedback): string {
        if (feedback.customer) {
            return `${feedback.customer.firstName[0]}${feedback.customer.lastName[0]}`.toUpperCase();
        }
        return 'CA';
    }

    getProfessionalName(feedback: Feedback): string {
        if (feedback.appointment?.professional?.user) {
            const { firstName, lastName } = feedback.appointment.professional.user;
            return `${firstName} ${lastName}`;
        }
        return 'Profissional não identificado';
    }

    getServiceName(feedback: Feedback): string {
        return feedback.appointment?.service?.name || 'Serviço não identificado';
    }

    getBusinessName(feedback: Feedback): string {
        return feedback.appointment?.business?.name || 'Negócio não identificado';
    }

    getAppointmentInfo(feedback: Feedback): string {
        if (feedback.appointment) {
            const { date, startTime } = feedback.appointment;
            const formattedDate = new Date(date).toLocaleDateString('pt-BR');
            return `${formattedDate} às ${startTime}`;
        }
        return 'Agendamento não identificado';
    }

    hasAspectRatings(feedback: Feedback): boolean {
        return !!feedback.aspects;
    }

    getAspectRating(feedback: Feedback, aspect: keyof NonNullable<Feedback['aspects']>): number {
        return feedback.aspects?.[aspect] || 0;
    }

    formatAspectLabel(aspect: string): string {
        const labels = {
            service: 'Serviço',
            professional: 'Profissional',
            environment: 'Ambiente',
            punctuality: 'Pontualidade',
            valueForMoney: 'Custo-Benefício'
        };
        return labels[aspect as keyof typeof labels] || aspect;
    }

    calculateAverageAspectRating(feedbacks: Feedback[], aspect: keyof NonNullable<Feedback['aspects']>): number {
        const ratingsWithAspect = feedbacks
            .filter(f => f.aspects?.[aspect])
            .map(f => f.aspects![aspect]);

        if (ratingsWithAspect.length === 0) return 0;

        const sum = ratingsWithAspect.reduce((acc, rating) => acc + rating, 0);
        return sum / ratingsWithAspect.length;
    }

    hasBusinessResponse(feedback: Feedback): boolean {
        return !!feedback.businessResponse;
    }

    isHidden(feedback: Feedback): boolean {
        return feedback.isHidden;
    }

    canEdit(feedback: Feedback): boolean {
        // Cliente pode editar por até 24h após criação
        const createdAt = new Date(feedback.createdAt);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        return hoursSinceCreation < 24;
    }

    canDelete(feedback: Feedback): boolean {
        // Cliente pode deletar por até 7 dias após criação
        const createdAt = new Date(feedback.createdAt);
        const now = new Date();
        const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

        return daysSinceCreation < 7;
    }

    canRespond(feedback: Feedback): boolean {
        // Negócio pode responder se ainda não respondeu ou se quer atualizar
        return !feedback.isHidden;
    }

    getRecommendationRate(feedbacks: Feedback[]): number {
        const feedbacksWithRecommendation = feedbacks.filter(f => f.wouldRecommend !== undefined);
        if (feedbacksWithRecommendation.length === 0) return 0;

        const recommendCount = feedbacksWithRecommendation.filter(f => f.wouldRecommend).length;
        return Math.round((recommendCount / feedbacksWithRecommendation.length) * 100);
    }

    filterByRating(feedbacks: Feedback[], minRating?: number, maxRating?: number): Feedback[] {
        return feedbacks.filter(feedback => {
            if (minRating !== undefined && feedback.rating < minRating) return false;
            if (maxRating !== undefined && feedback.rating > maxRating) return false;
            return true;
        });
    }

    filterByRecommendation(feedbacks: Feedback[], wouldRecommend?: boolean): Feedback[] {
        if (wouldRecommend === undefined) return feedbacks;
        return feedbacks.filter(feedback => feedback.wouldRecommend === wouldRecommend);
    }

    filterWithComments(feedbacks: Feedback[]): Feedback[] {
        return feedbacks.filter(feedback => feedback.comment && feedback.comment.trim().length > 0);
    }

    sortByRating(feedbacks: Feedback[], order: 'asc' | 'desc' = 'desc'): Feedback[] {
        return [...feedbacks].sort((a, b) => {
            return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        });
    }

    sortByDate(feedbacks: Feedback[], order: 'asc' | 'desc' = 'desc'): Feedback[] {
        return [...feedbacks].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'asc'
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
        });
    }

    groupByRating(feedbacks: Feedback[]): Record<number, Feedback[]> {
        return feedbacks.reduce((groups, feedback) => {
            const rating = feedback.rating;
            if (!groups[rating]) {
                groups[rating] = [];
            }
            groups[rating].push(feedback);
            return groups;
        }, {} as Record<number, Feedback[]>);
    }

    calculateAverageRating(feedbacks: Feedback[]): number {
        if (feedbacks.length === 0) return 0;

        const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
        return sum / feedbacks.length;
    }

    getRatingDistribution(feedbacks: Feedback[]): Record<number, number> {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        feedbacks.forEach(feedback => {
            distribution[feedback.rating as keyof typeof distribution]++;
        });

        return distribution;
    }

    getMostRecentFeedbacks(feedbacks: Feedback[], limit = 5): Feedback[] {
        return this.sortByDate(feedbacks, 'desc').slice(0, limit);
    }

    getHighestRatedFeedbacks(feedbacks: Feedback[], limit = 5): Feedback[] {
        return this.sortByRating(feedbacks, 'desc')
            .filter(f => f.rating >= 4)
            .slice(0, limit);
    }

    searchInComments(feedbacks: Feedback[], query: string): Feedback[] {
        if (!query.trim()) return feedbacks;

        const lowerQuery = query.toLowerCase();
        return feedbacks.filter(feedback =>
            feedback.comment?.toLowerCase().includes(lowerQuery)
        );
    }
}

export const feedbackService = new FeedbackService();
export default feedbackService;