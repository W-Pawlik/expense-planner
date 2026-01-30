import { useQuery } from "@tanstack/react-query";
import { adminBoardService } from "../services/adminBoardService";

export const usePendingBoardPostDetails = (postId?: string) => {
  return useQuery({
    queryKey: ["admin", "board", "pending", "details", postId],
    queryFn: () => adminBoardService.fetchPendingDetails(postId!),
    enabled: !!postId,
  });
};
