import { Schema, model, Document } from 'mongoose';

export type UserRole = 'USER' | 'ADMIN';

export interface UserDocument extends Document {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
