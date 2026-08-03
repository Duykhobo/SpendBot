import { Request, Response } from 'express';
import reminderService from '../services/ReminderService';
import { AuthRequest } from '../utils/authMiddleware';

export class ReminderController {
  // Dùng cho Express API
  async getRemindersAPI(req: AuthRequest, res: Response) {
    try {
      const reminders = await reminderService.getRemindersByUser(req.userId);
      res.json({ success: true, data: reminders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
  }

  // Dùng cho Bot Telegram
  async addReminderBot(userId: any, minutesStr: string, message: string): Promise<string> {
    const minutes = parseInt(minutesStr);

    if (isNaN(minutes) || minutes <= 0) {
      return 'Số phút không hợp lệ.';
    }

    try {
      await reminderService.addReminder(userId, minutes, message);
      return `⏰ Đã đặt nhắc nhở: "${message}" sau ${minutes} phút nữa.`;
    } catch (error) {
      console.error('Lỗi khi lưu nhắc nhở:', error);
      return '❌ Có lỗi xảy ra khi lưu nhắc nhở.';
    }
  }

  // Logic Cron Job
  async processPendingReminders(botSendMessage: (userId: number, message: string) => Promise<void>) {
    try {
      const pendingReminders = await reminderService.getPendingRemindersBefore(new Date());

      for (const reminder of pendingReminders) {
        if (reminder.user && reminder.user.telegramId) {
          await botSendMessage(reminder.user.telegramId, `⏰ **NHẮC NHỞ:** ${reminder.message}`);
        }
        await reminderService.markAsCompleted(reminder.id);
      }
    } catch (error) {
      console.error('Lỗi khi chạy cron job:', error);
    }
  }
}

export default new ReminderController();
