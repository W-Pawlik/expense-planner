import type { LoginFormValues } from "../models/login.schema";
import type { RegisterFormValues } from "../models/register.schema";
import type { User } from "../types/credentials";

import { httpClient } from "../../../core/http/httpClient";
import { authUrls } from "../consts/authUrls";

type AuthResponse = { user: User; token: string };

export interface IAuthorizationService {
  registerUser: (data: RegisterFormValues) => Promise<AuthResponse>;
  loginUser: (data: LoginFormValues) => Promise<AuthResponse>;
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
};
