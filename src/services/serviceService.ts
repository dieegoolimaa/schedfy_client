import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Services
export interface CreateServiceDto {
    name: string;
    description?: string;
    price: number;
    duration: number; // em minutos
    businessId: string;
    category?: string;
    isActive?: boolean;
    requiresDeposit?: boolean;
    depositAmount?: number;
    maxAdvanceBooking?: number; // dias
    minAdvanceBooking?: number; // horas
    allowCancelation?: boolean;
    cancelationDeadline?: number; // horas
    professionalIds?: string[];
}

export interface UpdateServiceDto {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
    isActive?: boolean;
    requiresDeposit?: boolean;
    depositAmount?: number;
    maxAdvanceBooking?: number;
    minAdvanceBooking?: number;
    allowCancelation?: boolean;
    cancelationDeadline?: number;
    professionalIds?: string[];
}

export interface ServiceFilter {
    businessId?: string;
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    maxDuration?: number;
    professionalId?: string;
    search?: string; // busca por nome ou descrição
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'duration' | 'popularity' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface ServiceStats {
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    averagePrice: number;
    averageDuration: number;
    totalBookings: number;
    totalRevenue: number;
    popularServices: Array<{
        _id: string;
        name: string;
        bookings: number;
    }>;
}

export interface Service {
    _id: string;
    name: string;
    description?: string;
    price: number;
    duration: number; // em minutos
    category?: string;
    isActive: boolean;

    // Políticas
    requiresDeposit: boolean;
    depositAmount?: number;
    maxAdvanceBooking?: number; // dias
    minAdvanceBooking?: number; // horas
    allowCancelation: boolean;
    cancelationDeadline?: number; // horas

    // Relacionamentos
    businessId: string;
    business?: {
        _id: string;
        name: string;
        category: string;
    };

    professionals?: Array<{
        _id: string;
        userId: string;
        user: {
            firstName: string;
            lastName: string;
            avatar?: string;
        };
    }>;

    // Pacotes disponíveis
    packages?: ServicePackage[];

    // Estatísticas
    totalBookings?: number;
    totalRevenue?: number;
    averageRating?: number;
    totalReviews?: number;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

// Interface para Pacotes de Serviços
export interface ServicePackage {
    _id: string;
    serviceId: string;
    businessId: string;
    name: string;
    description?: string;
    sessionsIncluded: number;
    packagePrice: number;
    individualPrice: number;
    discountPercentage: number;
    validityDays: number;
    isActive: boolean;

    // Políticas
    allowRescheduling: boolean;
    allowRefund: boolean;
    cancellationDeadlineHours: number;

    // Restrições
    availableDaysOfWeek?: string[];
    availableTimeSlots?: string[];
    availableProfessionals?: string[];

    // Estatísticas
    totalSold: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

export interface CreateServicePackageDto {
    serviceId: string;
    name: string;
    description?: string;
    sessionsIncluded: number;
    packagePrice: number;
    individualPrice: number;
    validityDays?: number;
    allowRescheduling?: boolean;
    allowRefund?: boolean;
    cancellationDeadlineHours?: number;
    availableDaysOfWeek?: string[];
    availableTimeSlots?: string[];
    availableProfessionals?: string[];
}

export interface UpdateServicePackageDto {
    name?: string;
    description?: string;
    sessionsIncluded?: number;
    packagePrice?: number;
    individualPrice?: number;
    validityDays?: number;
    isActive?: boolean;
    allowRescheduling?: boolean;
    allowRefund?: boolean;
    cancellationDeadlineHours?: number;
    availableDaysOfWeek?: string[];
    availableTimeSlots?: string[];
    availableProfessionals?: string[];
}

export interface PackagePurchase {
    _id: string;
    packageId: string;
    customerId: string;
    businessId: string;
    serviceId: string;
    pricePaid: number;
    sessionsIncluded: number;
    sessionsRemaining: number;
    purchaseDate: string;
    expirationDate: string;
    status: 'active' | 'expired' | 'used' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'refunded';

    // Relacionamentos
    package?: ServicePackage;
    service?: Service;

    // Histórico
    usageHistory: Array<{
        appointmentId: string;
        usedAt: string;
        professionalId: string;
    }>;

    createdAt: string;
    updatedAt: string;
}

class ServiceService {
    private baseUrl = '/services';

