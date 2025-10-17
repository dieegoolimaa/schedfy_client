import { apiUtils } from './api';

// Interfaces de Auth
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'customer' | 'professional' | 'business_owner' | 'admin';
    planType?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'professional' | 'business_owner' | 'admin' | 'platform_admin';
    planType?: string;
    businessId?: string;
    professionalId?: string;
    isEmailVerified: boolean;
    isActive: boolean;
    phone?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}

export interface UpdateProfileDto {
    name?: string;
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
        const response = await apiUtils.post<AuthResponse>(
            `${this.baseUrl}/login`,
            credentials
        );

        const authData = response.data;
        this.setAuthData(authData);

        return authData;
    }

    // Register (returns email verification response, not auth tokens)
    async register(userData: RegisterDto): Promise<{ message: string; email: string; expiresAt: Date }> {
        const response = await apiUtils.post<{ message: string; email: string; expiresAt: Date }>(
            `${this.baseUrl}/register`,
            userData
        );

        return response.data;
    }

    // Verify Email (called after registration with verification code)
    async verifyEmailWithCode(email: string, code: string): Promise<AuthResponse> {
        const response = await apiUtils.post<AuthResponse>(
            `${this.baseUrl}/verify-email`,
            { email, code }
        );

        const authData = response.data;
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

        const response = await apiUtils.post<AuthResponse>(
            `${this.baseUrl}/refresh`,
            { refresh_token: refreshToken }
        );

        const authData = response.data;
        this.setAuthData(authData);

        return authData;
    }

    // Get Current User Profile
    async getProfile(): Promise<User> {
        const response = await apiUtils.get<User>(`${this.baseUrl}/profile`);

        const user = response.data;
        this.setUser(user);

        return user;
    }

    // Update Profile
    async updateProfile(data: UpdateProfileDto): Promise<User> {
        const response = await apiUtils.patch<User>(
            `${this.baseUrl}/profile`,
            data
        );

        const user = response.data;
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

    // Resend Email Verification
    async resendEmailVerification(email: string): Promise<{ message: string; email: string }> {
        const response = await apiUtils.post<{ message: string; email: string }>(
            `${this.baseUrl}/resend-verification`,
            { email }
        );
        return response.data;
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

    // Alias público para clearAuthData
    clearTokens(): void {
        this.clearAuthData();
    }

    // Utilities
    getFullName(): string {
        const user = this.getCurrentUser();
        return user?.name || '';
    }

    getUserInitials(): string {
        const user = this.getCurrentUser();
        if (!user?.name) return '';

        const nameParts = user.name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].substring(0, 2).toUpperCase();
        }
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
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