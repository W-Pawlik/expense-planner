import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../../modules/admin/application/admin.service';
import { ListUsersQuery, DeleteUserParams } from '../../modules/admin/domain/admin.schemas';

const adminService = new AdminService();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as unknown as ListUsersQuery;
    const result = await adminService.listUsers(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as DeleteUserParams;
    await adminService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
