import { z } from "zod";

export const storage = {
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  getWithSchema<T>(key: string, schema: z.ZodType<T>): T | null {
    const data = this.get<unknown>(key);
    if (data == null) return null;

    const parsed = schema.safeParse(data);
    if (!parsed.success) return null;

    return parsed.data;
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },

  setRaw(key: string, value: string): void {
    localStorage.setItem(key, value);
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  has(key: string): boolean {
    return localStorage.getItem(key) != null;
  },
} as const;
