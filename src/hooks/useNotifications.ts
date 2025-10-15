import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import type {
    Notification,
    CreateNotificationDto,
    NotificationFilter,
    NotificationStats,
    BulkNotificationDto
} from '../services/notificationService';

interface UseNotificationsOptions {
    initialFilter?: NotificationFilter;
    autoRefresh?: boolean;
    refreshInterval?: number; // em milissegundos
}

interface UseNotificationsReturn {
    // Estado
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    stats: NotificationStats | null;
    totalCount: number;
    currentPage: number;
    totalPages: number;

    // Funções
    fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
    createNotification: (data: CreateNotificationDto) => Promise<Notification | null>;
    createBulkNotifications: (data: BulkNotificationDto) => Promise<Notification[] | null>;
    sendNotification: (id: string) => Promise<boolean>;
    refreshStats: () => Promise<void>;
    setFilter: (filter: NotificationFilter) => void;
    reset: () => void;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
    const {
        initialFilter = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
        autoRefresh = false,
        refreshInterval = 30000 // 30 segundos
    } = options;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [filter, setFilter] = useState<NotificationFilter>(initialFilter);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Buscar notificações
    const fetchNotifications = useCallback(async (newFilter?: NotificationFilter) => {
        setLoading(true);
        setError(null);

        try {
            const filterToUse = newFilter || filter;
            const response = await notificationService.getNotifications(filterToUse);

            setNotifications(response.data);
            setTotalCount(response.totalCount);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);

            if (newFilter) {
                setFilter(newFilter);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar notificações';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    // Criar notificação
    const createNotification = useCallback(async (data: CreateNotificationDto): Promise<Notification | null> => {
        setLoading(true);
        setError(null);

        try {
            const newNotification = await notificationService.createNotification(data);

            // Adicionar à lista se estiver na primeira página
            if (currentPage === 1) {
                setNotifications(prev => [newNotification, ...prev.slice(0, -1)]);
            }

            return newNotification;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar notificação';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    // Criar notificações em lote
    const createBulkNotifications = useCallback(async (data: BulkNotificationDto): Promise<Notification[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const newNotifications = await notificationService.createBulkNotifications(data);

            // Atualizar lista se necessário
            if (currentPage === 1) {
                await fetchNotifications();
            }

            return newNotifications;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar notificações em lote';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, fetchNotifications]);

    // Enviar notificação manualmente
    const sendNotification = useCallback(async (id: string): Promise<boolean> => {
        setError(null);

        try {
            const result = await notificationService.sendNotification(id);

            if (result.success) {
                // Atualizar status da notificação na lista
                setNotifications(prev =>
                    prev.map(notification =>
                        notification._id === id
                            ? { ...notification, status: 'SENT' as const, sentAt: new Date().toISOString() }
                            : notification
                    )
                );
                return true;
            } else {
                setError(result.error || 'Falha ao enviar notificação');
                return false;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao enviar notificação';
            setError(errorMessage);
            return false;
        }
    }, []);

    // Buscar estatísticas
    const refreshStats = useCallback(async () => {
        try {
            const statsData = await notificationService.getStats();
            setStats(statsData);
        } catch (err: any) {
            console.error('Erro ao carregar estatísticas:', err);
        }
    }, []);

    // Reset
    const reset = useCallback(() => {
        setNotifications([]);
        setError(null);
        setStats(null);
        setTotalCount(0);
        setCurrentPage(1);
        setTotalPages(0);
        setFilter(initialFilter);
    }, [initialFilter]);

    // Auto-refresh
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchNotifications();
                refreshStats();
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval, fetchNotifications, refreshStats]);

    // Carregar dados iniciais
    useEffect(() => {
        fetchNotifications();
        refreshStats();
    }, []);

    return {
        notifications,
        loading,
        error,
        stats,
        totalCount,
        currentPage,
        totalPages,
        fetchNotifications,
        createNotification,
        createBulkNotifications,
        sendNotification,
        refreshStats,
        setFilter,
        reset,
    };
};

// Hook para notificações em tempo real (pode ser expandido com WebSocket)
export const useRealtimeNotifications = () => {
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // TODO: Implementar WebSocket connection quando disponível
    const markAsRead = useCallback((notificationId: string) => {
        setRecentNotifications(prev =>
            prev.map(notification =>
                notification._id === notificationId
                    ? { ...notification, metadata: { ...notification.metadata, read: true } }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setRecentNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                metadata: { ...notification.metadata, read: true }
            }))
        );
        setUnreadCount(0);
    }, []);

    return {
        recentNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
};

// Hook para testes de notificação
export const useNotificationTesting = () => {
    const [testing, setTesting] = useState(false);
    const [testResults, setTestResults] = useState<Record<string, boolean>>({});

    const testEmail = useCallback(async (email: string, subject?: string, content?: string) => {
        setTesting(true);
        try {
            await notificationService.testEmail({ email, subject, content });
            setTestResults(prev => ({ ...prev, email: true }));
            return true;
        } catch (error) {
            setTestResults(prev => ({ ...prev, email: false }));
            return false;
        } finally {
            setTesting(false);
        }
    }, []);

    const testSms = useCallback(async (phone: string, message?: string) => {
        setTesting(true);
        try {
            await notificationService.testSms({ phone, message });
            setTestResults(prev => ({ ...prev, sms: true }));
            return true;
        } catch (error) {
            setTestResults(prev => ({ ...prev, sms: false }));
            return false;
        } finally {
            setTesting(false);
        }
    }, []);

    const testWhatsApp = useCallback(async (phone: string, message?: string) => {
        setTesting(true);
        try {
            await notificationService.testWhatsApp({ phone, message });
            setTestResults(prev => ({ ...prev, whatsapp: true }));
            return true;
        } catch (error) {
            setTestResults(prev => ({ ...prev, whatsapp: false }));
            return false;
        } finally {
            setTesting(false);
        }
    }, []);

    const resetTests = useCallback(() => {
        setTestResults({});
    }, []);

    return {
        testing,
        testResults,
        testEmail,
        testSms,
        testWhatsApp,
        resetTests,
    };
};

export default useNotifications;