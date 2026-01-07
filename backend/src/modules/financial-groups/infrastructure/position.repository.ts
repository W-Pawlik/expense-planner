import { FinancialPositionDocument, FinancialPositionModel } from '../domain/position.model';
import { PositionType } from '../../../core/enums/PositionType.enum';
import { FrequencyType } from '../../../core/enums/FrequencyType.enum';

export interface IPositionRepository {
  createPosition(params: {
    groupId: string;
    name: string;
    amount: number;
    positionType: PositionType;
    frequencyType: FrequencyType;
    date: Date;
    notes?: string;
    category?: string;
    interestRate?: number;
  }): Promise<FinancialPositionDocument>;
  findById(positionId: string): Promise<FinancialPositionDocument | null>;
  findAllByGroup(groupId: string): Promise<FinancialPositionDocument[]>;
  updateById(
    positionId: string,
    update: Partial<{
      name: string;
      amount: number;
      positionType: PositionType;
      frequencyType: FrequencyType;
      date: Date;
      notes?: string;
      category?: string;
      interestRate?: number;
    }>,
  ): Promise<FinancialPositionDocument | null>;
  deleteById(positionId: string): Promise<FinancialPositionDocument | null>;
  deleteManyByGroupId(groupId: string): Promise<void>;
}

export class PositionRepository implements IPositionRepository {
  public async createPosition(params: {
    groupId: string;
    name: string;
    amount: number;
    positionType: PositionType;
    frequencyType: FrequencyType;
    date: Date;
    notes?: string;
    category?: string;
    interestRate?: number;
  }): Promise<FinancialPositionDocument> {
    const pos = new FinancialPositionModel({
      groupId: params.groupId,
      name: params.name,
      amount: params.amount,
      positionType: params.positionType,
      frequencyType: params.frequencyType,
      date: params.date,
      notes: params.notes,
      category: params.category,
      interestRate: params.interestRate,
    });
    return pos.save();
  }

  public async findById(positionId: string): Promise<FinancialPositionDocument | null> {
    return FinancialPositionModel.findById(positionId).exec();
  }

  public async findAllByGroup(groupId: string): Promise<FinancialPositionDocument[]> {
    return FinancialPositionModel.find({ groupId }).sort({ createdAt: -1 }).exec();
  }

  public async updateById(
    positionId: string,
    update: Partial<{
      name: string;
      amount: number;
      positionType: PositionType;
      frequencyType: FrequencyType;
      date: Date;
      notes?: string;
      category?: string;
      interestRate?: number;
    }>,
  ): Promise<FinancialPositionDocument | null> {
    return FinancialPositionModel.findByIdAndUpdate(
      positionId,
      { $set: update },
      { new: true },
    ).exec();
  }

  public async deleteById(positionId: string): Promise<FinancialPositionDocument | null> {
    return FinancialPositionModel.findByIdAndDelete(positionId).exec();
  }

  public async deleteManyByGroupId(groupId: string): Promise<void> {
    await FinancialPositionModel.deleteMany({ groupId }).exec();
  }
}
