import { Request, Response } from 'express';
import { verifyTelegramWebAppData, generateToken } from '../utils/auth';
import userService from '../services/UserService';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { initData } = req.body;
      const botToken = process.env.BOT_TOKEN;

      if (!botToken) {
        return res.status(500).json({ success: false, message: 'Server missing BOT_TOKEN' });
      }

      // Xác thực chữ ký Telegram
      const isValid = verifyTelegramWebAppData(initData, botToken);
      
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid Telegram Data' });
      }

      // Lấy thông tin user từ initData (có chứa trường user dưới dạng JSON)
      const urlParams = new URLSearchParams(initData);
      const userStr = urlParams.get('user');
      
      if (!userStr) {
        return res.status(400).json({ success: false, message: 'Missing user data' });
      }

      const telegramUser = JSON.parse(userStr);
      
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
