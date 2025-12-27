import { useQuery } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useFinancialGroupDetails = (groupId: string | null) => {
  return useQuery({
    queryKey: financialGroupsQueryKeys.details(groupId as string),
    queryFn: () => financialGroupsService.getFinancialGroup(groupId as string),
    enabled: !!groupId,
  });
};
