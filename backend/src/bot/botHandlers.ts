import { Telegraf } from 'telegraf';
import expenseController from '../controllers/ExpenseController';
import reminderController from '../controllers/ReminderController';
import { MyContext } from './middlewares';
import { Markup } from 'telegraf';

// Lưu trữ trạng thái tạm thời (in-memory) để xử lý nút bấm
const pendingExpenses = new Map<number, { amountStr: string, description: string }>();

export function setupBotHandlers(bot: Telegraf<MyContext>) {
  bot.start((ctx) => {
    ctx.reply('Chào mừng bạn đến với Bot Quản lý Thời gian và Chi tiêu!\n\nTôi có thể giúp bạn ghi chép chi tiêu và đặt nhắc nhở.\nHãy gõ /help để xem các lệnh có sẵn nhé!');
  });

  bot.help((ctx) => {
    ctx.reply(
      'Danh sách lệnh:\n' +
      '/spend <số tiền> [mô tả] - Ghi tiêu (vd: /spend 50k Phở bò)\n' +
      '/report - Xem báo cáo chi tiêu\n' +
      '/remind <số phút> <nội dung> - Đặt nhắc nhở\n' +
      '/list_reminders - Xem danh sách nhắc nhở chưa xong'
    );
  });

  bot.command('spend', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) {
      return ctx.reply('Sai cú pháp! Vui lòng dùng: /spend <số tiền> [mô tả]\nVD: /spend 50k Phở bò');
    }
    
    const amountStr = args[0];
    const description = args.slice(1).join(' ');

    // Lưu vào bộ nhớ tạm bằng telegramId để action dễ lấy
    pendingExpenses.set(ctx.from.id, { amountStr, description });

    // Hiển thị nút bấm
    ctx.reply('Hãy chọn danh mục cho khoản chi này:', Markup.inlineKeyboard([
      [Markup.button.callback('Ăn uống 🍔', 'cat_an_uong'), Markup.button.callback('Đi lại 🛵', 'cat_di_lai')],
      [Markup.button.callback('Hóa đơn 🧾', 'cat_hoa_don'), Markup.button.callback('Mua sắm 🛍️', 'cat_mua_sam')],
      [Markup.button.callback('Khác 🧩', 'cat_khac')]
    ]));
  });

  // Xử lý khi người dùng bấm nút danh mục
  bot.action(/cat_(.+)/, async (ctx) => {
    const telegramId = ctx.from.id;
    const pending = pendingExpenses.get(telegramId);
    
    if (!pending || !ctx.dbUser) {
      return ctx.answerCbQuery('Phiên giao dịch đã hết hạn hoặc lỗi xác thực.', { show_alert: true });
    }

    const category = ctx.match[1];
    const { amountStr, description } = pending;

    const replyMsg = await expenseController.addExpenseBot(ctx.dbUser._id, amountStr, category, description);
    
    // Trả lời và xóa nút bấm
    await ctx.editMessageText(replyMsg);
    
    // Xóa bộ nhớ tạm
    pendingExpenses.delete(telegramId);
  });

  bot.command('report', async (ctx) => {
    if (!ctx.dbUser) return;
    const replyMsg = await expenseController.getReportBot(ctx.dbUser._id);
    ctx.reply(replyMsg);
  });

  bot.command('remind', async (ctx) => {
    if (!ctx.dbUser) return;
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 2) {
      return ctx.reply('Sai cú pháp! Vui lòng dùng: /remind <số phút> <nội dung>\nVD: /remind 10 Uong nuoc');
    }
    const minutesStr = args[0];
    const message = args.slice(1).join(' ');

    const replyMsg = await reminderController.addReminderBot(ctx.dbUser._id, minutesStr, message);
    ctx.reply(replyMsg);
  });
}
