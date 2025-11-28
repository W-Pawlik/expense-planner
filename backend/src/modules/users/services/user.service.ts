import { UserDocument } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';

export const userService = {
  async findByLoginOrEmail(identifier: string): Promise<UserDocument | null> {
    const byLogin = await userRepository.findByLogin(identifier);
    if (byLogin) return byLogin;

    return userRepository.findByEmail(identifier);
  },

  async createUser(params: { login: string; email: string; passwordHash: string }) {
    return userRepository.createUser(params);
  },
};
