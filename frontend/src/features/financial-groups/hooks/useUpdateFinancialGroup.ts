import { useMutation, useQueryClient } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";
import type { UpdateFinancialGroupInput } from "../types/financialGroup.types";

export const useUpdateFinancialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      changes,
    }: {
      groupId: string;
      changes: UpdateFinancialGroupInput;
    }) => financialGroupsService.updateFinancialGroup(groupId, changes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: financialGroupsQueryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: financialGroupsQueryKeys.details(updated.id),
      });
    },
  });
};
