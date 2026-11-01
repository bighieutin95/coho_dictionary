import { KdWord, KdWordType, KdUser, UserRole } from '../types';
import { INITIAL_WORDS, SAMPLE_WORD_TYPES } from './sampleData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Bộ nhớ đệm cục bộ (Local Storage) để lưu trữ bổ sung khi ở chế độ offline/client-only
const LOCAL_WORDS_KEY = 'koho_local_words';
const BOOKMARKS_KEY = 'koho_bookmarks';
const LOCAL_USERS_KEY = 'koho_mock_users';

function getStoredWords(): KdWord[] {
  const data = localStorage.getItem(LOCAL_WORDS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_WORDS_KEY, JSON.stringify(INITIAL_WORDS));
    return INITIAL_WORDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_WORDS;
  }
}

function saveStoredWords(words: KdWord[]) {
  localStorage.setItem(LOCAL_WORDS_KEY, JSON.stringify(words));
}

// Lấy danh sách từ loại
export async function fetchWordTypes(): Promise<KdWordType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/word-types`);
    if (res.ok) {
      const json = await res.json();
      return json.data || SAMPLE_WORD_TYPES;
    }
  } catch (err) {
    // Fallback offline
  }
  return SAMPLE_WORD_TYPES;
}

// Tra cứu từ ngữ hai chiều
export async function searchDictionary(params: {
  q?: string;
  direction?: 'koho_vi' | 'vi_koho';
  type?: number;
}): Promise<KdWord[]> {
  const { q = '', direction = 'koho_vi', type } = params;

  try {
    const queryParams = new URLSearchParams();
    if (q) queryParams.set('q', q);
    if (direction) queryParams.set('direction', direction);
    if (type) queryParams.set('type', type.toString());

    const res = await fetch(`${API_BASE_URL}/words/search?${queryParams.toString()}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    // Fallback client search
  }

  // Thuật toán tìm kiếm client-side mượt mà
  const allWords = getStoredWords().filter((w) => w.status === 'APPROVED');
  const cleanQ = q.trim().toLowerCase();

  return allWords.filter((w) => {
    // Lọc theo loại từ nếu có
    if (type && w.word_type?.id !== type) return false;

    if (!cleanQ) return true;

    if (direction === 'koho_vi') {
      const matchKoho = w.word_koho.toLowerCase().includes(cleanQ);
      const matchPhonetic = w.phonetic?.toLowerCase().includes(cleanQ);
      const matchPhrases = w.phrases?.some((p) => p.phrase_koho.toLowerCase().includes(cleanQ));
      return matchKoho || matchPhonetic || matchPhrases;
    } else {
      const matchMeaning = w.meaning_vi.toLowerCase().includes(cleanQ);
      const matchDef = w.definition_vi?.toLowerCase().includes(cleanQ);
      const matchPhrasesVi = w.phrases?.some((p) => p.meaning_vi.toLowerCase().includes(cleanQ));
      return matchMeaning || matchDef || matchPhrasesVi;
    }
  });
}

// Lấy chi tiết từ vựng theo ID
export async function getWordDetail(id: string): Promise<KdWord | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/words/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    // Fallback
  }
  const allWords = getStoredWords();
  return allWords.find((w) => w.id === id) || null;
}

// Đóng góp từ mới
export async function createWordContribution(
  data: Partial<KdWord>,
  token?: string,
): Promise<{ success: boolean; message: string; word?: KdWord }> {
  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: 'Đóng góp thành công!', word: json.data };
      }
    }
  } catch (err) {
    // Fallback
  }

  // Lưu cục bộ
  const allWords = getStoredWords();
  const newWord: KdWord = {
    id: `local-${Date.now()}`,
    word_koho: data.word_koho || '',
    phonetic: data.phonetic || '',
    word_type: data.word_type || SAMPLE_WORD_TYPES[0],
    meaning_vi: data.meaning_vi || '',
    definition_vi: data.definition_vi || '',
    notes: data.notes || '',
    status: 'PENDING',
    phrases: data.phrases || [],
    examples: data.examples || [],
    created_at: new Date().toISOString(),
  };

  allWords.unshift(newWord);
  saveStoredWords(allWords);
  return { success: true, message: 'Đã gửi từ mới vào hàng đợi duyệt bài!', word: newWord };
}

// Lấy danh sách từ chờ duyệt
export async function getPendingContributions(token?: string): Promise<KdWord[]> {
  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/contributions/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }
  return getStoredWords().filter((w) => w.status === 'PENDING');
}

// Cập nhật trạng thái duyệt từ vựng
export async function updateContributionStatus(
  wordId: string,
  status: 'APPROVED' | 'REJECTED',
  token?: string,
): Promise<boolean> {
  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/words/${wordId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    }
  } catch (err) {
    // Fallback
  }

  const allWords = getStoredWords();
  const index = allWords.findIndex((w) => w.id === wordId);
  if (index !== -1) {
    allWords[index].status = status;
    saveStoredWords(allWords);
    return true;
  }
  return false;
}

// Quản lý Bookmark (Sổ tay từ yêu thích)
export function getLocalBookmarks(): string[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleLocalBookmark(wordId: string): boolean {
  const bookmarks = getLocalBookmarks();
  const index = bookmarks.indexOf(wordId);
  let isBookmarked = false;
  if (index !== -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(wordId);
    isBookmarked = true;
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return isBookmarked;
}

// Quản lý Người dùng & Phân quyền (Mock & API)
export function getStoredUsers(): KdUser[] {
  const data = localStorage.getItem(LOCAL_USERS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // ignore
    }
  }

  const defaultUsers: KdUser[] = [
    {
      id: 'usr-admin-1',
      email: 'admin.koho@gmail.com',
      full_name: 'Quản trị viên Hệ thống',
      avatar_url: null,
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-mod-1',
      email: 'bientap.diline@gmail.com',
      full_name: 'Biên tập viên K\'Ho Di Linh',
      avatar_url: null,
      role: 'MODERATOR',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-contributor-1',
      email: 'donggop.lamdong@gmail.com',
      full_name: 'Thành viên Đóng góp Bản địa',
      avatar_url: null,
      role: 'CONTRIBUTOR',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-user-1',
      email: 'hocsinh.tudien@gmail.com',
      full_name: 'Học viên tra cứu',
      avatar_url: null,
      role: 'USER',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export async function fetchUsersList(token?: string): Promise<KdUser[]> {
  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    }
  } catch (err) {
    // Fallback
  }
  return getStoredUsers();
}

export async function updateUserRoleApi(
  userId: string,
  newRole: UserRole,
  token?: string,
): Promise<boolean> {
  try {
    if (token) {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) return true;
    }
  } catch (err) {
    // Fallback
  }

  const users = getStoredUsers();
  const u = users.find((item) => item.id === userId);
  if (u) {
    u.role = newRole;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return true;
  }
  return false;
}
