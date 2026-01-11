import { BoardPostDocument, BoardPostModel } from '../domain/board-post.model';
import { PublicationStatus } from '../../../core/enums/PublicationStatus.enum';
import { ApprovalStatus } from '../../../core/enums/ApprovalStatus.enum';

export interface IBoardPostRepository {
  findOrCreateForGroup(params: {
    groupId: string;
    authorId: string;
    description?: string;
  }): Promise<BoardPostDocument>;
  markRemovedForGroup(groupId: string): Promise<void>;
  deleteForGroup(groupId: string): Promise<void>;
  findPublic(page: number, limit: number): Promise<{ posts: BoardPostDocument[]; total: number }>;
  findPublicById(postId: string): Promise<BoardPostDocument | null>;
  findPending(page: number, limit: number): Promise<{ posts: BoardPostDocument[]; total: number }>;
  findById(postId: string): Promise<BoardPostDocument | null>;
  setApprovalStatus(
    postId: string,
    approvalStatus: ApprovalStatus,
  ): Promise<BoardPostDocument | null>;
}

export class BoardPostRepository implements IBoardPostRepository {
  public async findOrCreateForGroup(params: {
    groupId: string;
    authorId: string;
    description?: string;
  }): Promise<BoardPostDocument> {
    const update: {
      authorId: string;
      publicationStatus: PublicationStatus;
      approvalStatus: ApprovalStatus;
      description?: string;
    } = {
      authorId: params.authorId,
      publicationStatus: PublicationStatus.VISIBLE,
      approvalStatus: ApprovalStatus.PENDING,
    };

    if (params.description !== undefined) {
      update.description = params.description;
    }

    return BoardPostModel.findOneAndUpdate(
      { groupId: params.groupId },
      {
        $setOnInsert: { groupId: params.groupId },
        $set: update,
      },
      { new: true, upsert: true },
    ).exec();
  }

  public async markRemovedForGroup(groupId: string): Promise<void> {
    await BoardPostModel.updateOne(
      { groupId },
      { $set: { publicationStatus: PublicationStatus.REMOVED } },
    ).exec();
  }

  public async deleteForGroup(groupId: string): Promise<void> {
    await BoardPostModel.deleteOne({ groupId }).exec();
  }

  public async findPublic(
    page: number,
    limit: number,
  ): Promise<{ posts: BoardPostDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      publicationStatus: PublicationStatus.VISIBLE,
      approvalStatus: ApprovalStatus.APPROVED,
    };

    const [posts, total] = await Promise.all([
      BoardPostModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      BoardPostModel.countDocuments(filter).exec(),
    ]);

    return { posts, total };
  }

  public async findPublicById(postId: string): Promise<BoardPostDocument | null> {
    return BoardPostModel.findOne({
      _id: postId,
      publicationStatus: PublicationStatus.VISIBLE,
      approvalStatus: ApprovalStatus.APPROVED,
    }).exec();
  }

  public async findPending(
    page: number,
    limit: number,
  ): Promise<{ posts: BoardPostDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      approvalStatus: ApprovalStatus.PENDING,
      publicationStatus: PublicationStatus.VISIBLE,
    };

    const [posts, total] = await Promise.all([
      BoardPostModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).exec(),
      BoardPostModel.countDocuments(filter).exec(),
    ]);

    return { posts, total };
  }

  public async findById(postId: string): Promise<BoardPostDocument | null> {
    return BoardPostModel.findById(postId).exec();
  }

  public async findByGroupId(groupId: string): Promise<BoardPostDocument | null> {
    return BoardPostModel.findOne({ groupId }).exec();
  }

  public async setApprovalStatus(
    postId: string,
    approvalStatus: ApprovalStatus,
  ): Promise<BoardPostDocument | null> {
    return BoardPostModel.findByIdAndUpdate(
      postId,
      { $set: { approvalStatus } },
      { new: true },
    ).exec();
  }
}
