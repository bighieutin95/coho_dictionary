import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ContributePage } from './pages/ContributePage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { getLocalBookmarks, toggleLocalBookmark } from './services/api';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('search');
  const [direction, setDirection] = useState<'koho_vi' | 'vi_koho'>('koho_vi');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(getLocalBookmarks());
  }, []);

  const handleToggleDirection = () => {
    setDirection((prev) => (prev === 'koho_vi' ? 'vi_koho' : 'koho_vi'));
  };

  const handleToggleBookmark = (wordId: string) => {
    toggleLocalBookmark(wordId);
    setBookmarks(getLocalBookmarks());
  };

  const handleClearAllBookmarks = () => {
    localStorage.removeItem('koho_bookmarks');
    setBookmarks([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Khung mô phỏng ứng dụng điện thoại chuẩn (Mobile Frame) */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative shadow-xl border-x border-slate-200/60">
        {/* Top Header */}
        <Header
          direction={direction}
          onToggleDirection={handleToggleDirection}
        />

        {/* Nội dung trang */}
        <main className="flex-1 px-4 pt-3.5 pb-20">
          {currentTab === 'search' && (
            <SearchPage
              direction={direction}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksPage
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onClearAllBookmarks={handleClearAllBookmarks}
            />
          )}

          {currentTab === 'contribute' && <ContributePage />}

          {currentTab === 'admin' && <AdminPage />}

          {currentTab === 'profile' && <ProfilePage />}
        </main>

        {/* Thanh điều hướng đáy App */}
        <BottomNavigation
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          bookmarkCount={bookmarks.length}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
