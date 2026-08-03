import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  user: mongoose.Types.ObjectId;
  time: Date;
  message: string;
  isCompleted: boolean;
}

const ReminderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  time: { type: Date, required: true, index: true },
  message: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
