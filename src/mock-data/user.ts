import type { User } from "@/interfaces/user.interface";

const users: User[] = [
    {
        id: 1,
        username: "admin@gmail.com",
        password: "P@ssw0rd",
        role: "admin",
    },
    {
        id: 3,
        username: "jose.silva@example.com",
        password: "P@ssw0rd",
        role: "professional",
    },

];

export default users;
