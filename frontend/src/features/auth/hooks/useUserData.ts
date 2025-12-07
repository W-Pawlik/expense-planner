import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "../services/authorizationService";

export const useUserData = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["me"],
    queryFn: authorizationService.fetchUserData,
    retry: false,
    staleTime: Infinity,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
};
