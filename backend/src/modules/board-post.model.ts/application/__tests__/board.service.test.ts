import { BoardService } from '../board.service';
import { AppError } from '../../../../core/errors/AppError';

const boardRepoMock = {
  findOrCreateForGroup: jest.fn(),
  markRemovedForGroup: jest.fn(),
  deleteForGroup: jest.fn(),
  findPublic: jest.fn(),
  findPublicById: jest.fn(),
  findPending: jest.fn(),
  findById: jest.fn(),
  findByGroupId: jest.fn(),
  setApprovalStatus: jest.fn(),
};

jest.mock('../../infrastructure/board.repository', () => ({
  BoardPostRepository: jest.fn().mockImplementation(() => boardRepoMock),
}));

describe('BoardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listPublicPosts() mapuje DTO i zwraca total/page/limit', async () => {
    boardRepoMock.findPublic.mockResolvedValue({
      posts: [
        {
          _id: { toString: () => 'p1' },
          groupId: { toString: () => 'g1' },
          authorId: { toString: () => 'u1' },
          description: 'desc',
          publicationStatus: 'VISIBLE',
          approvalStatus: 'APPROVED',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-02'),
        },
      ],
      total: 1,
    });

    const svc = new BoardService();
    const res = await svc.listPublicPosts(1, 10);

    expect(res.total).toBe(1);
    expect(res.posts).toHaveLength(1);
    expect(res.posts[0]).toMatchObject({
      id: 'p1',
      groupId: 'g1',
      authorId: 'u1',
      description: 'desc',
    });
  });

  test('getPublicPost() gdy brak -> AppError 404', async () => {
    boardRepoMock.findPublicById.mockResolvedValue(null);

    const svc = new BoardService();
    await expect(svc.getPublicPost('missing')).rejects.toBeInstanceOf(AppError);
    await expect(svc.getPublicPost('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('getPostByGroupId() zwraca null gdy brak', async () => {
    boardRepoMock.findByGroupId.mockResolvedValue(null);

    const svc = new BoardService();
    const res = await svc.getPostByGroupId('g1');

    expect(res).toBeNull();
  });
});
