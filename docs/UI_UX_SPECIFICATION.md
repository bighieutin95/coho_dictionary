# 📱 ĐẶC TẢ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX)

Tài liệu này xác định nguyên tắc thiết kế, bảng màu, thành phần giao diện và trải nghiệm tương tác cho ứng dụng web **Tự điển K'Ho - Việt**, đảm bảo tiêu chí: **Đơn giản, gọn nhẹ, rõ ràng, 100% tiếng Việt và chuẩn phong cách ứng dụng điện thoại (Mobile App-like)**.

---

## 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI

1. **Thiết kế ưu tiên di động (Mobile-First)**: Mọi màn hình được tối ưu hoàn hảo cho kích thước hiển thị smartphone (360px - 430px), có thể ghim ra màn hình chính (Add to Home Screen) trải nghiệm như ứng dụng gốc.
2. **Tối giản & Trực quan**: Hạn chế tối đa các chi tiết rườm rà. Tập trung tối đa vào tốc độ tra cứu và khả năng đọc rõ ràng của phông chữ.
3. **Thao tác một tay thuận tiện (Thumb-zone Friendly)**: Đặt các nút điều hướng chính ở đáy màn hình (Bottom Navigation Bar) để ngón tay cái dễ dàng chạm tới.
4. **Phản hồi tức thì (Instant Feedback)**: Tìm kiếm thời gian thực (Real-time Instant Search), hiển thị kết quả ngay khi người dùng gõ từ khóa.

---

## 2. BẢNG MÀU & ĐỒNG BỘ THIẾT KẾ (DESIGN SYSTEM)

- **Màu chủ đạo (Primary - Xanh đại ngàn Tây Nguyên)**: `#0F766E` (Teal 700) kết hợp `#0D9488` (Teal 600) – Đại diện cho sắc xanh bạt ngàn của núi rừng Lang Biang, vùng đất của người K'Ho.
- **Màu điểm nhấn (Accent - Vàng cam thổ cẩm)**: `#F59E0B` (Amber 500) – Lấy cảm hứng từ hoa văn rực rỡ trên trang phục thổ cẩm truyền thống K'Ho.
- **Nền ứng dụng (Background)**: `#F8FAFC` (Slate 50) mang lại cảm giác dịu mắt, sạch sẽ.
- **Màu văn bản (Text)**:
  - Tiêu đề chính / Từ ngữ K'Ho: `#0F172A` (Slate 900) – Đậm nét, sắc sảo.
  - Nghĩa tiếng Việt: `#334155` (Slate 700) – Rõ ràng, dễ đọc.
  - Phiên âm ngữ âm: `#0D9488` (Teal 600) hoặc `#64748B` (Slate 500) – In nghiêng mềm mại.
- **Phông chữ**: Hỗ trợ font hệ thống hiện đại, tối ưu tiếng Việt (`system-ui`, `Inter`, `Be Vietnam Pro`).

---

## 3. CÁC MÀN HÌNH CHÍNH (APP SCREENS)

### 3.1. Màn hình Tra cứu chính (Home / Search Screen)
- **Top Header**:
  - Logo và tên ứng dụng: **"Tự điển K'Ho"**.
  - Nút chuyển đổi nhanh hướng tra cứu: `K'Ho ➔ Việt` hoặc `Việt ➔ K'Ho` với hiệu ứng chuyển động mượt mà.
- **Thanh tìm kiếm nổi bật (Hero Search Bar)**:
  - Ô nhập liệu lớn, bo tròn mềm mại (`rounded-2xl`), có biểu tượng kính lúp và nút xóa nhanh (x).
  - Tự động lấy tiêu điểm (auto-focus) khi mở ứng dụng.
- **Bàn phím ký tự ảo K'Ho (Virtual Quick Keyboard)**:
  - Thanh trượt ngang chứa các phím tắt cho các ký tự đặc biệt trong văn tự K'Ho (ví dụ: `Ơ`, `Ư`, `Č`, `Ñ`, `Ň`, `Ơ̆`, `U̯`...) giúp người dùng điện thoại gõ nhanh mà không cần cài thêm bộ gõ phức tạp.
- **Danh sách kết quả tra cứu**:
  - Dạng thẻ (Card) bo góc, đổ bóng nhẹ.
  - Mỗi thẻ hiển thị:
    - **Từ vựng K'Ho** (Chữ to, đậm).
    - **Phiên âm ngữ âm** (Ví dụ: `/bər/`).
    - **Huy hiệu loại từ** (Tag nhỏ: `Danh từ`, `Động từ`...).
    - **Nghĩa tiếng Việt** (Dễ hiểu, trọng tâm).
    - **Số lượng cụm từ / câu ví dụ đính kèm**.
    - Nút bấm xem chi tiết toàn diện.

### 3.2. Màn hình Chi tiết từ vựng (Word Detail Screen)
- Nút quay lại tiện lợi.
- Khối thông tin từ ngữ chính: Từ K'Ho, phiên âm, nút phát âm âm thanh (nếu có audio), loại từ.
- Phần diễn giải ngữ nghĩa chi tiết và ghi chú ngữ cảnh văn hóa bản địa.
- **Mục "Cụm từ & Thành ngữ liên quan"**: Danh sách các cụm từ K'Ho chứa từ này cùng nghĩa tiếng Việt.
- **Mục "Câu ví dụ thực tế"**: Các câu song ngữ minh họa cách sử dụng từ ngữ trong đời sống hàng ngày của người K'Ho.
- Nút bấm lưu nhanh vào Sổ tay từ yêu thích (Bookmark).

### 3.3. Màn hình Sổ tay yêu thích (Bookmarks Screen)
- Quản lý toàn bộ danh sách các từ người học đã đánh dấu.
- Hỗ trợ học tập, ôn tập từ vựng mọi lúc mọi nơi.
- Hỗ trợ xóa từng từ hoặc xóa toàn bộ.

### 3.4. Màn hình Đóng góp từ mới (Contribution Screen)
- Biểu mẫu trực quan, thân thiện trên điện thoại để cộng đồng gửi từ mới:
  - Nhập từ K'Ho, phiên âm, chọn loại từ.
  - Nhập nghĩa tiếng Việt, câu ví dụ và cụm từ đi kèm.
- Tab theo dõi các từ đã đóng góp và trạng thái duyệt (Đang chờ duyệt, Đã chấp thuận, Cần chỉnh sửa).

### 3.5. Màn hình Quản trị & Phân quyền (Admin Dashboard)
- Dành riêng cho tài khoản có vai trò `ADMIN` hoặc `MODERATOR`.
- Tab **Duyệt bài**: Xem xét các từ vựng do người dùng gửi lên, nhấn duyệt hoặc từ chối kèm lý do.
- Tab **Phân quyền người dùng**: Danh sách thành viên đăng nhập bằng Google, cho phép đổi quyền hạn (`Admin`, `Biên tập viên`, `Đóng góp`, `Người dùng`) chỉ bằng 1 cú nhấp.

### 3.6. Thanh điều hướng đáy điện thoại (Bottom Navigation Bar)
Cố định ở chân màn hình điện thoại với 5 biểu tượng thân thuộc:
1. 🔍 **Tra từ** (Màn hình chính)
2. ⭐ **Yêu thích** (Sổ tay cá nhân)
3. ✍️ **Đóng góp** (Thêm từ mới)
4. 🛡️ **Quản trị** (Chỉ hiện khi là Admin/Moderator)
5. 👤 **Cá nhân** (Thông tin tài khoản Google / Đăng nhập)
