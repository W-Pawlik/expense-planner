import { UserDocument } from '../domain/user.model';
import { AppError } from '../../../core/errors/AppError';
import { UserRepository } from '../infrastructure/user.repository';

export interface IUserService {
  findByLoginOrEmail(identifier: string): Promise<UserDocument | null>;
  createUser(params: { login: string; email: string; passwordHash: string }): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  listUsers(page: number, limit: number): Promise<{ users: UserDocument[]; total: number }>;
  deleteUser(id: string): Promise<void>;
}

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findByLoginOrEmail(identifier: string): Promise<UserDocument | null> {
    const byLogin = await this.userRepository.findByLogin(identifier);
    if (byLogin) return byLogin;
    return this.userRepository.findByEmail(identifier);
  }

  public async createUser(params: {
    login: string;
    email: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    return this.userRepository.createUser(params);
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  public async listUsers(
    page: number,
    limit: number,
  ): Promise<{ users: UserDocument[]; total: number }> {
    return this.userRepository.findAll(page, limit);
  }

  public async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new AppError('User not found', 404);
    }
  }
}
