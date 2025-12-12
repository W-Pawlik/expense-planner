import { useQuery } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useFinancialGroups = () => {
  return useQuery({
    queryKey: financialGroupsQueryKeys.list(),
    queryFn: financialGroupsService.getFinancialGroups,
  });
};
