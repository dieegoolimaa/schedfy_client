import { apiUtils } from './api';
import type { ApiResponse } from './api';

// Interfaces de Auth
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'professional' | 'business_owner' | 'admin';
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

    // Profile específico por role
    professionalProfile?: {
        _id: string;
        specialties: string[];
        bio?: string;
        experience?: number;
    };

    businessProfile?: {
        _id: string;
        name: string;
        description?: string;
        category?: string;
    };

    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token?: string;
}

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}

class AuthService {
    private baseUrl = '/auth';
    private tokenKey = 'authToken';
    private refreshTokenKey = 'refreshToken';
    private userKey = 'currentUser';

    // Login
    async login(credentials: LoginDto): Promise<AuthResponse> {
        const response = await apiUtils.post<ApiResponse<AuthResponse>>(
            `${this.baseUrl}/login`,
            credentials
        );

        const authData = response.data.data;
        this.setAuthData(authData);

        return authData;
    }

    // Register
    async register(userData: RegisterDto): Promise<AuthResponse> {
        const response = await apiUtils.post<ApiResponse<AuthResponse>>(
            `${this.baseUrl}/register`,
            userData
        );

        const authData = response.data.data;
        this.setAuthData(authData);

        return authData;
    }

    // Logout
    async logout(): Promise<void> {
        try {
            await apiUtils.post(`${this.baseUrl}/logout`);
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            this.clearAuthData();
        }
    }

    // Refresh Token
    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiUtils.post<ApiResponse<AuthResponse>>(
            `${this.baseUrl}/refresh`,
            { refresh_token: refreshToken }
        );

        const authData = response.data.data;
        this.setAuthData(authData);

        return authData;
    }

    // Get Current User Profile
    async getProfile(): Promise<User> {
        const response = await apiUtils.get<ApiResponse<User>>(`${this.baseUrl}/profile`);

        const user = response.data.data;
        this.setUser(user);

        return user;
    }

    // Update Profile
    async updateProfile(data: UpdateProfileDto): Promise<User> {
        const response = await apiUtils.patch<ApiResponse<User>>(
            `${this.baseUrl}/profile`,
            data
        );

        const user = response.data.data;
        this.setUser(user);

        return user;
    }

    // Change Password
    async changePassword(data: ChangePasswordDto): Promise<void> {
        await apiUtils.patch(`${this.baseUrl}/change-password`, data);
    }

    // Forgot Password
    async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        await apiUtils.post(`${this.baseUrl}/forgot-password`, data);
    }

    // Reset Password
    async resetPassword(data: ResetPasswordDto): Promise<void> {
        await apiUtils.post(`${this.baseUrl}/reset-password`, data);
    }

    // Verify Email
    async verifyEmail(token: string): Promise<void> {
        await apiUtils.post(`${this.baseUrl}/verify-email`, { token });
    }

    // Resend Email Verification
    async resendEmailVerification(): Promise<void> {
        await apiUtils.post(`${this.baseUrl}/resend-verification`);
    }

    // Token Management
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    getCurrentUser(): User | null {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    hasRole(role: User['role']): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    hasAnyRole(roles: User['role'][]): boolean {
        const user = this.getCurrentUser();
        return user ? roles.includes(user.role) : false;
    }

    private setAuthData(authData: AuthResponse): void {
        localStorage.setItem(this.tokenKey, authData.access_token);

        if (authData.refresh_token) {
            localStorage.setItem(this.refreshTokenKey, authData.refresh_token);
        }

        this.setUser(authData.user);
    }

    private setUser(user: User): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));

        // Dispara evento personalizado para atualizar componentes
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);

        // Dispara evento de logout
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // Utilities
    getFullName(): string {
        const user = this.getCurrentUser();
        return user ? `${user.firstName} ${user.lastName}` : '';
    }

    getUserInitials(): string {
        const user = this.getCurrentUser();
        return user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';
    }

    isProfessional(): boolean {
        return this.hasRole('professional');
    }

    isBusinessOwner(): boolean {
        return this.hasRole('business_owner');
    }

    isAdmin(): boolean {
        return this.hasAnyRole(['admin', 'platform_admin']);
    }

    canManageBusiness(): boolean {
        return this.hasAnyRole(['business_owner', 'admin', 'platform_admin']);
    }

    canManageProfessionals(): boolean {
        return this.hasAnyRole(['business_owner', 'admin', 'platform_admin']);
    }
}

export const authService = new AuthService();
export default authService;