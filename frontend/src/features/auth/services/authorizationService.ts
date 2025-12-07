import type { LoginCredentials } from "../auth.schemas";
import type { User } from "../types/credentials";

export interface IAuthorizationService {
  loginUser(data: LoginCredentials): Promise<{ user: User; token: string }>;
  fetchUserData(): Promise<User | null>;
}

export const authorizationService: IAuthorizationService = {
  loginUser: async (data: LoginCredentials) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Logging failed");
      }

      return res.json() as Promise<{ user: User; token: string }>;
    } catch {
      throw new Error("Unexpected error occured during data fetching");
    }
  },

  fetchUserData: async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/userdata");

      const data = await res.json();

      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error(data?.message ?? "Fetching user data failed");
      }

      return data;
    } catch {
      throw new Error("Unexpected error occured during data fetching");
    }
  },
};
