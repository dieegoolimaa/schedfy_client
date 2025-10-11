// Mock data de empresas suspensas
// Em produção, isso virá do backend

export const suspendedCompanies = [
    {
        email: "suspended@schedfy.com",
        reason: "payment_overdue",
        suspendedAt: "2025-10-01T00:00:00.000Z",
        daysOverdue: 15,
    },
];

export const isSuspendedAccount = (email: string): boolean => {
    return suspendedCompanies.some((company) => company.email === email);
};

export const getSuspensionInfo = (email: string) => {
    return suspendedCompanies.find((company) => company.email === email);
};
