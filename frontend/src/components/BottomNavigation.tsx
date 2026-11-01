import React from 'react';
import { Search, Bookmark, PlusCircle, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type TabType = 'search' | 'bookmarks' | 'contribute' | 'admin' | 'profile';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  bookmarkCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  bookmarkCount,
}) => {
  const { user } = useAuth();
  const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'search', label: 'Tra từ', icon: Search },
    { id: 'bookmarks', label: 'Yêu thích', icon: Bookmark, badge: bookmarkCount },
    { id: 'contribute', label: 'Đóng góp', icon: PlusCircle },
    ...(isAdminOrMod ? [{ id: 'admin' as TabType, label: 'Quản trị', icon: Shield }] : []),
    { id: 'profile', label: 'Tài khoản', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 relative ${
                isActive ? 'text-teal-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-teal-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
