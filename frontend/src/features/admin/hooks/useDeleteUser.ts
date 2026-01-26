import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminUsersService";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsers";

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUsersService.deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
};
