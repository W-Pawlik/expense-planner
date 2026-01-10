import { useMutation, useQueryClient } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import type { VisibilityStatus } from "../types/financialGroup.types";

export const useChangeGroupVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      groupId: string;
      visibilityStatus: VisibilityStatus;
    }) => financialGroupsService.changeVisibility(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialGroups"] });
    },
  });
};
