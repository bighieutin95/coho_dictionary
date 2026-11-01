# 🔐 XÁC THỰC & PHÂN QUYỀN (AUTH & RBAC)

Tài liệu này quy định kiến trúc bảo mật, cơ chế xác thực một chạm qua Google OAuth và hệ thống phân quyền theo vai trò (Role-Based Access Control - RBAC) trong ứng dụng **Tự điển K'Ho - Việt**.

---

## 1. QUY TRÌNH XÁC THỰC GOOGLE OAUTH QUA SUPABASE

Ứng dụng sử dụng **Supabase Auth** để xử lý toàn bộ luồng đăng nhập bằng tài khoản Google, giúp bảo mật tối đa và tối ưu trải nghiệm người dùng:

```
[ Người dùng ] --( Nhấn nút "Đăng nhập Google" )--> [ Frontend Vite/React ]
                                                               |
                                                               | supabase.auth.signInWithOAuth({ provider: 'google' })
                                                               v
                                                    [ Google OAuth Consent ]
                                                               |
                                                               | (Đồng ý ủy quyền)
                                                               v
                                                    [ Supabase Auth Server ]
                                                               |
                                                               | Trả về Access Token (JWT) & Refresh Token
                                                               v
                                                    [ Frontend Vite/React ]
                                                               |
                                                               | Gửi request: GET/POST kèm Bearer JWT Token
                                                               v
                                                    [ Backend NestJS API ]
                                                               |
                                                               |---> [ SupabaseAuthGuard ] (Verify JWT signature & Expire)
                                                               |---> Đồng bộ/Khởi tạo tài khoản vào `kd_users` (nếu chưa có)
                                                               |---> [ RolesGuard ] (Kiểm tra quyền hạn thực thi)
                                                               v
                                                    [ Trả về dữ liệu kết quả ]
```

---

## 2. MA TRẬN PHÂN QUYỀN VAI TRÒ (RBAC MATRIX)

Hệ thống định nghĩa 4 cấp độ vai trò chính:

| Chức năng | Khách vãng lai | Người dùng (`USER`) | Người đóng góp (`CONTRIBUTOR`) | Biên tập viên (`MODERATOR`) | Quản trị viên (`ADMIN`) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Tra cứu từ ngữ K'Ho & Việt | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết từ, cụm từ, ví dụ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lưu từ yêu thích (Bookmark) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lưu lịch sử tra cứu cá nhân | ❌ | ✅ | ✅ | ✅ | ✅ |
| Đề xuất từ mới / cụm từ mới | ❌ | ❌ | ✅ | ✅ | ✅ |
| Theo dõi tiến trình duyệt từ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Phê duyệt / Từ chối đóng góp | ❌ | ❌ | ❌ | ✅ | ✅ |
| Chỉnh sửa / Xóa từ trong từ điển | ❌ | ❌ | ❌ | ✅ | ✅ |
| Quản lý tài khoản & phân quyền | ❌ | ❌ | ❌ | ❌ | ✅ |
| Xem thống kê toàn hệ thống | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. CƠ CHẾ ĐỒNG BỘ DỮ LIỆU NGƯỜI DÙNG VÀO `kd_users`

Khi người dùng đăng nhập Google lần đầu:
1. Supabase tạo bản ghi trong schema nội bộ `auth.users`.
2. Backend NestJS thông qua middleware/interceptor hoặc Trigger Supabase Database sẽ kiểm tra sự tồn tại của `id` trong bảng `kd_users`.
3. Nếu chưa tồn tại, hệ thống tự động khởi tạo bản ghi mới trong `kd_users` với vai trò mặc định là `USER` (hoặc `CONTRIBUTOR` theo cấu hình chính sách mở rộng cộng đồng).
4. Email chỉ định đầu tiên cấu hình trong biến môi trường `ADMIN_EMAIL` sẽ được tự động trao quyền `ADMIN`.

---

## 4. BẢO VỆ API TRÊN BACKEND NESTJS

Backend NestJS triển khai 2 tầng bảo vệ:

1. **`SupabaseAuthGuard`**:
   - Trích xuất JWT Token từ HTTP Header `Authorization: Bearer <token>`.
   - Xác thực tính hợp lệ của Token dựa trên Supabase JWT Secret Key.
   - Gắn thông tin người dùng (`req.user`) vào ngữ cảnh của Request.

2. **`RolesGuard` kết hợp Decorator `@Roles(...)`**:
   - Khai báo trên các Controller hoặc Route Handler cần kiểm soát quyền.
   - Ví dụ:
     ```typescript
     @Post('words')
     @UseGuards(SupabaseAuthGuard, RolesGuard)
     @Roles('CONTRIBUTOR', 'MODERATOR', 'ADMIN')
     async createWord(@Body() dto: CreateWordDto, @Req() req) { ... }

     @Patch('users/:id/role')
     @UseGuards(SupabaseAuthGuard, RolesGuard)
     @Roles('ADMIN')
     async updateUserRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) { ... }
     ```

---

## 5. TRANG GIAO DIỆN PHÂN QUYỀN DÀNH CHO ADMIN

Hệ thống cung cấp một trang giao diện chuyên biệt (`/admin/users`) cho phép Quản trị viên:
- Tìm kiếm người dùng theo tên hoặc email.
- Xem danh sách người dùng kèm vai trò hiện tại và trạng thái kích hoạt.
- Thay đổi trực quan vai trò (`ADMIN`, `MODERATOR`, `CONTRIBUTOR`, `USER`) thông qua menu chọn thả xuống.
- Khóa / Mở khóa tài khoản ngay lập tức.
