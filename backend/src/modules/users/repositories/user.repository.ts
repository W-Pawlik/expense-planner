import { UserDocument, UserModel, UserRole } from '../models/user.model';

export const userRepository = {
  async findByLogin(login: string): Promise<UserDocument | null> {
    return UserModel.findOne({ login }).exec();
  },

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  },

  async createUser(params: {
    login: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<UserDocument> {
    const user = new UserModel({
      login: params.login,
      email: params.email,
      passwordHash: params.passwordHash,
      role: params.role ?? 'USER',
    });

    return user.save();
  },
};
