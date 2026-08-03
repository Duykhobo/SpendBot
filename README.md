# 🤖 SpenseBot - Hệ thống Bot Telegram Quản lý Chi tiêu & Nhắc nhở

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Telegraf](https://img.shields.io/badge/Telegraf-2CA5E0?style=flat&logo=telegram&logoColor=white)

SpenseBot là một hệ thống quản lý tài chính cá nhân và đặt lịch nhắc nhở toàn diện, được tích hợp trực tiếp qua Telegram Bot kết hợp với một Web Dashboard (đang phát triển). Dự án được thiết kế theo chuẩn mô hình **MVC (Model-View-Controller)** và nguyên tắc **SOLID**, đem lại hiệu năng cao và dễ dàng mở rộng.

---

## 📸 Demo & Giao diện

*(Chèn ảnh hoặc GIF thực tế ở đây sau khi hoàn thiện UI Web)*
> 💡 **Ảnh 1**: Demo Bot Telegram xử lý mượt mà số tiền viết tắt (`50k`, `2 lít`) với Inline Keyboard (Nút bấm)
> 💡 **Ảnh 2**: Giao diện Web Dashboard (Glassmorphism) trực quan thống kê chi tiêu.

---

## ✨ Tính năng nổi bật

### 1. Telegram Bot (Input Thông Minh)
- **Parse số tiền tự nhiên (Shorthand Numbers)**: Hỗ trợ người dùng nhập nhanh `50k`, `50 củ`, `2 lít`... thay vì phải gõ chuỗi số 0 dài dòng.
- **Fail-Fast & Undo**: Bắt lỗi cú pháp ngay lập tức và có hệ thống lưu session (timeout 5 phút) để người dùng chọn danh mục (bằng các Nút bấm tiện lợi) nhằm tránh sai lệch dữ liệu.
- **Tính năng nhắc nhở (Cron Jobs)**: Đặt nhắc nhở theo phút, bot sẽ chủ động nhắn tin khi đến hạn.

### 2. Backend & Authentication (API)
- **Kiến trúc MVC**: Phân tách rõ ràng giữa `Controllers`, `Services`, `Models` và `Routes`.
- **Bảo mật chuẩn Doanh nghiệp**: Tích hợp thuật toán xác thực (HMAC-SHA256) xác minh dữ liệu từ **Telegram Login Widget**. Đóng gói thành **JWT (JSON Web Token)** để bảo mật các API queries.
- **Data Isolation**: Quản lý `User` chặt chẽ, các Expense và Reminder được link với người dùng qua hệ quản trị dữ liệu `ObjectId` của MongoDB.

### 3. Web Dashboard (Sắp ra mắt - Phase 2)
- Theo dõi biểu đồ chi tiêu (Recharts).
- Đăng nhập 1 chạm với Telegram Login.
- Giao diện Glassmorphism hiện đại và sang trọng.

---

## 📂 Cấu trúc Thư mục (Architecture)
Dự án được tổ chức rõ ràng theo chuẩn mô hình MVC để dễ dàng phân chia Logic, Data và Router.

```text
📦 backend
 ┣ 📂 src
 ┃ ┣ 📂 bot            # Bot Handlers, Middlewares
 ┃ ┣ 📂 config         # Kết nối DB, Cấu hình môi trường
 ┃ ┣ 📂 controllers    # Xử lý Logic HTTP và Bot
 ┃ ┣ 📂 models         # Mongoose Schemas (User, Expense, Reminder)
 ┃ ┣ 📂 routes         # Express API Routes
 ┃ ┣ 📂 services       # Bussiness Logic thao tác trực tiếp với Database
 ┃ ┣ 📂 utils          # Utilities (Number Parser, Auth JWT)
 ┃ ┣ 📜 cron.ts        # Setup Node-cron jobs
 ┃ ┗ 📜 index.ts       # Entry point cho Server
 ┗ 📜 .env.example     # Template biến môi trường
```

---

## 🚀 Cài đặt & Chạy cục bộ (Local Development)

### Yêu cầu hệ thống
- Node.js (v16 trở lên)
- MongoDB (Sử dụng MongoDB Atlas hoặc Local)
- 1 Bot Telegram (Tạo qua [@BotFather](https://t.me/BotFather))

### Các bước cài đặt

**1. Clone dự án và cài đặt dependencies**
```bash
git clone https://github.com/Duykhobo/SpendBot.git
cd SpendBot/backend
npm install
```

**2. Cấu hình biến môi trường**
Copy file mẫu và đổi tên thành `.env`:
```bash
cp .env.example .env
```
Mở file `.env` và điền các thông tin của bạn (BOT_TOKEN, MONGODB_URI, JWT_SECRET).

**3. Chạy Server ở chế độ Development**
```bash
npm run dev
```
Server Express sẽ lắng nghe tại `http://localhost:3000` và Bot Telegram sẽ tự động khởi chạy, lắng nghe các lệnh từ người dùng.

---

## 🚢 Triển khai (Deployment)
Dự án đã được module hoá hoàn chỉnh để sẵn sàng đưa lên môi trường Production. 

**Tùy chọn 1: Render hoặc Vercel (PaaS)**
- Đẩy code lên GitHub.
- Liên kết kho lưu trữ với **Render Web Service** (hoặc nền tảng tương đương).
- Thiết lập Root Directory là `backend`, lệnh Build: `npm install && npx tsc`, lệnh Start: `node dist/index.js`.
- Cấu hình Environment Variables theo nội dung file `.env`.

**Tùy chọn 2: VPS (Ubuntu) bằng PM2**
```bash
# Sau khi build source code sang Javascript
npm install -g pm2
pm2 start dist/index.js --name "SpenseBot"
pm2 save
```

---

## 📝 Danh sách lệnh Bot Telegram
- `/spend <số tiền> [mô tả]` - Ghi chép chi tiêu (vd: `/spend 50k Ăn sáng`)
- `/remind <số phút> <nội dung>` - Đặt lời nhắc nhở
- `/report` - Báo cáo tổng chi tiêu
- `/list_reminders` - Xem danh sách nhắc nhở chưa hoàn thành

---

> Được xây dựng với ❤️ nhằm mang đến trải nghiệm quản lý tài chính cá nhân mượt mà nhất ngay trên nền tảng Telegram.
