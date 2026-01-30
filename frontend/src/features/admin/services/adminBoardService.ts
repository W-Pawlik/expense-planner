import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import type {
  AdminBoardPage,
  AdminPendingPlanDetails,
} from "../types/adminBoard.types";

export const adminBoardService = {
  async fetchPending(page: number, limit: number) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return httpClient.requestAuthJson<AdminBoardPage>(
      `/admin/board/pending?${params.toString()}`,
      token,
      { method: "GET", headers: httpClient.jsonHeaders }
    );
  },

  async fetchPendingDetails(postId: string) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<AdminPendingPlanDetails>(
      `/admin/board/pending/${postId}`,
      token,
      { method: "GET", headers: httpClient.jsonHeaders }
    );
  },

  async approvePost(postId: string) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<void>(
      `/admin/board/posts/${postId}/approve`,
      token,
      { method: "POST", headers: httpClient.jsonHeaders }
    );
  },

  async rejectPost(postId: string) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<void>(
      `/admin/board/posts/${postId}/reject`,
      token,
      { method: "POST", headers: httpClient.jsonHeaders }
    );
  },
} as const;
