import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Business
export interface CreateBusinessDto {
    name: string;
    category: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
    };
    workingHours: WorkingHours;
    settings?: BusinessSettings;
}

export interface UpdateBusinessDto {
    name?: string;
    category?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    logo?: string;
    address?: {
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    workingHours?: WorkingHours;
    settings?: Partial<BusinessSettings>;
    isActive?: boolean;
}

export interface WorkingHours {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

export interface DaySchedule {
    isOpen: boolean;
    openTime?: string; // HH:MM format
    closeTime?: string; // HH:MM format
    breaks?: {
        start: string;
        end: string;
    }[];
}

export interface BusinessSettings {
    allowOnlineBooking: boolean;
    requirePaymentUpfront: boolean;
    cancelationPolicy: {
        allowCancelation: boolean;
        minimumHours: number;
        refundPolicy: 'full' | 'partial' | 'none';
    };
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        whatsappNotifications: boolean;
    };
    appointmentDefaults: {
        duration: number; // minutos
        buffer: number; // tempo entre consultas
    };
}

export interface BusinessFilter {
    category?: string;
    city?: string;
    state?: string;
    isActive?: boolean;
    hasOnlineBooking?: boolean;
    search?: string; // busca por nome ou descrição
    ownerId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'category' | 'createdAt' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

export interface BusinessStats {
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    withOnlineBooking: number;
    averageRating: number;
    totalAppointments: number;
    totalRevenue: number;
}

export interface Business {
    _id: string;
    name: string;
    category: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    logo?: string;

    // Localização
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };

    // Funcionamento
    workingHours: WorkingHours;
    settings: BusinessSettings;
    isActive: boolean;

    // Relacionamentos
    ownerId: string;
    owner?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };

    // Estatísticas
    rating?: number;
    totalReviews?: number;
    totalAppointments?: number;
    totalRevenue?: number;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

class BusinessService {
    private baseUrl = '/business';

