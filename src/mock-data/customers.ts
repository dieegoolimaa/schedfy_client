export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

const customers: Customer[] = [
    { id: 'cust_001', name: 'Maria Santos', email: 'maria.santos@example.com', phone: '(11) 99999-9999' },
    { id: 'cust_002', name: 'Carlos Silva', email: 'carlos.silva@example.com', phone: '(11) 99887-7766' }
];

export default customers;
