/* eslint-disable @typescript-eslint/no-require-imports */
import request from 'supertest';
import express from 'express';

import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';
import { ApprovalStatus } from '../../../core/enums/ApprovalStatus.enum';

let currentUser = { sub: 'admin1', role: 'ADMIN' as 'USER' | 'ADMIN' };

jest.mock('../../../core/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = currentUser;
    next();
  },
}));

jest.mock('../../../core/middleware/roleguard.middleware.', () => ({
  roleGuard: (_role: string) => (_req: any, _res: any, next: any) => next(),
}));

const g: any = globalThis;

g.__userRepoMock = {
  findAll: jest.fn(),
  deleteById: jest.fn(),
  findByLogin: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  findById: jest.fn(),
};

g.__groupRepoMock = {
  findById: jest.fn(),
  findByIdAndOwner: jest.fn(),
  updateByIdAndOwner: jest.fn(),
};

g.__positionRepoMock = {
  findAllByGroup: jest.fn(),
  deleteManyByGroupId: jest.fn(),
};

g.__boardRepoMock = {
  findPending: jest.fn(),
  findById: jest.fn(),
  setApprovalStatus: jest.fn(),
  markRemovedForGroup: jest.fn(),
  findByGroupId: jest.fn(),
  findPublicByGroupId: jest.fn(),
  findPublicById: jest.fn(),
  findPublic: jest.fn(),
  findOrCreateForGroup: jest.fn(),
  deleteForGroup: jest.fn(),
};

jest.mock('../../../modules/users/infrastructure/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => (globalThis as any).__userRepoMock),
}));

jest.mock('../../../modules/financial-groups/infrastructure/group.repository', () => ({
  FinancialGroupRepository: jest.fn().mockImplementation(() => (globalThis as any).__groupRepoMock),
}));

jest.mock('../../../modules/financial-groups/infrastructure/position.repository', () => ({
  PositionRepository: jest.fn().mockImplementation(() => (globalThis as any).__positionRepoMock),
}));

jest.mock('../../../modules/board-post.model.ts/infrastructure/board.repository', () => ({
  BoardPostRepository: jest.fn().mockImplementation(() => (globalThis as any).__boardRepoMock),
}));

const userRepoMock = (globalThis as any).__userRepoMock;
const groupRepoMock = (globalThis as any).__groupRepoMock;
const positionRepoMock = (globalThis as any).__positionRepoMock;
const boardRepoMock = (globalThis as any).__boardRepoMock;

const buildApp = () => {
  const app = express();
  app.use(express.json());

  const { registerGroupRoutes } = require('../../routes/group.routes');
  const { registerBoardRoutes } = require('../../routes/board.routes');
  const { registerAdminRoutes } = require('../../routes/admin.routes');

  registerGroupRoutes(app);
  registerBoardRoutes(app);
  registerAdminRoutes(app);

  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err?.statusCode ?? 500).json({
      message: err?.message ?? 'Internal Server Error',
      details: err?.details,
    });
  });

  return app;
};

describe('ACCEPTANCE: Admin UAT (Users + Pending Board)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = { sub: 'admin1', role: 'ADMIN' };
  });

  test('GET /admin/users returns paged users list (mapped id)', async () => {
    userRepoMock.findAll.mockResolvedValue({
      users: [
        {
          _id: { toString: () => 'u1' },
          login: 'john',
          email: 'john@test.com',
          role: 'USER',
          createdAt: new Date('2025-01-01T00:00:00Z'),
        },
      ],
      total: 1,
    });

    const app = buildApp();

    const res = await request(app).get('/admin/users?page=1&limit=10').expect(200);

    expect(res.body.total).toBe(1);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0]).toMatchObject({
      id: 'u1',
      login: 'john',
      email: 'john@test.com',
      role: 'USER',
    });
  });

  test('DELETE /admin/users/:id -> 204 when user deleted', async () => {
    userRepoMock.deleteById.mockResolvedValue({ _id: 'u1' });

    const app = buildApp();

    await request(app).delete('/admin/users/u1').expect(204);

    expect(userRepoMock.deleteById).toHaveBeenCalledWith('u1');
  });

  test('GET /admin/board/pending returns pending posts with groupName + description fallback', async () => {
    boardRepoMock.findPending.mockResolvedValue({
      posts: [
        {
          _id: { toString: () => 'post1' },
          groupId: { toString: () => 'g1' },
          authorId: { toString: () => 'u1' },
          description: null,
          publicationStatus: 'VISIBLE',
          approvalStatus: ApprovalStatus.PENDING,
          createdAt: new Date('2025-01-01T10:00:00Z'),
          updatedAt: new Date('2025-01-01T10:00:00Z'),
        },
      ],
      total: 1,
    });

    groupRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'Group Pending',
      description: 'Group desc',
      visibilityStatus: VisibilityStatus.PUBLIC,
    });

    const app = buildApp();

    const res = await request(app).get('/admin/board/pending?page=1&limit=10').expect(200);

    expect(res.body.total).toBe(1);
    expect(res.body.posts).toHaveLength(1);
    expect(res.body.posts[0]).toMatchObject({
      groupName: 'Group Pending',
      description: 'Group desc',
    });
  });

  test('GET /admin/board/pending/:postId returns full details (post + group + positions)', async () => {
    boardRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
      description: 'pending desc',
      publicationStatus: 'VISIBLE',
      approvalStatus: ApprovalStatus.PENDING,
      createdAt: new Date('2025-01-01T10:00:00Z'),
      updatedAt: new Date('2025-01-01T10:00:00Z'),
    });

    groupRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'Group Pending',
      projectionYears: 3,
      visibilityStatus: VisibilityStatus.PUBLIC,
      description: 'Group desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    positionRepoMock.findAllByGroup.mockResolvedValue([
      {
        _id: { toString: () => 'p1' },
        name: 'Salary',
        amount: 5000,
        positionType: 'INCOME',
        frequencyType: 'RECURRING',
        date: new Date('2025-01-01T00:00:00Z'),
        notes: 'monthly',
        category: 'job',
        interestRate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const app = buildApp();

    const res = await request(app).get('/admin/board/pending/post1').expect(200);

    expect(res.body.post).toBeDefined();
    expect(res.body.group).toBeDefined();
    expect(res.body.group.name).toBe('Group Pending');
    expect(res.body.group.positions).toHaveLength(1);
    expect(res.body.group.positions[0]).toMatchObject({
      id: 'p1',
      name: 'Salary',
      amount: 5000,
    });
  });

  test('POST /admin/board/posts/:postId/approve -> 204', async () => {
    boardRepoMock.setApprovalStatus.mockResolvedValue({ _id: 'post1' });

    const app = buildApp();

    await request(app).post('/admin/board/posts/post1/approve').expect(204);

    expect(boardRepoMock.setApprovalStatus).toHaveBeenCalled();
  });

  test('POST /admin/board/posts/:postId/reject -> 204 and group set PRIVATE', async () => {
    boardRepoMock.setApprovalStatus.mockResolvedValue({ _id: 'post1' });

    boardRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
      approvalStatus: ApprovalStatus.REJECTED,
      publicationStatus: 'VISIBLE',
    });

    groupRepoMock.updateByIdAndOwner.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'Group Pending',
      projectionYears: 3,
      visibilityStatus: VisibilityStatus.PRIVATE,
      description: 'Group desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const app = buildApp();

    await request(app).post('/admin/board/posts/post1/reject').expect(204);

    expect(groupRepoMock.updateByIdAndOwner).toHaveBeenCalledWith('g1', 'u1', {
      visibilityStatus: VisibilityStatus.PRIVATE,
    });
  });
});
