/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "../../../core/http/httpClient";
import { authStorage } from "../../auth/utils/authStorage";
import { accountUrls } from "../consts/accountUrls";
import type { User } from "../../auth/types/credentials";

export const accountService = {
  async fetchMe(): Promise<User | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      return await httpClient.requestAuthJson<User>(accountUrls.me, token);
    } catch (e: any) {
      if (
        String(e?.message ?? "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        authStorage.clearToken();
        return null;
      }
      throw e;
    }
  },
} as const;
