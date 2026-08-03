import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Lỗi: MONGODB_URI không được cấu hình trong file .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB đã kết nối thành công!');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
}
