import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// === INTERFACES PARA AGENDAMENTO EM LOTE ===
export interface BulkAppointment {
    _id: string;
    customerId: string;
    businessId: string;
    requestId: string;
    appointments: {
        serviceId: string;
        professionalId?: string;
        date: string;
        startTime: string;
        endTime?: string;
        notes?: string;
        status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
        appointmentId?: string;
        failureReason?: string;
    }[];
    totalAppointments: number;
    successfulAppointments: number;
    failedAppointments: number;
    totalPrice: number;
    status: 'pending' | 'processing' | 'completed' | 'partially_failed' | 'failed';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
    createdAt: string;
    updatedAt: string;
}

export interface BulkAppointmentRequest {
    businessId: string;
    appointments: {
        serviceId: string;
        professionalId?: string;
        date: string;
        startTime: string;
        notes?: string;
    }[];
    paymentMethod?: string;
    autoConfirm?: boolean;
    allowPartial?: boolean;
}

export interface AvailabilityCheck {
    date: string;
    startTime: string;
    serviceId: string;
    professionalId?: string;
    isAvailable: boolean;
    conflicts?: string[];
    suggestedTimes?: string[];
}

export interface BulkAvailabilityRequest {
    businessId: string;
    appointments: {
        serviceId: string;
        professionalId?: string;
        date: string;
        startTime: string;
    }[];
}

export interface BulkAvailabilityResponse {
    requestId: string;
    results: AvailabilityCheck[];
    hasConflicts: boolean;
    availableCount: number;
    conflictCount: number;
    suggestedAlternatives?: {
        date: string;
        times: string[];
        serviceId: string;
        professionalId?: string;
    }[];
}

export interface Appointment {
    _id: string;
    customerId: string;
    businessId: string;
    professionalId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    notes?: string;
    totalPrice: number;
    paymentStatus?: 'pending' | 'paid' | 'refunded';
    reminderSent?: boolean;
    canceledAt?: string;
    cancelationReason?: string;
    createdAt: string;
    updatedAt: string;

    // Dados relacionados (populados)
    customer?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };

    business?: {
        _id: string;
        name: string;
        category?: string;
    };

    professional?: {
        _id: string;
        user: {
            firstName: string;
            lastName: string;
            avatar?: string;
        };
    };

    service?: {
        _id: string;
        name: string;
        duration: number;
        price: number;
        category?: string;
    };
}

export interface CreateAppointmentDto {
    customerId: string;
    businessId: string;
    professionalId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes?: string;
}

export interface UpdateAppointmentDto {
    date?: string;
    startTime?: string;
    status?: Appointment['status'];
    notes?: string;
    professionalId?: string;
}

export interface AppointmentFilter {
    businessId?: string;
    customerId?: string;
    professionalId?: string;
    serviceId?: string;
    status?: string;
    paymentStatus?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    search?: string; // busca por nome do cliente
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'startTime' | 'createdAt' | 'totalPrice';
    sortOrder?: 'asc' | 'desc';
}

export interface AppointmentStats {
    total: number;
    byStatus: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        no_show: number;
    };
    byPaymentStatus: {
        pending: number;
        paid: number;
        refunded: number;
    };
    totalRevenue: number;
    averageTicket: number;
    completionRate: number;
    cancelationRate: number;
    noShowRate: number;
}

export interface TimeSlot {
    time: string;
    available: boolean;
    professionalId?: string;
}

class AppointmentService {
    private baseUrl = '/appointments';

