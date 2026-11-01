import React from 'react';
import { Bookmark, ChevronRight, Volume2, Layers } from 'lucide-react';
import { KdWord } from '../types';

interface WordCardProps {
  word: KdWord;
  isBookmarked: boolean;
  onToggleBookmark: (wordId: string) => void;
  onSelectWord: (word: KdWord) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isBookmarked,
  onToggleBookmark,
  onSelectWord,
}) => {
  return (
    <div
      onClick={() => onSelectWord(word)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] relative group"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Phần từ K'Ho và phiên âm */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {word.word_koho}
            </h3>

            {word.phonetic && (
              <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                {word.phonetic}
              </span>
            )}

            {word.word_type && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                {word.word_type.name_vi}
              </span>
            )}
          </div>

          {/* Nghĩa tiếng Việt */}
          <p className="text-sm font-medium text-slate-700 mt-1.5 leading-snug line-clamp-2">
            {word.meaning_vi}
          </p>

          {/* Cụm từ và ví dụ đính kèm */}
          {word.phrases && word.phrases.length > 0 && (
            <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-slate-500">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Cụm từ: <span className="font-medium text-slate-700">{word.phrases[0].phrase_koho}</span> ({word.phrases[0].meaning_vi})
                {word.phrases.length > 1 && ` +${word.phrases.length - 1}`}
              </span>
            </div>
          )}
        </div>

        {/* Nút lưu Bookmark và icon xem chi tiết */}
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(word.id)}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50'
                : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Bỏ lưu yêu thích' : 'Lưu từ yêu thích'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <div className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
