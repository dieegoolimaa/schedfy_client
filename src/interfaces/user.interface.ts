export type PlanType = "business" | "individual" | "simple_booking";

export type UserRole = "platform_admin" | "admin" | "customer" | "professional" | "business_owner";

export interface User {
  id?: number;
  username: string;
  password: string;
  role: UserRole;
  planType?: PlanType;
  name?: string;
  email?: string;
}
