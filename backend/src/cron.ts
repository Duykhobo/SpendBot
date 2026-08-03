import cron from 'node-cron';
import reminderController from './controllers/ReminderController';
import bot from './bot';

// Chạy mỗi phút
cron.schedule('* * * * *', async () => {
  await reminderController.processPendingReminders(async (userId, message) => {
    await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
  });
});

console.log('Cron job đã được thiết lập.');
