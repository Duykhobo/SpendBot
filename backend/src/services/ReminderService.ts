import Reminder, { IReminder } from '../models/Reminder';

export class ReminderService {
  async addReminder(userId: any, minutes: number, message: string): Promise<IReminder> {
    const time = new Date(Date.now() + minutes * 60000);
    const reminder = new Reminder({ user: userId, time, message });
    return await reminder.save();
  }

  async getAllReminders(): Promise<IReminder[]> {
    return await Reminder.find().sort({ time: 1 });
  }

  async getRemindersByUser(userId: any): Promise<IReminder[]> {
    return await Reminder.find({ user: userId }).sort({ time: 1 });
  }

  async getPendingRemindersBefore(date: Date): Promise<any[]> {
    return await Reminder.find({
      time: { $lte: date },
      isCompleted: false
    }).populate('user');
  }

  async markAsCompleted(reminderId: string): Promise<void> {
    await Reminder.findByIdAndUpdate(reminderId, { isCompleted: true });
  }
}

export default new ReminderService();
