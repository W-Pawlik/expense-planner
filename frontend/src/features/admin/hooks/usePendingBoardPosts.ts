import { useQuery } from "@tanstack/react-query";
import { adminBoardService } from "../services/adminBoardService";

export const PENDING_BOARD_QUERY_KEY = ["admin", "board", "pending"];

export const usePendingBoardPosts = (page: number, limit: number) => {
  return useQuery({
    queryKey: [...PENDING_BOARD_QUERY_KEY, page, limit],
    queryFn: () => adminBoardService.fetchPending(page, limit),
    placeholderData: (previousData) => previousData,
  });
};
