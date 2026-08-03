import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  budget: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  telegramId: { type: Number, required: true, unique: true, index: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  budget: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
