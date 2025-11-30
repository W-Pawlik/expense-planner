import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../../modules/admin/application/admin.service';
import { ListUsersQuery, DeleteUserParams } from '../../modules/admin/domain/admin.schemas';
import {
  ListBoardPostsQuery,
  BoardPostIdParams,
} from '../../modules/board-post.model.ts/domain/board.types';

const adminService = new AdminService();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = (req as any).validatedQuery as ListUsersQuery;
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

export const getPendingBoardPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = (req as any).validatedQuery as ListUsersQuery;
    const result = await adminService.listPendingBoardPosts(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const approveBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as unknown as BoardPostIdParams;
    await adminService.approveBoardPost(postId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const rejectBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as unknown as BoardPostIdParams;
    await adminService.rejectBoardPost(postId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
