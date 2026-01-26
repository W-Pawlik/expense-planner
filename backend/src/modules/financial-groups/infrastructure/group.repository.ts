import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';
import { FinancialGroupDocument, FinancialGroupModel } from '../domain/group.model';

export interface IFinancialGroupRepository {
  createGroup(params: {
    ownerId: string;
    name: string;
    projectionYears: number;
    visibilityStatus: VisibilityStatus;
    description?: string | null;
  }): Promise<FinancialGroupDocument>;
  findById(groupId: string): Promise<FinancialGroupDocument | null>;
  findByIdAndOwner(groupId: string, ownerId: string): Promise<FinancialGroupDocument | null>;
  findAllByOwner(ownerId: string): Promise<FinancialGroupDocument[]>;
  updateByIdAndOwner(
    groupId: string,
    ownerId: string,
    update: Partial<{
      name: string;
      projectionYears: number;
      visibilityStatus: VisibilityStatus;
      description?: string | null;
    }>,
  ): Promise<FinancialGroupDocument | null>;
  deleteByIdAndOwner(groupId: string, ownerId: string): Promise<FinancialGroupDocument | null>;
}

export class FinancialGroupRepository implements IFinancialGroupRepository {
  public async createGroup(params: {
    ownerId: string;
    name: string;
    projectionYears: number;
    visibilityStatus: VisibilityStatus;
    description?: string | null;
  }): Promise<FinancialGroupDocument> {
    const group = new FinancialGroupModel({
      ownerId: params.ownerId,
      name: params.name,
      projectionYears: params.projectionYears,
      visibilityStatus: params.visibilityStatus,
      description: params.description ?? null,
    });

    return group.save();
  }

  public async findById(groupId: string): Promise<FinancialGroupDocument | null> {
    return FinancialGroupModel.findById(groupId).exec();
  }

  public async findByIdAndOwner(
    groupId: string,
    ownerId: string,
  ): Promise<FinancialGroupDocument | null> {
    return FinancialGroupModel.findOne({ _id: groupId, ownerId }).exec();
  }

  public async findAllByOwner(ownerId: string): Promise<FinancialGroupDocument[]> {
    return FinancialGroupModel.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  public async updateByIdAndOwner(
    groupId: string,
    ownerId: string,
    update: Partial<{
      name: string;
      projectionYears: number;
      visibilityStatus: VisibilityStatus;
      description?: string | null;
    }>,
  ): Promise<FinancialGroupDocument | null> {
    return FinancialGroupModel.findOneAndUpdate(
      { _id: groupId, ownerId },
      { $set: update },
      { new: true },
    ).exec();
  }

  public async deleteByIdAndOwner(
    groupId: string,
    ownerId: string,
  ): Promise<FinancialGroupDocument | null> {
    return FinancialGroupModel.findOneAndDelete({ _id: groupId, ownerId }).exec();
  }
}
