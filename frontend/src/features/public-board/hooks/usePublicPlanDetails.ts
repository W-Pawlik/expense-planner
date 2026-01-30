import { useQuery } from "@tanstack/react-query";
import { publicBoardService } from "../services/publicBoardService";

export const usePublicPlanDetails = (groupId?: string) => {
  return useQuery({
    queryKey: ["publicPlanDetails", groupId],
    queryFn: () => publicBoardService.fetchPublicPlanDetails(groupId!),
    enabled: !!groupId,
  });
};
