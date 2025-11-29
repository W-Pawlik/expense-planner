import { UserService } from '../../users/application/user.service';

export interface AdminListUsersResult {
  users: Array<{
    id: string;
    login: string;
    email: string;
    role: string;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface IAdminService {
  listUsers(page: number, limit: number): Promise<AdminListUsersResult>;
  deleteUser(userId: string): Promise<void>;
}

export class AdminService implements IAdminService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async listUsers(page: number, limit: number): Promise<AdminListUsersResult> {
    const { users, total } = await this.userService.listUsers(page, limit);

    return {
      users: users.map((u) => ({
        id: u._id.toString(),
        login: u.login,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.userService.deleteUser(userId);
  }
}
