import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../../modules/admin/application/admin.service';
import { ListUsersQuery, DeleteUserParams } from '../../modules/admin/domain/admin.schemas';
import { FinancialGroupService } from '../../modules/financial-groups/application/group.service';
import { VisibilityStatus } from '../../core/enums/isibilityStatus.enum';
import { BoardService } from '../../modules/board-post.model.ts/application/board.service';

import { ListBoardPostsQuery } from '../../modules/board-post.model.ts/domain/board.schemas'; // ✅

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
    const { page, limit } = (req as any).validatedQuery as ListBoardPostsQuery;

    const result = await adminService.listPendingBoardPosts(page, limit);

    const postsWithGroupMeta = await Promise.all(
      result.posts.map(async (p: any) => {
        const g = await groupService.getGroupSummaryById(p.groupId);
        return {
          ...p,
          groupName: g?.name ?? 'Unknown group',
          description: p.description ?? g?.description ?? null,
        };
      }),
    );

    res.json({ ...result, posts: postsWithGroupMeta });
  } catch (err) {
    next(err);
  }
};

export const approveBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as { postId: string };
    await adminService.approveBoardPost(postId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const rejectBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as { postId: string };
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

export const getPendingBoardPostDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };

    const post = await boardService.getPost(postId);
    const group = await groupService.getGroupWithPositionsById(post.groupId);

    res.json({ post, group });
  } catch (err) {
    next(err);
  }
};
