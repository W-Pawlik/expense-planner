import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";

export interface BoardPost {
  id: string;
  groupId: string;
  authorId: string;
  description?: string;
  publicationStatus: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface IBoardUserService {
  publishGroup(
    groupId: string,
    description?: string | null
  ): Promise<BoardPost>;
  hideGroup(groupId: string): Promise<void>;
}

export const boardUserService: IBoardUserService = {
  async publishGroup(groupId, description) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<BoardPost>(
      `/board/groups/${groupId}/publish`,
      token,
      {
        method: "POST",
        headers: httpClient.jsonHeaders,
        body: JSON.stringify(description ? { description } : {}),
      }
    );
  },

  async hideGroup(groupId) {
    const token = authStorage.getToken();
    if (!token) throw new Error("No auth token");

    return httpClient.requestAuthJson<void>(
      `/board/groups/${groupId}/hide`,
      token,
      {
        method: "POST",
      }
    );
  },
};
