export interface Business {
    id: string;
    name: string;
    slug: string; // URL amigável: schedfy.com/b/nome-do-negocio
    description: string;
    logo?: string;
    coverImage?: string;
    category: string;
    phone: string;
    email: string;
    website?: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    businessHours: {
        monday?: { open: string; close: string } | { closed: true };
        tuesday?: { open: string; close: string } | { closed: true };
        wednesday?: { open: string; close: string } | { closed: true };
        thursday?: { open: string; close: string } | { closed: true };
        friday?: { open: string; close: string } | { closed: true };
        saturday?: { open: string; close: string } | { closed: true };
        sunday?: { open: string; close: string } | { closed: true };
    };
    rating: {
        average: number;
        count: number;
    };
    reviews: Review[];
    planType: "business" | "individual" | "simple_booking";
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    businessId: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    serviceType?: string;
    date: string;
    response?: {
        text: string;
        date: string;
    };
}
