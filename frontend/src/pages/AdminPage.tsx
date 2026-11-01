import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { KdWord, KdUser, UserRole } from '../types';
import {
  getPendingContributions,
  updateContributionStatus,
  fetchUsersList,
  updateUserRoleApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'moderate' | 'users'>('moderate');

  // Kiểm duyệt
  const [pendingWords, setPendingWords] = useState<KdWord[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);

  // Phân quyền
  const [usersList, setUsersList] = useState<KdUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const loadPending = () => {
    setLoadingWords(true);
    getPendingContributions(token || undefined).then((data) => {
      setPendingWords(data);
      setLoadingWords(false);
    });
  };

  const loadUsers = () => {
    setLoadingUsers(true);
    fetchUsersList(token || undefined).then((data) => {
      setUsersList(data);
      setLoadingUsers(false);
    });
  };

  useEffect(() => {
    loadPending();
    loadUsers();
  }, []);

  const handleApprove = async (wordId: string) => {
    const success = await updateContributionStatus(wordId, 'APPROVED', token || undefined);
    if (success) {
      showToast('Đã phê duyệt từ mới vào từ điển chính thức!');
      loadPending();
    }
  };

  const handleReject = async (wordId: string) => {
    if (window.confirm('Bạn có chắc muốn từ chối từ vựng này?')) {
      const success = await updateContributionStatus(wordId, 'REJECTED', token || undefined);
      if (success) {
        showToast('Đã từ chối từ vựng đóng góp');
        loadPending();
      }
    }
  };

  const handleChangeRole = async (targetUserId: string, newRole: UserRole) => {
    const success = await updateUserRoleApi(targetUserId, newRole, token || undefined);
    if (success) {
      showToast(`Đã thay đổi vai trò người dùng thành "${newRole}"!`);
      loadUsers();
    }
  };

  const showToast = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const ROLE_OPTIONS: { role: UserRole; label: string }[] = [
    { role: 'ADMIN', label: 'Quản trị viên (Admin)' },
    { role: 'MODERATOR', label: 'Biên tập viên (Moderator)' },
    { role: 'CONTRIBUTOR', label: 'Người đóng góp (Contributor)' },
    { role: 'USER', label: 'Học viên (User)' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Tiêu đề trang */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <Shield className="w-5 h-5 text-teal-600" />
          Bàn làm việc Quản trị & Kiểm duyệt
        </h2>
        <p className="text-xs text-slate-500">
          Chỉ dành cho Quản trị viên và Biên tập viên kiểm duyệt
        </p>
      </div>

      {actionMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-semibold animate-in fade-in">
          {actionMsg}
        </div>
      )}

      {/* Tabs chuyển đổi */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('moderate')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'moderate'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Duyệt từ vựng ({pendingWords.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'users'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Phân quyền thành viên ({usersList.length})
        </button>
      </div>

      {/* TAB 1: DUYỆT TỪ VỰNG */}
      {activeTab === 'moderate' && (
        <div className="space-y-3">
          {loadingWords ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách chờ duyệt...</div>
          ) : pendingWords.length > 0 ? (
            pendingWords.map((word) => (
              <div
                key={word.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-slate-900">{word.word_koho}</span>
                    {word.phonetic && (
                      <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                        {word.phonetic}
                      </span>
                    )}
                    {word.word_type && (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {word.word_type.name_vi}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{word.meaning_vi}</p>
                  {word.definition_vi && (
                    <p className="text-xs text-slate-500 mt-0.5">{word.definition_vi}</p>
                  )}
                </div>

                {word.phrases && word.phrases.length > 0 && (
                  <div className="text-xs bg-slate-50 p-2 rounded-lg text-slate-600">
                    <span className="font-bold">Cụm từ kèm theo: </span>
                    {word.phrases[0].phrase_koho} - {word.phrases[0].meaning_vi}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleReject(word.id)}
                    className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Từ chối</span>
                  </button>
                  <button
                    onClick={() => handleApprove(word.id)}
                    className="flex items-center space-x-1 text-xs px-3.5 py-1.5 rounded-xl font-bold text-white bg-teal-700 hover:bg-teal-800 transition active:scale-95 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Phê duyệt</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Hàng đợi trống</p>
              <p className="text-xs text-slate-500">
                Toàn bộ từ vựng đóng góp đều đã được xem xét và xử lý!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PHÂN QUYỀN THÀNH VIÊN */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Quản trị viên có toàn quyền cấp hoặc hạ vai trò của các thành viên tham gia hệ thống từ điển.
            </span>
          </div>

          <div className="space-y-2.5">
            {usersList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {item.full_name || 'Thành viên'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{item.email}</p>
                </div>

                <div className="shrink-0">
                  <select
                    value={item.role}
                    onChange={(e) => handleChangeRole(item.id, e.target.value as UserRole)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none text-slate-700"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.role} value={opt.role}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
