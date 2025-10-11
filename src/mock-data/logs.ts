import type { SystemLog, ActivityLog } from "@/interfaces/log.interface";

export const systemLogs: SystemLog[] = [
    {
        id: "log-001",
        timestamp: "2025-01-11T10:30:00Z",
        action: "user_login",
        level: "info",
        userId: 1,
        userName: "Maria Silva",
        userEmail: "business@schedfy.com",
        companyId: "comp-001",
        companyName: "Salão Bella Vista",
        details: {
            loginMethod: "email_password",
            deviceType: "desktop",
        },
        metadata: {
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            location: "São Paulo, BR",
        },
    },
    {
        id: "log-002",
        timestamp: "2025-01-11T09:15:00Z",
        action: "appointment_created",
        level: "info",
        userId: 2,
        userName: "Ana Costa",
        userEmail: "individual@schedfy.com",
        companyId: "comp-002",
        companyName: "Studio Ana Costa",
        details: {
            appointmentId: "apt-123",
            customerName: "Cliente Teste",
            serviceName: "Corte de Cabelo",
            appointmentDate: "2025-01-15T14:00:00Z",
        },
        metadata: {
            ipAddress: "192.168.1.101",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            location: "Rio de Janeiro, BR",
        },
    },
    {
        id: "log-003",
        timestamp: "2025-01-11T08:45:00Z",
        action: "payment_failed",
        level: "error",
        userId: 15,
        userName: "Jennifer Smith",
        userEmail: "jennifer@thespanyc.com",
        companyId: "comp-005",
        companyName: "The Spa NYC",
        details: {
            subscriptionId: "sub-005",
            amount: 99.00,
            currency: "USD",
            errorCode: "card_declined",
            errorMessage: "Insufficient funds",
            attemptNumber: 3,
        },
        metadata: {
            ipAddress: "10.0.0.50",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            location: "New York, US",
        },
    },
    {
        id: "log-004",
        timestamp: "2025-01-11T07:00:00Z",
        action: "company_suspended",
        level: "warning",
        companyId: "comp-005",
        companyName: "The Spa NYC",
        details: {
            reason: "payment_failure",
            attemptsMade: 3,
            lastPaymentAttempt: "2025-01-11T06:45:00Z",
            suspendedBy: "system",
        },
        metadata: {
            ipAddress: "system",
            userAgent: "Schedfy-Cron-Job/1.0",
        },
    },
    {
        id: "log-005",
        timestamp: "2025-01-10T15:20:00Z",
        action: "plan_changed",
        level: "info",
        userId: 3,
        userName: "Carlos Mendes",
        userEmail: "carlos@example.com",
        companyId: "comp-003",
        companyName: "Barbearia Moderna",
        details: {
            oldPlan: "individual",
            newPlan: "simple_booking",
            reason: "downgrade",
            effectiveDate: "2025-02-01T00:00:00Z",
        },
        metadata: {
            ipAddress: "192.168.1.102",
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            location: "São Paulo, BR",
        },
    },
    {
        id: "log-006",
        timestamp: "2025-01-10T14:00:00Z",
        action: "company_created",
        level: "info",
        userId: 10,
        userName: "Sofia Ferreira",
        userEmail: "sofia@beautylounge.pt",
        companyId: "comp-004",
        companyName: "Beauty Lounge Lisboa",
        details: {
            planType: "business",
            status: "trial",
            trialDays: 14,
            country: "PT",
        },
        metadata: {
            ipAddress: "85.240.12.34",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            location: "Lisboa, PT",
        },
    },
    {
        id: "log-007",
        timestamp: "2025-01-10T11:30:00Z",
        action: "professional_created",
        level: "info",
        userId: 1,
        userName: "Maria Silva",
        userEmail: "business@schedfy.com",
        companyId: "comp-001",
        companyName: "Salão Bella Vista",
        details: {
            professionalId: "prof-123",
            professionalName: "Carla Santos",
            professionalEmail: "carla@bellavista.com.br",
            specialty: "Manicure",
        },
        metadata: {
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            location: "São Paulo, BR",
        },
    },
    {
        id: "log-008",
        timestamp: "2025-01-09T16:45:00Z",
        action: "payment_succeeded",
        level: "info",
        userId: 2,
        userName: "Ana Costa",
        userEmail: "individual@schedfy.com",
        companyId: "comp-002",
        companyName: "Studio Ana Costa",
        details: {
            subscriptionId: "sub-002",
            amount: 2388.00,
            currency: "BRL",
            paymentMethod: "pix",
            transactionId: "pix-txn-789",
        },
        metadata: {
            ipAddress: "192.168.1.101",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            location: "Rio de Janeiro, BR",
        },
    },
    {
        id: "log-009",
        timestamp: "2025-01-09T10:00:00Z",
        action: "appointment_completed",
        level: "info",
        userId: 5,
        userName: "João Santos",
        userEmail: "simple@schedfy.com",
        companyId: "comp-003",
        companyName: "Barbearia Moderna",
        details: {
            appointmentId: "apt-456",
            customerName: "Pedro Oliveira",
            serviceName: "Corte + Barba",
            duration: 45,
            revenue: 60.00,
            paymentMethod: "cash",
        },
        metadata: {
            ipAddress: "192.168.1.103",
            userAgent: "Mozilla/5.0 (Android 12; Mobile)",
            location: "São Paulo, BR",
        },
    },
    {
        id: "log-010",
        timestamp: "2025-01-08T18:30:00Z",
        action: "subscription_renewed",
        level: "info",
        userId: 1,
        userName: "Maria Silva",
        userEmail: "business@schedfy.com",
        companyId: "comp-001",
        companyName: "Salão Bella Vista",
        details: {
            subscriptionId: "sub-001",
            planType: "business",
            amount: 499.00,
            currency: "BRL",
            nextBillingDate: "2025-02-15T10:00:00Z",
        },
        metadata: {
            ipAddress: "system",
            userAgent: "Schedfy-Payment-Service/1.0",
        },
    },
];

export const activityLogs: ActivityLog[] = systemLogs.map((log) => ({
    ...log,
    description: getLogDescription(log),
}));

function getLogDescription(log: SystemLog): string {
    const userName = log.userName || "Usuário";
    const companyName = log.companyName ? ` - ${log.companyName}` : "";

    switch (log.action) {
        case "user_login":
            return `${userName} fez login${companyName}`;
        case "user_logout":
            return `${userName} fez logout${companyName}`;
        case "user_created":
            return `Novo usuário criado: ${userName}${companyName}`;
        case "company_created":
            return `Nova empresa criada: ${log.companyName}`;
        case "company_suspended":
            return `Empresa suspensa: ${log.companyName} - ${log.details.reason}`;
        case "company_activated":
            return `Empresa ativada: ${log.companyName}`;
        case "plan_changed":
            return `${userName} alterou o plano de ${log.details.oldPlan} para ${log.details.newPlan}${companyName}`;
        case "payment_succeeded":
            return `Pagamento realizado com sucesso: ${log.details.currency} ${log.details.amount}${companyName}`;
        case "payment_failed":
            return `Falha no pagamento: ${log.details.errorMessage}${companyName}`;
        case "appointment_created":
            return `Agendamento criado: ${log.details.customerName} - ${log.details.serviceName}${companyName}`;
        case "appointment_completed":
            return `Agendamento concluído: ${log.details.customerName}${companyName}`;
        case "professional_created":
            return `Profissional adicionado: ${log.details.professionalName}${companyName}`;
        case "subscription_renewed":
            return `Assinatura renovada${companyName}`;
        default:
            return `${log.action}${companyName}`;
    }
}

export default systemLogs;
