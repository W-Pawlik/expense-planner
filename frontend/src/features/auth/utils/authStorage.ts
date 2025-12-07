import { storage } from "../../../core/utils/storage";
import { authStorageKeys } from "../consts/authStorageKeys";

export const authStorage = {
  getToken(): string | null {
    return storage.get<string>(authStorageKeys.token);
  },

  setToken(token: string) {
    storage.set(authStorageKeys.token, token);
  },

  clearToken() {
    storage.remove(authStorageKeys.token);
  },

  hasToken() {
    return storage.has(authStorageKeys.token);
  },
} as const;
