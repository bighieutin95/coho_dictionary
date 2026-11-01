import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { QuickKeyboard } from '../components/QuickKeyboard';
import { WordCard } from '../components/WordCard';
import { WordDetailModal } from '../components/WordDetailModal';
import { KdWord, KdWordType } from '../types';
import { searchDictionary, fetchWordTypes } from '../services/api';
import { Sparkles, Info } from 'lucide-react';

interface SearchPageProps {
  direction: 'koho_vi' | 'vi_koho';
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  direction,
  bookmarks,
  onToggleBookmark,
}) => {
  const [query, setQuery] = useState('');
  const [wordTypes, setWordTypes] = useState<KdWordType[]>([]);
  const [selectedType, setSelectedType] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<KdWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<KdWord | null>(null);

  useEffect(() => {
    fetchWordTypes().then(setWordTypes);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      searchDictionary({
        q: query,
        direction,
        type: selectedType,
      })
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [query, direction, selectedType]);

  const handleInsertChar = (char: string) => {
    setQuery((prev) => prev + char);
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Khung tìm kiếm và bộ lọc */}
      <SearchBar
        value={query}
        onChange={setQuery}
        direction={direction}
        wordTypes={wordTypes}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* Bàn phím ký tự đặc trưng K'Ho */}
      {direction === 'koho_vi' && (
        <QuickKeyboard onInsertChar={handleInsertChar} />
      )}

      {/* Thống kê kết quả tìm kiếm */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Tìm thấy <span className="font-bold text-slate-700">{results.length}</span> từ vựng
        </span>
        <span>
          Hướng tra: <strong className="text-teal-700">{direction === 'koho_vi' ? "K'Ho ➔ Việt" : "Việt ➔ K'Ho"}</strong>
        </span>
      </div>

      {/* Danh sách thẻ kết quả */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Đang tra cứu từ điển...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2.5">
          {results.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isBookmarked={bookmarks.includes(word.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectWord={setSelectedWord}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <Info className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Chưa tìm thấy từ ngữ phù hợp</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Bạn có thể thử tìm từ khóa khác hoặc đóng góp từ mới vào hệ thống tại mục "Đóng góp"!
          </p>
        </div>
      )}

      {/* Modal chi tiết từ vựng */}
      <WordDetailModal
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        isBookmarked={selectedWord ? bookmarks.includes(selectedWord.id) : false}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
};
