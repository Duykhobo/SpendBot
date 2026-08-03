import Expense, { IExpense } from '../models/Expense';

export class ExpenseService {
  async addExpense(userId: any, amount: number, category: string, description: string): Promise<IExpense> {
    const expense = new Expense({ user: userId, amount, category, description });
    return await expense.save();
  }

  async getExpensesByUser(userId: any): Promise<IExpense[]> {
    return await Expense.find({ user: userId }).sort({ timestamp: -1 });
  }

  async getAllExpenses(): Promise<IExpense[]> {
    return await Expense.find().sort({ timestamp: -1 });
  }

  getSummary(expenses: IExpense[]): { total: number; summary: Record<string, number> } {
    let total = 0;
    const summary: Record<string, number> = {};

    expenses.forEach(exp => {
      total += exp.amount;
      summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
    });

    return { total, summary };
  }
}

export default new ExpenseService();
