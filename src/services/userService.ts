import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Users
export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'professional' | 'business_owner';
    businessId?: string;
    professionalData?: {
        specialties: string[];
        bio?: string;
        experience?: number;
        availability?: any;
    };
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    isActive?: boolean;
}

export interface UserFilter {
    role?: string;
    isActive?: boolean;
    businessId?: string;
    search?: string; // busca por nome ou email
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'firstName' | 'lastName' | 'email';
    sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    byRole: {
        customer: number;
        professional: number;
        business_owner: number;
        admin: number;
    };
    recentRegistrations: number; // últimos 30 dias
}

export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'customer' | 'professional' | 'business_owner' | 'admin' | 'platform_admin';
    isActive: boolean;
    isEmailVerified: boolean;
    avatar?: string;

    // Relacionamentos
    businessId?: string;
    business?: {
        _id: string;
        name: string;
        category?: string;
    };

    professionalProfile?: {
        _id: string;
        specialties: string[];
        bio?: string;
        experience?: number;
        rating?: number;
        totalReviews?: number;
    };

    // Metadata
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

class UserService {
    private baseUrl = '/users';

    // Criar usuário (admin)
    async createUser(data: CreateUserDto): Promise<User> {
        const response = await apiUtils.post<ApiResponse<User>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar usuários
    async getUsers(filter?: UserFilter): Promise<PaginatedResponse<User>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<User>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter usuário por ID
    async getUserById(id: string): Promise<User> {
        const response = await apiUtils.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Atualizar usuário
    async updateUser(id: string, data: UpdateUserDto): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Deletar usuário (soft delete)
    async deleteUser(id: string): Promise<void> {
        await apiUtils.delete(`${this.baseUrl}/${id}`);
    }

    // Ativar/Desativar usuário
    async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/${id}/status`,
            { isActive }
        );
        return response.data.data;
    }

    // Obter estatísticas de usuários
    async getUserStats(): Promise<UserStats> {
        const response = await apiUtils.get<ApiResponse<UserStats>>(`${this.baseUrl}/stats`);
        return response.data.data;
    }

    // Buscar usuários por email/nome
    async searchUsers(query: string, limit = 10): Promise<User[]> {
        const params = new URLSearchParams({
            search: query,
            limit: String(limit),
        });

        const response = await apiUtils.get<ApiResponse<User[]>>(
            `${this.baseUrl}/search?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter profissionais disponíveis
    async getAvailableProfessionals(businessId?: string): Promise<User[]> {
        const params = new URLSearchParams({
            role: 'professional',
            isActive: 'true',
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const response = await apiUtils.get<PaginatedResponse<User>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter clientes de um negócio
    async getBusinessCustomers(businessId: string, filter?: Omit<UserFilter, 'businessId'>): Promise<PaginatedResponse<User>> {
        const params = new URLSearchParams({
            businessId,
            role: 'customer',
        });

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<User>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Criar perfil profissional para usuário existente
    async createProfessionalProfile(userId: string, data: {
        specialties: string[];
        bio?: string;
        experience?: number;
        availability?: any;
    }): Promise<User> {
        const response = await apiUtils.post<ApiResponse<User>>(
            `${this.baseUrl}/${userId}/professional-profile`,
            data
        );
        return response.data.data;
    }

    // Atualizar perfil profissional
    async updateProfessionalProfile(userId: string, data: {
        specialties?: string[];
        bio?: string;
        experience?: number;
        availability?: any;
    }): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/${userId}/professional-profile`,
            data
        );
        return response.data.data;
    }

    // Associar usuário a um negócio
    async assignToBusiness(userId: string, businessId: string): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/${userId}/assign-business`,
            { businessId }
        );
        return response.data.data;
    }

    // Remover usuário de um negócio
    async removeFromBusiness(userId: string): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/${userId}/remove-business`
        );
        return response.data.data;
    }

    // Resetar senha (admin)
    async resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
        const response = await apiUtils.post<ApiResponse<{ temporaryPassword: string }>>(
            `${this.baseUrl}/${userId}/reset-password`
        );
        return response.data.data;
    }

    // Verificar email de usuário (admin)
    async verifyUserEmail(userId: string): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/${userId}/verify-email`
        );
        return response.data.data;
    }

    // Obter histórico de atividades do usuário
    async getUserActivity(userId: string): Promise<any[]> {
        const response = await apiUtils.get<ApiResponse<any[]>>(
            `${this.baseUrl}/${userId}/activity`
        );
        return response.data.data;
    }

    // Utilities
    getFullName(user: User): string {
        return `${user.firstName} ${user.lastName}`;
    }

    getUserInitials(user: User): string {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }

    getRoleLabel(role: User['role']): string {
        const labels = {
            customer: 'Cliente',
            professional: 'Profissional',
            business_owner: 'Proprietário',
            admin: 'Administrador',
            platform_admin: 'Admin da Plataforma'
        };
        return labels[role];
    }

    getStatusLabel(isActive: boolean): string {
        return isActive ? 'Ativo' : 'Inativo';
    }

    getStatusColor(isActive: boolean): string {
        return isActive ? 'text-green-600' : 'text-red-600';
    }

    canUserManageBusiness(user: User): boolean {
        return ['business_owner', 'admin', 'platform_admin'].includes(user.role);
    }

    canUserManageUsers(user: User): boolean {
        return ['admin', 'platform_admin'].includes(user.role);
    }

    isProfessional(user: User): boolean {
        return user.role === 'professional';
    }

    isBusinessOwner(user: User): boolean {
        return user.role === 'business_owner';
    }

    formatLastLogin(lastLogin?: string): string {
        if (!lastLogin) return 'Nunca';

        const date = new Date(lastLogin);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Agora mesmo';
        if (diffInHours < 24) return `${diffInHours}h atrás`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d atrás`;

        return date.toLocaleDateString('pt-BR');
    }
}

export const userService = new UserService();
export default userService;