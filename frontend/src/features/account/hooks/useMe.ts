import { useQuery } from "@tanstack/react-query";
import { accountService } from "../services/accountService";
import { accountQueryKeys } from "../consts/accountQueryKeys";
import { authStorage } from "../../auth/utils/authStorage";

export const useMe = () => {
  return useQuery({
    queryKey: accountQueryKeys.me,
    queryFn: accountService.fetchMe,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: authStorage.hasToken(),
    refetchOnWindowFocus: false,
  });
};
