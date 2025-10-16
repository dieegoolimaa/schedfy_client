// Core API configuration
export * from './api';

// Service instances exports
export { authService } from './authService';
export { userService } from './userService';
export { businessService } from './businessService';
export { professionalService } from './professionalService';
export { serviceService } from './serviceService';
export { appointmentService } from './appointmentService';
export { paymentService } from './paymentService';
export { feedbackService } from './feedbackService';
export { uploadService } from './uploadService';
export { notificationService } from './notificationService';
export { analyticsService } from './analyticsService';
export { localizationService } from './localizationService';

// Type exports (with explicit naming to avoid conflicts)
export type { User as AuthUser } from './authService';
export type { User as UserData } from './userService';
export type { Business, CreateBusinessDto, UpdateBusinessDto, BusinessFilter } from './businessService';
export type { Professional, CreateProfessionalDto, UpdateProfessionalDto, ProfessionalFilter } from './professionalService';
export type { Service, CreateServiceDto, UpdateServiceDto, ServiceFilter } from './serviceService';
export type {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    AppointmentFilter,
    TimeSlot as AppointmentTimeSlot
} from './appointmentService';
export type { Payment, CreatePaymentDto, PaymentFilter } from './paymentService';
export type { Feedback, CreateFeedbackDto, UpdateFeedbackDto, FeedbackFilter } from './feedbackService';
export type { UploadFile, UploadOptions, UploadProgress } from './uploadService';
export type { Notification, CreateNotificationDto, NotificationFilter } from './notificationService';
export type { DashboardStats, RevenueAnalytics, AppointmentAnalytics } from './analyticsService';

// Legacy services (to be gradually replaced)
export * from './appointment-approval.service';
export * from './notification.service';