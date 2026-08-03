import { Request, Response } from 'express';
import expenseService from '../services/ExpenseService';
import { parseShorthandNumber } from '../utils/numberParser';
import { AuthRequest } from '../utils/authMiddleware';

export class ExpenseController {
  // Dùng cho Express API
  async getExpensesAPI(req: AuthRequest, res: Response) {
    try {
      const expenses = await expenseService.getExpensesByUser(req.userId);
      res.json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
  }

  // Dùng cho Bot Telegram
  async addExpenseBot(userId: any, amountStr: string, category: string, description: string): Promise<string> {
    const amount = parseShorthandNumber(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      return 'Số tiền không hợp lệ. Bạn có thể nhập: 50k, 1m, 2 củ...';
    }

    const validCategories = ['an_uong', 'di_lai', 'hoa_don', 'mua_sam', 'khac'];
    if (!validCategories.includes(category)) {
      return `Danh mục không hợp lệ. Vui lòng chọn: ${validCategories.join(', ')}`;
    }

    try {
      await expenseService.addExpense(userId, amount, category, description);
      return `✅ Đã ghi nhận chi tiêu:\nSố tiền: ${amount.toLocaleString()}đ\nDanh mục: ${category}\nMô tả: ${description || 'Không có'}`;
    } catch (error) {
      console.error('Lỗi khi lưu chi tiêu:', error);
      return '❌ Có lỗi xảy ra khi lưu chi tiêu.';
    }
  }

  async getReportBot(userId: any): Promise<string> {
    try {
      const expenses = await expenseService.getExpensesByUser(userId);
      if (expenses.length === 0) {
        return 'Bạn chưa có khoản chi tiêu nào.';
      }

      const { total, summary } = expenseService.getSummary(expenses);

      let reportMsg = `📊 Báo cáo chi tiêu của bạn:\n\n`;
      for (const [cat, sum] of Object.entries(summary)) {
        reportMsg += `- ${cat}: ${sum.toLocaleString()}đ\n`;
      }
      reportMsg += `\n💰 Tổng cộng: ${total.toLocaleString()}đ`;

      return reportMsg;
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo:', error);
      return '❌ Có lỗi xảy ra khi lấy báo cáo.';
    }
  }
}

export default new ExpenseController();
