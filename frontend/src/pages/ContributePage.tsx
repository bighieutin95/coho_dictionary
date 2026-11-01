import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, CheckCircle2, Sparkles, Layers, Quote } from 'lucide-react';
import { KdWordType } from '../types';
import { fetchWordTypes, createWordContribution } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ContributePage: React.FC = () => {
  const { user, token } = useAuth();
  const [wordTypes, setWordTypes] = useState<KdWordType[]>([]);

  // Form states
  const [wordKoho, setWordKoho] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [wordTypeId, setWordTypeId] = useState<number>(1);
  const [meaningVi, setMeaningVi] = useState('');
  const [definitionVi, setDefinitionVi] = useState('');
  const [notes, setNotes] = useState('');

  // Phrase states
  const [phraseKoho, setPhraseKoho] = useState('');
  const [phraseMeaningVi, setPhraseMeaningVi] = useState('');

  // Example states
  const [sentenceKoho, setSentenceKoho] = useState('');
  const [sentenceVi, setSentenceVi] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchWordTypes().then((types) => {
      setWordTypes(types);
      if (types.length > 0) setWordTypeId(types[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordKoho.trim() || !meaningVi.trim()) {
      alert('Vui lòng điền tối thiểu Từ vựng K\'Ho và Nghĩa tiếng Việt!');
      return;
    }

    setLoading(true);

    const phrases = phraseKoho.trim()
      ? [{ id: `p-${Date.now()}`, phrase_koho: phraseKoho.trim(), meaning_vi: phraseMeaningVi.trim() }]
      : [];

    const examples = sentenceKoho.trim()
      ? [{ id: `e-${Date.now()}`, sentence_koho: sentenceKoho.trim(), sentence_vi: sentenceVi.trim() }]
      : [];

    const selectedTypeObj = wordTypes.find((t) => t.id === Number(wordTypeId));

    const result = await createWordContribution(
      {
        word_koho: wordKoho.trim(),
        phonetic: phonetic.trim() || undefined,
        word_type: selectedTypeObj,
        meaning_vi: meaningVi.trim(),
        definition_vi: definitionVi.trim() || undefined,
        notes: notes.trim() || undefined,
        phrases,
        examples,
      },
      token || undefined,
    );

    setLoading(false);
    if (result.success) {
      setSuccessMsg(result.message);
      // Reset form
      setWordKoho('');
      setPhonetic('');
      setMeaningVi('');
      setDefinitionVi('');
      setNotes('');
      setPhraseKoho('');
      setPhraseMeaningVi('');
      setSentenceKoho('');
      setSentenceVi('');

      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tiêu đề trang */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <PlusCircle className="w-5 h-5 text-teal-600" />
          Đóng góp từ mới K'Ho
        </h2>
        <p className="text-xs text-slate-500">
          Chung tay làm giàu kho tàng văn tự K'Ho Di Linh & Lâm Đồng
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Biểu mẫu đóng góp */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Khối từ vựng chính */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            1. Thông tin từ ngữ K'Ho
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Từ ngữ K'Ho <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={wordKoho}
              onChange={(e) => setWordKoho(e.target.value)}
              placeholder="Ví dụ: Bơr, Đa, Bơnơm, Liam..."
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phiên âm (nếu có)
              </label>
              <input
                type="text"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="/bər/, /ɗaː/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Loại từ
              </label>
              <select
                value={wordTypeId}
                onChange={(e) => setWordTypeId(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
              >
                {wordTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name_vi} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nghĩa tiếng Việt <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={meaningVi}
              onChange={(e) => setMeaningVi(e.target.value)}
              placeholder="Nghĩa ngắn gọn (vd: Cơm, Nước, Núi...)"
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Giải nghĩa chi tiết / Ngữ cảnh sử dụng
            </label>
            <textarea
              rows={2}
              value={definitionVi}
              onChange={(e) => setDefinitionVi(e.target.value)}
              placeholder="Giải thích thêm ngữ cảnh..."
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ghi chú văn hóa / phong tục bản địa
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm về đời sống người K'Ho..."
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>
        </div>

        {/* Khối Cụm từ liên quan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            2. Cụm từ hoặc Thành ngữ đi kèm (Tùy chọn)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cụm từ tiếng K'Ho
              </label>
              <input
                type="text"
                value={phraseKoho}
                onChange={(e) => setPhraseKoho(e.target.value)}
                placeholder="Ví dụ: Bơr sa, Đa dêr..."
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nghĩa tiếng Việt của cụm từ
              </label>
              <input
                type="text"
                value={phraseMeaningVi}
                onChange={(e) => setPhraseMeaningVi(e.target.value)}
                placeholder="Nghĩa của cụm từ..."
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Khối Câu ví dụ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-teal-600" />
            3. Câu ví dụ minh họa (Tùy chọn)
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Câu ví dụ bằng tiếng K'Ho
            </label>
            <input
              type="text"
              value={sentenceKoho}
              onChange={(e) => setSentenceKoho(e.target.value)}
              placeholder="Ví dụ: He lơh sa bơr bal!"
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Dịch nghĩa câu ví dụ sang tiếng Việt
            </label>
            <input
              type="text"
              value={sentenceVi}
              onChange={(e) => setSentenceVi(e.target.value)}
              placeholder="Ví dụ: Chúng ta cùng ăn cơm nào!"
              className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>
        </div>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl shadow-md active:scale-98 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Đang gửi đề xuất...' : 'Gửi đóng góp vào từ điển'}</span>
        </button>
      </form>
    </div>
  );
};
