export type UserRole = 'ADMIN' | 'MODERATOR' | 'CONTRIBUTOR' | 'USER';

export interface KdUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface KdWordType {
  id: number;
  code: string;
  name_vi: string;
  description?: string;
}

export interface KdPhrase {
  id: string;
  phrase_koho: string;
  phonetic?: string;
  meaning_vi: string;
  explanation_vi?: string;
  word_id?: string;
}

export interface KdExample {
  id: string;
  sentence_koho: string;
  sentence_vi: string;
  word_id?: string;
  phrase_id?: string;
}

export interface KdWord {
  id: string;
  word_koho: string;
  word_koho_normalized?: string;
  phonetic?: string;
  word_type_id?: number;
  word_type?: KdWordType;
  meaning_vi: string;
  definition_vi?: string;
  notes?: string;
  audio_url?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  view_count?: number;
  phrases?: KdPhrase[];
  examples?: KdExample[];
  created_at?: string;
}
