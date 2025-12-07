/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginFormValues } from "../models/login.schema";
import type { RegisterFormValues } from "../models/register.schema";
import type { User } from "../types/credentials";

import { httpClient } from "../../../core/http/httpClient";
import { authUrls } from "../consts/authUrls";
import { authStorage } from "../utils/authStorage";

type AuthResponse = { user: User; token: string };

export interface IAuthorizationService {
  registerUser: (data: RegisterFormValues) => Promise<AuthResponse>;
  loginUser: (data: LoginFormValues) => Promise<AuthResponse>;
  fetchUserData: () => Promise<User | null>;
}

export const authorizationService: IAuthorizationService = {
  registerUser: async (data) => {
    const payload = {
      login: data.login,
      email: data.email,
      password: data.password,
    };

    return httpClient.requestJson<AuthResponse>(authUrls.register, {
      method: "POST",
      headers: httpClient.jsonHeaders,
      body: JSON.stringify(payload),
    });
  },

  loginUser: async (data) => {
    return httpClient.requestJson<AuthResponse>(authUrls.login, {
      method: "POST",
      headers: httpClient.jsonHeaders,
      body: JSON.stringify(data),
    });
  },

  fetchUserData: async () => {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      return await httpClient.requestAuthJson<User>(authUrls.me, token);
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
};
