import { UserService } from '../user.service';
import { AppError } from '../../../../core/errors/AppError';

const userRepoMock = {
  findByLogin: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  deleteById: jest.fn(),
};

jest.mock('../../infrastructure/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => userRepoMock),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findByLoginOrEmail(): zwraca usera po login jeśli istnieje', async () => {
    userRepoMock.findByLogin.mockResolvedValue({ _id: 'u1', login: 'john' });

    const svc = new UserService();
    const res = await svc.findByLoginOrEmail('john');

    expect(userRepoMock.findByLogin).toHaveBeenCalledWith('john');
    expect(userRepoMock.findByEmail).not.toHaveBeenCalled();
    expect(res).toMatchObject({ login: 'john' });
  });

  test('findByLoginOrEmail(): gdy brak po login -> sprawdza email', async () => {
    userRepoMock.findByLogin.mockResolvedValue(null);
    userRepoMock.findByEmail.mockResolvedValue({ _id: 'u2', email: 'a@b.com' });

    const svc = new UserService();
    const res = await svc.findByLoginOrEmail('a@b.com');

    expect(userRepoMock.findByLogin).toHaveBeenCalledWith('a@b.com');
    expect(userRepoMock.findByEmail).toHaveBeenCalledWith('a@b.com');
    expect(res).toMatchObject({ email: 'a@b.com' });
  });

  test('listUsers(): deleguje do repo', async () => {
    userRepoMock.findAll.mockResolvedValue({ users: [{ login: 'x' }], total: 1 });

    const svc = new UserService();
    const res = await svc.listUsers(1, 10);

    expect(userRepoMock.findAll).toHaveBeenCalledWith(1, 10);
    expect(res.total).toBe(1);
    expect(res.users).toHaveLength(1);
  });

  test('deleteUser(): gdy nie znaleziono -> 404', async () => {
    userRepoMock.deleteById.mockResolvedValue(null);

    const svc = new UserService();

    await expect(svc.deleteUser('missing')).rejects.toBeInstanceOf(AppError);
    await expect(svc.deleteUser('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('deleteUser(): gdy usunięto -> resolves', async () => {
    userRepoMock.deleteById.mockResolvedValue({ _id: 'u1' });

    const svc = new UserService();
    await expect(svc.deleteUser('u1')).resolves.toBeUndefined();
  });
});
