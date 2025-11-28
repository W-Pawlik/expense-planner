import { AppError } from '../../../core/errors/AppError';
import { signJwt } from '../../../core/utils/jwt';
import { hashPassword, verifyPassword } from '../../../core/utils/password';
import { userService } from '../../users/services/user.service';
import { RegisterInput, LoginInput } from '../types/auth.types';

export const authService = {
  async register(input: RegisterInput) {
    const existingLogin = await userService.findByLoginOrEmail(input.login);
    if (existingLogin) {
      throw new AppError('Login is already taken', 400);
    }

    const existingEmail = await userService.findByLoginOrEmail(input.email);
    if (existingEmail) {
      throw new AppError('Email is already taken', 400);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await userService.createUser({
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
  },

  async login(input: LoginInput) {
    const user = await userService.findByLoginOrEmail(input.login);
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
  },
};
