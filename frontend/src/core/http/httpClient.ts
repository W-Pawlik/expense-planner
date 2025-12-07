import { env } from "../config/env";

const jsonHeaders = {
  "Content-Type": "application/json",
};

const parseBody = async (res: Response) => {
  return res.json().catch(() => null);
};

const buildUrl = (path: string) => `${env.apiUrl}${path}`;

export const httpClient = {
  jsonHeaders,

  async requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(buildUrl(path), options);
    const body = await parseBody(res);

    if (!res.ok) {
      throw new Error(body?.message ?? "Request failed");
    }

    return body as T;
  },

  async requestAuthJson<T>(
    path: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(buildUrl(path), {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await parseBody(res);

    if (!res.ok) {
      throw new Error(body?.message ?? "Request failed");
    }

    return body as T;
  },
} as const;
