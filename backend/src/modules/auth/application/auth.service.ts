import { AppError } from '../../../core/errors/AppError';
import { signJwt } from '../../../core/utils/jwt';
import { hashPassword, verifyPassword } from '../../../core/utils/password';
import { UserService } from '../../users/application/user.service';
import { LoginInput, LoginResponse, RegisterInput, RegisterResponse } from '../domain/auth.types';

export interface IAuthService {
  register(input: RegisterInput): Promise<RegisterResponse>;
  login(input: LoginInput): Promise<LoginResponse>;
}

export class authService implements IAuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async register(input: RegisterInput): Promise<RegisterResponse> {
    const existingLogin = await this.userService.findByLoginOrEmail(input.login);
    if (existingLogin) {
      throw new AppError('Login is already taken', 400);
    }

    const existingEmail = await this.userService.findByLoginOrEmail(input.email);
    if (existingEmail) {
      throw new AppError('Email is already taken', 400);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.userService.createUser({
      login: input.login,
      email: input.email,
      passwordHash,
    });

    const userId = user._id.toString();
    const token = signJwt({ sub: userId, role: user.role });
    return {
      user: {
        id: userId,
        login: user.login,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  public async login(input: LoginInput) {
    const user = await this.userService.findByLoginOrEmail(input.login);
    if (!user) {
      throw new AppError('Invalid login or password', 401);
    }

    const passwordValid = await verifyPassword(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new AppError('Invalid login or password', 401);
    }

    const userId = user._id.toString();
    const token = signJwt({ sub: userId, role: user.role });
    return {
      user: {
        id: userId,
        login: user.login,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
