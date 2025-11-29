import { Schema, model, Document, Types } from 'mongoose';
import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';

export interface FinancialGroupDocument extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  visibilityStatus: VisibilityStatus;
  projectionYears: number;
  createdAt: Date;
  updatedAt: Date;
}

const financialGroupSchema = new Schema<FinancialGroupDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    visibilityStatus: {
      type: String,
      enum: Object.values(VisibilityStatus),
      default: VisibilityStatus.PRIVATE,
    },
    projectionYears: { type: Number, required: true },
  },
  { timestamps: true },
);

export const FinancialGroupModel = model<FinancialGroupDocument>(
  'FinancialGroup',
  financialGroupSchema,
);
