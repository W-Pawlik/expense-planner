import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorizationService } from "../services/authorizationService";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authorizationService.loginUser,
    onSuccess: ({ user, token }) => {
      localStorage.setItem("token", token);
      queryClient.setQueryData(["me"], user);
    },
  });
};
