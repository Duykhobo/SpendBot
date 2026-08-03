import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Hàm xác thực dữ liệu từ Telegram Login Widget
export function verifyTelegramWebAppData(telegramUser: any, botToken: string): boolean {
  if (!telegramUser || !telegramUser.hash) return false;
  
  const hash = telegramUser.hash;
  const dataCheckArr: string[] = [];
  
  // Trích xuất tất cả key ngoại trừ hash
  for (const key in telegramUser) {
    if (key !== 'hash' && telegramUser[key] !== undefined && telegramUser[key] !== null) {
      dataCheckArr.push(`${key}=${telegramUser[key]}`);
    }
  }
  
  // Sắp xếp theo thứ tự alpha-b
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  
  // Login Widget sử dụng SHA256(botToken) làm secret key (Khác với Mini App dùng HMAC)
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  
  // Sinh mã hash từ chuỗi dữ liệu
  const generatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  return generatedHash === hash;
}

// Hàm sinh JWT Token
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'super-secret-key-telegram-bot';
  // Token có hiệu lực 7 ngày
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}
