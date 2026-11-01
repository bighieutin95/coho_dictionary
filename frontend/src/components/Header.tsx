import React from 'react';
import { ArrowLeftRight, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  direction: 'koho_vi' | 'vi_koho';
  onToggleDirection: () => void;
}

export const Header: React.FC<HeaderProps> = ({ direction, onToggleDirection }) => {
  const { user } = useAuth();

  const getRoleBadge = () => {
    if (!user) return null;
    const roleLabels: Record<string, { text: string; color: string }> = {
      ADMIN: { text: 'Quản trị viên', color: 'bg-red-500 text-white' },
      MODERATOR: { text: 'Biên tập viên', color: 'bg-purple-600 text-white' },
      CONTRIBUTOR: { text: 'Đóng góp', color: 'bg-amber-600 text-white' },
      USER: { text: 'Học viên', color: 'bg-teal-600 text-white' },
    };
    const current = roleLabels[user.role] || roleLabels.USER;
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${current.color}`}>
        {current.text}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-teal-800 text-white shadow-md">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo và Tiêu đề */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-inner">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight flex items-center gap-1.5">
              Tự điển K'Ho
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-teal-200">Bảo tồn di sản ngôn ngữ</span>
              {getRoleBadge()}
            </div>
          </div>
        </div>

        {/* Nút đổi chiều tra cứu K'Ho <-> Việt */}
        <button
          onClick={onToggleDirection}
          className="flex items-center space-x-1.5 bg-teal-700/80 hover:bg-teal-700 active:scale-95 transition-all text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-500/50 shadow-sm"
          title="Nhấn để đổi hướng dịch"
        >
          <span className="text-amber-300">
            {direction === 'koho_vi' ? "K'Ho" : 'Việt'}
          </span>
          <ArrowLeftRight className="w-3.5 h-3.5 text-teal-200" />
          <span>
            {direction === 'koho_vi' ? 'Việt' : "K'Ho"}
          </span>
        </button>
      </div>
    </header>
  );
};
