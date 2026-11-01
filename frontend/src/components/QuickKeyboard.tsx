import React from 'react';
import { Keyboard } from 'lucide-react';

interface QuickKeyboardProps {
  onInsertChar: (char: string) => void;
}

const KOHO_CHARS = [
  'ơ', 'ơ̆', 'ư', 'ư̆', 'ê̆', 'ô̆', 'à', 'č', 'ñ', 'ň', 'đ', '’'
];

export const QuickKeyboard: React.FC<QuickKeyboardProps> = ({ onInsertChar }) => {
  return (
    <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-2">
      <div className="flex items-center space-x-1 mb-1.5 text-[11px] font-medium text-teal-800">
        <Keyboard className="w-3.5 h-3.5 text-teal-600" />
        <span>Bàn phím ký tự đặc trưng K'Ho:</span>
      </div>
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {KOHO_CHARS.map((char) => (
          <button
            key={char}
            onClick={() => onInsertChar(char)}
            className="min-w-[32px] h-8 px-2 bg-white hover:bg-teal-600 hover:text-white active:scale-90 text-sm font-semibold text-slate-700 rounded-lg border border-teal-200/80 shadow-xs transition-colors flex items-center justify-center"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};
