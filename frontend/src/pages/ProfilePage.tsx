import React from 'react';
import { User, LogIn, LogOut, ShieldCheck, Github, Heart, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, signInWithGoogle, signOut, switchDemoRole } = useAuth();

  const ROLE_NAMES: Record<UserRole, string> = {
    ADMIN: 'Quản trị viên Hệ thống',
    MODERATOR: 'Biên tập viên Kiểm duyệt',
    CONTRIBUTOR: 'Thành viên Đóng góp',
    USER: 'Học viên tra cứu',
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tiêu đề trang */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <User className="w-5 h-5 text-teal-600" />
          Hồ sơ & Tài khoản
        </h2>
        <p className="text-xs text-slate-500">Quản lý xác thực Google OAuth & Phân quyền</p>
      </div>

      {/* Thẻ thông tin người dùng */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-xl font-black ring-4 ring-teal-50">
          {user?.full_name?.charAt(0) || 'K'}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">{user?.full_name || 'Khách vãng lai'}</h3>
          <p className="text-xs text-slate-500">{user?.email || 'Chưa đăng nhập'}</p>
        </div>

        {user && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-50 border border-teal-200/60 rounded-full text-xs font-semibold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Vai trò: {ROLE_NAMES[user.role]}</span>
          </div>
        )}

        <div className="pt-2">
          {user ? (
            <button
              onClick={signOut}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất tài khoản</span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center space-x-2 text-xs font-bold px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl shadow-sm transition active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập với Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Bộ chọn giả lập Vai trò thử nghiệm (Rất tiện lợi cho việc đánh giá & kiểm thử) */}
      <div className="bg-slate-100/80 p-4 rounded-2xl space-y-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Thử nghiệm nhanh các vai trò phân quyền:</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Chọn vai trò bên dưới để kiểm tra ngay lập tức các giao diện và quyền hạn tương ứng:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {(['ADMIN', 'MODERATOR', 'CONTRIBUTOR', 'USER'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              className={`text-xs py-2 px-2.5 rounded-xl font-semibold transition active:scale-95 text-left border ${
                user?.role === r
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] opacity-75">{r}</div>
              <div className="truncate">{ROLE_NAMES[r]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Thông tin dự án */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Về dự án Tự điển K'Ho
        </h4>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Ứng dụng được xây dựng với mục tiêu giữ gìn và phát huy tiếng nói, chữ viết của người đồng bào dân tộc K'Ho vùng Di Linh, Lâm Đồng.
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Phiên bản 1.0.0 (Vercel Ready)</span>
          <a
            href="https://github.com/bighieutin95/coho_dictionary.git"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-teal-700 font-semibold hover:underline"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
