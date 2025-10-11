/**
 * Feedback System Interface
 * Sistema de avaliação para todos os 3 tipos de planos
 */

/**
 * Feedback/Rating from customer after appointment completion
 */
export interface AppointmentFeedback {
    id: string;
    appointmentId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;

    // Professional rating (all plans)
    professionalRating?: number; // 1-5 stars
    professionalComment?: string;

    // Business rating (only for business/individual plans with business context)
    businessRating?: number; // 1-5 stars
    businessComment?: string;

    // Overall experience
    overallRating: number; // 1-5 stars
    overallComment?: string;

    // Specific aspects (optional)
    aspects?: {
        punctuality?: number; // 1-5
        cleanliness?: number; // 1-5
        communication?: number; // 1-5
        quality?: number; // 1-5
        value?: number; // 1-5
    };

    // Metadata
    wouldRecommend: boolean;
    submittedAt: string;
    createdAt: string;

    // Status
    status: 'pending' | 'submitted' | 'replied';

    // Business reply (optional)
    reply?: {
        message: string;
        repliedBy: string;
        repliedAt: string;
    };
}

/**
 * Feedback statistics for professional/business
 */
export interface FeedbackStats {
    totalFeedbacks: number;
    averageRating: number;

    // Breakdown by rating
    ratingBreakdown: {
        '5': number;
        '4': number;
        '3': number;
        '2': number;
        '1': number;
    };

    // Specific aspects averages
    aspectsAverage?: {
        punctuality: number;
        cleanliness: number;
        communication: number;
        quality: number;
        value: number;
    };

    // Recommendation rate
    recommendationRate: number; // Percentage of customers who would recommend

    // Trends
    lastMonthAverage?: number;
    trend?: 'up' | 'down' | 'stable';
}

/**
 * Feedback survey email data
 */
export interface FeedbackSurveyEmail {
    appointmentId: string;
    customerEmail: string;
    customerName: string;
    serviceName?: string;
    professionalName: string;
    businessName?: string;
    appointmentDate: string;
    surveyToken: string; // Unique token to access survey
    expiresAt: string;
}

/**
 * Feedback filter for queries
 */
export interface FeedbackFilters {
    professionalId?: string;
    businessId?: string;
    rating?: number; // Filter by specific rating
    minRating?: number; // Filter by minimum rating
    startDate?: string;
    endDate?: string;
    status?: 'pending' | 'submitted' | 'replied';
    hasReply?: boolean;
    sortBy?: 'date' | 'rating' | 'helpful';
    order?: 'asc' | 'desc';
}

/**
 * Paginated feedback response
 */
export interface FeedbackListResponse {
    feedbacks: AppointmentFeedback[];
    stats: FeedbackStats;
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

/**
 * Create feedback DTO
 */
export interface CreateFeedbackDTO {
    appointmentId: string;
    surveyToken: string;

    // Ratings
    professionalRating?: number;
    professionalComment?: string;
    businessRating?: number;
    businessComment?: string;
    overallRating: number;
    overallComment?: string;

    // Aspects
    aspects?: {
        punctuality?: number;
        cleanliness?: number;
        communication?: number;
        quality?: number;
        value?: number;
    };

    wouldRecommend: boolean;
}

/**
 * Reply to feedback DTO
 */
export interface ReplyToFeedbackDTO {
    feedbackId: string;
    message: string;
    repliedBy: string; // User ID
}
