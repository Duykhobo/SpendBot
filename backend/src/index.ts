import express from 'express';
import cors from 'cors';
import bot from './bot';
import './cron';

const app = express();
app.use(cors());
app.use(express.json());

import { connectDB } from './config/database';
import apiRoutes from './routes/apiRoutes';

connectDB().then(() => {
  // Khởi động Express Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API Server đang chạy tại http://localhost:${PORT}`);
  });

  // Khởi động Telegram Bot
  console.log('Khởi động Bot Telegram...');
  bot.launch().then(() => {
    console.log('Bot đã khởi động thành công!');
  }).catch((err) => {
    console.error('Lỗi khởi động Bot:', err);
  });
});

// --- API ENDPOINTS ---
app.use('/api', apiRoutes);

// Kích hoạt tính năng ngắt an toàn
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
