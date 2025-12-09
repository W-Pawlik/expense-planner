import { createApp } from '../app';
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';

describe('GET /health', () => {
  it("should return 200 OK with status 'ok'", async () => {
    const app = createApp();

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
