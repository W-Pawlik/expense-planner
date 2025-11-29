import { Schema, model, Document, Types } from 'mongoose';
import { PublicationStatus } from '../../../core/enums/PublicationStatus.enum';
import { ApprovalStatus } from '../../../core/enums/ApprovalStatus.enum';

export interface BoardPostDocument extends Document {
  _id: Types.ObjectId;
  groupId: Types.ObjectId;
  authorId: Types.ObjectId;
  description?: string;
  publicationStatus: PublicationStatus;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const boardPostSchema = new Schema<BoardPostDocument>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'FinancialGroup',
      required: true,
      unique: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    publicationStatus: {
      type: String,
      enum: Object.values(PublicationStatus),
      default: PublicationStatus.VISIBLE,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
    },
  },
  { timestamps: true },
);

export const BoardPostModel = model<BoardPostDocument>('BoardPost', boardPostSchema);
