import { useQuery } from "@tanstack/react-query";
import { publicBoardService } from "../services/publicBoardService";

export const usePublicBoard = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ["publicBoard", { page, limit }],
    queryFn: () => publicBoardService.fetchPublicBoard(page, limit),
    placeholderData: (previousData) => previousData,
  });
};
