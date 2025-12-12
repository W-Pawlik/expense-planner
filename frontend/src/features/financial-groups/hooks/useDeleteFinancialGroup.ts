import { useMutation, useQueryClient } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useDeleteFinancialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) =>
      financialGroupsService.deleteFinancialGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialGroupsQueryKeys.list(),
      });
    },
  });
};
