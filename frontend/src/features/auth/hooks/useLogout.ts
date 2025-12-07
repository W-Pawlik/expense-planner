import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { authQueryKeys } from "../consts/authQueryKeys";
import { authStorage } from "../utils/authStorage";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useCallback(() => {
    authStorage.clearToken();
    queryClient.removeQueries({ queryKey: authQueryKeys.me });
    navigate("/login", { replace: true });
  }, [queryClient, navigate]);
};
