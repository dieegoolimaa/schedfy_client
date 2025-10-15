import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Professionals
export interface CreateProfessionalDto {
    userId: string;
    businessId: string;
    specialties: string[];
    bio?: string;
    experience?: number;
    certifications?: string[];
    availability: ProfessionalAvailability;
    serviceIds?: string[];
}

export interface UpdateProfessionalDto {
    specialties?: string[];
    bio?: string;
    experience?: number;
    certifications?: string[];
    availability?: ProfessionalAvailability;
    isActive?: boolean;
    serviceIds?: string[];
}

export interface ProfessionalAvailability {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
}

export interface DayAvailability {
    isAvailable: boolean;
    timeSlots?: TimeSlot[];
}

export interface TimeSlot {
    start: string; // HH:MM format
    end: string;   // HH:MM format
}

export interface ProfessionalFilter {
    businessId?: string;
    specialty?: string;
    isActive?: boolean;
    isAvailable?: boolean;
    minRating?: number;
    search?: string; // busca por nome ou especialidade
    serviceId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'rating' | 'experience' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface ProfessionalStats {
    total: number;
    active: number;
    inactive: number;
    bySpecialty: Record<string, number>;
    averageRating: number;
    averageExperience: number;
    totalAppointments: number;
}

export interface Professional {
    _id: string;
    specialties: string[];
    bio?: string;
    experience?: number;
    certifications?: string[];
    availability: ProfessionalAvailability;
    isActive: boolean;

    // Relacionamentos
    userId: string;
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };

    businessId: string;
    business?: {
        _id: string;
        name: string;
        category: string;
    };

    services?: Array<{
        _id: string;
        name: string;
        price: number;
        duration: number;
    }>;

    // Estatísticas
    rating?: number;
    totalReviews?: number;
    totalAppointments?: number;
    completedAppointments?: number;
    revenue?: number;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

class ProfessionalService {
    private baseUrl = '/professionals';

