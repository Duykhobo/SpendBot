import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Hàm xác thực dữ liệu từ Telegram Login Widget
export function verifyTelegramWebAppData(telegramInitData: string, botToken: string): boolean {
  // Parsing the string "query_id=...&user=..."
  const urlParams = new URLSearchParams(telegramInitData);
  const hash = urlParams.get('hash');
  
  if (!hash) return false;
  
  urlParams.delete('hash');
  
  const dataCheckArr: string[] = [];
  urlParams.forEach((value, key) => {
    dataCheckArr.push(`${key}=${value}`);
  });
  
  // Sắp xếp theo thứ tự alpha-b
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  
  // Tạo secret key từ botToken theo chuẩn của Telegram
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  
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
