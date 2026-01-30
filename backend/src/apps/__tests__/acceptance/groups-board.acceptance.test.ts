/* eslint-disable @typescript-eslint/no-require-imports */
import request from 'supertest';
import express from 'express';

import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';

let currentUser = { sub: 'u1', role: 'USER' as 'USER' | 'ADMIN' };

jest.mock('../../../core/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = currentUser;
    next();
  },
}));

const g: any = globalThis;

g.__groupRepoMock = {
  createGroup: jest.fn(),
  findByIdAndOwner: jest.fn(),
  findAllByOwner: jest.fn(),
  updateByIdAndOwner: jest.fn(),
  deleteByIdAndOwner: jest.fn(),
  findById: jest.fn(),
};

g.__positionRepoMock = {
  findAllByGroup: jest.fn(),
  deleteManyByGroupId: jest.fn(),
};

g.__boardRepoMock = {
  findOrCreateForGroup: jest.fn(),
  markRemovedForGroup: jest.fn(),
  deleteForGroup: jest.fn(),
  findPublic: jest.fn(),
  findPublicById: jest.fn(),
  findPublicByGroupId: jest.fn(),
  findPending: jest.fn(),
  findById: jest.fn(),
  findByGroupId: jest.fn(),
  setApprovalStatus: jest.fn(),
};

jest.mock('../../../modules/financial-groups/infrastructure/group.repository', () => ({
  FinancialGroupRepository: jest.fn().mockImplementation(() => (globalThis as any).__groupRepoMock),
}));

jest.mock('../../../modules/financial-groups/infrastructure/position.repository', () => ({
  PositionRepository: jest.fn().mockImplementation(() => (globalThis as any).__positionRepoMock),
}));

jest.mock('../../../modules/board-post.model.ts/infrastructure/board.repository', () => ({
  BoardPostRepository: jest.fn().mockImplementation(() => (globalThis as any).__boardRepoMock),
}));

const groupRepoMock = (globalThis as any).__groupRepoMock;
const positionRepoMock = (globalThis as any).__positionRepoMock;
const boardRepoMock = (globalThis as any).__boardRepoMock;

const buildApp = () => {
  const app = express();
  app.use(express.json());

  const { registerGroupRoutes } = require('../../routes/group.routes');
  const { registerBoardRoutes } = require('../../routes/board.routes');

  registerGroupRoutes(app);
  registerBoardRoutes(app);

  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err?.statusCode ?? 500).json({
      message: err?.message ?? 'Internal Server Error',
      details: err?.details,
    });
  });

  return app;
};

describe('ACCEPTANCE: Groups + Public Board', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = { sub: 'u1', role: 'USER' };
  });

  test('GET /board/public returns posts with groupName (for UI display)', async () => {
    boardRepoMock.findPublic.mockResolvedValue({
      posts: [
        {
          _id: { toString: () => 'post1' },
          groupId: { toString: () => 'g1' },
          authorId: { toString: () => 'u1' },
          description: 'Board desc',
          publicationStatus: 'VISIBLE',
          approvalStatus: 'APPROVED',
          createdAt: new Date('2025-01-01T10:00:00Z'),
          updatedAt: new Date('2025-01-01T10:00:00Z'),
        },
      ],
      total: 1,
    });

    groupRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'My Public Plan',
      visibilityStatus: VisibilityStatus.PUBLIC,
      description: 'Group desc',
    });

    const app = buildApp();

    const res = await request(app).get('/board/public?page=1&limit=10').expect(200);

    expect(res.body.total).toBe(1);
    expect(res.body.posts).toHaveLength(1);
    expect(res.body.posts[0].groupName).toBe('My Public Plan');
  });

  test('GET /board/public/groups/:groupId returns publishedAt + group details + positions', async () => {
    boardRepoMock.findPublicByGroupId.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
      description: 'Board desc',
      publicationStatus: 'VISIBLE',
      approvalStatus: 'APPROVED',
      createdAt: new Date('2025-01-05T12:00:00Z'),
      updatedAt: new Date('2025-01-05T12:00:00Z'),
    });

    groupRepoMock.findById.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'My Public Plan',
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

    const res = await request(app).get('/board/public/groups/g1').expect(200);

    expect(res.body.publishedAt).toBeDefined();
    expect(res.body.group).toBeDefined();
    expect(res.body.group.name).toBe('My Public Plan');
    expect(res.body.group.positions).toHaveLength(1);
    expect(res.body.group.positions[0]).toMatchObject({
      id: 'p1',
      name: 'Salary',
      amount: 5000,
    });
  });

  test('POST /board/groups/:groupId/hide -> owner can unpublish (204)', async () => {
    currentUser = { sub: 'u1', role: 'USER' };

    boardRepoMock.findByGroupId.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
    });

    boardRepoMock.markRemovedForGroup.mockResolvedValue(undefined);

    groupRepoMock.updateByIdAndOwner.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'My Group',
      projectionYears: 3,
      visibilityStatus: VisibilityStatus.PRIVATE,
      description: 'desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const app = buildApp();

    await request(app).post('/board/groups/g1/hide').expect(204);

    expect(boardRepoMock.markRemovedForGroup).toHaveBeenCalledWith('g1');
    expect(groupRepoMock.updateByIdAndOwner).toHaveBeenCalledWith('g1', 'u1', {
      visibilityStatus: VisibilityStatus.PRIVATE,
    });
  });

  test('POST /board/groups/:groupId/hide -> non-owner USER gets 403', async () => {
    currentUser = { sub: 'u2', role: 'USER' };

    boardRepoMock.findByGroupId.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
    });

    const app = buildApp();

    await request(app).post('/board/groups/g1/hide').expect(403);

    expect(boardRepoMock.markRemovedForGroup).not.toHaveBeenCalled();
  });

  test('POST /board/groups/:groupId/hide -> ADMIN can unpublish any (204)', async () => {
    currentUser = { sub: 'admin1', role: 'ADMIN' };

    boardRepoMock.findByGroupId.mockResolvedValue({
      _id: { toString: () => 'post1' },
      groupId: { toString: () => 'g1' },
      authorId: { toString: () => 'u1' },
    });

    boardRepoMock.markRemovedForGroup.mockResolvedValue(undefined);

    groupRepoMock.updateByIdAndOwner.mockResolvedValue({
      _id: { toString: () => 'g1' },
      name: 'My Group',
      projectionYears: 3,
      visibilityStatus: VisibilityStatus.PRIVATE,
      description: 'desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const app = buildApp();

    await request(app).post('/board/groups/g1/hide').expect(204);
  });
});
