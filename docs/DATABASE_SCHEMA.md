# 🗄️ THIẾT KẾ CƠ SỞ DỮ LIỆU & SCHEMA (SUPABASE POSTGRESQL)

Tài liệu này định nghĩa chi tiết thiết kế lược đồ cơ sở dữ liệu trên PostgreSQL của Supabase. Mọi bảng dữ liệu đều tuân thủ nguyên tắc sử dụng tiền tố **`kd_`** (*K'Ho Dictionary*).

---

## 1. SƠ ĐỒ THỰC THỂ QUAN HỆ (ERD)

```
+-------------------------------------------------------------+
|                           kd_users                          |
|-------------------------------------------------------------|
| id (UUID, PK)                                               |
| email (VARCHAR, UNIQUE)                                     |
| full_name (VARCHAR)                                         |
| avatar_url (VARCHAR)                                        |
| role (VARCHAR: ADMIN, MODERATOR, CONTRIBUTOR, USER)         |
| is_active (BOOLEAN)                                         |
| created_at, updated_at (TIMESTAMP)                          |
+-------------------------------------------------------------+
      | 1                                     | 1
      | n                                     | n
+-----------------------+           +-----------------------+
|     kd_bookmarks      |           |   kd_search_history   |
|-----------------------|           |-----------------------|
| id (UUID, PK)         |           | id (UUID, PK)         |
| user_id (UUID, FK)    |           | user_id (UUID, FK)    |
| word_id (UUID, FK)    |           | keyword (VARCHAR)     |
| created_at            |           | target_lang (VARCHAR) |
+-----------------------+           +-----------------------+

            +------------------------------------+
            |           kd_word_types            |
            |------------------------------------|
            | id (SERIAL, PK)                    |
            | code (VARCHAR, UNIQUE: n, v, adj..)|
            | name_vi (VARCHAR: Danh từ, Động từ)|
            | order_index (INT)                  |
            +------------------------------------+
                              | 1
                              | n
+-------------------------------------------------------------+
|                           kd_words                          |
|-------------------------------------------------------------|
| id (UUID, PK)                                               |
| word_koho (VARCHAR) - Từ ngữ K'Ho                           |
| word_koho_normalized (VARCHAR) - Tìm kiếm không dấu         |
| phonetic (VARCHAR) - Phiên âm ngữ âm                        |
| word_type_id (INT, FK -> kd_word_types)                     |
| meaning_vi (VARCHAR) - Nghĩa tiếng Việt cốt lõi             |
| definition_vi (TEXT) - Giải nghĩa chi tiết/ngữ cảnh        |
| notes (TEXT) - Ghi chú văn hóa/ngữ pháp                     |
| audio_url (VARCHAR) - Đường dẫn file âm thanh phát âm       |
| status (VARCHAR: PENDING, APPROVED, REJECTED)               |
| created_by (UUID, FK -> kd_users)                           |
| reviewed_by (UUID, FK -> kd_users)                          |
| created_at, updated_at (TIMESTAMP)                          |
+-------------------------------------------------------------+
      | 1                                     | 1
      | n                                     | n
+-----------------------------------+   +------------------------------------+
|            kd_phrases             |   |            kd_examples             |
|-----------------------------------|   |------------------------------------|
| id (UUID, PK)                     |   | id (UUID, PK)                      |
| phrase_koho (VARCHAR)             |   | sentence_koho (TEXT)               |
| phrase_koho_normalized (VARCHAR)  |   | sentence_vi (TEXT)                 |
| phonetic (VARCHAR)                |   | word_id (UUID, FK -> kd_words)     |
| meaning_vi (VARCHAR)              |   | phrase_id (UUID, FK -> kd_phrases) |
| explanation_vi (TEXT)             |   | created_at (TIMESTAMP)             |
| word_id (UUID, FK -> kd_words)    |   +------------------------------------+
| status (VARCHAR: PENDING, APPROVED)
| created_by, reviewed_by (UUID)    |
+-----------------------------------+
```

---

## 2. ĐẶC TẢ CHI TIẾT CÁC BẢNG DỮ LIỆU

### 2.1. Bảng Người dùng (`kd_users`)
Lưu trữ thông tin người dùng được đồng bộ từ Supabase Auth (`auth.users`) sau khi đăng nhập Google thành công.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Khóa chính, tương ứng với `auth.users.id` của Supabase |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Địa chỉ email người dùng |
| `full_name` | VARCHAR(255) | NULL | Họ và tên hiển thị |
| `avatar_url` | TEXT | NULL | Đường dẫn ảnh đại diện Google |
| `role` | VARCHAR(50) | NOT NULL, DEFAULT 'USER' | Phân quyền: `ADMIN`, `MODERATOR`, `CONTRIBUTOR`, `USER` |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Trạng thái kích hoạt tài khoản |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời gian tạo tài khoản |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời gian cập nhật gần nhất |

### 2.2. Bảng Danh mục Loại từ (`kd_word_types`)
Định danh các từ loại trong ngữ pháp K'Ho - Việt.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Khóa chính tự tăng |
| `code` | VARCHAR(20) | NOT NULL, UNIQUE | Mã viết tắt (ví dụ: `d` - Danh từ, `đ` - Động từ, `t` - Tính từ, `đt` - Đại từ, `pt` - Phụ từ) |
| `name_vi` | VARCHAR(100) | NOT NULL | Tên loại từ bằng tiếng Việt (Danh từ, Động từ, Tính từ...) |
| `description` | TEXT | NULL | Chú thích hướng dẫn sử dụng từ loại |
| `order_index` | INT | DEFAULT 0 | Thứ tự sắp xếp hiển thị |

### 2.3. Bảng Từ vựng K'Ho (`kd_words`)
Bảng trọng tâm lưu trữ toàn bộ từ ngữ K'Ho và nghĩa tiếng Việt tương ứng.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Định danh duy nhất cho từ |
| `word_koho` | VARCHAR(255) | NOT NULL | Từ vựng tiếng K'Ho chuẩn |
| `word_koho_normalized` | VARCHAR(255) | NOT NULL | Dạng viết thường, bỏ dấu phục vụ tìm kiếm nhanh |
| `phonetic` | VARCHAR(255) | NULL | Phiên âm ngữ âm học (VD: `/kə'hɔː/`) |
| `word_type_id` | INT | REFERENCES kd_word_types(id) | Liên kết loại từ |
| `meaning_vi` | VARCHAR(500) | NOT NULL | Nghĩa tiếng Việt súc tích |
| `definition_vi` | TEXT | NULL | Giải nghĩa ngữ cảnh đầy đủ |
| `notes` | TEXT | NULL | Ghi chú văn hóa bản địa hoặc ngữ pháp đặc biệt |
| `audio_url` | TEXT | NULL | Đường dẫn file phát âm chuẩn bản địa |
| `status` | VARCHAR(20) | DEFAULT 'APPROVED' | Trạng thái: `PENDING`, `APPROVED`, `REJECTED` |
| `created_by` | UUID | REFERENCES kd_users(id) | Người đóng góp từ vựng |
| `reviewed_by` | UUID | REFERENCES kd_users(id) | Người phê duyệt từ vựng |
| `view_count` | INT | DEFAULT 0 | Số lượt tra cứu từ này |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm cập nhật |

### 2.4. Bảng Cụm từ & Thành ngữ (`kd_phrases`)
Lưu trữ cụm từ ghép, thành ngữ, quán ngữ trong tiếng K'Ho.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Khóa chính |
| `phrase_koho` | VARCHAR(255) | NOT NULL | Cụm từ tiếng K'Ho |
| `phrase_koho_normalized`| VARCHAR(255) | NOT NULL | Cụm từ chuẩn hóa tìm kiếm |
| `phonetic` | VARCHAR(255) | NULL | Phiên âm cụm từ |
| `meaning_vi` | VARCHAR(500) | NOT NULL | Nghĩa tiếng Việt của cụm từ |
| `explanation_vi` | TEXT | NULL | Giải thích nghĩa đen và nghĩa bóng |
| `word_id` | UUID | REFERENCES kd_words(id) ON DELETE SET NULL | Liên kết với từ vựng gốc (nếu có) |
| `status` | VARCHAR(20) | DEFAULT 'APPROVED' | Trạng thái kiểm duyệt |
| `created_by` | UUID | REFERENCES kd_users(id) | Người đóng góp |
| `reviewed_by` | UUID | REFERENCES kd_users(id) | Người kiểm duyệt |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm sửa |

### 2.5. Bảng Câu ví dụ ngữ cảnh (`kd_examples`)
Lưu trữ các câu ví dụ song ngữ minh họa cho từ hoặc cụm từ.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Khóa chính |
| `sentence_koho` | TEXT | NOT NULL | Câu ví dụ bằng tiếng K'Ho |
| `sentence_vi` | TEXT | NOT NULL | Dịch nghĩa câu ví dụ sang tiếng Việt |
| `word_id` | UUID | REFERENCES kd_words(id) ON DELETE CASCADE | Liên kết với từ vựng |
| `phrase_id` | UUID | REFERENCES kd_phrases(id) ON DELETE CASCADE | Liên kết với cụm từ (nếu có) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời gian tạo |

### 2.6. Bảng Sổ tay từ yêu thích (`kd_bookmarks`)
Cho phép người dùng lưu lại các từ cần học vào sổ tay cá nhân.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Khóa chính |
| `user_id` | UUID | REFERENCES kd_users(id) ON DELETE CASCADE | Tài khoản người dùng |
| `word_id` | UUID | REFERENCES kd_words(id) ON DELETE CASCADE | Từ ngữ được bookmark |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm lưu |

### 2.7. Bảng Lịch sử tra cứu (`kd_search_history`)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Khóa chính |
| `user_id` | UUID | NULL, REFERENCES kd_users(id) ON DELETE CASCADE | Tài khoản (null nếu khách vãng lai) |
| `keyword` | VARCHAR(255) | NOT NULL | Từ khóa đã tra cứu |
| `target_lang` | VARCHAR(10) | NOT NULL DEFAULT 'koho_vi' | Hướng tra cứu (`koho_vi` hoặc `vi_koho`) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời điểm tra cứu |

---

## 3. MÃ SQL KHỞI TẠO DỮ LIỆU ĐẦU TIÊN (SEEDS)

Hệ thống sẽ cung cấp sẵn file SQL script để người quản trị chạy trực tiếp trên Supabase SQL Editor, bao gồm:
1. Tạo đầy đủ các bảng với tiền tố `kd_`.
2. Tạo các Indexes tối ưu hóa tốc độ tìm kiếm văn bản: `kd_words_word_koho_idx`, `kd_words_meaning_vi_idx`.
3. Chèn sẵn danh mục từ loại ngữ pháp K'Ho - Việt (`kd_word_types`).
4. Chèn sẵn bộ dữ liệu từ vựng mẫu đối soát chất lượng.
