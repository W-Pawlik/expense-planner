import { useMutation, useQueryClient } from "@tanstack/react-query";
import { positionsService } from "../services/positionsService";
import type { CreatePositionInput } from "../models/createPosition.schema";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useCreatePosition = (groupId: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePositionInput) => {
      if (!groupId) throw new Error("No group selected");
      return positionsService.createPosition(groupId, input);
    },
    onSuccess: () => {
      if (!groupId) return;
      qc.invalidateQueries({
        queryKey: financialGroupsQueryKeys.details(groupId),
      });
    },
  });
};
