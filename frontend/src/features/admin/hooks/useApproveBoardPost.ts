import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBoardService } from "../services/adminBoardService";
import { PENDING_BOARD_QUERY_KEY } from "./usePendingBoardPosts";

export const useApproveBoardPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => adminBoardService.approvePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_BOARD_QUERY_KEY });
    },
  });
};
