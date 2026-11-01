import React, { useState, useEffect } from 'react';
import { WordCard } from '../components/WordCard';
import { WordDetailModal } from '../components/WordDetailModal';
import { KdWord } from '../types';
import { searchDictionary } from '../services/api';
import { Bookmark, Trash2 } from 'lucide-react';

interface BookmarksPageProps {
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onClearAllBookmarks: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  bookmarks,
  onToggleBookmark,
  onClearAllBookmarks,
}) => {
  const [savedWords, setSavedWords] = useState<KdWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<KdWord | null>(null);

  useEffect(() => {
    searchDictionary({}).then((all) => {
      const filtered = all.filter((w) => bookmarks.includes(w.id));
      setSavedWords(filtered);
    });
  }, [bookmarks]);

  return (
    <div className="space-y-4 pb-20">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            Sổ tay từ yêu thích
          </h2>
          <p className="text-xs text-slate-500">Đã lưu trữ {savedWords.length} từ vựng</p>
        </div>

        {savedWords.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn xóa toàn bộ danh sách từ yêu thích?')) {
                onClearAllBookmarks();
              }
            }}
            className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg active:scale-95 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* Danh sách từ đã lưu */}
      {savedWords.length > 0 ? (
        <div className="space-y-2.5">
          {savedWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onSelectWord={setSelectedWord}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-500">
            <Bookmark className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Chưa có từ vựng nào được lưu</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Khi tra cứu, hãy chạm vào biểu tượng dấu trang để lưu lại các từ cần ghi nhớ vào sổ tay này!
          </p>
        </div>
      )}

      {/* Modal chi tiết */}
      <WordDetailModal
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        isBookmarked={selectedWord ? bookmarks.includes(selectedWord.id) : false}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
};
