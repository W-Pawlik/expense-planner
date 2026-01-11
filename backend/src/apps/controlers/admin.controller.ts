import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../../modules/admin/application/admin.service';
import { ListUsersQuery, DeleteUserParams } from '../../modules/admin/domain/admin.schemas';
import {
  ListBoardPostsQuery,
  BoardPostIdParams,
} from '../../modules/board-post.model.ts/domain/board.types';
import { FinancialGroupService } from '../../modules/financial-groups/application/group.service';
import { VisibilityStatus } from '../../core/enums/isibilityStatus.enum';
import { BoardService } from '../../modules/board-post.model.ts/application/board.service';

const adminService = new AdminService();
const groupService = new FinancialGroupService();
const boardService = new BoardService();

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

    const post = await boardService.getPost(postId);

    await groupService.changeVisibility(post.authorId, post.groupId, {
      visibilityStatus: VisibilityStatus.PRIVATE,
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
