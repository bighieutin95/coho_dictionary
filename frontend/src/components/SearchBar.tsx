import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { KdWordType } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  direction: 'koho_vi' | 'vi_koho';
  wordTypes: KdWordType[];
  selectedType: number | undefined;
  onSelectType: (typeId: number | undefined) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  direction,
  wordTypes,
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Ô nhập từ khóa */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            direction === 'koho_vi'
              ? "Nhập từ tiếng K'Ho cần tra (vd: Bơr, Đa, Liam)..."
              : "Nhập nghĩa tiếng Việt cần tìm (vd: Cơm, Nước, Đẹp)..."
          }
          className="w-full pl-11 pr-10 py-3 bg-white text-slate-800 placeholder-slate-400 text-sm rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 active:scale-90"
            title="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Thanh lọc loại từ dạng thẻ lướt ngang */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectType(undefined)}
          className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all ${
            selectedType === undefined
              ? 'bg-teal-700 text-white font-medium shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả từ loại
        </button>

        {wordTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectType(selectedType === t.id ? undefined : t.id)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              selectedType === t.id
                ? 'bg-teal-700 text-white font-medium shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.name_vi} ({t.code})
          </button>
        ))}
      </div>
    </div>
  );
};
