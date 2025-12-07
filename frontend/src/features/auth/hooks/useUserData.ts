import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "../services/authorizationService";
import { authQueryKeys } from "../consts/authQueryKeys";
import { authStorage } from "../utils/authStorage";

export const useUserData = () => {
  const token = authStorage.getToken();

  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authorizationService.fetchUserData,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
};
