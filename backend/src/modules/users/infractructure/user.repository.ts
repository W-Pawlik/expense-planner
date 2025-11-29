import { UserDocument, UserModel, UserRole } from '../domain/user.model';

export interface IUserRepository {
  findByLogin(login: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  findAll(page: number, limit: number): Promise<{ users: UserDocument[]; total: number }>;
  createUser(params: {
    login: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<UserDocument>;
  deleteById(id: string): Promise<UserDocument | null>;
}

export class userRepository implements IUserRepository {
  public async findByLogin(login: string): Promise<UserDocument | null> {
    return UserModel.findOne({ login }).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  public async findAll(
    page: number,
    limit: number,
  ): Promise<{ users: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit).exec(),
      UserModel.countDocuments().exec(),
    ]);

    return { users, total };
  }

  public async createUser(params: {
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
  }

  public async deleteById(id: string): Promise<UserDocument | null> {
    return UserModel.findByIdAndDelete(id).exec();
  }
}
