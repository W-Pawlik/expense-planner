/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { financialGroupsService } from "../services/financialGroupsService";
import type {
  VisibilityStatus,
  FinancialGroupSummary,
} from "../types/financialGroup.types";

export const useChangeGroupVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      groupId: string;
      visibilityStatus: VisibilityStatus;
    }) => financialGroupsService.changeVisibility(params),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["financialGroups"] });
      await queryClient.cancelQueries({
        queryKey: ["financialGroupDetails", vars.groupId],
      });

      const prevGroups = queryClient.getQueryData<FinancialGroupSummary[]>([
        "financialGroups",
      ]);
      const prevDetails = queryClient.getQueryData<any>([
        "financialGroupDetails",
        vars.groupId,
      ]);

      queryClient.setQueryData<FinancialGroupSummary[] | undefined>(
        ["financialGroups"],
        (old) =>
          old?.map((g) =>
            g.id === vars.groupId
              ? { ...g, visibilityStatus: vars.visibilityStatus }
              : g
          )
      );

      queryClient.setQueryData(
        ["financialGroupDetails", vars.groupId],
        (old: any) =>
          old ? { ...old, visibilityStatus: vars.visibilityStatus } : old
      );

      return { prevGroups, prevDetails };
    },

    onError: (_err, vars, ctx) => {
      if (ctx?.prevGroups)
        queryClient.setQueryData(["financialGroups"], ctx.prevGroups);
      if (ctx?.prevDetails)
        queryClient.setQueryData(
          ["financialGroupDetails", vars.groupId],
          ctx.prevDetails
        );
    },

    onSuccess: (updated, vars) => {
      queryClient.setQueryData<FinancialGroupSummary[] | undefined>(
        ["financialGroups"],
        (old) =>
          old?.map((g) =>
            g.id === vars.groupId
              ? { ...g, visibilityStatus: updated.visibilityStatus }
              : g
          )
      );

      queryClient.setQueryData(
        ["financialGroupDetails", vars.groupId],
        (old: any) =>
          old ? { ...old, visibilityStatus: updated.visibilityStatus } : old
      );
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["financialGroups"] });
      queryClient.invalidateQueries({
        queryKey: ["financialGroupDetails", vars.groupId],
      });
    },
  });
};
