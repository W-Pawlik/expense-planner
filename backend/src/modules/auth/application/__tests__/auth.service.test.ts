import { AuthService } from '../auth.service';
import { AppError } from '../../../../core/errors/AppError';

const userServiceMock = {
  findByLoginOrEmail: jest.fn(),
  createUser: jest.fn(),
};

jest.mock('../../../users/application/user.service', () => ({
  UserService: jest.fn().mockImplementation(() => userServiceMock),
}));

const signJwtMock = jest.fn();
jest.mock('../../../../core/utils/jwt', () => ({
  signJwt: (payload: any) => signJwtMock(payload),
}));

const hashPasswordMock = jest.fn();
const verifyPasswordMock = jest.fn();

jest.mock('../../../../core/utils/password', () => ({
  hashPassword: (p: string) => hashPasswordMock(p),
  verifyPassword: (p: string, h: string) => verifyPasswordMock(p, h),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    signJwtMock.mockReturnValue('TOKEN');
  });

  test('register(): gdy login zajęty -> 400', async () => {
    userServiceMock.findByLoginOrEmail.mockResolvedValueOnce({ _id: 'x' });

    const svc = new AuthService();

    await expect(
      svc.register({ login: 'john', email: 'john@a.com', password: 'pass' }),
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });

  test('register(): gdy email zajęty -> 400', async () => {
    userServiceMock.findByLoginOrEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: 'x' });

    const svc = new AuthService();

    await expect(
      svc.register({ login: 'john', email: 'john@a.com', password: 'pass' }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('register(): tworzy usera, hashuje hasło i zwraca token', async () => {
    userServiceMock.findByLoginOrEmail.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    hashPasswordMock.mockResolvedValue('HASH');

    userServiceMock.createUser.mockResolvedValue({
      _id: { toString: () => 'u1' },
      login: 'john',
      email: 'john@a.com',
      role: 'USER',
    });

    const svc = new AuthService();
    const res = await svc.register({
      login: 'john',
      email: 'john@a.com',
      password: 'pass',
    });

    expect(hashPasswordMock).toHaveBeenCalledWith('pass');
    expect(userServiceMock.createUser).toHaveBeenCalledWith({
      login: 'john',
      email: 'john@a.com',
      passwordHash: 'HASH',
    });

    expect(signJwtMock).toHaveBeenCalledWith({ sub: 'u1', role: 'USER' });

    expect(res).toMatchObject({
      token: 'TOKEN',
      user: { id: 'u1', login: 'john', email: 'john@a.com', role: 'USER' },
    });
  });

  test('login(): gdy user nie istnieje -> 401', async () => {
    userServiceMock.findByLoginOrEmail.mockResolvedValue(null);

    const svc = new AuthService();

    await expect(svc.login({ login: 'x', password: 'p' })).rejects.toBeInstanceOf(AppError);
    await expect(svc.login({ login: 'x', password: 'p' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  test('login(): gdy hasło niepoprawne -> 401', async () => {
    userServiceMock.findByLoginOrEmail.mockResolvedValue({
      _id: { toString: () => 'u1' },
      login: 'john',
      email: 'john@a.com',
      role: 'USER',
      passwordHash: 'HASH',
    });

    verifyPasswordMock.mockResolvedValue(false);

    const svc = new AuthService();

    await expect(svc.login({ login: 'john', password: 'bad' })).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(verifyPasswordMock).toHaveBeenCalledWith('bad', 'HASH');
  });

  test('login(): sukces -> zwraca token i user', async () => {
    userServiceMock.findByLoginOrEmail.mockResolvedValue({
      _id: { toString: () => 'u1' },
      login: 'john',
      email: 'john@a.com',
      role: 'USER',
      passwordHash: 'HASH',
    });

    verifyPasswordMock.mockResolvedValue(true);

    const svc = new AuthService();
    const res = await svc.login({ login: 'john', password: 'pass' });

    expect(signJwtMock).toHaveBeenCalledWith({ sub: 'u1', role: 'USER' });

    expect(res).toMatchObject({
      token: 'TOKEN',
      user: { id: 'u1', login: 'john', email: 'john@a.com', role: 'USER' },
    });
  });
});
