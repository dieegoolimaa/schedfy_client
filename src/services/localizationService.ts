import { apiUtils } from './api';
import type { ApiResponse } from './api';

// === INTERFACES DE LOCALIZAÇÃO ===
export interface LocaleConfig {
    country: string;
    currency: string;
    currencySymbol: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    numberFormat: string;
    paymentMethods: PaymentMethodConfig[];
    taxConfig: TaxConfig;
}

export interface PaymentMethodConfig {
    id: string;
    name: string;
    type: 'card' | 'bank_transfer' | 'digital_wallet' | 'cash' | 'crypto';
    fees: {
        fixed?: number;
        percentage?: number;
    };
    processingTime: string;
    available: boolean;
    icon?: string;
    description?: string;
}

export interface TaxConfig {
    vatRate: number;
    vatIncluded: boolean;
    taxName: string;
    businessTaxId?: string;
}

export interface CurrencyConversion {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    convertedAmount: number;
    exchangeRate: number;
    timestamp: string;
}

export interface PaymentFeeCalculation {
    feeAmount: number;
    totalAmount: number;
    feePercentage?: number;
    feeFixed?: number;
}

export interface TaxCalculation {
    taxAmount: number;
    netAmount: number;
    taxRate: number;
    taxIncluded: boolean;
}

class LocalizationService {
    private readonly baseUrl = '/api/localization';
    private currentLocale: string = 'pt-BR';
    private localeConfig: LocaleConfig | null = null;

    // === DETECÇÃO E CONFIGURAÇÃO DE LOCALIZAÇÃO ===

    async detectLocale(): Promise<string> {
        try {
            const response = await apiUtils.get<ApiResponse<{ locale: string }>>(`${this.baseUrl}/detect`);
            this.currentLocale = response.data.data.locale;
            return this.currentLocale;
        } catch (error) {
            // Fallback para detecção local
            return this.detectLocaleFromBrowser();
        }
    }

    private detectLocaleFromBrowser(): string {
        const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';

        if (browserLang.startsWith('pt-PT') || browserLang.includes('Portugal')) {
            return 'pt-PT';
        }

        return 'pt-BR'; // Default para Brasil
    }

    async getLocaleConfig(locale?: string): Promise<LocaleConfig> {
        const targetLocale = locale || this.currentLocale;

        if (this.localeConfig && this.currentLocale === targetLocale) {
            return this.localeConfig;
        }

        try {
            const response = await apiUtils.get<ApiResponse<LocaleConfig>>(
                `${this.baseUrl}/config/${targetLocale}`
            );
            this.localeConfig = response.data.data;
            this.currentLocale = targetLocale;
            return this.localeConfig;
        } catch (error) {
            // Fallback para configuração local
            return this.getLocalFallbackConfig(targetLocale);
        }
    }

    private getLocalFallbackConfig(locale: string): LocaleConfig {
        const configs: Record<string, LocaleConfig> = {
            'pt-PT': {
                country: 'Portugal',
                currency: 'EUR',
                currencySymbol: '€',
                language: 'pt-PT',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: 'HH:mm',
                numberFormat: 'pt-PT',
                paymentMethods: [
                    {
                        id: 'mb_way',
                        name: 'MB WAY',
                        type: 'digital_wallet',
                        fees: { percentage: 0.5 },
                        processingTime: 'Instantâneo',
                        available: true,
                        icon: 'mb-way'
                    },
                    {
                        id: 'multibanco',
                        name: 'Multibanco',
                        type: 'bank_transfer',
                        fees: { fixed: 0.5 },
                        processingTime: 'Instantâneo',
                        available: true,
                        icon: 'multibanco'
                    }
                ],
                taxConfig: {
                    vatRate: 23,
                    vatIncluded: true,
                    taxName: 'IVA'
                }
            },
            'pt-BR': {
                country: 'Brasil',
                currency: 'BRL',
                currencySymbol: 'R$',
                language: 'pt-BR',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: 'HH:mm',
                numberFormat: 'pt-BR',
                paymentMethods: [
                    {
                        id: 'pix',
                        name: 'PIX',
                        type: 'digital_wallet',
                        fees: { fixed: 0 },
                        processingTime: 'Instantâneo',
                        available: true,
                        icon: 'pix'
                    },
                    {
                        id: 'credit_card',
                        name: 'Cartão de Crédito',
                        type: 'card',
                        fees: { percentage: 3.99 },
                        processingTime: 'Instantâneo',
                        available: true,
                        icon: 'credit-card'
                    }
                ],
                taxConfig: {
                    vatRate: 0,
                    vatIncluded: false,
                    taxName: 'Impostos'
                }
            }
        };

        return configs[locale] || configs['pt-BR'];
    }

