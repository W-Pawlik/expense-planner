import { env } from "../../../core/config/env";
import { accountUrls } from "../consts/accountUrls";
import { authStorage } from "../../auth/utils/authStorage";
import type { User } from "../../auth/types/credentials";

export const accountService = {
  async fetchMe(): Promise<User | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    const res = await fetch(`${env.apiUrl}${accountUrls.me}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      authStorage.clearToken();
      return null;
    }

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.message ?? "Fetching user data failed");
    }

    return body as User;
  },
} as const;
