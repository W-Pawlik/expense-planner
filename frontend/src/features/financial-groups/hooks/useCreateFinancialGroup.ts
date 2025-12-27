import { useMutation, useQueryClient } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";
import type { CreateFinancialGroupInput } from "../models/createFinancialGroup.schema";

export const useCreateFinancialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFinancialGroupInput) =>
      financialGroupsService.createFinancialGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialGroupsQueryKeys.list(),
      });
    },
  });
};
