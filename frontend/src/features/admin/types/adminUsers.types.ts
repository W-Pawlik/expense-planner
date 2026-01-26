export interface AdminUser {
  id: string;
  login: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
}

export interface AdminUsersPage {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}
