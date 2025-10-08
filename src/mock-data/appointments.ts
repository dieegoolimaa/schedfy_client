import type { Appointment, Voucher } from "@/interfaces/appointment.interface";

// Vouchers de exemplo
const sampleVouchers: Voucher[] = [
    {
        id: "voucher_001",
        code: "PRIMEIRA_VEZ",
        type: "percentage",
        value: 20,
        description: "20% de desconto para novos clientes",
        expiryDate: "2025-12-31T23:59:59Z",
        usageLimit: 100,
        usedCount: 15,
        minPurchase: 50
    },
    {
        id: "voucher_002",
        code: "FIDELIDADE10",
        type: "fixed_amount",
        value: 10,
        description: "R$ 10 de desconto para clientes fiéis",
        usageLimit: 50,
        usedCount: 8
    }
];

// Appointments de exemplo com estrutura completa
const appointments: Appointment[] = [
    {
        id: "apt_001",
        serviceId: "service_001",
        serviceName: "Corte de Cabelo Feminino",
        professionalId: "1",
        professionalName: "José da Silva",
        
        // Cliente
        customer: "Maria Santos",
        email: "maria.santos@example.com",
        phone: "(11) 99999-9999",
        customerNotes: "Prefere cortes mais conservadores",
        
        // Agendamento
        date: "2025-10-15T00:00:00Z",
        time: "14:30",
        duration: 60,
        status: "confirmed",
        
        // Valores
        originalPrice: 80.00,
        finalPrice: 64.00, // Com desconto de 20%
        
        // Descontos aplicados
        appliedVouchers: [sampleVouchers[0]],
        appliedDiscounts: [],
        totalDiscountAmount: 16.00,
        
        // Comissão (70% profissional, 30% estabelecimento)
        commission: {
            professionalPercentage: 70,
            establishmentPercentage: 30,
            baseAmount: 64.00,
            professionalAmount: 44.80,
            establishmentAmount: 19.20
        },
        
        // Pagamento
        payment: {
            method: "pending",
            status: "pending",
            paidAmount: 0,
            remainingAmount: 64.00
        },
        
        // Controle
        createdAt: "2025-10-07T10:30:00Z",
        updatedAt: "2025-10-07T10:30:00Z",
        
        // Observações
        professionalNotes: "",
        adminNotes: ""
    },
    {
        id: "apt_002",
        serviceId: "service_002",
        serviceName: "Manicure Completa",
        professionalId: "2",
        professionalName: "Maria Oliveira",
        
        customer: "Ana Costa",
        email: "ana.costa@example.com",
        phone: "(21) 88888-8888",
        
        date: "2025-10-16T00:00:00Z",
        time: "10:00",
        duration: 45,
        status: "completed",
        
        originalPrice: 35.00,
        finalPrice: 35.00,
        
        appliedVouchers: [],
        appliedDiscounts: [],
        totalDiscountAmount: 0,
        
        commission: {
            professionalPercentage: 60,
            establishmentPercentage: 40,
            baseAmount: 35.00,
            professionalAmount: 21.00,
            establishmentAmount: 14.00
        },
        
        payment: {
            method: "pix",
            status: "paid",
            paidAmount: 35.00,
            remainingAmount: 0,
            paymentDate: "2025-10-16T10:45:00Z",
            transactionId: "pix_12345"
        },
        
        createdAt: "2025-10-05T14:20:00Z",
        updatedAt: "2025-10-16T10:45:00Z",
        completedAt: "2025-10-16T10:45:00Z",
        
        rating: {
            score: 5,
            comment: "Excelente atendimento, muito caprichosa!",
            ratedAt: "2025-10-16T11:00:00Z"
        }
    },
    {
        id: "apt_003",
        serviceId: "service_003",
        serviceName: "Massagem Relaxante",
        professionalId: "5",
        professionalName: "Beatriz Santos",
        
        customer: "Carlos Silva",
        email: "carlos.silva@example.com",
        phone: "(31) 77777-7777",
        customerNotes: "Primeira vez, tem sensibilidade nas costas",
        
        date: "2025-10-17T00:00:00Z",
        time: "16:00",
        duration: 90,
        status: "canceled",
        
        originalPrice: 120.00,
        finalPrice: 108.00, // Desconto de fidelidade
        
        appliedVouchers: [],
        appliedDiscounts: [{
            id: "disc_001",
            type: "percentage",
            value: 10,
            description: "Desconto cliente fidelidade",
            appliedBy: "system",
            reason: "Cliente com mais de 5 agendamentos"
        }],
        totalDiscountAmount: 12.00,
        
        commission: {
            professionalPercentage: 65,
            establishmentPercentage: 35,
            baseAmount: 108.00,
            professionalAmount: 70.20,
            establishmentAmount: 37.80
        },
        
        payment: {
            method: "pending",
            status: "pending",
            paidAmount: 0,
            remainingAmount: 108.00
        },
        
        createdAt: "2025-10-06T09:15:00Z",
        updatedAt: "2025-10-07T08:30:00Z",
        canceledAt: "2025-10-07T08:30:00Z",
        cancellationReason: "Cliente precisou cancelar por motivos pessoais",
        cancellationFee: 20.00, // Taxa de cancelamento
        
        professionalNotes: "Cliente cancelou com antecedência adequada"
    },
    
    // Agendamento em andamento para testar finalização
    {
        id: "apt_004",
        serviceId: "service_001", 
        serviceName: "Corte de Cabelo Masculino",
        professionalId: "prof_002",
        professionalName: "João Santos",
        
        customer: "Carlos Silva",
        email: "carlos.silva@email.com",
        phone: "(11) 99887-7766",
        customerNotes: "Prefere corte social",
        
        date: "2025-10-07T15:00:00Z",
        time: "15:00",
        duration: 45,
        status: "in_progress",
        
        originalPrice: 50.00,
        finalPrice: 50.00,
        totalDiscountAmount: 0,
        
        commission: {
            professionalPercentage: 70,
            establishmentPercentage: 30,
            baseAmount: 50.00,
            professionalAmount: 35.00,
            establishmentAmount: 15.00
        },
        
        payment: {
            method: 'pending',
            status: 'pending'
        },
        
        createdAt: "2025-10-07T14:00:00Z",
        updatedAt: "2025-10-07T15:00:00Z",
        confirmedAt: "2025-10-07T14:30:00Z",
        
        professionalNotes: "Cliente chegou no horário"
    },
    
    // Agendamento similar ao da imagem - Manicure Maria Silva
    {
        id: "apt_005", 
        serviceId: "service_002",
        serviceName: "Manicure",
        professionalId: "2",
        professionalName: "Maria Silva",
        
        customer: "Maria Silva",
        email: "maria@email.com",
        phone: "(11) 99999-1111",
        customerNotes: "Cliente prefere bem curto",
        
        date: "2025-10-12T00:00:00Z",
        time: "09:00",
        duration: 60,
        status: "confirmed",
        
        originalPrice: 50.00,
        finalPrice: 50.00,
        totalDiscountAmount: 0,
        
        commission: {
            professionalPercentage: 70,
            establishmentPercentage: 30,
            baseAmount: 50.00,
            professionalAmount: 35.00,
            establishmentAmount: 15.00
        },
        
        payment: {
            method: 'pending',
            status: 'pending'
        },
        
        createdAt: "2025-10-11T10:00:00Z",
        updatedAt: "2025-10-11T11:00:00Z",
        confirmedAt: "2025-10-11T11:00:00Z",
        
        professionalNotes: "Cliente regular, sempre pontual"
    },
    // Mais appointments para José da Silva (ID: 1) para os gráficos
    {
        id: "apt_006",
        serviceId: "service_manicure_002",
        serviceName: "Manicure + Pedicure",
        professionalId: "1",
        professionalName: "José da Silva",
        customer: "Fernanda Lima",
        email: "fernanda@email.com",
        phone: "(11) 98765-4321",
        date: "2025-10-15T14:00:00Z",
        time: "14:00",
        duration: 90,
        originalPrice: 80,
        finalPrice: 80,
        totalDiscountAmount: 0,
        status: "completed",
        commission: {
            professionalPercentage: 40,
            establishmentPercentage: 60,
            baseAmount: 80,
            professionalAmount: 32,
            establishmentAmount: 48
        },
        rating: {
            score: 5,
            comment: "Excelente trabalho!",
            ratedAt: "2025-10-15T16:00:00Z"
        },
        payment: {
            method: 'card',
            status: 'paid'
        },
        createdAt: "2025-10-15T14:00:00Z",
        updatedAt: "2025-10-15T15:30:00Z",
        completedAt: "2025-10-15T15:30:00Z"
    },
    {
        id: "apt_007",
        serviceId: "service_manicure_003",
        serviceName: "Esmaltação em Gel",
        professionalId: "1",
        professionalName: "José da Silva",
        customer: "Carla Santos",
        email: "carla@email.com",
        phone: "(11) 91234-5678",
        date: "2025-10-16T10:00:00Z",
        time: "10:00",
        duration: 60,
        originalPrice: 45,
        finalPrice: 45,
        totalDiscountAmount: 0,
        status: "completed",
        commission: {
            professionalPercentage: 40,
            establishmentPercentage: 60,
            baseAmount: 45,
            professionalAmount: 18,
            establishmentAmount: 27
        },
        rating: {
            score: 4,
            comment: "Muito bom!",
            ratedAt: "2025-10-16T11:30:00Z"
        },
        payment: {
            method: 'pix',
            status: 'paid'
        },
        createdAt: "2025-10-16T10:00:00Z",
        updatedAt: "2025-10-16T11:00:00Z",
        completedAt: "2025-10-16T11:00:00Z"
    },
    {
        id: "apt_008",
        serviceId: "service_manicure_001",
        serviceName: "Manicure Simples",
        professionalId: "1",
        professionalName: "José da Silva",
        customer: "Julia Costa",
        email: "julia@email.com",
        phone: "(11) 95555-1234",
        date: "2025-10-17T09:00:00Z",
        time: "09:00",
        duration: 60,
        originalPrice: 30,
        finalPrice: 30,
        totalDiscountAmount: 0,
        status: "scheduled",
        commission: {
            professionalPercentage: 40,
            establishmentPercentage: 60,
            baseAmount: 30,
            professionalAmount: 12,
            establishmentAmount: 18
        },
        payment: {
            method: 'pending',
            status: 'pending'
        },
        createdAt: "2025-10-17T09:00:00Z",
        updatedAt: "2025-10-17T09:00:00Z"
    },
    {
        id: "apt_009",
        serviceId: "service_manicure_002",
        serviceName: "Manicure + Pedicure",
        professionalId: "1",
        professionalName: "José da Silva",
        customer: "Patricia Rocha",
        email: "patricia@email.com",
        phone: "(11) 94444-5678",
        date: "2025-10-18T15:00:00Z",
        time: "15:00",
        duration: 90,
        originalPrice: 80,
        finalPrice: 80,
        totalDiscountAmount: 0,
        status: "canceled",
        commission: {
            professionalPercentage: 40,
            establishmentPercentage: 60,
            baseAmount: 80,
            professionalAmount: 32,
            establishmentAmount: 48
        },
        payment: {
            method: 'pending',
            status: 'pending'
        },
        createdAt: "2025-10-18T15:00:00Z",
        updatedAt: "2025-10-18T15:00:00Z",
        canceledAt: "2025-10-18T15:00:00Z"
    },
    {
        id: "apt_010",
        serviceId: "service_manicure_001",
        serviceName: "Manicure Simples",
        professionalId: "1",
        professionalName: "José da Silva",
        customer: "Sandra Oliveira",
        email: "sandra@email.com",
        phone: "(11) 93333-9999",
        date: "2025-10-19T11:00:00Z",
        time: "11:00",
        duration: 60,
        originalPrice: 30,
        finalPrice: 30,
        totalDiscountAmount: 0,
        status: "no_show",
        commission: {
            professionalPercentage: 40,
            establishmentPercentage: 60,
            baseAmount: 30,
            professionalAmount: 12,
            establishmentAmount: 18
        },
        payment: {
            method: 'pending',
            status: 'pending'
        },
        createdAt: "2025-10-19T11:00:00Z",
        updatedAt: "2025-10-19T11:00:00Z"
    }
];

export default appointments;