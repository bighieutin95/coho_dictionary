# 📖 TỰ ĐIỂN K'HO - VIỆT (K'HO DICTIONARY WEBAPP)

> **Tài liệu cốt lõi trung tâm của dự án**. Bất kỳ AI hay nhà phát triển nào tham gia dự án đều phải đọc tài liệu này đầu tiên trước khi thực hiện bất kỳ thay đổi nào.

---

## 1. TỔNG QUAN DỰ ÁN

Dự án **Tự điển K'Ho - Việt** là một ứng dụng web hiện đại (Mobile-first Web App) phục vụ công tác tra cứu, học tập, lưu trữ và bảo tồn ngôn ngữ của đồng bào dân tộc K'Ho. Hệ thống hỗ trợ tra cứu hai chiều (K'Ho ⇄ Việt), hiển thị từ vựng, phiên âm ngữ âm, phân loại từ, các cụm từ/thành ngữ liên quan và câu ví dụ minh họa thực tế.

Ứng dụng được thiết kế theo tiêu chuẩn phần mềm chuyên nghiệp: giao diện tinh gọn, mượt mà chuẩn phong cách ứng dụng di động (App-like UI), 100% tiếng Việt, tích hợp bảo mật, xác thực Google OAuth qua Supabase và phân quyền quản trị rõ ràng.

---

## 2. KIẾN TRÚC VÀ CÔNG NGHỆ CHÍNH

- **Mô hình dự án**: Monorepo chứa đồng thời Frontend và Backend trong cùng một kho mã nguồn.
- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework mô-đun hóa cao cấp) kết hợp [TypeORM](https://typeorm.io/) để ánh xạ quan hệ cơ sở dữ liệu.
- **Frontend**: [React 18+](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/). Tối ưu trải nghiệm màn hình cảm ứng di động.
- **Cơ sở dữ liệu**: [Supabase PostgreSQL](https://supabase.com/) – Đảm bảo toàn vẹn dữ liệu quan hệ, hỗ trợ Full-text search và UUID.
- **Xác thực & Ủy quyền**: Supabase Auth (Đăng nhập Google OAuth) + JWT Guard trong NestJS.
- **Nền tảng máy chủ**: Triển khai trực tiếp lên [Vercel](https://vercel.com/) (Frontend Static SPA + Backend Serverless Functions/API).
- **Quy ước tiền tố bảng Database**: Mọi bảng trong cơ sở dữ liệu đều bắt đầu bằng tiền tố **`kd_`** (viết tắt của *K'Ho Dictionary*).

---

## 3. BẢN ĐỒ TÀI LIỆU DỰ ÁN (DOCS SITEMAP)

Mọi chi tiết kỹ thuật được phân rã thành các tài liệu chuyên sâu trong thư mục `docs/`. Khi cập nhật tính năng hoặc kiến trúc, các tài liệu tương ứng bắt buộc phải được cập nhật đồng bộ:

1. 🏛️ **[Kiến trúc hệ thống & Triển khai Monorepo](./docs/ARCHITECTURE.md)**: Chi tiết cấu trúc cây thư mục, luồng tương tác giữa Frontend - Backend - Supabase và cơ chế chạy trên Vercel.
2. 🗄️ **[Thiết kế Cơ sở dữ liệu & Data Schema](./docs/DATABASE_SCHEMA.md)**: Định nghĩa chi tiết các bảng `kd_*`, khóa chính, khóa ngoại, chỉ mục (indexes) và mã SQL khởi tạo.
3. 🔐 **[Xác thực & Phân quyền (Auth & RBAC)](./docs/AUTH_PERMISSIONS.md)**: Quy trình Google OAuth với Supabase, hệ thống phân quyền (Admin, Biên tập viên, Người đóng góp, Người dùng tra cứu).
4. 🔌 **[Đặc tả API Backend (API Specification)](./docs/API_SPECIFICATION.md)**: Danh sách đầy đủ các Endpoint RESTful, cấu trúc Request/Response DTOs, tìm kiếm đa tiêu chí.
5. 📱 **[Đặc tả Giao diện & Trải nghiệm Người dùng (UI/UX)](./docs/UI_UX_SPECIFICATION.md)**: Nguyên tắc thiết kế Mobile-first, giao diện phong cách Native App, bàn phím ký tự đặc trưng K'Ho, chế độ tối/sáng.
6. 🚀 **[Hướng dẫn Cấu hình & Triển khai Vercel](./docs/DEPLOYMENT_GUIDE.md)**: Chi tiết từng bước kết nối Supabase, biến môi trường `.env` và deploy Vercel thành công.

---

## 4. TÍNH NĂNG CỐT LÕI CỦA HỆ THỐNG

### 4.1. Dành cho người dùng đại chúng (Khách tra cứu & Học viên)
- 🔍 **Tra cứu thông minh hai chiều**: Tra từ K'Ho sang tiếng Việt hoặc từ tiếng Việt sang K'Ho.
- 🔤 **Bộ gõ hỗ trợ ký tự đặc thù K'Ho**: Thanh phím ảo gõ nhanh các ký tự nguyên âm/phụ âm đặc biệt trong văn tự K'Ho (như `ơ`, `ư`, các ký tự có dấu phụ âm vị học).
- 📖 **Chi tiết từ vựng toàn diện**:
  - Từ ngữ K'Ho chuẩn xác.
  - Phiên âm quốc tế / phiên âm chuẩn hóa.
  - Phân loại từ (Danh từ, Động từ, Tính từ, Phó từ, Đại từ...).
  - Nghĩa tiếng Việt ngắn gọn và diễn giải ngữ nghĩa mở rộng.
  - Cụm từ / Thành ngữ K'Ho có liên quan kèm nghĩa tiếng Việt.
  - Câu ví dụ song ngữ (K'Ho - Việt).
- ⭐ **Sổ tay từ yêu thích (Bookmarks)**: Lưu trữ các từ cần học để xem lại nhanh.
- 🕒 **Lịch sử tra cứu gần đây**: Tự động ghi nhớ các từ vừa tra để truy cập tức thì ngay cả khi offline.

### 4.2. Dành cho thành viên đóng góp (Contributors)
- ✍️ **Đóng góp từ mới & cụm từ mới**: Cho phép người dùng đăng nhập Google gửi đề xuất thêm từ ngữ, nghĩa, phiên âm và câu ví dụ.
- 📝 **Theo dõi tiến độ duyệt**: Xem trạng thái từ vựng đã gửi (Đang chờ duyệt, Đã chấp thuận, Yêu cầu chỉnh sửa).

### 4.3. Dành cho Ban biên tập & Quản trị viên (Moderators & Admins)
- 🛡️ **Bàn kiểm duyệt nội dung (Moderation Dashboard)**: Xem xét, chỉnh sửa và phê duyệt/từ chối các đóng góp từ cộng đồng.
- 👥 **Quản lý phân quyền người dùng**: Thăng cấp / hạ cấp vai trò tài khoản (Admin, Biên tập viên, Đóng góp, Người dùng).
- 📊 **Thống kê từ điển**: Tổng số từ, số cụm từ, tần suất tra cứu và số lượng đóng góp hàng tuần/tháng.

---

## 5. CẤU TRÚC THƯ MỤC NGUỒN (MONOREPO)

```plaintext
Coho_dictionary/
├── docs/                       # Toàn bộ tài liệu chi tiết của dự án (100% tiếng Việt)
│   ├── ARCHITECTURE.md         # Kiến trúc hệ thống
│   ├── DATABASE_SCHEMA.md      # Thiết kế cơ sở dữ liệu
│   ├── AUTH_PERMISSIONS.md     # Cơ chế xác thực & phân quyền
│   ├── API_SPECIFICATION.md    # Đặc tả REST API
│   ├── UI_UX_SPECIFICATION.md  # Đặc tả giao diện Mobile-first
│   └── DEPLOYMENT_GUIDE.md     # Hướng dẫn kết nối Database & deploy Vercel
├── backend/                    # Mã nguồn NestJS Backend
│   ├── src/
│   │   ├── config/             # Cấu hình Database & Environment
│   │   ├── modules/
│   │   │   ├── auth/           # Module xác thực Supabase JWT & Guards
│   │   │   ├── users/          # Module quản lý người dùng & phân quyền
│   │   │   ├── dictionary/     # Module tra cứu từ, cụm từ, phiên âm, từ loại
│   │   │   └── contributions/  # Module đóng góp & phê duyệt nội dung
│   │   ├── database/
│   │   │   └── entities/       # Các thực thể TypeORM (kd_*)
│   │   ├── main.ts             # Điểm khởi chạy ứng dụng NestJS
│   │   └── app.module.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Mã nguồn Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Giao diện UI tái sử dụng (BottomNav, SearchBar, WordCard...)
│   │   ├── pages/              # Các trang chính: Tra cứu, Chi tiết, Đóng góp, Quản trị
│   │   ├── services/           # Kết nối API Backend & Supabase Client
│   │   ├── context/            # Quản lý Auth State & Bookmark State
│   │   ├── types/              # Định nghĩa kiểu dữ liệu TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── vercel.json                 # Cấu hình định tuyến triển khai Monorepo trên Vercel
├── package.json                # Root package quản lý lệnh chung (build, dev, test)
└── README.md                   # File này - Cốt lõi trung tâm dự án
```

---

## 6. QUY TẮC PHÁT TRIỂN & CAM KẾT CHẤT LƯỢNG

1. **Ngôn ngữ chuẩn mực**: 100% tài liệu, giao diện người dùng và chú thích mã nguồn đều sử dụng tiếng Việt rõ ràng, chuẩn ngữ pháp.
2. **Tài liệu đi trước mã nguồn**: Mọi thay đổi về cấu trúc dữ liệu hoặc luồng nghiệp vụ đều phải được tài liệu hóa trước khi viết code.
3. **Độ tương thích cao trên thiết bị di động**: Giao diện được kiểm thử chặt chẽ trên kích thước màn hình smartphone phổ thông (360px - 430px) trước khi tối ưu cho máy tính bảng và desktop.
4. **Bảo mật cơ sở dữ liệu**: Tất cả truy vấn cơ sở dữ liệu qua TypeORM đều tham số hóa (Parameterized Queries) chống triệt để tấn công SQL Injection. Áp dụng Row Level Security (RLS) của Supabase.
