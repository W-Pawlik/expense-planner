import { useQuery } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminUsersService";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export const useAdminUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, page, limit],
    queryFn: () => adminUsersService.fetchUsers(page, limit),
    placeholderData: (prev) => prev,
  });
};
