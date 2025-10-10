import type { Service } from '@/interfaces/service.interface';

const services: Service[] = [
    {
        id: 1,
        name: 'Corte de Cabelo',
        description: 'Corte de cabelo masculino ou feminino.',
        duration: 30,
        price: 25.0,
        commerceId: 1,
        isActive: true,
        requiresConfirmation: false,
        commissionPercentage: 0,
        allowDiscounts: false,
        availableDays: [],
    },
    {
        id: 2,
        name: 'Manicure',
        description: 'Serviço de manicure e pedicure.',
        duration: 45,
        price: 30.0,
        commerceId: 1,
        isActive: true,
        requiresConfirmation: true,
        commissionPercentage: 0,
        allowDiscounts: false,
        availableDays: [],
        professionals: [2, 5],
    },
    {
        id: 3,
        name: 'Massagem Relaxante',
        description: 'Massagem corporal para relaxamento.',
        duration: 60,
        price: 70.0,
        commerceId: 1,
        isActive: true,
        requiresConfirmation: true,
        commissionPercentage: 0,
        allowDiscounts: false,
        availableDays: [],
        professionals: [5, 6],
    },
];

export default services;
