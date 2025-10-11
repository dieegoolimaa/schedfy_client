import type { User } from "@/interfaces/user.interface";

const users: User[] = [
    // Business Plan - Full access (owner/admin)
    {
        id: 1,
        username: "business@schedfy.com",
        password: "P@ssw0rd",
        role: "owner",
        planType: "business",
    },
    {
        id: 2,
        username: "admin@schedfy.com",
        password: "P@ssw0rd",
        role: "admin",
        planType: "business",
    },

    // Individual Plan - Single professional with business features
    {
        id: 3,
        username: "individual@schedfy.com",
        password: "P@ssw0rd",
        role: "owner", // Individual acts as owner of their own business
        planType: "individual",
    },

    // Simple Booking Plan - Basic appointment system
    {
        id: 4,
        username: "simple@schedfy.com",
        password: "P@ssw0rd",
        role: "simple",
        planType: "simple_booking",
    },

    // Professional accounts (work for business/individual)
    {
        id: 5,
        username: "jose.silva@example.com",
        password: "P@ssw0rd",
        role: "professional",
    },
    {
        id: 6,
        username: "maria.santos@example.com",
        password: "P@ssw0rd",
        role: "professional",
    }
];

export default users;
