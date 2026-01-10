import { httpClient } from "../../../core/http/httpClient";
import type {
  PublicBoardPage,
  PublicBoardPost,
} from "../types/publicBoard.types";

export interface IPublicBoardService {
  fetchPublicBoard(page: number, limit?: number): Promise<PublicBoardPage>;
  fetchPublicPost(postId: string): Promise<PublicBoardPost>;
}

const DEFAULT_LIMIT = 10;

export const publicBoardService: IPublicBoardService = {
  async fetchPublicBoard(page: number, limit = DEFAULT_LIMIT) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return httpClient.requestJson<PublicBoardPage>(
      `/board/public?${params.toString()}`
    );
  },

  async fetchPublicPost(postId: string) {
    return httpClient.requestJson<PublicBoardPost>(`/board/public/${postId}`);
  },
};
