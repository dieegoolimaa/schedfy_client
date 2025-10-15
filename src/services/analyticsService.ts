import { apiUtils } from './api';
import type { ApiResponse } from './api';

// Interfaces para Analytics
export interface AnalyticsFilter {
    businessId?: string;
    professionalId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
    period?: '7d' | '30d' | '90d' | '1y' | 'all';
    granularity?: 'day' | 'week' | 'month' | 'year';
}

export interface DashboardStats {
    totalAppointments: number;
    totalRevenue: number;
    totalCustomers: number;
    averageRating: number;

    // Crescimento comparado ao período anterior
    appointmentGrowth: number; // %
    revenueGrowth: number; // %
    customerGrowth: number; // %
    ratingChange: number; // diferença

    // Status dos agendamentos
    appointmentsByStatus: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        no_show: number;
    };

    // Pagamentos
    paymentsByStatus: {
        pending: number;
        completed: number;
        failed: number;
        refunded: number;
    };
}

export interface RevenueAnalytics {
    totalRevenue: number;
    averageTicket: number;
    revenueGrowth: number; // %

    // Receita por período
    revenueByPeriod: Array<{
        period: string; // data ou período
        revenue: number;
        appointments: number;
        averageTicket: number;
    }>;

    // Receita por serviço
    revenueByService: Array<{
        serviceId: string;
        serviceName: string;
        revenue: number;
        appointments: number;
        percentage: number; // % do total
    }>;

    // Receita por profissional
    revenueByProfessional: Array<{
        professionalId: string;
        professionalName: string;
        revenue: number;
        appointments: number;
        percentage: number; // % do total
    }>;

    // Métodos de pagamento
    revenueByPaymentMethod: Array<{
        method: string;
        revenue: number;
        count: number;
        percentage: number;
    }>;
}

export interface AppointmentAnalytics {
    totalAppointments: number;
    completionRate: number; // %
    cancelationRate: number; // %
    noShowRate: number; // %

    // Agendamentos por período
    appointmentsByPeriod: Array<{
        period: string;
        total: number;
        completed: number;
        cancelled: number;
        no_show: number;
    }>;

    // Horários mais populares
    popularTimeSlots: Array<{
        hour: number;
        count: number;
        percentage: number;
    }>;

    // Dias da semana mais populares
    popularDaysOfWeek: Array<{
        dayOfWeek: number; // 0 = domingo
        dayName: string;
        count: number;
        percentage: number;
    }>;

    // Lead time (antecedência média dos agendamentos)
    averageLeadTime: number; // dias

    // Duração média dos serviços
    averageServiceDuration: number; // minutos
}

export interface CustomerAnalytics {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number; // %

    // Clientes por período
    customersByPeriod: Array<{
        period: string;
        newCustomers: number;
        returningCustomers: number;
        totalCustomers: number;
    }>;

    // Frequência de visitas
    visitFrequency: Array<{
        visits: number;
        customers: number;
        percentage: number;
    }>;

    // Valor por cliente
    customerLifetimeValue: {
        average: number;
        median: number;
        topCustomers: Array<{
            customerId: string;
            customerName: string;
            totalSpent: number;
            visitCount: number;
        }>;
    };

    // Demografia (se disponível)
    demographics: {
        ageGroups?: Array<{
            ageRange: string;
            count: number;
            percentage: number;
        }>;
        genderDistribution?: Array<{
            gender: string;
            count: number;
            percentage: number;
        }>;
    };
}

export interface ServiceAnalytics {
    // Performance dos serviços
    servicePerformance: Array<{
        serviceId: string;
        serviceName: string;
        totalAppointments: number;
        totalRevenue: number;
        averageRating: number;
        completionRate: number;
        averagePrice: number;
        popularityRank: number;
    }>;

    // Serviços mais populares
    popularServices: Array<{
        serviceId: string;
        serviceName: string;
        bookingCount: number;
        revenue: number;
        growthRate: number; // %
    }>;

    // Análise de preços
    priceAnalysis: {
        averagePrice: number;
        priceRange: {
            min: number;
            max: number;
        };
        priceDistribution: Array<{
            priceRange: string;
            count: number;
            percentage: number;
        }>;
    };
}

export interface ProfessionalAnalytics {
    // Performance dos profissionais
    professionalPerformance: Array<{
        professionalId: string;
        professionalName: string;
        totalAppointments: number;
        totalRevenue: number;
        averageRating: number;
        completionRate: number;
        utilizationRate: number; // % do tempo disponível usado
        customerRetentionRate: number;
    }>;

    // Produtividade
    productivity: {
        averageAppointmentsPerDay: number;
        averageRevenuePerHour: number;
        peakHours: Array<{
            hour: number;
            appointmentCount: number;
        }>;
    };

