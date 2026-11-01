# 🏛️ KIẾN TRÚC HỆ THỐNG & TRIỂN KHAI MONOREPO

Tài liệu này mô tả chi tiết kiến trúc tổng thể, mô hình phân tầng, luồng xử lý dữ liệu và chiến lược đóng gói triển khai ứng dụng **Tự điển K'Ho - Việt** trên nền tảng **Vercel** và **Supabase**.

---

## 1. MÔ HÌNH KIẾN TRÚC TỔNG THỂ

Hệ thống được xây dựng theo mô hình **Client - Server tách biệt (Decoupled Client-Server)** trong cùng một kho lưu trữ mã nguồn (**Monorepo**):

```
+-------------------------------------------------------------+
|                  NGƯỜI DÙNG CUỐI (CLIENT)                   |
|       Trình duyệt di động / Máy tính (PWA / Mobile Web)     |
+-------------------------------------------------------------+
                              |
                              | HTTPS
                              v
+-------------------------------------------------------------+
|               VERCEL EDGE ROUTING & HOSTING                 |
|                                                             |
|   [ / (Root & Assets) ]      -->   [ Vite + React SPA ]     |
|   [ /api/*            ]      -->   [ NestJS Serverless API] |
+-------------------------------------------------------------+
             |                                    |
             | Google OAuth                       | TypeORM (Postgres)
             v                                    v
+-------------------------------------------------------------+
|                     SUPABASE CLOUD                          |
|                                                             |
|  * Supabase Auth (Google OAuth, JWT Token Issue)            |
|  * Supabase PostgreSQL (Bảng `kd_*`, RLS, Full-text Search) |
|  * Supabase Storage (File âm thanh phát âm từ ngữ)          |
+-------------------------------------------------------------+
```

---

## 2. PHÂN TẦNG VÀ TRÁCH NHIỆM

### 2.1. Tầng Giao diện (Frontend - Vite + React)
- **Vị trí thư mục**: `frontend/`
- **Công nghệ chính**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React.
- **Trách nhiệm**:
  - Render giao diện người dùng theo thiết kế Mobile-first phong cách App di động.
  - Xử lý tương tác tìm kiếm trực tiếp với kỹ thuật debounce (tránh gửi request dồn dập).
  - Quản lý trạng thái đăng nhập thông qua Supabase Client SDK (`@supabase/supabase-js`).
  - Gửi mã thông báo (Access Token JWT) lên Backend qua Header `Authorization: Bearer <token>`.
  - Lưu trữ từ vựng yêu thích (Bookmark) và lịch sử tra cứu cục bộ (Local Storage) kết hợp đồng bộ hóa với Database khi người dùng đăng nhập.

### 2.2. Tầng Máy chủ Xử lý Nghiệp vụ (Backend - NestJS)
- **Vị trí thư mục**: `backend/`
- **Công nghệ chính**: NestJS 10, TypeORM, PostgreSQL Client (`pg`), Passport JWT.
- **Trách nhiệm**:
  - Cung cấp toàn bộ RESTful API chuẩn hóa cho Frontend tiêu thụ.
  - Xác thực chữ ký số JWT từ Supabase Auth thông qua `SupabaseAuthGuard`.
  - Kiểm tra và thực thi phân quyền RBAC (Role-Based Access Control) thông qua `RolesGuard`.
  - Thực hiện các nghiệp vụ tra cứu từ điển K'Ho - Việt, chuẩn hóa từ ngữ, tìm kiếm mờ (Fuzzy search) và gợi ý từ tương tự.
  - Quản lý quy trình kiểm duyệt đóng góp: Khởi tạo, chỉnh sửa, phê duyệt và cập nhật vào kho từ điển chính thức.

### 2.3. Tầng Cơ sở Dữ liệu & Lưu trữ (Supabase PostgreSQL & Storage)
- **Trách nhiệm**:
  - Lưu trữ bền vững toàn bộ dữ liệu từ vựng, phiên âm, từ loại, cụm từ, tài khoản người dùng với tiền tố bảng `kd_*`.
  - Cung cấp dịch vụ đăng nhập xã hội Google OAuth mà không cần tự duy trì hạ tầng quản lý mật khẩu phức tạp.
  - Cung cấp cơ chế phân quyền bảo mật cấp dòng (Row Level Security - RLS).
  - Lưu trữ các tệp tin phát âm audio (`.mp3`, `.m4a`) trong Supabase Storage bucket nếu có.

---

## 3. CẤU TRÚC MONOREPO & CƠ CHẾ VERCEL SERVERLESS

Vercel hỗ trợ việc deploy Monorepo bao gồm cả Static Site (Frontend Vite) và Serverless Functions (Backend NestJS) thông qua cấu hình `vercel.json` ở thư mục gốc:

### Sơ đồ định tuyến `vercel.json`:
1. Mọi yêu cầu bắt đầu bằng `/api/(.*)` sẽ được chuyển tiếp tới điểm xuất khẩu Serverless Function của NestJS tại `backend/api/index.ts`.
2. Mọi yêu cầu còn lại sẽ được phục vụ bởi bản build tĩnh của Frontend (thư mục `frontend/dist`).

Cơ chế này mang lại các ưu điểm vượt trội:
- **Tiết kiệm chi phí**: Miễn phí hoàn toàn trên Vercel Hobby plan.
- **Dễ bảo trì**: Không cần duy trì 2 repository riêng biệt, đồng bộ mã nguồn giữa Frontend và Backend trong mỗi lượt Commit/Push.
- **Tốc độ tải trang cao**: Sử dụng mạng lưới CDN toàn cầu của Vercel Edge Network.
