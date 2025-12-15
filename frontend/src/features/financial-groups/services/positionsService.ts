import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import type {
  CreatePositionInput,
  UpdatePositionInput,
} from "../models/createPosition.schema";
import type { FinancialPosition } from "../types/financialPosition.types";

const requireToken = () => {
  const token = authStorage.getToken();
  if (!token) throw new Error("Not authenticated");
  return token;
};

export interface IPositionsService {
  createPosition(
    groupId: string,
    data: CreatePositionInput
  ): Promise<FinancialPosition>;
  updatePosition(
    groupId: string,
    positionId: string,
    changes: UpdatePositionInput
  ): Promise<FinancialPosition>;
  deletePosition(groupId: string, positionId: string): Promise<void>;
}

export const positionsService: IPositionsService = {
  async createPosition(groupId, data) {
    const token = requireToken();
    return httpClient.requestAuthJson<FinancialPosition>(
      `/groups/${groupId}/positions`,
      token,
      {
        method: "POST",
        headers: httpClient.jsonHeaders,
        body: JSON.stringify(data),
      }
    );
  },

  async updatePosition(groupId, positionId, changes) {
    const token = requireToken();
    return httpClient.requestAuthJson<FinancialPosition>(
      `/groups/${groupId}/positions/${positionId}`,
      token,
      {
        method: "PATCH",
        headers: httpClient.jsonHeaders,
        body: JSON.stringify(changes),
      }
    );
  },

  async deletePosition(groupId, positionId) {
    const token = requireToken();
    await httpClient.requestAuthJson<unknown>(
      `/groups/${groupId}/positions/${positionId}`,
      token,
      { method: "DELETE" }
    );
  },
};
