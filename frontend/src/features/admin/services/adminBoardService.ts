import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import type { AdminBoardPage } from "../types/adminBoard.types";

export interface IAdminBoardService {
  fetchPending(page: number, limit: number): Promise<AdminBoardPage>;
  approvePost(postId: string): Promise<void>;
  rejectPost(postId: string): Promise<void>;
}

const BASE_URL = "/admin/board";

export const adminBoardService: IAdminBoardService = {
  async fetchPending(page, limit) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    const search = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();

    return httpClient.requestAuthJson<AdminBoardPage>(
      `${BASE_URL}/pending?${search}`,
      token
    );
  },

  async approvePost(postId) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    await httpClient.requestAuthJson<void>(
      `${BASE_URL}/posts/${postId}/approve`,
      token,
      {
        method: "POST",
        headers: httpClient.jsonHeaders,
      }
    );
  },

  async rejectPost(postId) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    await httpClient.requestAuthJson<void>(
      `${BASE_URL}/posts/${postId}/reject`,
      token,
      {
        method: "POST",
        headers: httpClient.jsonHeaders,
      }
    );
  },
};
