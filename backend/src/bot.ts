import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { setupBotHandlers } from './bot/botHandlers';
import { userMiddleware, MyContext } from './bot/middlewares';

dotenv.config();

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<MyContext>(botToken);

// Đăng ký Middleware
bot.use(userMiddleware);

setupBotHandlers(bot);

export default bot;