    // Especialidades mais demandadas
    popularSpecialties: Array<{
        specialty: string;
        professionalCount: number;
        appointmentCount: number;
        averageRating: number;
    }>;
}

export interface MarketingAnalytics {
    // Canais de aquisição
    acquisitionChannels: Array<{
        channel: string;
        customerCount: number;
        percentage: number;
        conversionRate: number;
    }>;

    // Campanhas (se implementado)
    campaigns: Array<{
        campaignId: string;
        campaignName: string;
        impressions: number;
        clicks: number;
        conversions: number;
        cost: number;
        roi: number;
    }>;

    // Referências
    referrals: {
        totalReferrals: number;
        topReferrers: Array<{
            referrerId: string;
            referrerName: string;
            referralCount: number;
            conversionRate: number;
        }>;
    };
}

export interface FinancialAnalytics {
    // Receita bruta vs líquida
    grossRevenue: number;
    netRevenue: number;
    fees: number;
    refunds: number;

    // Fluxo de caixa
    cashFlow: Array<{
        period: string;
        inflow: number;
        outflow: number;
        netFlow: number;
    }>;

    // Previsões
    projections: {
        nextMonth: {
            estimatedRevenue: number;
            estimatedAppointments: number;
            confidence: number; // % de confiança
        };
        nextQuarter: {
            estimatedRevenue: number;
            estimatedAppointments: number;
            confidence: number;
        };
    };

    // Métricas financeiras
    metrics: {
        averageRevenuePerCustomer: number;
        customerAcquisitionCost: number;
        monthlyRecurringRevenue: number;
        churnRate: number;
    };
}

class AnalyticsService {
    private baseUrl = '/analytics';

    // Dashboard principal
    async getDashboardStats(filter?: AnalyticsFilter): Promise<DashboardStats> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<DashboardStats>>(
            `${this.baseUrl}/dashboard?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de receita
    async getRevenueAnalytics(filter?: AnalyticsFilter): Promise<RevenueAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<RevenueAnalytics>>(
            `${this.baseUrl}/revenue?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de agendamentos
    async getAppointmentAnalytics(filter?: AnalyticsFilter): Promise<AppointmentAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<AppointmentAnalytics>>(
            `${this.baseUrl}/appointments?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de clientes
    async getCustomerAnalytics(filter?: AnalyticsFilter): Promise<CustomerAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<CustomerAnalytics>>(
            `${this.baseUrl}/customers?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de serviços
    async getServiceAnalytics(filter?: AnalyticsFilter): Promise<ServiceAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<ServiceAnalytics>>(
            `${this.baseUrl}/services?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de profissionais
    async getProfessionalAnalytics(filter?: AnalyticsFilter): Promise<ProfessionalAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<ProfessionalAnalytics>>(
            `${this.baseUrl}/professionals?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise de marketing
    async getMarketingAnalytics(filter?: AnalyticsFilter): Promise<MarketingAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<MarketingAnalytics>>(
            `${this.baseUrl}/marketing?${params.toString()}`
        );
        return response.data.data;
    }

    // Análise financeira
    async getFinancialAnalytics(filter?: AnalyticsFilter): Promise<FinancialAnalytics> {
        const params = this.buildParams(filter);
        const response = await apiUtils.get<ApiResponse<FinancialAnalytics>>(
            `${this.baseUrl}/financial?${params.toString()}`
        );
        return response.data.data;
    }

    // Relatórios customizados
    async generateCustomReport(reportConfig: {
        name: string;
        type: 'revenue' | 'appointments' | 'customers' | 'services' | 'professionals';
        metrics: string[];
        groupBy: string[];
        filters?: AnalyticsFilter;
    }): Promise<any> {
        const response = await apiUtils.post<ApiResponse<any>>(
            `${this.baseUrl}/custom-report`,
            reportConfig
        );
        return response.data.data;
    }

    // Exportar dados para CSV/Excel
    async exportData(
        type: 'appointments' | 'customers' | 'revenue' | 'services' | 'professionals',
        format: 'csv' | 'excel',
        filter?: AnalyticsFilter
    ): Promise<Blob> {
        const params = this.buildParams(filter);
        params.append('format', format);

        const response = await apiUtils.get(
            `${this.baseUrl}/export/${type}?${params.toString()}`,
            { responseType: 'blob' }
        );

        return response.data as Blob;
    }

    // Comparação entre períodos
    async comparePeriods(
        currentPeriod: { startDate: string; endDate: string },
        previousPeriod: { startDate: string; endDate: string },
        businessId?: string
    ): Promise<{
        current: DashboardStats;
        previous: DashboardStats;
        comparison: {
            appointmentChange: number;
            revenueChange: number;
            customerChange: number;
            ratingChange: number;
        };
    }> {
        const response = await apiUtils.post<ApiResponse<any>>(
            `${this.baseUrl}/compare-periods`,
            {
                currentPeriod,
                previousPeriod,
                businessId
            }
        );
        return response.data.data;
    }

    // Utilities
    private buildParams(filter?: AnalyticsFilter): URLSearchParams {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }

        return params;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    formatPercentage(value: number): string {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    formatRating(rating: number): string {
        return `${rating.toFixed(1)} ⭐`;
    }

    getPeriodLabel(period: string): string {
        const labels = {
            '7d': 'Últimos 7 dias',
            '30d': 'Últimos 30 dias',
            '90d': 'Últimos 90 dias',
            '1y': 'Último ano',
            'all': 'Todo o período'
        };
        return labels[period as keyof typeof labels] || period;
    }

    getGrowthColor(growth: number): string {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    }

    getGrowthIcon(growth: number): string {
        if (growth > 0) return '↗️';
        if (growth < 0) return '↘️';
        return '➡️';
    }

    calculateGrowthRate(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }

    getTopPerformers<T extends { [key: string]: any }>(
        items: T[],
        sortKey: keyof T,
        limit = 5
    ): T[] {
        return [...items]
            .sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number))
            .slice(0, limit);
    }

    calculateTrend(data: Array<{ period: string; value: number }>): 'up' | 'down' | 'stable' {
        if (data.length < 2) return 'stable';

        const recent = data.slice(-3).map(d => d.value);
        const older = data.slice(-6, -3).map(d => d.value);

        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.length > 0
            ? older.reduce((a, b) => a + b, 0) / older.length
            : recentAvg;

        const changePercentage = ((recentAvg - olderAvg) / olderAvg) * 100;

        if (changePercentage > 5) return 'up';
        if (changePercentage < -5) return 'down';
        return 'stable';
    }

    getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
        const icons = {
            up: '📈',
            down: '📉',
            stable: '📊'
        };
        return icons[trend];
    }