    // Criar serviço
    async createService(data: CreateServiceDto): Promise<Service> {
        const response = await apiUtils.post<ApiResponse<Service>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar serviços
    async getServices(filter?: ServiceFilter): Promise<PaginatedResponse<Service>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Service>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter serviço por ID
    async getServiceById(id: string): Promise<Service> {
        const response = await apiUtils.get<ApiResponse<Service>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Atualizar serviço
    async updateService(id: string, data: UpdateServiceDto): Promise<Service> {
        const response = await apiUtils.patch<ApiResponse<Service>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Deletar serviço
    async deleteService(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Ativar/Desativar serviço
    async toggleServiceStatus(id: string, isActive: boolean): Promise<Service> {
        const response = await apiUtils.patch<ApiResponse<Service>>(
            `${this.baseUrl}/${id}/status`,
            { isActive }
        );
        return response.data.data;
    }

    // Obter estatísticas de serviços
    async getServiceStats(businessId?: string): Promise<ServiceStats> {
        const params = businessId ? `?businessId=${businessId}` : '';
        const response = await apiUtils.get<ApiResponse<ServiceStats>>(`${this.baseUrl}/stats${params}`);
        return response.data.data;
    }

    // Obter serviços de um negócio
    async getBusinessServices(businessId: string, filter?: Omit<ServiceFilter, 'businessId'>): Promise<PaginatedResponse<Service>> {
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

        const response = await apiUtils.get<PaginatedResponse<Service>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Buscar serviços
    async searchServices(query: string, businessId?: string, limit = 10): Promise<Service[]> {
        const params = new URLSearchParams({
            search: query,
            limit: String(limit),
            isActive: 'true',
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const response = await apiUtils.get<ApiResponse<Service[]>>(
            `${this.baseUrl}/search?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter serviços por categoria
    async getServicesByCategory(category: string, businessId?: string): Promise<Service[]> {
        const params = new URLSearchParams({
            category,
            isActive: 'true',
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const response = await apiUtils.get<PaginatedResponse<Service>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter serviços de um profissional
    async getProfessionalServices(professionalId: string): Promise<Service[]> {
        const params = new URLSearchParams({
            professionalId,
            isActive: 'true',
        });

        const response = await apiUtils.get<PaginatedResponse<Service>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter categorias disponíveis
    async getServiceCategories(businessId?: string): Promise<string[]> {
        const params = businessId ? `?businessId=${businessId}` : '';
        const response = await apiUtils.get<ApiResponse<string[]>>(`${this.baseUrl}/categories${params}`);
        return response.data.data;
    }

    // Obter serviços populares
    async getPopularServices(businessId?: string, limit = 10): Promise<Service[]> {
        const params = new URLSearchParams({
            limit: String(limit),
            sortBy: 'popularity',
            sortOrder: 'desc',
            isActive: 'true',
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const response = await apiUtils.get<PaginatedResponse<Service>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Atualizar profissionais do serviço
    async updateServiceProfessionals(serviceId: string, professionalIds: string[]): Promise<Service> {
        const response = await apiUtils.patch<ApiResponse<Service>>(
            `${this.baseUrl}/${serviceId}/professionals`,
            { professionalIds }
        );
        return response.data.data;
    }

    // Duplicar serviço
    async duplicateService(serviceId: string, newName?: string): Promise<Service> {
        const response = await apiUtils.post<ApiResponse<Service>>(
            `${this.baseUrl}/${serviceId}/duplicate`,
            { name: newName }
        );
        return response.data.data;
    }

    // Obter analytics do serviço
    async getServiceAnalytics(serviceId: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<any> {
        const params = period ? `?period=${period}` : '';
        const response = await apiUtils.get<ApiResponse<any>>(
            `${this.baseUrl}/${serviceId}/analytics${params}`
        );
        return response.data.data;
    }

    // === MÉTODOS PARA PACOTES DE SERVIÇOS ===

    // Criar pacote de serviço
    async createServicePackage(data: CreateServicePackageDto): Promise<ServicePackage> {
        const response = await apiUtils.post<ApiResponse<ServicePackage>>(`${this.baseUrl}/packages`, data);
        return response.data.data;
    }

    // Listar pacotes
    async getServicePackages(filter?: {
        businessId?: string;
        serviceId?: string;
        isActive?: boolean;
        minPrice?: number;
        maxPrice?: number;
        minSessions?: number;
        minDiscount?: number;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<ServicePackage>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<ServicePackage>>(
            `${this.baseUrl}/packages?${params.toString()}`
        );

        return response.data;
    }

    // Obter pacote por ID
    async getServicePackageById(id: string): Promise<ServicePackage> {
        const response = await apiUtils.get<ApiResponse<ServicePackage>>(`${this.baseUrl}/packages/${id}`);
        return response.data.data;
    }

    // Atualizar pacote
    async updateServicePackage(id: string, data: UpdateServicePackageDto): Promise<ServicePackage> {
        const response = await apiUtils.patch<ApiResponse<ServicePackage>>(`${this.baseUrl}/packages/${id}`, data);
        return response.data.data;
    }

    // Deletar pacote
    async deleteServicePackage(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/packages/${id}`);
    }

    // Comprar pacote
    async purchasePackage(packageId: string, paymentMethod?: string): Promise<PackagePurchase> {
        const response = await apiUtils.post<ApiResponse<PackagePurchase>>(
            `${this.baseUrl}/packages/${packageId}/purchase`,
            { paymentMethod }
        );
        return response.data.data;
    }

    // Obter minhas compras de pacotes
    async getMyPackagePurchases(filter?: {
        status?: string;
        serviceId?: string;
        businessId?: string;
    }): Promise<PackagePurchase[]> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<ApiResponse<PackagePurchase[]>>(
            `${this.baseUrl}/packages/my-purchases?${params.toString()}`
        );

        return response.data.data;
    }

    // Usar sessão do pacote
    async usePackageSession(packagePurchaseId: string, appointmentId: string, professionalId: string): Promise<PackagePurchase> {
        const response = await apiUtils.post<ApiResponse<PackagePurchase>>(
            `${this.baseUrl}/packages/use-session`,
            { packagePurchaseId, appointmentId, professionalId }
        );
        return response.data.data;
    }

    // Utilities para Pacotes
    calculatePackageDiscount(packagePrice: number, individualPrice: number, sessions: number): number {
        const regularPrice = individualPrice * sessions;
        return ((regularPrice - packagePrice) / regularPrice) * 100;
    }

    formatPackageDiscount(discountPercentage: number): string {
        return `${discountPercentage.toFixed(0)}% OFF`;
    }

    getPackageSavings(packagePrice: number, individualPrice: number, sessions: number): number {
        const regularPrice = individualPrice * sessions;
        return regularPrice - packagePrice;
    }

    formatPackageSavings(savings: number): string {
        return `Economize ${this.formatPrice(savings)}`;
    }

    isPackageExpired(packagePurchase: PackagePurchase): boolean {
        return new Date(packagePurchase.expirationDate) < new Date();
    }

    getPackageExpirationDays(packagePurchase: PackagePurchase): number {
        const now = new Date();
        const expiration = new Date(packagePurchase.expirationDate);
        const diffTime = expiration.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getPackageUsagePercentage(packagePurchase: PackagePurchase): number {
        const used = packagePurchase.sessionsIncluded - packagePurchase.sessionsRemaining;
        return (used / packagePurchase.sessionsIncluded) * 100;
    }

    getPackageStatusLabel(status: PackagePurchase['status']): string {
        const labels = {
            active: 'Ativo',
            expired: 'Expirado',
            used: 'Utilizado',
            cancelled: 'Cancelado',
            refunded: 'Reembolsado'
        };
        return labels[status];
    }

    getPackageStatusColor(status: PackagePurchase['status']): string {
        const colors = {
            active: 'text-green-600',
            expired: 'text-red-600',
            used: 'text-gray-600',
            cancelled: 'text-orange-600',
            refunded: 'text-blue-600'
        };
        return colors[status];
    }

    canUsePackage(packagePurchase: PackagePurchase): boolean {
        return packagePurchase.status === 'active' &&
            packagePurchase.sessionsRemaining > 0 &&
            !this.isPackageExpired(packagePurchase);
    }

    // Utilities
    formatPrice(price: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes}min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return hours === 1 ? '1h' : `${hours}h`;
        }

        return `${hours}h${remainingMinutes.toString().padStart(2, '0')}min`;
    }

    formatDurationLong(minutes: number): string {
        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        }

        const hoursText = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        const minutesText = `${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`;
        return `${hoursText} e ${minutesText}`;
    }

    calculateEndTime(startTime: string, duration: number): string {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + duration;

        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;

        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    }

    formatPriceRange(services: Service[]): string {
        if (services.length === 0) return 'Preços não disponíveis';

        const prices = services.map(s => s.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return this.formatPrice(minPrice);
        }

        return `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)}`;
    }

    formatDurationRange(services: Service[]): string {
        if (services.length === 0) return 'Duração não disponível';

        const durations = services.map(s => s.duration);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);

        if (minDuration === maxDuration) {
            return this.formatDuration(minDuration);
        }

        return `${this.formatDuration(minDuration)} - ${this.formatDuration(maxDuration)}`;
    }

    getDepositInfo(service: Service): string {
        if (!service.requiresDeposit) return 'Sem entrada';

        if (service.depositAmount) {
            return `Entrada: ${this.formatPrice(service.depositAmount)}`;
        }

        return 'Entrada obrigatória';
    }

    getCancelationInfo(service: Service): string {
        if (!service.allowCancelation) return 'Cancelamento não permitido';

        if (service.cancelationDeadline) {
            const hours = service.cancelationDeadline;
            if (hours < 24) {
                return `Cancelamento até ${hours}h antes`;
            }
            const days = Math.floor(hours / 24);
            return `Cancelamento até ${days} ${days === 1 ? 'dia' : 'dias'} antes`;
        }

        return 'Cancelamento permitido';
    }

    getBookingAdvanceInfo(service: Service): string {
        const minText = service.minAdvanceBooking
            ? `mín. ${service.minAdvanceBooking}h`
            : 'sem mínimo';

        const maxText = service.maxAdvanceBooking
            ? `máx. ${service.maxAdvanceBooking}d`
            : 'sem máximo';

        return `Agendamento: ${minText}, ${maxText}`;
    }

    canBookService(service: Service, appointmentDate: Date): { canBook: boolean; reason?: string } {
        const now = new Date();
        const diffInMs = appointmentDate.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;

        // Verificar antecedência mínima
        if (service.minAdvanceBooking && diffInHours < service.minAdvanceBooking) {
            return {
                canBook: false,
                reason: `Agendamento deve ser feito com pelo menos ${service.minAdvanceBooking}h de antecedência`
            };
        }

        // Verificar antecedência máxima
        if (service.maxAdvanceBooking && diffInDays > service.maxAdvanceBooking) {
            return {
                canBook: false,
                reason: `Agendamento deve ser feito com no máximo ${service.maxAdvanceBooking} dias de antecedência`
            };
        }

        return { canBook: true };
    }

    canCancelAppointment(service: Service, appointmentDate: Date): { canCancel: boolean; reason?: string } {
        if (!service.allowCancelation) {
            return { canCancel: false, reason: 'Cancelamento não permitido para este serviço' };
        }

        if (service.cancelationDeadline) {
            const now = new Date();
            const diffInMs = appointmentDate.getTime() - now.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours < service.cancelationDeadline) {
                return {
                    canCancel: false,
                    reason: `Cancelamento deve ser feito com pelo menos ${service.cancelationDeadline}h de antecedência`
                };
            }
        }

        return { canCancel: true };
    }

    getServiceProfessionals(service: Service): string[] {
        return service.professionals?.map(prof =>
            `${prof.user.firstName} ${prof.user.lastName}`
        ) || [];
    }

    formatRating(service: Service): string {
        if (!service.averageRating || !service.totalReviews) {
            return 'Sem avaliações';
        }

        const reviewText = service.totalReviews === 1 ? 'avaliação' : 'avaliações';
        return `${service.averageRating.toFixed(1)} ⭐ (${service.totalReviews} ${reviewText})`;
    }

    getStatusColor(service: Service): string {
        return service.isActive ? 'text-green-600' : 'text-red-600';
    }

    getStatusLabel(service: Service): string {
        return service.isActive ? 'Ativo' : 'Inativo';
    }

    getCategoryIcon(category?: string): string {
        if (!category) return '⚙️';

        const icons: Record<string, string> = {
            'corte': '✂️',
            'coloracao': '🎨',
            'manicure': '💅',
            'pedicure': '🦶',
            'sobrancelha': '👁️',
            'barba': '🧔',
            'massagem': '🤲',
            'facial': '😊',
            'depilacao': '🪒',
            'maquiagem': '💄',
            'penteado': '💇‍♀️',
            'tratamento': '✨',
        };

        return icons[category.toLowerCase()] || '⚙️';
    }

    sortServicesByPopularity(services: Service[]): Service[] {
        return [...services].sort((a, b) => {
            const aBookings = a.totalBookings || 0;
            const bBookings = b.totalBookings || 0;
            return bBookings - aBookings;
        });
    }

    sortServicesByPrice(services: Service[], order: 'asc' | 'desc' = 'asc'): Service[] {
        return [...services].sort((a, b) => {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        });
    }

    sortServicesByDuration(services: Service[], order: 'asc' | 'desc' = 'asc'): Service[] {
        return [...services].sort((a, b) => {
            return order === 'asc' ? a.duration - b.duration : b.duration - a.duration;
        });
    }

    filterServicesByPriceRange(services: Service[], minPrice?: number, maxPrice?: number): Service[] {
        return services.filter(service => {
            if (minPrice !== undefined && service.price < minPrice) return false;
            if (maxPrice !== undefined && service.price > maxPrice) return false;
            return true;
        });
    }

    filterServicesByMaxDuration(services: Service[], maxDuration?: number): Service[] {
        if (!maxDuration) return services;
        return services.filter(service => service.duration <= maxDuration);
    }
}

export const serviceService = new ServiceService();
export default serviceService;