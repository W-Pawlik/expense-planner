export interface User {
  id: string;
  login: string;
  email: string;
  role: "USER" | "ADMIN";
}