    // === FORMATAÇÃO ===

    async formatCurrency(amount: number, locale?: string): Promise<string> {
        const config = await this.getLocaleConfig(locale);

        return new Intl.NumberFormat(config.numberFormat, {
            style: 'currency',
            currency: config.currency,
            minimumFractionDigits: 2
        }).format(amount);
    }

    async formatDate(date: Date, locale?: string): Promise<string> {
        const config = await this.getLocaleConfig(locale);

        return new Intl.DateTimeFormat(config.numberFormat, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }

    async formatTime(date: Date, locale?: string): Promise<string> {
        const config = await this.getLocaleConfig(locale);

        return new Intl.DateTimeFormat(config.numberFormat, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }

    async formatDateTime(date: Date, locale?: string): Promise<string> {
        const [formattedDate, formattedTime] = await Promise.all([
            this.formatDate(date, locale),
            this.formatTime(date, locale)
        ]);

        return `${formattedDate} ${formattedTime}`;
    }

    formatNumber(value: number, locale?: string): string {
        const targetLocale = locale || this.currentLocale;
        const config = this.localeConfig || this.getLocalFallbackConfig(targetLocale);

        return new Intl.NumberFormat(config.numberFormat).format(value);
    }

    // === MÉTODOS DE PAGAMENTO ===

    async getAvailablePaymentMethods(locale?: string): Promise<PaymentMethodConfig[]> {
        const config = await this.getLocaleConfig(locale);
        return config.paymentMethods.filter(method => method.available);
    }

    async calculatePaymentFee(
        amount: number,
        paymentMethodId: string,
        locale?: string
    ): Promise<PaymentFeeCalculation> {
        try {
            const response = await apiUtils.post<ApiResponse<PaymentFeeCalculation>>(
                `${this.baseUrl}/payment-fee`,
                { amount, paymentMethodId, locale: locale || this.currentLocale }
            );
            return response.data.data;
        } catch (error) {
            // Fallback para cálculo local
            return this.calculatePaymentFeeLocal(amount, paymentMethodId, locale);
        }
    }

    private async calculatePaymentFeeLocal(
        amount: number,
        paymentMethodId: string,
        locale?: string
    ): Promise<PaymentFeeCalculation> {
        const config = await this.getLocaleConfig(locale);
        const paymentMethod = config.paymentMethods.find(method => method.id === paymentMethodId);

        if (!paymentMethod) {
            return { feeAmount: 0, totalAmount: amount };
        }

        let feeAmount = 0;

        if (paymentMethod.fees.fixed) {
            feeAmount += paymentMethod.fees.fixed;
        }

        if (paymentMethod.fees.percentage) {
            feeAmount += (amount * paymentMethod.fees.percentage) / 100;
        }

        return {
            feeAmount: Math.round(feeAmount * 100) / 100,
            totalAmount: Math.round((amount + feeAmount) * 100) / 100,
            feePercentage: paymentMethod.fees.percentage,
            feeFixed: paymentMethod.fees.fixed
        };
    }

    // === CÁLCULO DE IMPOSTOS ===

    async calculateTax(amount: number, locale?: string): Promise<TaxCalculation> {
        try {
            const response = await apiUtils.post<ApiResponse<TaxCalculation>>(
                `${this.baseUrl}/tax-calculation`,
                { amount, locale: locale || this.currentLocale }
            );
            return response.data.data;
        } catch (error) {
            // Fallback para cálculo local
            return this.calculateTaxLocal(amount, locale);
        }
    }

    private async calculateTaxLocal(amount: number, locale?: string): Promise<TaxCalculation> {
        const config = await this.getLocaleConfig(locale);
        const { vatRate, vatIncluded } = config.taxConfig;

        let taxAmount = 0;
        let netAmount = amount;

        if (vatRate > 0) {
            if (vatIncluded) {
                // IVA incluído (Portugal)
                taxAmount = (amount * vatRate) / (100 + vatRate);
                netAmount = amount - taxAmount;
            } else {
                // IVA a ser adicionado
                taxAmount = (amount * vatRate) / 100;
                netAmount = amount;
            }
        }

        return {
            taxAmount: Math.round(taxAmount * 100) / 100,
            netAmount: Math.round(netAmount * 100) / 100,
            taxRate: vatRate,
            taxIncluded: vatIncluded
        };
    }

    // === CONVERSÃO DE MOEDA ===

    async convertCurrency(
        amount: number,
        fromCurrency: string,
        toCurrency: string
    ): Promise<CurrencyConversion> {
        try {
            const response = await apiUtils.post<ApiResponse<CurrencyConversion>>(
                `${this.baseUrl}/currency-conversion`,
                { amount, fromCurrency, toCurrency }
            );
            return response.data.data;
        } catch (error) {
            // Fallback para conversão básica
            return {
                amount,
                fromCurrency,
                toCurrency,
                convertedAmount: amount, // Sem conversão
                exchangeRate: 1,
                timestamp: new Date().toISOString()
            };
        }
    }

    // === UTILITIES ===

    getCurrentLocale(): string {
        return this.currentLocale;
    }

    setCurrentLocale(locale: string): void {
        this.currentLocale = locale;
        this.localeConfig = null; // Limpar cache
    }

    isPortugal(): boolean {
        return this.currentLocale === 'pt-PT';
    }

    isBrazil(): boolean {
        return this.currentLocale === 'pt-BR';
    }

    async getUIConfig(locale?: string): Promise<{
        datePickerLocale: string;
        currencyInputConfig: any;
        phoneInputConfig: any;
        addressFormat: string[];
    }> {
        const config = await this.getLocaleConfig(locale);

        return {
            datePickerLocale: config.language,
            currencyInputConfig: {
                currency: config.currency,
                locale: config.numberFormat,
                precision: 2,
                symbol: config.currencySymbol
            },
            phoneInputConfig: {
                defaultCountry: this.isPortugal() ? 'PT' : 'BR',
                preferredCountries: this.isPortugal() ? ['PT', 'BR'] : ['BR', 'PT']
            },
            addressFormat: this.isPortugal()
                ? ['street', 'city', 'postalCode', 'country']
                : ['street', 'city', 'state', 'postalCode', 'country']
        };
    }

    // === MÉTODOS PARA COMPONENTES ===

    getPaymentMethodIcon(paymentMethodId: string): string {
        const iconMap: Record<string, string> = {
            'pix': '💳',
            'mb_way': '📱',
            'multibanco': '🏛️',
            'credit_card': '💳',
            'debit_card': '💳',
            'boleto': '📄',
            'bank_transfer': '🏦',
            'cash': '💵'
        };

        return iconMap[paymentMethodId] || '💳';
    }

    getPaymentMethodColor(paymentMethodId: string): string {
        const colorMap: Record<string, string> = {
            'pix': 'text-green-600',
            'mb_way': 'text-blue-600',
            'multibanco': 'text-red-600',
            'credit_card': 'text-purple-600',
            'debit_card': 'text-blue-600',
            'boleto': 'text-orange-600',
            'bank_transfer': 'text-gray-600',
            'cash': 'text-green-600'
        };

        return colorMap[paymentMethodId] || 'text-gray-600';
    }

    async formatPaymentSummary(
        amount: number,
        paymentMethodId: string,
        locale?: string
    ): Promise<{
        subtotal: string;
        fee: string;
        tax: string;
        total: string;
        paymentMethod: string;
    }> {
        const [config, feeCalc, taxCalc] = await Promise.all([
            this.getLocaleConfig(locale),
            this.calculatePaymentFee(amount, paymentMethodId, locale),
            this.calculateTax(amount, locale)
        ]);

        const paymentMethod = config.paymentMethods.find(m => m.id === paymentMethodId);

        return {
            subtotal: await this.formatCurrency(taxCalc.netAmount, locale),
            fee: await this.formatCurrency(feeCalc.feeAmount, locale),
            tax: await this.formatCurrency(taxCalc.taxAmount, locale),
            total: await this.formatCurrency(feeCalc.totalAmount + taxCalc.taxAmount, locale),
            paymentMethod: paymentMethod?.name || 'Método não encontrado'
        };
    }
}

export const localizationService = new LocalizationService();
export default localizationService;