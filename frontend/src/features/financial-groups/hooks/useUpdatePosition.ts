import { useMutation, useQueryClient } from "@tanstack/react-query";
import { positionsService } from "../services/positionsService";
import type { UpdatePositionInput } from "../models/createPosition.schema";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const useUpdatePosition = (groupId: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      positionId,
      changes,
    }: {
      positionId: string;
      changes: UpdatePositionInput;
    }) => {
      if (!groupId) throw new Error("No group selected");
      return positionsService.updatePosition(groupId, positionId, changes);
    },
    onSuccess: () => {
      if (!groupId) return;
      qc.invalidateQueries({
        queryKey: financialGroupsQueryKeys.details(groupId),
      });
    },
  });
};
