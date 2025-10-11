export type PlanType = "business" | "individual" | "simple_booking";

export interface User {
  id?: number;
  username: string;
  password: string;
  role: "admin" | "professional" | "owner" | "simple";
  planType?: PlanType;
}