    // Criar negócio
    async createBusiness(data: CreateBusinessDto): Promise<Business> {
        const response = await apiUtils.post<ApiResponse<Business>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar negócios
    async getBusinesses(filter?: BusinessFilter): Promise<PaginatedResponse<Business>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Business>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter negócio por ID
    async getBusinessById(id: string): Promise<Business> {
        const response = await apiUtils.get<ApiResponse<Business>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Obter meu negócio (proprietário)
    async getMyBusiness(): Promise<Business> {
        const response = await apiUtils.get<ApiResponse<Business>>(`${this.baseUrl}/my-business`);
        return response.data.data;
    }

    // Atualizar negócio
    async updateBusiness(id: string, data: UpdateBusinessDto): Promise<Business> {
        const response = await apiUtils.patch<ApiResponse<Business>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Deletar negócio
    async deleteBusiness(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Ativar/Desativar negócio
    async toggleBusinessStatus(id: string, isActive: boolean): Promise<Business> {
        const response = await apiUtils.patch<ApiResponse<Business>>(
            `${this.baseUrl}/${id}/status`,
            { isActive }
        );
        return response.data.data;
    }

    // Obter estatísticas de negócios
    async getBusinessStats(): Promise<BusinessStats> {
        const response = await apiUtils.get<ApiResponse<BusinessStats>>(`${this.baseUrl}/stats`);
        return response.data.data;
    }

    // Obter estatísticas de um negócio específico
    async getBusinessAnalytics(id: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<any> {
        const params = period ? `?period=${period}` : '';
        const response = await apiUtils.get<ApiResponse<any>>(
            `${this.baseUrl}/${id}/analytics${params}`
        );
        return response.data.data;
    }

    // Buscar negócios por nome/categoria
    async searchBusinesses(query: string, limit = 10): Promise<Business[]> {
        const params = new URLSearchParams({
            search: query,
            limit: String(limit),
            isActive: 'true',
        });

        const response = await apiUtils.get<ApiResponse<Business[]>>(
            `${this.baseUrl}/search?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter negócios por categoria
    async getBusinessesByCategory(category: string, filter?: Omit<BusinessFilter, 'category'>): Promise<PaginatedResponse<Business>> {
        const params = new URLSearchParams({
            category,
            isActive: 'true',
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Business>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter negócios próximos
    async getNearbyBusinesses(lat: number, lng: number, radius = 10): Promise<Business[]> {
        const params = new URLSearchParams({
            lat: String(lat),
            lng: String(lng),
            radius: String(radius),
            isActive: 'true',
        });

        const response = await apiUtils.get<ApiResponse<Business[]>>(
            `${this.baseUrl}/nearby?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter categorias disponíveis
    async getCategories(): Promise<string[]> {
        const response = await apiUtils.get<ApiResponse<string[]>>(`${this.baseUrl}/categories`);
        return response.data.data;
    }

    // Upload de logo
    async uploadLogo(businessId: string, file: File): Promise<{ logoUrl: string }> {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await apiUtils.post<ApiResponse<{ logoUrl: string }>>(
            `${this.baseUrl}/${businessId}/logo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    }

    // Remover logo
    async removeLogo(businessId: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${businessId}/logo`);
    }

    // Atualizar horário de funcionamento
    async updateWorkingHours(businessId: string, workingHours: WorkingHours): Promise<Business> {
        const response = await apiUtils.patch<ApiResponse<Business>>(
            `${this.baseUrl}/${businessId}/working-hours`,
            { workingHours }
        );
        return response.data.data;
    }

    // Atualizar configurações
    async updateSettings(businessId: string, settings: Partial<BusinessSettings>): Promise<Business> {
        const response = await apiUtils.patch<ApiResponse<Business>>(
            `${this.baseUrl}/${businessId}/settings`,
            { settings }
        );
        return response.data.data;
    }

    // Utilities
    getFullAddress(business: Business): string {
        const { address } = business;
        const complement = address.complement ? `, ${address.complement}` : '';
        return `${address.street}, ${address.number}${complement}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}`;
    }

    getShortAddress(business: Business): string {
        const { address } = business;
        return `${address.neighborhood}, ${address.city} - ${address.state}`;
    }

    isBusinessOpen(business: Business, date?: Date): boolean {
        const currentDate = date || new Date();
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayMap: Record<string, keyof WorkingHours> = {
            'monday': 'monday',
            'tuesday': 'tuesday',
            'wednesday': 'wednesday',
            'thursday': 'thursday',
            'friday': 'friday',
            'saturday': 'saturday',
            'sunday': 'sunday'
        };
        const currentDay = dayMap[dayName];
        const daySchedule = business.workingHours[currentDay];

        if (!daySchedule.isOpen) return false;

        const currentTime = currentDate.toTimeString().slice(0, 5); // HH:MM
        return currentTime >= (daySchedule.openTime || '00:00') &&
            currentTime <= (daySchedule.closeTime || '23:59');
    }

    getOpeningStatus(business: Business): { isOpen: boolean; message: string } {
        const now = new Date();
        const isOpen = this.isBusinessOpen(business, now);

        if (isOpen) {
            return { isOpen: true, message: 'Aberto agora' };
        }

        // Encontrar próximo horário de abertura
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayMap: Record<string, keyof WorkingHours> = {
            'monday': 'monday',
            'tuesday': 'tuesday',
            'wednesday': 'wednesday',
            'thursday': 'thursday',
            'friday': 'friday',
            'saturday': 'saturday',
            'sunday': 'sunday'
        };
        const currentDay = dayMap[dayName];
        const daySchedule = business.workingHours[currentDay];

        if (daySchedule.isOpen && daySchedule.openTime) {
            const currentTime = now.toTimeString().slice(0, 5);
            if (currentTime < daySchedule.openTime) {
                return { isOpen: false, message: `Abre às ${daySchedule.openTime}` };
            }
        }

        return { isOpen: false, message: 'Fechado' };
    }

    formatRating(rating?: number): string {
        if (!rating) return 'Sem avaliações';
        return `${rating.toFixed(1)} ⭐`;
    }

    getBusinessUrl(business: Business): string {
        const slug = business.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `/business/${business._id}/${slug}`;
    }

    getCategoryIcon(category: string): string {
        const icons: Record<string, string> = {
            'salao-beleza': '💇‍♀️',
            'barbearia': '💈',
            'clinica-estetica': '✨',
            'consultorio-medico': '🏥',
            'academia': '💪',
            'spa': '🧘‍♀️',
            'veterinario': '🐕',
            'manicure': '💅',
            'massagem': '🤲',
            'fisioterapia': '🏥',
        };
        return icons[category] || '🏢';
    }

    formatPhone(phone?: string): string {
        if (!phone) return '';

        // Remove caracteres não numéricos
        const cleaned = phone.replace(/\D/g, '');

        // Formata para (XX) XXXXX-XXXX
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }

        // Formata para (XX) XXXX-XXXX
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }

        return phone;
    }

    canUserManage(business: Business, userId: string): boolean {
        return business.ownerId === userId;
    }

    getWorkingDays(workingHours: WorkingHours): string[] {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

        return days
            .filter(day => workingHours[day as keyof WorkingHours].isOpen)
            .map(day => dayNames[days.indexOf(day)]);
    }

    getBusinessDistance(business: Business, userLat: number, userLng: number): number | null {
        if (!business.address.coordinates) return null;

        const { lat, lng } = business.address.coordinates;
        const R = 6371; // Raio da Terra em km

        const dLat = (lat - userLat) * Math.PI / 180;
        const dLon = (lng - userLng) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 10) / 10; // Arredonda para 1 casa decimal
    }

    formatDistance(distance: number | null): string {
        if (distance === null) return '';
        if (distance < 1) return `${Math.round(distance * 1000)}m`;
        return `${distance}km`;
    }
}

export const businessService = new BusinessService();
export default businessService;