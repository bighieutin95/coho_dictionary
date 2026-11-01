# 🚀 HƯỚNG DẪN CẤU HÌNH & TRIỂN KHAI VERCEL + SUPABASE

Tài liệu này hướng dẫn chi tiết từng bước từ cấu hình Database Supabase, thiết lập xác thực Google OAuth cho tới triển khai hoàn chỉnh ứng dụng lên nền tảng **Vercel**.

---

## 1. BƯỚC 1: THIẾT LẬP CƠ SỞ DỮ LIỆU TRÊN SUPABASE

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập (hoặc tạo tài khoản miễn phí).
2. Nhấn **"New project"**, đặt tên dự án (ví dụ: `coho-dictionary`), chọn mật khẩu mạnh cho Database và chọn khu vực máy chủ (Region) gần Việt Nam nhất (khuyến nghị: `Singapore - ap-southeast-1`).
3. Sau khi dự án khởi tạo xong, truy cập **SQL Editor** trong thanh menu bên trái.
4. Mở file `database/init_schema.sql` trong mã nguồn dự án, dán toàn bộ nội dung vào SQL Editor và nhấn nút **Run**.
   - Thao tác này sẽ tự động tạo toàn bộ các bảng với tiền tố `kd_*` (`kd_users`, `kd_word_types`, `kd_words`, `kd_phrases`, `kd_examples`, `kd_bookmarks`, `kd_search_history`).
   - Chèn sẵn danh mục từ loại và bộ từ vựng mẫu tiếng K'Ho đầu tiên.
5. Lấy các thông số kết nối:
   - Truy cập **Project Settings** -> **Database** -> Mục **Connection string** (URI): Sao chép chuỗi kết nối PostgreSQL (dạng `postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`).
   - Truy cập **Project Settings** -> **API**:
     - `Project URL` (ví dụ: `https://xyzcompany.supabase.co`)
     - `anon public key`
     - `JWT Secret` (dùng cho Backend NestJS xác minh token).

---

## 2. BƯỚC 2: CẤU HÌNH GOOGLE OAUTH TRÊN SUPABASE

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo dự án mới, vào **APIs & Services** -> **OAuth consent screen** -> Chọn **External** -> Điền thông tin ứng dụng.
3. Vào **Credentials** -> **Create Credentials** -> **OAuth client ID** -> Chọn Application type là **Web application**.
4. Trong mục **Authorized redirect URIs**, điền địa chỉ Callback từ Supabase Auth:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. Nhận `Client ID` và `Client Secret`.
6. Quay lại trang quản trị Supabase: Vào **Authentication** -> **Providers** -> Chọn **Google** -> Bật **Enable Google provider** -> Dán `Client ID` và `Client Secret` -> Nhấn **Save**.

---

## 3. BƯỚC 3: CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV)

### 3.1. Phía Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=production

# Chuỗi kết nối Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.[project-ref]:[db-password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Khóa bí mật Supabase JWT
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Email tài khoản mặc định được tự động trao quyền ADMIN
ADMIN_EMAIL=admin@example.com
```

### 3.2. Phía Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=/api
```

---

## 4. BƯỚC 4: TRIỂN KHAI HOÀN CHỈNH LÊN VERCEL

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Nhấn **"Add New..."** -> Chọn **"Project"**.
3. Chọn kho lưu trữ GitHub: `bighieutin95/coho_dictionary`.
4. Cấu hình triển khai:
   - **Framework Preset**: Chọn `Vite` (hoặc `Other`).
   - **Root Directory**: Để trống (hoặc `./` vì có file `vercel.json` điều phối monorepo).
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
5. Trong mục **Environment Variables**, thêm đầy đủ các biến môi trường:
   - `DATABASE_URL`
   - `SUPABASE_JWT_SECRET`
   - `ADMIN_EMAIL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (giá trị: `/api`)
6. Nhấn **Deploy**! Vercel sẽ tự động build mã nguồn và phát hành ứng dụng ra internet với chứng chỉ SSL HTTPS miễn phí.
