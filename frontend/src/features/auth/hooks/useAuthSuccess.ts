import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authQueryKeys } from "../consts/authQueryKeys";
import { authStorage } from "../utils/authStorage";
import type { User } from "../types/credentials";

type AuthSuccessPayload = { user: User; token: string };

export const useAuthSuccess = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return ({ user, token }: AuthSuccessPayload) => {
    authStorage.setToken(token);
    queryClient.setQueryData(authQueryKeys.me, user);
    navigate("/financialGroups", { replace: true });
  };
};