    // Criar perfil profissional
    async createProfessional(data: CreateProfessionalDto): Promise<Professional> {
        const response = await apiUtils.post<ApiResponse<Professional>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar profissionais
    async getProfessionals(filter?: ProfessionalFilter): Promise<PaginatedResponse<Professional>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Professional>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter profissional por ID
    async getProfessionalById(id: string): Promise<Professional> {
        const response = await apiUtils.get<ApiResponse<Professional>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Obter meu perfil profissional
    async getMyProfessionalProfile(): Promise<Professional> {
        const response = await apiUtils.get<ApiResponse<Professional>>(`${this.baseUrl}/my-profile`);
        return response.data.data;
    }

    // Atualizar profissional
    async updateProfessional(id: string, data: UpdateProfessionalDto): Promise<Professional> {
        const response = await apiUtils.patch<ApiResponse<Professional>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Deletar profissional
    async deleteProfessional(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Ativar/Desativar profissional
    async toggleProfessionalStatus(id: string, isActive: boolean): Promise<Professional> {
        const response = await apiUtils.patch<ApiResponse<Professional>>(
            `${this.baseUrl}/${id}/status`,
            { isActive }
        );
        return response.data.data;
    }

    // Obter estatísticas de profissionais
    async getProfessionalStats(businessId?: string): Promise<ProfessionalStats> {
        const params = businessId ? `?businessId=${businessId}` : '';
        const response = await apiUtils.get<ApiResponse<ProfessionalStats>>(`${this.baseUrl}/stats${params}`);
        return response.data.data;
    }

    // Obter profissionais de um negócio
    async getBusinessProfessionals(businessId: string, filter?: Omit<ProfessionalFilter, 'businessId'>): Promise<PaginatedResponse<Professional>> {
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

        const response = await apiUtils.get<PaginatedResponse<Professional>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Buscar profissionais
    async searchProfessionals(query: string, businessId?: string, limit = 10): Promise<Professional[]> {
        const params = new URLSearchParams({
            search: query,
            limit: String(limit),
            isActive: 'true',
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const response = await apiUtils.get<ApiResponse<Professional[]>>(
            `${this.baseUrl}/search?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter profissionais disponíveis para um serviço
    async getAvailableProfessionals(serviceId: string, date?: string): Promise<Professional[]> {
        const params = new URLSearchParams({
            serviceId,
            isActive: 'true',
        });

        if (date) {
            params.append('date', date);
        }

        const response = await apiUtils.get<ApiResponse<Professional[]>>(
            `${this.baseUrl}/available?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter horários disponíveis de um profissional
    async getProfessionalAvailableSlots(
        professionalId: string,
        date: string,
        serviceId?: string
    ): Promise<TimeSlot[]> {
        const params = new URLSearchParams({
            date,
        });

        if (serviceId) {
            params.append('serviceId', serviceId);
        }

        const response = await apiUtils.get<ApiResponse<TimeSlot[]>>(
            `${this.baseUrl}/${professionalId}/available-slots?${params.toString()}`
        );

        return response.data.data;
    }

    // Atualizar disponibilidade
    async updateAvailability(professionalId: string, availability: ProfessionalAvailability): Promise<Professional> {
        const response = await apiUtils.patch<ApiResponse<Professional>>(
            `${this.baseUrl}/${professionalId}/availability`,
            { availability }
        );
        return response.data.data;
    }

    // Atualizar serviços do profissional
    async updateProfessionalServices(professionalId: string, serviceIds: string[]): Promise<Professional> {
        const response = await apiUtils.patch<ApiResponse<Professional>>(
            `${this.baseUrl}/${professionalId}/services`,
            { serviceIds }
        );
        return response.data.data;
    }

    // Obter agenda do profissional
    async getProfessionalSchedule(professionalId: string, startDate: string, endDate: string): Promise<any[]> {
        const params = new URLSearchParams({
            startDate,
            endDate,
        });

        const response = await apiUtils.get<ApiResponse<any[]>>(
            `${this.baseUrl}/${professionalId}/schedule?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter histórico de agendamentos
    async getProfessionalAppointments(
        professionalId: string,
        filter?: {
            status?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<PaginatedResponse<any>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<any>>(
            `${this.baseUrl}/${professionalId}/appointments?${params.toString()}`
        );

        return response.data;
    }

    // Obter analytics do profissional
    async getProfessionalAnalytics(professionalId: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<any> {
        const params = period ? `?period=${period}` : '';
        const response = await apiUtils.get<ApiResponse<any>>(
            `${this.baseUrl}/${professionalId}/analytics${params}`
        );
        return response.data.data;
    }

    // Utilities
    getProfessionalName(professional: Professional): string {
        if (professional.user) {
            return `${professional.user.firstName} ${professional.user.lastName}`;
        }
        return 'Profissional';
    }

    getProfessionalInitials(professional: Professional): string {
        if (professional.user) {
            return `${professional.user.firstName[0]}${professional.user.lastName[0]}`.toUpperCase();
        }
        return 'P';
    }

    getSpecialtiesText(specialties: string[]): string {
        if (specialties.length === 0) return 'Nenhuma especialidade';
        if (specialties.length === 1) return specialties[0];
        if (specialties.length <= 3) return specialties.join(', ');
        return `${specialties.slice(0, 2).join(', ')} e mais ${specialties.length - 2}`;
    }

    formatExperience(experience?: number): string {
        if (!experience) return 'Experiência não informada';
        if (experience === 1) return '1 ano de experiência';
        return `${experience} anos de experiência`;
    }

    formatRating(rating?: number, totalReviews?: number): string {
        if (!rating || !totalReviews) return 'Sem avaliações';
        const reviewText = totalReviews === 1 ? 'avaliação' : 'avaliações';
        return `${rating.toFixed(1)} ⭐ (${totalReviews} ${reviewText})`;
    }

    isAvailableOnDay(professional: Professional, dayOfWeek: keyof ProfessionalAvailability): boolean {
        const dayAvailability = professional.availability[dayOfWeek];
        return dayAvailability.isAvailable && (dayAvailability.timeSlots?.length || 0) > 0;
    }

    getAvailableDays(professional: Professional): string[] {
        const days: Array<{ key: keyof ProfessionalAvailability; label: string }> = [
            { key: 'monday', label: 'Segunda' },
            { key: 'tuesday', label: 'Terça' },
            { key: 'wednesday', label: 'Quarta' },
            { key: 'thursday', label: 'Quinta' },
            { key: 'friday', label: 'Sexta' },
            { key: 'saturday', label: 'Sábado' },
            { key: 'sunday', label: 'Domingo' },
        ];

        return days
            .filter(day => this.isAvailableOnDay(professional, day.key))
            .map(day => day.label);
    }

    getEarliestAvailableTime(professional: Professional): string | null {
        const days: Array<keyof ProfessionalAvailability> = [
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ];

        let earliestTime: string | null = null;

        for (const day of days) {
            const dayAvailability = professional.availability[day];
            if (dayAvailability.isAvailable && dayAvailability.timeSlots) {
                for (const slot of dayAvailability.timeSlots) {
                    if (!earliestTime || slot.start < earliestTime) {
                        earliestTime = slot.start;
                    }
                }
            }
        }

        return earliestTime;
    }

    getLatestAvailableTime(professional: Professional): string | null {
        const days: Array<keyof ProfessionalAvailability> = [
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ];

        let latestTime: string | null = null;

        for (const day of days) {
            const dayAvailability = professional.availability[day];
            if (dayAvailability.isAvailable && dayAvailability.timeSlots) {
                for (const slot of dayAvailability.timeSlots) {
                    if (!latestTime || slot.end > latestTime) {
                        latestTime = slot.end;
                    }
                }
            }
        }

        return latestTime;
    }

    getTotalWeeklyHours(professional: Professional): number {
        const days: Array<keyof ProfessionalAvailability> = [
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ];

        let totalMinutes = 0;

        for (const day of days) {
            const dayAvailability = professional.availability[day];
            if (dayAvailability.isAvailable && dayAvailability.timeSlots) {
                for (const slot of dayAvailability.timeSlots) {
                    const startMinutes = this.timeToMinutes(slot.start);
                    const endMinutes = this.timeToMinutes(slot.end);
                    totalMinutes += endMinutes - startMinutes;
                }
            }
        }

        return Math.round(totalMinutes / 60 * 10) / 10; // Arredonda para 1 casa decimal
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    formatWorkingHours(professional: Professional): string {
        const earliestTime = this.getEarliestAvailableTime(professional);
        const latestTime = this.getLatestAvailableTime(professional);
        const availableDays = this.getAvailableDays(professional);

        if (!earliestTime || !latestTime || availableDays.length === 0) {
            return 'Horários não definidos';
        }

        const daysText = availableDays.length === 7
            ? 'Todos os dias'
            : availableDays.length <= 3
                ? availableDays.join(', ')
                : `${availableDays.slice(0, 2).join(', ')} e mais ${availableDays.length - 2} dias`;

        return `${daysText}: ${earliestTime} às ${latestTime}`;
    }

    canProfessionalProvideService(professional: Professional, serviceId: string): boolean {
        return professional.services?.some(service => service._id === serviceId) || false;
    }

    getProfessionalServices(professional: Professional): string[] {
        return professional.services?.map(service => service.name) || [];
    }

    getCompletionRate(professional: Professional): number {
        if (!professional.totalAppointments || professional.totalAppointments === 0) return 0;
        const completedRate = (professional.completedAppointments || 0) / professional.totalAppointments;
        return Math.round(completedRate * 100);
    }

    formatRevenue(revenue?: number): string {
        if (!revenue) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(revenue);
    }

    getStatusColor(professional: Professional): string {
        if (!professional.isActive) return 'text-red-600';

        const availableDays = this.getAvailableDays(professional);
        if (availableDays.length === 0) return 'text-yellow-600';

        return 'text-green-600';
    }

    getStatusLabel(professional: Professional): string {
        if (!professional.isActive) return 'Inativo';

        const availableDays = this.getAvailableDays(professional);
        if (availableDays.length === 0) return 'Sem horários';

        return 'Ativo';
    }
}

export const professionalService = new ProfessionalService();
export default professionalService;