    // Criar agendamento
    async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
        const response = await apiUtils.post<ApiResponse<Appointment>>(this.baseUrl, data);
        return response.data.data;
    }

    // Listar agendamentos
    async getAppointments(filter?: AppointmentFilter): Promise<PaginatedResponse<Appointment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Appointment>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter agendamento por ID
    async getAppointmentById(id: string): Promise<Appointment> {
        const response = await apiUtils.get<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Atualizar agendamento
    async updateAppointment(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Cancelar agendamento
    async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(
            `${this.baseUrl}/${id}/cancel`,
            { reason }
        );
        return response.data.data;
    }

    // Confirmar agendamento
    async confirmAppointment(id: string): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(
            `${this.baseUrl}/${id}/confirm`
        );
        return response.data.data;
    }

    // Completar agendamento
    async completeAppointment(id: string): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(
            `${this.baseUrl}/${id}/complete`
        );
        return response.data.data;
    }

    // Marcar como falta
    async markNoShow(id: string): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(
            `${this.baseUrl}/${id}/no-show`
        );
        return response.data.data;
    }

    // Obter meus agendamentos (cliente)
    async getMyAppointments(filter?: Omit<AppointmentFilter, 'customerId'>): Promise<PaginatedResponse<Appointment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Appointment>>(
            `${this.baseUrl}/my-appointments?${params.toString()}`
        );

        return response.data;
    }

    // Obter agendamentos do profissional
    async getProfessionalAppointments(professionalId: string, filter?: Omit<AppointmentFilter, 'professionalId'>): Promise<PaginatedResponse<Appointment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Appointment>>(
            `${this.baseUrl}/professional/${professionalId}?${params.toString()}`
        );

        return response.data;
    }

    // Obter agendamentos do negócio
    async getBusinessAppointments(businessId: string, filter?: Omit<AppointmentFilter, 'businessId'>): Promise<PaginatedResponse<Appointment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Appointment>>(
            `${this.baseUrl}/business/${businessId}?${params.toString()}`
        );

        return response.data;
    }

    // Obter horários disponíveis
    async getAvailableSlots(
        businessId: string,
        serviceId: string,
        date: string,
        professionalId?: string
    ): Promise<TimeSlot[]> {
        const params = new URLSearchParams({
            businessId,
            serviceId,
            date,
        });

        if (professionalId) {
            params.append('professionalId', professionalId);
        }

        const response = await apiUtils.get<ApiResponse<TimeSlot[]>>(
            `${this.baseUrl}/available-slots?${params.toString()}`
        );

        return response.data.data;
    }

    // Verificar conflitos de horário
    async checkTimeConflict(
        professionalId: string,
        date: string,
        startTime: string,
        duration: number,
        excludeAppointmentId?: string
    ): Promise<{ hasConflict: boolean; conflictingAppointment?: Appointment }> {
        const params = new URLSearchParams({
            professionalId,
            date,
            startTime,
            duration: String(duration),
        });

        if (excludeAppointmentId) {
            params.append('excludeAppointmentId', excludeAppointmentId);
        }

        const response = await apiUtils.get<ApiResponse<{ hasConflict: boolean; conflictingAppointment?: Appointment }>>(
            `${this.baseUrl}/check-conflict?${params.toString()}`
        );

        return response.data.data;
    }

    // Obter estatísticas
    async getAppointmentStats(businessId?: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<AppointmentStats> {
        const params = new URLSearchParams();

        if (businessId) {
            params.append('businessId', businessId);
        }

        if (period) {
            params.append('period', period);
        }

        const response = await apiUtils.get<ApiResponse<AppointmentStats>>(
            `${this.baseUrl}/stats?${params.toString()}`
        );

        return response.data.data;
    }

    // Reagendar agendamento
    async rescheduleAppointment(
        appointmentId: string,
        newDate: string,
        newStartTime: string,
        newProfessionalId?: string
    ): Promise<Appointment> {
        const response = await apiUtils.patch<ApiResponse<Appointment>>(
            `${this.baseUrl}/${appointmentId}/reschedule`,
            {
                date: newDate,
                startTime: newStartTime,
                professionalId: newProfessionalId
            }
        );
        return response.data.data;
    }

    // Enviar lembrete
    async sendReminder(appointmentId: string): Promise<void> {
        await apiUtils.post(`${this.baseUrl}/${appointmentId}/send-reminder`);
    }

    // Obter próximos agendamentos
    async getUpcomingAppointments(businessId?: string, limit = 5): Promise<Appointment[]> {
        const params = new URLSearchParams({
            status: 'confirmed',
            sortBy: 'date,startTime',
            sortOrder: 'asc',
            limit: String(limit),
        });

        if (businessId) {
            params.append('businessId', businessId);
        }

        const today = new Date().toISOString().split('T')[0];
        params.append('startDate', today);

        const response = await apiUtils.get<PaginatedResponse<Appointment>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data.data;
    }

    // Utilities
    getStatusLabel(status: Appointment['status']): string {
        const labels = {
            pending: 'Pendente',
            confirmed: 'Confirmado',
            completed: 'Concluído',
            cancelled: 'Cancelado',
            no_show: 'Não compareceu'
        };
        return labels[status];
    }

    getStatusColor(status: Appointment['status']): string {
        const colors = {
            pending: 'text-yellow-600',
            confirmed: 'text-blue-600',
            completed: 'text-green-600',
            cancelled: 'text-red-600',
            no_show: 'text-gray-600'
        };
        return colors[status];
    }

    getStatusBadgeColor(status: Appointment['status']): string {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            no_show: 'bg-gray-100 text-gray-800'
        };
        return colors[status];
    }

    getPaymentStatusLabel(paymentStatus?: Appointment['paymentStatus']): string {
        if (!paymentStatus) return 'Não definido';

        const labels = {
            pending: 'Pendente',
            paid: 'Pago',
            refunded: 'Reembolsado'
        };
        return labels[paymentStatus];
    }

    getPaymentStatusColor(paymentStatus?: Appointment['paymentStatus']): string {
        if (!paymentStatus) return 'text-gray-500';

        const colors = {
            pending: 'text-yellow-600',
            paid: 'text-green-600',
            refunded: 'text-blue-600'
        };
        return colors[paymentStatus];
    }

    formatDateTime(appointment: Appointment): string {
        const date = new Date(appointment.date);
        const dateStr = date.toLocaleDateString('pt-BR');
        return `${dateStr} às ${appointment.startTime}`;
    }

    formatDate(appointment: Appointment): string {
        const date = new Date(appointment.date);
        return date.toLocaleDateString('pt-BR');
    }

    formatTime(appointment: Appointment): string {
        return `${appointment.startTime} - ${appointment.endTime}`;
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    getCustomerName(appointment: Appointment): string {
        if (appointment.customer) {
            return `${appointment.customer.firstName} ${appointment.customer.lastName}`;
        }
        return 'Cliente não identificado';
    }

    getProfessionalName(appointment: Appointment): string {
        if (appointment.professional?.user) {
            return `${appointment.professional.user.firstName} ${appointment.professional.user.lastName}`;
        }
        return 'Profissional não identificado';
    }

    getServiceName(appointment: Appointment): string {
        return appointment.service?.name || 'Serviço não identificado';
    }

    getBusinessName(appointment: Appointment): string {
        return appointment.business?.name || 'Negócio não identificado';
    }

    getDuration(appointment: Appointment): string {
        const duration = appointment.service?.duration || 0;
        if (duration < 60) {
            return `${duration}min`;
        }

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (minutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h${minutes.toString().padStart(2, '0')}min`;
    }

    isUpcoming(appointment: Appointment): boolean {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.startTime}`);
        return appointmentDateTime > new Date();
    }

    isPast(appointment: Appointment): boolean {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.endTime}`);
        return appointmentDateTime < new Date();
    }

    isToday(appointment: Appointment): boolean {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointmentDate.toDateString() === today.toDateString();
    }

    canCancel(appointment: Appointment): boolean {
        return ['pending', 'confirmed'].includes(appointment.status) && this.isUpcoming(appointment);
    }

    canConfirm(appointment: Appointment): boolean {
        return appointment.status === 'pending' && this.isUpcoming(appointment);
    }

    canComplete(appointment: Appointment): boolean {
        return appointment.status === 'confirmed' && !this.isUpcoming(appointment);
    }

    canReschedule(appointment: Appointment): boolean {
        return ['pending', 'confirmed'].includes(appointment.status) && this.isUpcoming(appointment);
    }

    getTimeUntilAppointment(appointment: Appointment): string {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.startTime}`);
        const now = new Date();
        const diffInMs = appointmentDateTime.getTime() - now.getTime();

        if (diffInMs <= 0) return 'Já passou';

        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;

        if (diffInDays >= 1) {
            const days = Math.floor(diffInDays);
            return `${days} ${days === 1 ? 'dia' : 'dias'}`;
        }

        if (diffInHours >= 1) {
            const hours = Math.floor(diffInHours);
            return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        }

        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    sortAppointmentsByDateTime(appointments: Appointment[]): Appointment[] {
        return [...appointments].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateA.getTime() - dateB.getTime();
        });
    }

    filterAppointmentsByStatus(appointments: Appointment[], status: Appointment['status'][]): Appointment[] {
        return appointments.filter(appointment => status.includes(appointment.status));
    }

    filterAppointmentsByDate(appointments: Appointment[], startDate?: string, endDate?: string): Appointment[] {
        return appointments.filter(appointment => {
            if (startDate && appointment.date < startDate) return false;
            if (endDate && appointment.date > endDate) return false;
            return true;
        });
    }

    groupAppointmentsByDate(appointments: Appointment[]): Record<string, Appointment[]> {
        return appointments.reduce((groups, appointment) => {
            const date = appointment.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(appointment);
            return groups;
        }, {} as Record<string, Appointment[]>);
    }

    calculateRevenue(appointments: Appointment[]): number {
        return appointments
            .filter(appointment => appointment.status === 'completed')
            .reduce((total, appointment) => total + appointment.totalPrice, 0);
    }

    calculateCompletionRate(appointments: Appointment[]): number {
        if (appointments.length === 0) return 0;

        const completedCount = appointments.filter(appointment => appointment.status === 'completed').length;
        return Math.round((completedCount / appointments.length) * 100);
    }

    calculateCancelationRate(appointments: Appointment[]): number {
        if (appointments.length === 0) return 0;

        const canceledCount = appointments.filter(appointment => appointment.status === 'cancelled').length;
        return Math.round((canceledCount / appointments.length) * 100);
    }

    calculateNoShowRate(appointments: Appointment[]): number {
        if (appointments.length === 0) return 0;

        const noShowCount = appointments.filter(appointment => appointment.status === 'no_show').length;
        return Math.round((noShowCount / appointments.length) * 100);
    }

    // === MÉTODOS PARA AGENDAMENTO EM LOTE ===

    // Verificar disponibilidade para múltiplos agendamentos
    async checkBulkAvailability(data: BulkAvailabilityRequest): Promise<BulkAvailabilityResponse> {
        const response = await apiUtils.post<ApiResponse<BulkAvailabilityResponse>>(
            `${this.baseUrl}/bulk/availability-check`,
            data
        );
        return response.data.data;
    }

    // Criar agendamentos em lote
    async createBulkAppointments(data: BulkAppointmentRequest): Promise<BulkAppointment> {
        const response = await apiUtils.post<ApiResponse<BulkAppointment>>(
            `${this.baseUrl}/bulk`,
            data
        );
        return response.data.data;
    }

    // Obter agendamento em lote por ID
    async getBulkAppointmentById(id: string): Promise<BulkAppointment> {
        const response = await apiUtils.get<ApiResponse<BulkAppointment>>(`${this.baseUrl}/bulk/${id}`);
        return response.data.data;
    }

    // Listar agendamentos em lote
    async getBulkAppointments(filter?: {
        businessId?: string;
        customerId?: string;
        status?: string;
        paymentStatus?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<BulkAppointment>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<BulkAppointment>>(
            `${this.baseUrl}/bulk?${params.toString()}`
        );

        return response.data;
    }

    // Cancelar agendamento em lote
    async cancelBulkAppointment(id: string, reason?: string): Promise<BulkAppointment> {
        const response = await apiUtils.patch<ApiResponse<BulkAppointment>>(
            `${this.baseUrl}/bulk/${id}/cancel`,
            { reason }
        );
        return response.data.data;
    }

    // Processar agendamento em lote pendente
    async processBulkAppointment(id: string): Promise<BulkAppointment> {
        const response = await apiUtils.post<ApiResponse<BulkAppointment>>(
            `${this.baseUrl}/bulk/${id}/process`
        );
        return response.data.data;
    }

    // === UTILITIES PARA AGENDAMENTO EM LOTE ===

    getBulkStatusLabel(status: BulkAppointment['status']): string {
        const labels = {
            pending: 'Pendente',
            processing: 'Processando',
            completed: 'Completo',
            partially_failed: 'Parcialmente Falhou',
            failed: 'Falhou'
        };
        return labels[status];
    }

    getBulkStatusColor(status: BulkAppointment['status']): string {
        const colors = {
            pending: 'text-yellow-600',
            processing: 'text-blue-600',
            completed: 'text-green-600',
            partially_failed: 'text-orange-600',
            failed: 'text-red-600'
        };
        return colors[status];
    }

    getBulkSuccessRate(bulk: BulkAppointment): number {
        return Math.round((bulk.successfulAppointments / bulk.totalAppointments) * 100);
    }

    getBulkFailureRate(bulk: BulkAppointment): number {
        return Math.round((bulk.failedAppointments / bulk.totalAppointments) * 100);
    }

    formatBulkSummary(bulk: BulkAppointment): string {
        return `${bulk.successfulAppointments}/${bulk.totalAppointments} agendamentos realizados`;
    }

    hasBulkConflicts(availability: BulkAvailabilityResponse): boolean {
        return availability.hasConflicts || availability.conflictCount > 0;
    }

    getBulkConflictCount(availability: BulkAvailabilityResponse): number {
        return availability.results.filter(result => !result.isAvailable).length;
    }

    getBulkAvailableCount(availability: BulkAvailabilityResponse): number {
        return availability.results.filter(result => result.isAvailable).length;
    }

    formatBulkAvailability(availability: BulkAvailabilityResponse): string {
        const available = this.getBulkAvailableCount(availability);
        const total = availability.results.length;
        return `${available}/${total} horários disponíveis`;
    }

    groupBulkAppointmentsByDate(bulk: BulkAppointment): Record<string, typeof bulk.appointments> {
        return bulk.appointments.reduce((acc, appointment) => {
            const date = appointment.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(appointment);
            return acc;
        }, {} as Record<string, typeof bulk.appointments>);
    }

    groupBulkAppointmentsByStatus(bulk: BulkAppointment): Record<string, typeof bulk.appointments> {
        return bulk.appointments.reduce((acc, appointment) => {
            const status = appointment.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(appointment);
            return acc;
        }, {} as Record<string, typeof bulk.appointments>);
    }

    canRetryBulkAppointment(bulk: BulkAppointment): boolean {
        return ['failed', 'partially_failed'].includes(bulk.status) &&
            bulk.failedAppointments > 0;
    }

    canCancelBulkAppointment(bulk: BulkAppointment): boolean {
        return ['pending', 'processing'].includes(bulk.status);
    }

    getFailedAppointments(bulk: BulkAppointment): typeof bulk.appointments {
        return bulk.appointments.filter(app => app.status === 'failed');
    }

    getSuccessfulAppointments(bulk: BulkAppointment): typeof bulk.appointments {
        return bulk.appointments.filter(app => ['confirmed', 'pending'].includes(app.status));
    }

    calculateBulkTotalDuration(appointments: BulkAppointmentRequest['appointments']): number {
        // Esta função precisaria das informações dos serviços para calcular a duração total
        // Por enquanto, retorna 0 como placeholder
        return 0;
    }

    validateBulkAppointmentTimes(appointments: BulkAppointmentRequest['appointments']): string[] {
        const errors: string[] = [];

        appointments.forEach((appointment, index) => {
            const date = new Date(appointment.date);
            const now = new Date();

            // Verificar se a data não é no passado
            if (date < now) {
                errors.push(`Agendamento ${index + 1}: Data não pode ser no passado`);
            }

            // Verificar formato do horário
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(appointment.startTime)) {
                errors.push(`Agendamento ${index + 1}: Formato de horário inválido`);
            }
        });

        return errors;
    }

    optimizeBulkAppointmentSchedule(appointments: BulkAppointmentRequest['appointments']): BulkAppointmentRequest['appointments'] {
        // Ordenar por data e depois por horário para otimizar o agendamento
        return [...appointments].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }

            return a.startTime.localeCompare(b.startTime);
        });
    }
}

export const appointmentService = new AppointmentService();
export default appointmentService;