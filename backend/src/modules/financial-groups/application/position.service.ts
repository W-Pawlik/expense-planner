import { AppError } from '../../../core/errors/AppError';
import { FinancialGroupRepository } from '../infrastructure/group.repository';
import { PositionRepository } from '../infrastructure/position.repository';
import { CreatePositionInput, UpdatePositionInput } from '../domain/position.types';
import { PositionType } from '../../../core/enums/PositionType.enum';
import { FrequencyType } from '../../../core/enums/FrequencyType.enum';

export interface IPositionService {
  addPosition(userId: string, groupId: string, input: CreatePositionInput): Promise<any>;
  updatePosition(
    userId: string,
    groupId: string,
    positionId: string,
    input: UpdatePositionInput,
  ): Promise<any>;
  deletePosition(userId: string, groupId: string, positionId: string): Promise<void>;
}

export class PositionService implements IPositionService {
  private groupRepository: FinancialGroupRepository;
  private positionRepository: PositionRepository;

  constructor() {
    this.groupRepository = new FinancialGroupRepository();
    this.positionRepository = new PositionRepository();
  }

  private async assertGroupBelongsToUser(groupId: string, userId: string) {
    const group = await this.groupRepository.findByIdAndOwner(groupId, userId);
    if (!group) {
      throw new AppError('Group not found', 404);
    }
  }

  public async addPosition(userId: string, groupId: string, input: CreatePositionInput) {
    await this.assertGroupBelongsToUser(groupId, userId);

    const params: {
      groupId: string;
      name: string;
      amount: number;
      positionType: PositionType;
      frequencyType: FrequencyType;
      date: Date;
      notes?: string;
      category?: string;
      interestRate?: number;
    } = {
      groupId,
      name: input.name,
      amount: input.amount,
      positionType: input.positionType,
      frequencyType: input.frequencyType,
      date: input.date,
    };

    if (input.notes !== undefined) params.notes = input.notes;
    if (input.category !== undefined) params.category = input.category;
    if (input.interestRate !== undefined) params.interestRate = input.interestRate;

    const position = await this.positionRepository.createPosition(params);

    return {
      id: position._id.toString(),
      name: position.name,
      amount: position.amount,
      positionType: position.positionType,
      frequencyType: position.frequencyType,
      date: position.date,
      notes: position.notes,
      category: position.category,
      interestRate: position.interestRate,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }

  public async updatePosition(
    userId: string,
    groupId: string,
    positionId: string,
    input: UpdatePositionInput,
  ) {
    await this.assertGroupBelongsToUser(groupId, userId);

    const update: {
      name?: string;
      amount?: number;
      positionType?: PositionType;
      frequencyType?: FrequencyType;
      date?: Date;
      notes?: string;
      category?: string;
      interestRate?: number;
    } = {};

    if (input.name !== undefined) update.name = input.name;
    if (input.amount !== undefined) update.amount = input.amount;
    if (input.positionType !== undefined) update.positionType = input.positionType;
    if (input.frequencyType !== undefined) update.frequencyType = input.frequencyType;
    if (input.date !== undefined) update.date = input.date;
    if (input.notes !== undefined) update.notes = input.notes;
    if (input.category !== undefined) update.category = input.category;
    if (input.interestRate !== undefined) update.interestRate = input.interestRate;

    const position = await this.positionRepository.updateById(positionId, update);
    if (!position) {
      throw new AppError('Position not found', 404);
    }

    if (position.groupId.toString() !== groupId) {
      throw new AppError('Position does not belong to this group', 400);
    }

    return {
      id: position._id.toString(),
      name: position.name,
      amount: position.amount,
      positionType: position.positionType,
      frequencyType: position.frequencyType,
      date: position.date,
      notes: position.notes,
      category: position.category,
      interestRate: position.interestRate,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }

  public async deletePosition(userId: string, groupId: string, positionId: string): Promise<void> {
    await this.assertGroupBelongsToUser(groupId, userId);

    const position = await this.positionRepository.deleteById(positionId);
    if (!position) {
      throw new AppError('Position not found', 404);
    }

    if (position.groupId.toString() !== groupId) {
      throw new AppError('Position does not belong to this group', 400);
    }
  }
}
