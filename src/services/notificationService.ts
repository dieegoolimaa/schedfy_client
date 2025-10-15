import { apiUtils } from './api';
import type { ApiResponse, PaginatedResponse } from './api';

// Interfaces para Notificações
export interface Notification {
    _id: string;
    type: 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLATION' |
    'PAYMENT_CONFIRMATION' | 'PAYMENT_FAILED' | 'BUSINESS_ANNOUNCEMENT' |
    'SYSTEM_ALERT' | 'MARKETING' | 'FEEDBACK_REQUEST' | 'OTHER';
    channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
    title: string;
    content: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';

    // Destinatário
    userId?: string;
    email?: string;
    phone?: string;
    recipientName?: string;

    // Configurações específicas por canal
    emailConfig?: {
        subject?: string;
        htmlContent?: string;
        replyTo?: string;
        cc?: string[];
        bcc?: string[];
        attachments?: string[];
    };

    smsConfig?: {
        from?: string;
    };

    whatsappConfig?: {
        mediaUrl?: string;
        mediaType?: 'image' | 'video' | 'audio' | 'document';
    };

    // Agendamento e tentativas
    scheduledFor?: string;
    sentAt?: string;
    deliveredAt?: string;
    retryCount: number;
    maxRetries: number;
    nextRetryAt?: string;
    errors?: string[];

    // Relacionamentos
    businessId?: string;
    professionalId?: string;
    appointmentId?: string;
    serviceId?: string;

    // Resposta do provedor
    externalId?: string;
    providerResponse?: any;
    metadata?: any;

    createdAt: string;
    updatedAt: string;
}

export interface NotificationTemplate {
    _id: string;
    name: string;
    type: Notification['type'];
    channel: Notification['channel'];
    titleTemplate: string;
    contentTemplate: string;
    variables?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNotificationDto {
    type: Notification['type'];
    channel: Notification['channel'];
    title: string;
    content: string;

    // Destinatário (pelo menos um deve ser fornecido)
    userId?: string;
    email?: string;
    phone?: string;
    recipientName?: string;

    // Opcionais
    priority?: Notification['priority'];
    scheduledFor?: string;
    maxRetries?: number;

    // Configurações por canal
    emailConfig?: Notification['emailConfig'];
    smsConfig?: Notification['smsConfig'];
    whatsappConfig?: Notification['whatsappConfig'];

    // Relacionamentos
    businessId?: string;
    professionalId?: string;
    appointmentId?: string;
    serviceId?: string;

    metadata?: any;
}

export interface BulkNotificationDto {
    notification: Omit<CreateNotificationDto, 'userId' | 'email' | 'phone' | 'recipientName'>;
    recipients: Array<{
        userId?: string;
        email?: string;
        phone?: string;
        name?: string;
        metadata?: any;
    }>;
}

export interface NotificationFilter {
    type?: Notification['type'];
    channel?: Notification['channel'];
    status?: Notification['status'];
    priority?: Notification['priority'];
    userId?: string;
    email?: string;
    businessId?: string;
    professionalId?: string;
    appointmentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'scheduledFor' | 'sentAt' | 'priority';
    sortOrder?: 'asc' | 'desc';
}

export interface NotificationStats {
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
    byChannel: {
        EMAIL: number;
        SMS: number;
        WHATSAPP: number;
    };
    byType: {
        [key in Notification['type']]: number;
    };
}

class NotificationService {
    private baseUrl = '/notifications';

    // Criar notificação
    async createNotification(data: CreateNotificationDto): Promise<Notification> {
        const response = await apiUtils.post<ApiResponse<Notification>>(this.baseUrl, data);
        return response.data.data;
    }

    // Criar notificações em lote
    async createBulkNotifications(data: BulkNotificationDto): Promise<Notification[]> {
        const response = await apiUtils.post<ApiResponse<Notification[]>>(`${this.baseUrl}/bulk`, data);
        return response.data.data;
    }

    // Listar notificações
    async getNotifications(filter?: NotificationFilter): Promise<PaginatedResponse<Notification>> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<PaginatedResponse<Notification>>(
            `${this.baseUrl}?${params.toString()}`
        );

        return response.data;
    }

