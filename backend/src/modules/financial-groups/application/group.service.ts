import { AppError } from '../../../core/errors/AppError';
import { FinancialGroupRepository } from '../infrastructure/group.repository';
import { PositionRepository } from '../infrastructure/position.repository';
import { CreateGroupInput, UpdateGroupInput, ChangeVisibilityInput } from '../domain/group.types';
import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';
import { BoardService } from '../../board-post.model.ts/application/board.service';

export interface IFinancialGroupService {
  createGroup(userId: string, input: CreateGroupInput): Promise<any>;
  getMyGroups(userId: string): Promise<any[]>;
  getGroupWithPositions(userId: string, groupId: string): Promise<any>;
  updateGroup(userId: string, groupId: string, input: UpdateGroupInput): Promise<any>;
  changeVisibility(userId: string, groupId: string, input: ChangeVisibilityInput): Promise<any>;
  deleteGroup(userId: string, groupId: string): Promise<void>;
}

export class FinancialGroupService implements IFinancialGroupService {
  private groupRepository: FinancialGroupRepository;
  private positionRepository: PositionRepository;
  private boardService: BoardService;

  constructor() {
    this.groupRepository = new FinancialGroupRepository();
    this.positionRepository = new PositionRepository();
    this.boardService = new BoardService();
  }

  public async createGroup(userId: string, input: CreateGroupInput) {
    const group = await this.groupRepository.createGroup({
      ownerId: userId,
      name: input.name,
      projectionYears: input.projectionYears,
      visibilityStatus: input.visibilityStatus ?? VisibilityStatus.PRIVATE,
      description: input.description ?? null,
    });

    return {
      id: group._id.toString(),
      name: group.name,
      projectionYears: group.projectionYears,
      visibilityStatus: group.visibilityStatus,
      decription: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  public async getMyGroups(userId: string) {
    const groups = await this.groupRepository.findAllByOwner(userId);

    return groups.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      projectionYears: g.projectionYears,
      visibilityStatus: g.visibilityStatus,
      description: g.description,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));
  }

  public async getGroupWithPositions(userId: string, groupId: string) {
    const group = await this.groupRepository.findByIdAndOwner(groupId, userId);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    const positions = await this.positionRepository.findAllByGroup(groupId);

    return {
      id: group._id.toString(),
      name: group.name,
      projectionYears: group.projectionYears,
      visibilityStatus: group.visibilityStatus,
      description: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      positions: positions.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        amount: p.amount,
        positionType: p.positionType,
        frequencyType: p.frequencyType,
        date: p.date.toISOString(),
        notes: p.notes,
        category: p.category,
        interestRate: p.interestRate,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    };
  }

  public async updateGroup(userId: string, groupId: string, input: UpdateGroupInput) {
    const update: {
      name?: string;
      projectionYears?: number;
      description?: string | null;
    } = {};

    if (input.name !== undefined) {
      update.name = input.name;
    }
    if (input.projectionYears !== undefined) {
      update.projectionYears = input.projectionYears;
    }

    if (input.description !== undefined) {
      update.description = input.description;
    }

    const group = await this.groupRepository.updateByIdAndOwner(groupId, userId, update);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    return {
      id: group._id.toString(),
      name: group.name,
      projectionYears: group.projectionYears,
      visibilityStatus: group.visibilityStatus,
      description: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  public async changeVisibility(userId: string, groupId: string, input: ChangeVisibilityInput) {
    const group = await this.groupRepository.updateByIdAndOwner(groupId, userId, {
      visibilityStatus: input.visibilityStatus,
    });

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    if (group.visibilityStatus === VisibilityStatus.PUBLIC) {
      await this.boardService.ensurePostForGroup(group._id.toString(), userId);
    } else {
      await this.boardService.hidePostForGroup(group._id.toString());
    }

    return {
      id: group._id.toString(),
      name: group.name,
      projectionYears: group.projectionYears,
      visibilityStatus: group.visibilityStatus,
      description: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  public async deleteGroup(userId: string, groupId: string): Promise<void> {
    const group = await this.groupRepository.deleteByIdAndOwner(groupId, userId);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    await this.positionRepository.deleteManyByGroupId(groupId);
    await this.boardService.removePostForGroup(groupId);
  }
}
