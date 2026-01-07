import { Schema, model, Document, Types } from 'mongoose';
import { PositionType } from '../../../core/enums/PositionType.enum';
import { FrequencyType } from '../../../core/enums/FrequencyType.enum';

export interface FinancialPositionDocument extends Document {
  _id: Types.ObjectId;
  groupId: Types.ObjectId;
  name: string;
  amount: number;
  positionType: PositionType;
  frequencyType: FrequencyType;
  date: Date;
  notes?: string;
  category?: string;
  interestRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const financialPositionSchema = new Schema<FinancialPositionDocument>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'FinancialGroup', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    positionType: { type: String, enum: Object.values(PositionType), required: true },
    frequencyType: { type: String, enum: Object.values(FrequencyType), required: true },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String },
    category: { type: String },
    interestRate: { type: Number },
  },
  { timestamps: true },
);

export const FinancialPositionModel = model<FinancialPositionDocument>(
  'FinancialPosition',
  financialPositionSchema,
);
