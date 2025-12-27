import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import { financialGroupsUrls } from "../consts/financialGroupsUrls";

import type { CreateFinancialGroupInput } from "../models/createFinancialGroup.schema";
import type {
  FinancialGroupSummary,
  FinancialGroupDetails,
  UpdateFinancialGroupInput,
  VisibilityStatus,
} from "../types/financialGroup.types";

export interface IFinancialGroupsService {
  getFinancialGroups(): Promise<FinancialGroupSummary[]>;
  getFinancialGroup(groupId: string): Promise<FinancialGroupDetails>;
  createFinancialGroup(
    data: CreateFinancialGroupInput
  ): Promise<FinancialGroupDetails>;
  updateFinancialGroup(
    groupId: string,
    changes: UpdateFinancialGroupInput
  ): Promise<FinancialGroupDetails>;
  deleteFinancialGroup(groupId: string): Promise<void>;
}

const requireToken = () => {
  const token = authStorage.getToken();
  if (!token) throw new Error("Not authenticated");
  return token;
};

export const financialGroupsService: IFinancialGroupsService = {
  async getFinancialGroups() {
    const token = requireToken();
    return httpClient.requestAuthJson<FinancialGroupSummary[]>(
      financialGroupsUrls.list,
      token
    );
  },

  async getFinancialGroup(groupId: string) {
    const token = requireToken();
    return httpClient.requestAuthJson<FinancialGroupDetails>(
      financialGroupsUrls.details(groupId),
      token
    );
  },

  async createFinancialGroup(data) {
    const token = requireToken();

    const payload: CreateFinancialGroupInput = {
      name: data.name,
      projectionYears: data.projectionYears,
      visibilityStatus: data.visibilityStatus as VisibilityStatus,
      description: data.description,
    };

    return httpClient.requestAuthJson<FinancialGroupDetails>(
      financialGroupsUrls.create,
      token,
      {
        method: "POST",
        headers: httpClient.jsonHeaders,
        body: JSON.stringify(payload),
      }
    );
  },

  async updateFinancialGroup(groupId, changes) {
    const token = requireToken();

    return httpClient.requestAuthJson<FinancialGroupDetails>(
      financialGroupsUrls.details(groupId),
      token,
      {
        method: "PATCH",
        headers: httpClient.jsonHeaders,
        body: JSON.stringify(changes),
      }
    );
  },

  async deleteFinancialGroup(groupId) {
    const token = requireToken();

    await httpClient.requestAuthJson<unknown>(
      financialGroupsUrls.details(groupId),
      token,
      {
        method: "DELETE",
      }
    );
  },
};
