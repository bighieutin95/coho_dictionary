import React from 'react';
import { X, Bookmark, Volume2, Quote, BookOpen, Layers } from 'lucide-react';
import { KdWord } from '../types';

interface WordDetailModalProps {
  word: KdWord | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (wordId: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-md max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Thanh tiêu đề Modal */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-1 bg-slate-300 rounded-full sm:hidden mx-auto" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Chi tiết từ vựng
            </h2>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleBookmark(word.id)}
              className={`p-2 rounded-full transition ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nội dung chi tiết cuộn được */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* Header từ vựng chính */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-baseline space-x-3 flex-wrap gap-y-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {word.word_koho}
              </span>
              {word.phonetic && (
                <span className="text-sm font-mono text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/50">
                  {word.phonetic}
                </span>
              )}
              {word.word_type && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                  {word.word_type.name_vi}
                </span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-slate-800">
                {word.meaning_vi}
              </h3>
              {word.definition_vi && (
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {word.definition_vi}
                </p>
              )}
            </div>

            {word.notes && (
              <div className="mt-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Ghi chú văn hóa: </span>
                {word.notes}
              </div>
            )}
          </div>

          {/* Mục Cụm từ & Thành ngữ liên quan */}
          {word.phrases && word.phrases.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Cụm từ & Thành ngữ liên quan ({word.phrases.length})</span>
              </div>
              <div className="space-y-2">
                {word.phrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="p-3 bg-teal-50/50 rounded-xl border border-teal-100/80"
                  >
                    <div className="flex items-baseline space-x-2">
                      <span className="font-bold text-sm text-slate-900">
                        {phrase.phrase_koho}
                      </span>
                      {phrase.phonetic && (
                        <span className="text-xs font-mono text-teal-600">
                          {phrase.phonetic}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      {phrase.meaning_vi}
                    </p>
                    {phrase.explanation_vi && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        {phrase.explanation_vi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mục Câu ví dụ ngữ cảnh */}
          {word.examples && word.examples.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Quote className="w-4 h-4 text-teal-600" />
                <span>Câu ví dụ minh họa ({word.examples.length})</span>
              </div>
              <div className="space-y-2">
                {word.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      "{ex.sentence_koho}"
                    </p>
                    <p className="text-xs text-slate-600">
                      ➔ {ex.sentence_vi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
