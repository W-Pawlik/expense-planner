import { AdminService } from '../admin.service';

const userServiceMock = {
  listUsers: jest.fn(),
  deleteUser: jest.fn(),
};

const boardServiceMock = {
  listPendingPosts: jest.fn(),
  approvePost: jest.fn(),
  rejectPost: jest.fn(),
};

jest.mock('../../../users/application/user.service', () => ({
  UserService: jest.fn().mockImplementation(() => userServiceMock),
}));

jest.mock('../../../board-post.model.ts/application/board.service', () => ({
  BoardService: jest.fn().mockImplementation(() => boardServiceMock),
}));

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listUsers(): mapuje userów do AdminListUsersResult + przekazuje page/limit', async () => {
    userServiceMock.listUsers.mockResolvedValue({
      users: [
        {
          _id: { toString: () => 'u1' },
          login: 'john',
          email: 'john@test.com',
          role: 'USER',
          createdAt: new Date('2025-01-01'),
        },
        {
          _id: { toString: () => 'u2' },
          login: 'admin',
          email: 'admin@test.com',
          role: 'ADMIN',
          createdAt: new Date('2025-01-02'),
        },
      ],
      total: 2,
    });

    const svc = new AdminService();
    const res = await svc.listUsers(2, 10);

    expect(userServiceMock.listUsers).toHaveBeenCalledWith(2, 10);

    expect(res).toMatchObject({
      total: 2,
      page: 2,
      limit: 10,
    });

    expect(res.users).toHaveLength(2);
    expect(res.users[0]).toMatchObject({
      id: 'u1',
      login: 'john',
      email: 'john@test.com',
      role: 'USER',
    });
    expect(res.users[1]).toMatchObject({
      id: 'u2',
      login: 'admin',
      email: 'admin@test.com',
      role: 'ADMIN',
    });
  });

  test('deleteUser(): deleguje do UserService.deleteUser()', async () => {
    userServiceMock.deleteUser.mockResolvedValue(undefined);

    const svc = new AdminService();
    await expect(svc.deleteUser('u1')).resolves.toBeUndefined();

    expect(userServiceMock.deleteUser).toHaveBeenCalledWith('u1');
  });

  test('listPendingBoardPosts(): deleguje do BoardService.listPendingPosts()', async () => {
    boardServiceMock.listPendingPosts.mockResolvedValue({
      posts: [
        {
          id: 'p1',
          groupId: 'g1',
          authorId: 'u1',
          description: 'desc',
          publicationStatus: 'VISIBLE',
          approvalStatus: 'PENDING',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-02'),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });

    const svc = new AdminService();
    const res = await svc.listPendingBoardPosts(1, 10);

    expect(boardServiceMock.listPendingPosts).toHaveBeenCalledWith(1, 10);
    expect(res.total).toBe(1);
    expect(res.posts).toHaveLength(1);
    expect(res.posts[0]).toMatchObject({
      id: 'p1',
      groupId: 'g1',
      authorId: 'u1',
      approvalStatus: 'PENDING',
    });
  });

  test('approveBoardPost(): deleguje do BoardService.approvePost()', async () => {
    boardServiceMock.approvePost.mockResolvedValue(undefined);

    const svc = new AdminService();
    await expect(svc.approveBoardPost('p1')).resolves.toBeUndefined();

    expect(boardServiceMock.approvePost).toHaveBeenCalledWith('p1');
  });

  test('rejectBoardPost(): deleguje do BoardService.rejectPost()', async () => {
    boardServiceMock.rejectPost.mockResolvedValue(undefined);

    const svc = new AdminService();
    await expect(svc.rejectBoardPost('p1')).resolves.toBeUndefined();

    expect(boardServiceMock.rejectPost).toHaveBeenCalledWith('p1');
  });
});