    formatDateRange(startDate: string, endDate: string): string {
        const start = new Date(startDate).toLocaleDateString('pt-BR');
        const end = new Date(endDate).toLocaleDateString('pt-BR');
        return `${start} - ${end}`;
    }

    getDayOfWeekName(dayOfWeek: number): string {
        const days = [
            'Domingo', 'Segunda', 'Terça', 'Quarta',
            'Quinta', 'Sexta', 'Sábado'
        ];
        return days[dayOfWeek] || 'Desconhecido';
    }

    formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes}min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h${remainingMinutes}min`;
    }

    getComparisonText(current: number, previous: number, type: 'currency' | 'number' | 'percentage' = 'number'): string {
        const growth = this.calculateGrowthRate(current, previous);
        const growthText = this.formatPercentage(growth);
        const direction = growth >= 0 ? 'aumento' : 'diminuição';

        let currentFormatted: string;
        let previousFormatted: string;

        switch (type) {
            case 'currency':
                currentFormatted = this.formatCurrency(current);
                previousFormatted = this.formatCurrency(previous);
                break;
            case 'percentage':
                currentFormatted = `${current.toFixed(1)}%`;
                previousFormatted = `${previous.toFixed(1)}%`;
                break;
            default:
                currentFormatted = this.formatNumber(current);
                previousFormatted = this.formatNumber(previous);
        }

        return `${currentFormatted} (${growthText} de ${direction} em relação a ${previousFormatted})`;
    }

    generateInsights(stats: DashboardStats): string[] {
        const insights: string[] = [];

        // Insights sobre agendamentos
        if (stats.appointmentGrowth > 20) {
            insights.push(`📈 Excelente crescimento de ${this.formatPercentage(stats.appointmentGrowth)} nos agendamentos!`);
        } else if (stats.appointmentGrowth < -10) {
            insights.push(`📉 Atenção: queda de ${this.formatPercentage(Math.abs(stats.appointmentGrowth))} nos agendamentos.`);
        }

        // Insights sobre receita
        if (stats.revenueGrowth > 15) {
            insights.push(`💰 Receita cresceu ${this.formatPercentage(stats.revenueGrowth)} - ótimo desempenho!`);
        }

        // Insights sobre avaliações
        if (stats.averageRating >= 4.5) {
            insights.push(`⭐ Avaliação excelente de ${this.formatRating(stats.averageRating)}!`);
        } else if (stats.averageRating < 3.5) {
            insights.push(`⚠️ Avaliação baixa (${this.formatRating(stats.averageRating)}) - considere melhorias no atendimento.`);
        }

        // Insights sobre cancelamentos
        const totalAppointments = Object.values(stats.appointmentsByStatus).reduce((a, b) => a + b, 0);
        const cancelationRate = (stats.appointmentsByStatus.cancelled / totalAppointments) * 100;

        if (cancelationRate > 20) {
            insights.push(`⚠️ Taxa de cancelamento alta (${cancelationRate.toFixed(1)}%) - revise políticas de cancelamento.`);
        }

        return insights;
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;