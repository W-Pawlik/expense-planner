import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import type { AdminUsersPage } from "../types/adminUsers.types";

export const adminUsersService = {
  async fetchUsers(page: number, limit: number) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return httpClient.requestAuthJson<AdminUsersPage>(
      `/admin/users?${params.toString()}`,
      token,
      { method: "GET", headers: httpClient.jsonHeaders }
    );
  },

  async deleteUser(userId: string) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<void>(`/admin/users/${userId}`, token, {
      method: "DELETE",
      headers: httpClient.jsonHeaders,
    });
  },
} as const;
