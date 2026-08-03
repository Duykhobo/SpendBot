import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  timestamp: Date;
}

const ExpenseSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['an_uong', 'di_lai', 'hoa_don', 'mua_sam', 'khac'] 
  },
  description: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
