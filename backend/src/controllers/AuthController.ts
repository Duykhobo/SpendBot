import { Request, Response } from 'express';
import { verifyTelegramWebAppData, generateToken } from '../utils/auth';
import userService from '../services/UserService';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const telegramUser = req.body;
      const botToken = process.env.BOT_TOKEN;

      if (!botToken) {
        return res.status(500).json({ success: false, message: 'Server missing BOT_TOKEN' });
      }

      // Xác thực chữ ký Telegram
      const isValid = verifyTelegramWebAppData(telegramUser, botToken);
      
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid Telegram Data' });
      }
      
      // Tạo hoặc tìm User trong Database
      const dbUser = await userService.getOrCreateUser(
        telegramUser.id,
        telegramUser.first_name,
        telegramUser.last_name,
        telegramUser.username
      );

      // Cấp phát JWT
      const token = generateToken(dbUser._id.toString());

      res.json({
        success: true,
        token,
        user: {
          id: dbUser._id,
          telegramId: dbUser.telegramId,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          username: dbUser.username,
          budget: dbUser.budget
        }
      });

    } catch (error: any) {
      console.error('Lỗi Login:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default new AuthController();
