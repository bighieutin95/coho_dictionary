-- ========================================================
-- KHỞI TẠO CƠ SỞ DỮ LIỆU TỰ ĐIỂN K'HO - VIỆT (SUPABASE POSTGRESQL)
-- Tiền tố bảng quy chuẩn: kd_ (K'Ho Dictionary)
-- ========================================================

-- Kích hoạt tiện ích mở rộng tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG NGƯỜI DÙNG (kd_users)
CREATE TABLE IF NOT EXISTS kd_users (
    id UUID PRIMARY KEY, -- Trùng với auth.users.id của Supabase Auth
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'MODERATOR', 'CONTRIBUTOR', 'USER')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG DANH MỤC LOẠI TỪ (kd_word_types)
CREATE TABLE IF NOT EXISTS kd_word_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

-- 3. BẢNG TỪ VỰNG TIẾNG K'HO (kd_words)
CREATE TABLE IF NOT EXISTS kd_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_koho VARCHAR(255) NOT NULL,
    word_koho_normalized VARCHAR(255) NOT NULL,
    phonetic VARCHAR(255),
    word_type_id INT REFERENCES kd_word_types(id) ON DELETE SET NULL,
    meaning_vi VARCHAR(500) NOT NULL,
    definition_vi TEXT,
    notes TEXT,
    audio_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_by UUID REFERENCES kd_users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES kd_users(id) ON DELETE SET NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG CỤM TỪ / THÀNH NGỮ TIẾNG K'HO (kd_phrases)
CREATE TABLE IF NOT EXISTS kd_phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phrase_koho VARCHAR(255) NOT NULL,
    phrase_koho_normalized VARCHAR(255) NOT NULL,
    phonetic VARCHAR(255),
    meaning_vi VARCHAR(500) NOT NULL,
    explanation_vi TEXT,
    word_id UUID REFERENCES kd_words(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_by UUID REFERENCES kd_users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES kd_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG CÂU VÍ DỤ NGỮ CẢNH (kd_examples)
CREATE TABLE IF NOT EXISTS kd_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sentence_koho TEXT NOT NULL,
    sentence_vi TEXT NOT NULL,
    word_id UUID REFERENCES kd_words(id) ON DELETE CASCADE,
    phrase_id UUID REFERENCES kd_phrases(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG SỔ TAY TỪ YÊU THÍCH (kd_bookmarks)
CREATE TABLE IF NOT EXISTS kd_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES kd_users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES kd_words(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- 7. BẢNG LỊCH SỬ TRA CỨU (kd_search_history)
CREATE TABLE IF NOT EXISTS kd_search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES kd_users(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    target_lang VARCHAR(20) NOT NULL DEFAULT 'koho_vi',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHỈ MỤC TỐI ƯU HÓA TRA CỨU (INDEXES)
CREATE INDEX IF NOT EXISTS idx_kd_words_word_koho ON kd_words(word_koho);
CREATE INDEX IF NOT EXISTS idx_kd_words_normalized ON kd_words(word_koho_normalized);
CREATE INDEX IF NOT EXISTS idx_kd_words_meaning ON kd_words(meaning_vi);
CREATE INDEX IF NOT EXISTS idx_kd_phrases_normalized ON kd_phrases(phrase_koho_normalized);
CREATE INDEX IF NOT EXISTS idx_kd_bookmarks_user ON kd_bookmarks(user_id);

-- DỮ LIỆU BAN ĐẦU: DANH MỤC LOẠI TỪ (kd_word_types)
INSERT INTO kd_word_types (code, name_vi, description, order_index) VALUES
('d', 'Danh từ', 'Từ chỉ người, sự vật, con vật, địa danh trong đời sống K''Ho', 1),
('đ', 'Động từ', 'Từ chỉ hoạt động, hành vi, trạng thái vận động', 2),
('t', 'Tính từ', 'Từ chỉ đặc điểm, tính chất, màu sắc, hình dáng', 3),
('đt', 'Đại từ', 'Từ dùng để xưng hô, thay thế hoặc chỉ định', 4),
('pt', 'Phụ từ / Trạng từ', 'Từ bổ nghĩa cho động từ, tính từ', 5),
('lt', 'Liên từ', 'Từ dùng để nối các từ, mệnh đề hoặc câu', 6),
('ct', 'Cảm từ / Thán từ', 'Từ biểu lộ cảm xúc, tiếng hô gọi', 7)
ON CONFLICT (code) DO NOTHING;

-- DỮ LIỆU MẪU BAN ĐẦU: MỘT SỐ TỪ VỰNG K'HO PHỔ BIẾN
DO $$
DECLARE
    d_id INT;
    v_id INT;
    adj_id INT;
    pron_id INT;
    word_bor_id UUID := gen_random_uuid();
    word_da_id UUID := gen_random_uuid();
    word_bonam_id UUID := gen_random_uuid();
    word_sa_id UUID := gen_random_uuid();
    word_liam_id UUID := gen_random_uuid();
BEGIN
    SELECT id INTO d_id FROM kd_word_types WHERE code = 'd';
    SELECT id INTO v_id FROM kd_word_types WHERE code = 'đ';
    SELECT id INTO adj_id FROM kd_word_types WHERE code = 't';
    SELECT id INTO pron_id FROM kd_word_types WHERE code = 'đt';

    -- Từ 1: Bơr (Cơm, lương thực)
    INSERT INTO kd_words (id, word_koho, word_koho_normalized, phonetic, word_type_id, meaning_vi, definition_vi, notes, status)
    VALUES (word_bor_id, 'Bơr', 'bor', '/bər/', d_id, 'Cơm; bữa ăn; lương thực', 'Lương thực chính nấu từ gạo lúa rẫy của đồng bào K''Ho', 'Biểu tượng của sự ấm no trong buôn làng', 'APPROVED')
    ON CONFLICT DO NOTHING;

    -- Cụm từ của Bơr
    INSERT INTO kd_phrases (phrase_koho, phrase_koho_normalized, phonetic, meaning_vi, explanation_vi, word_id, status)
    VALUES ('Bơr sa', 'bor sa', '/bər sa/', 'Bữa ăn cơm; việc ăn uống', 'Chỉ chung bữa ăn hàng ngày của gia đình', word_bor_id, 'APPROVED')
    ON CONFLICT DO NOTHING;

    -- Ví dụ của Bơr
    INSERT INTO kd_examples (sentence_koho, sentence_vi, word_id)
    VALUES ('He lơh sa bơr bal!', 'Chúng ta cùng ăn cơm nào!', word_bor_id)
    ON CONFLICT DO NOTHING;

    -- Từ 2: Đa (Nước, dòng sông, suối)
    INSERT INTO kd_words (id, word_koho, word_koho_normalized, phonetic, word_type_id, meaning_vi, definition_vi, notes, status)
    VALUES (word_da_id, 'Đa', 'da', '/ɗaː/', d_id, 'Nước; dòng nước', 'Chất lỏng tự nhiên, nguồn sống của muôn loài và cây lúa', 'Thường xuất hiện trong các địa danh K''Ho (như Đa Nhim, Đa Lạch)', 'APPROVED')
    ON CONFLICT DO NOTHING;

    INSERT INTO kd_phrases (phrase_koho, phrase_koho_normalized, phonetic, meaning_vi, explanation_vi, word_id, status)
    VALUES ('Đa dêr', 'da der', '/ɗaː ɗeːr/', 'Suối nhỏ', 'Dòng nước chảy róc rách từ khe đá trong rừng', word_da_id, 'APPROVED')
    ON CONFLICT DO NOTHING;

    INSERT INTO kd_examples (sentence_koho, sentence_vi, word_id)
    VALUES ('Kòn đơs mờ da kloh.', 'Trẻ em tắm bên dòng nước trong mát.', word_da_id)
    ON CONFLICT DO NOTHING;

    -- Từ 3: Bơnơm (Núi, đồi cao)
    INSERT INTO kd_words (id, word_koho, word_koho_normalized, phonetic, word_type_id, meaning_vi, definition_vi, notes, status)
    VALUES (word_bonam_id, 'Bơnơm', 'bonom', '/bəˈnəm/', d_id, 'Núi; đồi núi', 'Vùng đất dốc cao hiểm trở, nơi rừng già bao phủ', 'Gắn liền với truyền thuyết đỉnh núi Lang Biang', 'APPROVED')
    ON CONFLICT DO NOTHING;

    INSERT INTO kd_examples (sentence_koho, sentence_vi, word_id)
    VALUES ('Bơnơm Lang Biang gơtùi kơ đờng ngăn.', 'Núi Lang Biang sừng sững cao vút.', word_bonam_id)
    ON CONFLICT DO NOTHING;

    -- Từ 4: Sa (Ăn)
    INSERT INTO kd_words (id, word_koho, word_koho_normalized, phonetic, word_type_id, meaning_vi, definition_vi, notes, status)
    VALUES (word_sa_id, 'Sa', 'sa', '/saː/', v_id, 'Ăn; dùng bữa', 'Hành động nạp thức ăn để duy trì sức khỏe', NULL, 'APPROVED')
    ON CONFLICT DO NOTHING;

    -- Từ 5: Liam (Đẹp, tốt, hay)
    INSERT INTO kd_words (id, word_koho, word_koho_normalized, phonetic, word_type_id, meaning_vi, definition_vi, notes, status)
    VALUES (word_liam_id, 'Liam', 'liam', '/liːəm/', adj_id, 'Đẹp; duyên dáng; tốt lành', 'Chỉ nét đẹp của con người, cảnh quan thiên nhiên hay phẩm chất', NULL, 'APPROVED')
    ON CONFLICT DO NOTHING;

    INSERT INTO kd_examples (sentence_koho, sentence_vi, word_id)
    VALUES ('Oh me liam ngăn!', 'Em gái trông thật duyên dáng xinh đẹp!', word_liam_id)
    ON CONFLICT DO NOTHING;
END $$;
