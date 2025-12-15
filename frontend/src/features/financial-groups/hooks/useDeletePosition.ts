import { useMutation, useQueryClient } from "@tanstack/react-query";
import { positionsService } from "../services/positionsService";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useDeletePosition = (groupId: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (positionId: string) => {
      if (!groupId) throw new Error("No group selected");
      return positionsService.deletePosition(groupId, positionId);
    },
    onSuccess: () => {
      if (!groupId) return;
      qc.invalidateQueries({
        queryKey: financialGroupsQueryKeys.details(groupId),
      });
    },
  });
};
