import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorizationService } from "../services/authorizationService";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authorizationService.loginUser,
    onSuccess: ({ user, token }) => {
      localStorage.setItem("token", token);
      queryClient.setQueryData(["me"], user);
      navigate("/financialGroups");
    },
  });
};
