import { Request, Response, NextFunction } from 'express';
import { FinancialGroupService } from '../../modules/financial-groups/application/group.service';
import { PositionService } from '../../modules/financial-groups/application/position.service';
import {
  CreateGroupInput,
  UpdateGroupInput,
  ChangeVisibilityInput,
} from '../../modules/financial-groups/domain/group.types';
import {
  CreatePositionInput,
  UpdatePositionInput,
} from '../../modules/financial-groups/domain/position.types';
import { AppError } from '../../core/errors/AppError';
import { BoardService } from '../../modules/board-post.model.ts/application/board.service';

const groupService = new FinancialGroupService();
const positionService = new PositionService();
const boardService = new BoardService();

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const input = req.body as CreateGroupInput;
    const result = await groupService.createGroup(userId, input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const groups = await groupService.getMyGroups(userId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

export const getGroupDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId } = req.params as { groupId: string };
    const group = await groupService.getGroupWithPositions(userId, groupId);
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId } = req.params as { groupId: string };
    const input = req.body as UpdateGroupInput;

    const group = await groupService.updateGroup(userId, groupId, input);
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const changeVisibility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId } = req.params as { groupId: string };
    const input = req.body as ChangeVisibilityInput;
    const { visibilityStatus } = input;

    const group = await groupService.changeVisibility(userId, groupId, input);

    if (visibilityStatus === 'PUBLIC') {
      await boardService.ensurePostForGroup(groupId, userId, group.description ?? undefined);
    } else {
      await boardService.hidePostForGroup(groupId);
    }
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId } = req.params as { groupId: string };

    await groupService.deleteGroup(userId, groupId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const addPosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId } = req.params as { groupId: string };
    const input = req.body as CreatePositionInput;

    const position = await positionService.addPosition(userId, groupId, input);
    res.status(201).json(position);
  } catch (err) {
    next(err);
  }
};

export const updatePosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId, positionId } = req.params as {
      groupId: string;
      positionId: string;
    };
    const input = req.body as UpdatePositionInput;

    const position = await positionService.updatePosition(userId, groupId, positionId, input);
    res.json(position);
  } catch (err) {
    next(err);
  }
};

export const deletePosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { groupId, positionId } = req.params as {
      groupId: string;
      positionId: string;
    };

    await positionService.deletePosition(userId, groupId, positionId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
