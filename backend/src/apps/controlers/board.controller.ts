import { Request, Response, NextFunction } from 'express';
import { ListBoardPostsQuery } from '../../modules/board-post.model.ts/domain/board.schemas';
import { BoardService } from '../../modules/board-post.model.ts/application/board.service';
import { AppError } from '../../core/errors/AppError';
import { FinancialGroupService } from '../../modules/financial-groups/application/group.service';
import { VisibilityStatus } from '../../core/enums/isibilityStatus.enum';

const boardService = new BoardService();
const groupService = new FinancialGroupService();

export const getPublicBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = (req as any).validatedQuery as ListBoardPostsQuery;
    const result = await boardService.listPublicPosts(page, limit);

    const postsWithGroupMeta = await Promise.all(
      result.posts.map(async (p) => {
        const g = await groupService.getPublicGroupSummary(p.groupId);
        return {
          ...p,
          groupName: g?.name ?? 'Public plan',
          description: p.description ?? g?.description ?? null,
        };
      }),
    );

    res.json({ ...result, posts: postsWithGroupMeta });
  } catch (err) {
    next(err);
  }
};

export const getPublicBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as { postId: string };
    const result = await boardService.getPublicPost(postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getPublicPlanDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params as { groupId: string };

    // 1) musi istnieć publiczny, APPROVED + VISIBLE post dla tej grupy
    const post = await boardService.getPublicPostByGroupId(groupId);

    // 2) pobierz publiczną grupę + pozycje
    const group = await groupService.getPublicGroupWithPositions(groupId);

    res.json({
      publishedAt: post.createdAt,
      group,
    });
  } catch (err) {
    next(err);
  }
};

export const hideGroupOnBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const role = (req.user as any)?.role as string | undefined;
    const isAdmin = role === 'ADMIN';

    const { groupId } = req.params as { groupId: string };

    const post = await boardService.getPostByGroupId(groupId);
    if (!post) throw new AppError('Post not found', 404);

    const isOwner = post.authorId === userId;
    if (!isAdmin && !isOwner) throw new AppError('Forbidden', 403);

    await boardService.hidePostForGroup(groupId);

    await groupService.changeVisibility(post.authorId, groupId, {
      visibilityStatus: VisibilityStatus.PRIVATE,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
