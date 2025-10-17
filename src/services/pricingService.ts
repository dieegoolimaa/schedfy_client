import { apiUtils } from './api';

// Pricing plan interface
export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: {
        USD: number;
        EUR: number;
        BRL: number;
    };
    period: 'month' | 'year';
    features: string[];
    badge?: string;
    badgeColor?: string;
    recommended?: boolean;
    planType: 'simple_booking' | 'individual' | 'business';
}

// Mock data - will be replaced by backend API call
const mockPlans: PricingPlan[] = [
    {
        id: '1',
        name: 'Simple Booking',
        description: 'Perfect for solo professionals starting their booking journey',
        price: { USD: 29, EUR: 27, BRL: 149 },
        period: 'month',
        badge: 'Most Popular',
        badgeColor: 'bg-blue-500',
        recommended: true,
        planType: 'simple_booking',
        features: [
            'Unlimited appointments',
            'Team member management',
            'Basic calendar view',
            'SMS notifications',
            'Mobile responsive',
            'Email support',
        ],
    },
    {
        id: '2',
        name: 'Individual',
        description: 'For independent professionals who work alone',
        price: { USD: 49, EUR: 45, BRL: 249 },
        period: 'month',
        recommended: false,
        planType: 'individual',
        features: [
            'Everything in Simple',
            'Advanced analytics',
            'Custom branding',
            'Payment integration',
            'Automated reminders',
            'Priority support',
            'Commission tracking',
        ],
    },
    {
        id: '3',
        name: 'Business',
        description: 'Complete solution for growing businesses',
        price: { USD: 99, EUR: 89, BRL: 499 },
        period: 'month',
        badge: 'Best Value',
        badgeColor: 'bg-emerald-500',
        recommended: false,
        planType: 'business',
        features: [
            'Everything in Individual',
            'Unlimited team members',
            'Multi-location support',
            'Advanced reports',
            'API access',
            'White-label option',
            'Dedicated account manager',
            'Custom integrations',
        ],
    },
];

class PricingService {
    private baseUrl = '/pricing'; // Will be '/plans' or '/pricing' on backend

    /**
     * Get all available pricing plans
     * TODO: Connect to backend endpoint GET /api/v1/pricing/plans
     */
    async getPlans(): Promise<PricingPlan[]> {
        try {
            // TODO: Uncomment when backend endpoint is ready
            // const response = await apiUtils.get<{ data: PricingPlan[] }>(
            //   `${this.baseUrl}/plans`
            // );
            // return response.data.data;

            // For now, return mock data
            return Promise.resolve(mockPlans);
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
            // Fallback to mock data on error
            return mockPlans;
        }
    }

    /**
     * Get a specific plan by ID
     * TODO: Connect to backend endpoint GET /api/v1/pricing/plans/:id
     */
    async getPlanById(id: string): Promise<PricingPlan | null> {
        try {
            // TODO: Uncomment when backend endpoint is ready
            // const response = await apiUtils.get<{ data: PricingPlan }>(
            //   `${this.baseUrl}/plans/${id}`
            // );
            // return response.data.data;

            // For now, return from mock data
            const plan = mockPlans.find(p => p.id === id);
            return Promise.resolve(plan || null);
        } catch (error) {
            console.error(`Error fetching plan ${id}:`, error);
            return null;
        }
    }

    /**
     * Get plan by type
     */
    async getPlanByType(planType: 'simple_booking' | 'individual' | 'business'): Promise<PricingPlan | null> {
        const plans = await this.getPlans();
        return plans.find(p => p.planType === planType) || null;
    }
}

export const pricingService = new PricingService();
export default pricingService;
