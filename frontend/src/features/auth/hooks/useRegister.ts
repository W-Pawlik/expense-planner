import { useMutation } from "@tanstack/react-query";
import { authorizationService } from "../services/authorizationService";
import { useAuthSuccess } from "./useAuthSuccess";

export const useRegister = () => {
  const onAuthSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authorizationService.registerUser,
    onSuccess: onAuthSuccess,
  });
};
