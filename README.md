# 🤖 SpenseBot - Hệ thống Bot Telegram Quản lý Chi tiêu & Web Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
</div>

<br/>

SpenseBot là một hệ thống quản lý tài chính cá nhân và đặt lịch nhắc nhở toàn diện, kết hợp sự tiện lợi của **Telegram Bot** (nhập liệu thần tốc) với một **Web Dashboard Glassmorphism** (trực quan hoá dữ liệu). Dự án được thiết kế theo chuẩn mô hình **MVC**, nguyên tắc **SOLID**, bảo mật JWT cao cấp và kiến trúc phân tách Frontend/Backend hiện đại.

---

## 📸 Hình ảnh Demo

*(Hãy thay thế ảnh bằng file thực tế tải lên repo `docs/`)*

![Dashboard Demo](./docs/dashboard-demo.png)
> 💡 **Giao diện Web Dashboard (Glassmorphism)**: Tích hợp Đăng nhập 1 chạm bằng Telegram, thống kê biểu đồ chi tiêu (Recharts) với giao diện kính mờ (Glassmorphism) chuẩn Dark Mode cực kỳ sang trọng.

![Bot Demo](./docs/bot-demo.png)
> 💡 **Bot Telegram**: Xử lý mượt mà số tiền viết tắt (`50k`, `2 lít`) với Inline Keyboard (Nút bấm Undo/Fail-Fast) đảm bảo tính toàn vẹn dữ liệu.

---

## ✨ Tính năng nổi bật

### 1. Telegram Bot (Đầu vào thông minh)
- **Parse số tiền tự nhiên (Shorthand Numbers)**: Hỗ trợ người dùng nhập nhanh `50k`, `50 củ`, `2 lít`...
- **Fail-Fast & Undo**: Bắt lỗi cú pháp ngay lập tức và có hệ thống lưu session (timeout 5 phút) để người dùng có thể thao tác lại bằng Nút bấm tiện lợi.
- **Tính năng nhắc nhở (Cron Jobs)**: Đặt nhắc nhở theo phút, bot sẽ chủ động nhắn tin khi đến hạn.

### 2. Web Dashboard (Giao diện nghìn sao)
- **Thiết kế Glassmorphism**: Sử dụng hoàn toàn Vanilla CSS và CSS Variables để tạo hiệu ứng kính mờ (backdrop-filter) sắc nét, tối ưu hiệu năng.
- **Biểu đồ trực quan**: Sử dụng thư viện Recharts để thống kê phân bổ danh mục chi tiêu.
- **Quản lý State toàn cục**: Ứng dụng Zustand siêu nhẹ thay thế Redux để quản lý User Token.

### 3. Backend & Authentication (API)
- **Xác thực Telegram Widget chuẩn xác**: Triển khai mã hóa SHA256 để verify chữ ký số từ Telegram Widget, cấp phát JWT cho API an toàn.
- **Axios Interceptors**: Tự động đính kèm Token ở mọi Request từ Frontend xuống Backend.

---

## 📂 Cấu trúc Thư mục (Monorepo-style)

```text
📦 SpendBot
 ┣ 📂 backend            # API Server & Bot (Node.js, Express, Mongoose)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 bot            # Bot Handlers, Middlewares
 ┃ ┃ ┣ 📂 controllers    # Xử lý Logic HTTP và Bot
 ┃ ┃ ┣ 📂 models         # Mongoose Schemas (User, Expense, Reminder)
 ┃ ┃ ┣ 📂 routes         # Express API Routes
 ┃ ┃ ┣ 📂 services       # Bussiness Logic (Database)
 ┃ ┃ ┗ 📜 index.ts       # Entry point cho Backend
 ┃ ┗ 📜 .env.example
 ┃
 ┗ 📂 frontend           # Web Dashboard (React, Vite)
   ┣ 📂 src
   ┃ ┣ 📂 components     # Reusable UI (Header, ProtectedRoute...)
   ┃ ┣ 📂 pages          # Login, Dashboard views
   ┃ ┣ 📂 services       # Axios API Config & Interceptors
   ┃ ┣ 📂 store          # Zustand Global State
   ┃ ┣ 📜 App.tsx        # React Router Setup
   ┃ ┗ 📜 index.css      # Design System (Glassmorphism Variables)
   ┗ 📜 vite.config.ts   # Cấu hình Proxy gọi API
```

---

## 🚀 Cài đặt & Chạy cục bộ (Local Development)

### Yêu cầu hệ thống
- Node.js (v18 trở lên)
- MongoDB Atlas (hoặc Local)
- 1 Bot Telegram (Tạo qua [@BotFather](https://t.me/BotFather))

### Các bước cài đặt

**1. Khởi chạy Backend**
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa file .env với BOT_TOKEN và MONGODB_URI của bạn
npm run dev
```

**2. Khởi chạy Frontend**
Mở một cửa sổ Terminal khác:
```bash
cd frontend
npm install
npm run dev
```
Truy cập `http://localhost:5173` (hoặc cấu hình Ngrok/Pinggy nếu muốn test Telegram Login Widget trên điện thoại).

---

## 🚢 Hướng dẫn Triển khai (Deployment)

Dự án được thiết kế để dễ dàng deploy lên các nền tảng đám mây:

### 1. Triển khai Backend (Render, Vercel hoặc VPS)
- Cấu hình Environment Variables: `BOT_TOKEN`, `MONGODB_URI`, `JWT_SECRET`.
- Lệnh Build: `npm install && npx tsc`
- Lệnh Start: `node dist/index.js`
- Đảm bảo cấu hình CORS trong Express cho phép tên miền Frontend truy cập.

### 2. Triển khai Frontend (Vercel, Netlify)
- Đẩy thư mục `frontend` lên Vercel.
- Cấu hình Build Command: `npm run build`
- Output Directory: `dist`
- **Quan trọng:** Bạn cần đổi URL `/api` trong `src/services/api.ts` trỏ thẳng tới tên miền thật của Backend, hoặc cấu hình Vercel Rewrites (`vercel.json`) để proxy request `/api` sang Backend domain.
- Lên `@BotFather` gõ `/setdomain` và nhập tên miền Vercel của bạn để Widget Đăng nhập hoạt động.

---

> Được xây dựng với ❤️ nhằm mang đến trải nghiệm quản lý tài chính cá nhân mượt mà nhất.