    // Obter notificação por ID
    async getNotificationById(id: string): Promise<Notification> {
        const response = await apiUtils.get<ApiResponse<Notification>>(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    // Atualizar notificação
    async updateNotification(id: string, data: Partial<CreateNotificationDto>): Promise<Notification> {
        const response = await apiUtils.patch<ApiResponse<Notification>>(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    // Enviar notificação manualmente
    async sendNotification(id: string): Promise<{ success: boolean; message: string; error?: string }> {
        const response = await apiUtils.post<{ success: boolean; message: string; error?: string }>(
            `${this.baseUrl}/${id}/send`
        );
        return response.data;
    }

    // Obter estatísticas
    async getStats(filter?: Omit<NotificationFilter, 'page' | 'limit'>): Promise<NotificationStats> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await apiUtils.get<ApiResponse<NotificationStats>>(
            `${this.baseUrl}/stats/overview?${params.toString()}`
        );
        return response.data.data;
    }

    // Testes de envio
    async testEmail(data: { email: string; subject?: string; content?: string }): Promise<Notification> {
        const response = await apiUtils.post<ApiResponse<Notification>>(`${this.baseUrl}/test/email`, data);
        return response.data.data;
    }

    async testSms(data: { phone: string; message?: string }): Promise<Notification> {
        const response = await apiUtils.post<ApiResponse<Notification>>(`${this.baseUrl}/test/sms`, data);
        return response.data.data;
    }

    async testWhatsApp(data: { phone: string; message?: string }): Promise<Notification> {
        const response = await apiUtils.post<ApiResponse<Notification>>(`${this.baseUrl}/test/whatsapp`, data);
        return response.data.data;
    }

    // Templates
    async createTemplate(data: Omit<NotificationTemplate, '_id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
        const response = await apiUtils.post<ApiResponse<NotificationTemplate>>(`${this.baseUrl}/templates`, data);
        return response.data.data;
    }

    async getTemplates(): Promise<NotificationTemplate[]> {
        const response = await apiUtils.get<ApiResponse<NotificationTemplate[]>>(`${this.baseUrl}/templates`);
        return response.data.data;
    }

    async getTemplateById(id: string): Promise<NotificationTemplate> {
        const response = await apiUtils.get<ApiResponse<NotificationTemplate>>(`${this.baseUrl}/templates/${id}`);
        return response.data.data;
    }

    async updateTemplate(id: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
        const response = await apiUtils.patch<ApiResponse<NotificationTemplate>>(`${this.baseUrl}/templates/${id}`, data);
        return response.data.data;
    }

    // Utilitários
    getStatusColor(status: Notification['status']): string {
        const colors = {
            PENDING: '#f59e0b',     // amber
            SENT: '#3b82f6',        // blue  
            DELIVERED: '#10b981',   // green
            FAILED: '#ef4444',      // red
            CANCELLED: '#6b7280'    // gray
        };
        return colors[status];
    }

    getPriorityColor(priority: Notification['priority']): string {
        const colors = {
            LOW: '#6b7280',      // gray
            NORMAL: '#3b82f6',   // blue
            HIGH: '#f59e0b',     // amber
            URGENT: '#ef4444'    // red
        };
        return colors[priority];
    }

    formatNotificationType(type: Notification['type']): string {
        const labels = {
            APPOINTMENT_REMINDER: 'Lembrete de Agendamento',
            APPOINTMENT_CONFIRMATION: 'Confirmação de Agendamento',
            APPOINTMENT_CANCELLATION: 'Cancelamento de Agendamento',
            PAYMENT_CONFIRMATION: 'Confirmação de Pagamento',
            PAYMENT_FAILED: 'Falha no Pagamento',
            BUSINESS_ANNOUNCEMENT: 'Anúncio da Empresa',
            SYSTEM_ALERT: 'Alerta do Sistema',
            MARKETING: 'Marketing',
            FEEDBACK_REQUEST: 'Solicitação de Feedback',
            OTHER: 'Outros'
        };
        return labels[type];
    }

    formatChannel(channel: Notification['channel']): string {
        const labels = {
            EMAIL: 'E-mail',
            SMS: 'SMS',
            WHATSAPP: 'WhatsApp'
        };
        return labels[channel];
    }

    // Helpers para criação rápida de notificações
    createAppointmentReminder(data: {
        userId?: string;
        email?: string;
        phone?: string;
        recipientName?: string;
        appointmentDate: string;
        serviceName: string;
        businessName: string;
        appointmentId: string;
        channel?: Notification['channel'];
    }): CreateNotificationDto {
        return {
            type: 'APPOINTMENT_REMINDER',
            channel: data.channel || 'EMAIL',
            title: `Lembrete: Agendamento ${data.serviceName}`,
            content: `Olá ${data.recipientName || 'Cliente'}, você tem um agendamento marcado para ${data.appointmentDate} na ${data.businessName} para o serviço ${data.serviceName}.`,
            userId: data.userId,
            email: data.email,
            phone: data.phone,
            recipientName: data.recipientName,
            appointmentId: data.appointmentId,
            priority: 'NORMAL'
        };
    }

    createPaymentConfirmation(data: {
        userId?: string;
        email?: string;
        phone?: string;
        recipientName?: string;
        amount: string;
        serviceName: string;
        businessName: string;
        channel?: Notification['channel'];
    }): CreateNotificationDto {
        return {
            type: 'PAYMENT_CONFIRMATION',
            channel: data.channel || 'EMAIL',
            title: 'Pagamento Confirmado',
            content: `Seu pagamento de ${data.amount} para o serviço ${data.serviceName} na ${data.businessName} foi confirmado com sucesso.`,
            userId: data.userId,
            email: data.email,
            phone: data.phone,
            recipientName: data.recipientName,
            priority: 'HIGH'
        };
    }
}

export const notificationService = new NotificationService();
export default notificationService;