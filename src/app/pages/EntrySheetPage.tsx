import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Plus, Search, Trash2, Copy, Check, Clock, 
  ChevronRight, Save, Layout, Type, Hash, 
  Sparkles, List, ArrowUpRight, BookOpen, AlertCircle
} from 'lucide-react';
import { useStorage } from '../imports/useStorage';

interface ESQuestion {
  id: string;
  title: string;
  content: string;
  limit: number;
  updatedAt: string;
}

interface ESDraft {
  id: string;
  companyId?: string;
  companyName: string;
  questions: ESQuestion[];
  updatedAt: string;
}

const TEMPLATES = [
  { title: '自己PR', limit: 400 },
  { title: '学生時代に力を入れたこと', limit: 400 },
  { title: '志望動機', limit: 400 },
  { title: '長所・短所', limit: 300 },
];

export default function EntrySheetPage() {
  const { data, saveData } = useStorage();
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });
  const [promptModal, setPromptModal] = useState<{ show: boolean; title: string; message: string; value: string; onConfirm: (val: string) => void }>({ show: false, title: '', message: '', value: '', onConfirm: () => { } });
  const isDark = data.settings?.darkMode === true;

  const drafts: ESDraft[] = useMemo(() => data.esDrafts || [], [data.esDrafts]);
  const activeDraft = drafts.find(d => d.id === activeDraftId);
  const activeQuestion = activeDraft?.questions.find(q => q.id === activeQuestionId);

  useEffect(() => {
    if (!activeDraftId && drafts.length > 0) {
      setActiveDraftId(drafts[0].id);
      if (drafts[0].questions.length > 0) setActiveQuestionId(drafts[0].questions[0].id);
    }
  }, [drafts, activeDraftId]);

  const handleAddDraft = () => {
    setPromptModal({
      show: true,
      title: '下書きの作成',
      message: '企業名を入力してください',
      value: '',
      onConfirm: (companyName) => {
        const newDraft: ESDraft = {
          id: Date.now().toString(),
          companyName: companyName || '新規下書き',
          questions: TEMPLATES.map(t => ({
            id: Math.random().toString(36).substr(2, 9),
            title: t.title,
            content: '',
            limit: t.limit,
            updatedAt: new Date().toISOString()
          })),
          updatedAt: new Date().toISOString()
        };
        saveData({ esDrafts: [newDraft, ...drafts] });
        setActiveDraftId(newDraft.id);
        setActiveQuestionId(newDraft.questions[0].id);
      }
    });
  };

  const handleAddQuestion = () => {
    if (!activeDraftId) return;
    const newQ: ESQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      title: '新規設問',
      content: '',
      limit: 400,
      updatedAt: new Date().toISOString()
    };
    const updated = drafts.map(d => d.id === activeDraftId ? { ...d, questions: [...d.questions, newQ], updatedAt: new Date().toISOString() } : d);
    saveData({ esDrafts: updated });
    setActiveQuestionId(newQ.id);
  };

  const updateQuestion = (updates: Partial<ESQuestion>) => {
    if (!activeDraftId || !activeQuestionId) return;
    const updated = drafts.map(d => d.id === activeDraftId ? {
      ...d,
      questions: d.questions.map(q => q.id === activeQuestionId ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q),
      updatedAt: new Date().toISOString()
    } : d);
    saveData({ esDrafts: updated });
  };

  const deleteDraft = (id: string) => {
    setConfirmModal({
      show: true,
      title: '下書きの削除',
      message: 'この下書きを削除しますか？',
      onConfirm: () => {
        saveData({ esDrafts: drafts.filter(d => d.id !== id) });
        if (activeDraftId === id) setActiveDraftId(null);
      }
    });
  };

  return (
    <>
    <div className={`h-full flex overflow-hidden font-sans select-none relative transition-colors duration-500 ${isDark ? 'bg-[#1e1e1e] text-gray-200' : 'bg-white text-slate-900'}`}>
      {/* Sidebar: Draft List */}
      <div className={`w-80 border-r flex flex-col h-full overflow-hidden transition-colors ${isDark ? 'bg-[#151515] border-white/5' : 'bg-slate-50/50 border-slate-200'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Entry Sheets</h2>
            <button onClick={handleAddDraft} className="p-2 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/20 hover:scale-105 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
            {drafts.length === 0 ? (
              <div className="py-20 text-center opacity-20 space-y-4">
                <FileText className="w-12 h-12 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest">下書きがありません</p>
              </div>
            ) : drafts.map(draft => (
              <div key={draft.id} className="group relative">
                <button
                  onClick={() => { setActiveDraftId(draft.id); setActiveQuestionId(draft.questions[0]?.id || null); }}
                  className={`w-full flex flex-col px-5 py-4 rounded-2xl transition-all border-2 ${
                    activeDraftId === draft.id 
                      ? (isDark ? 'bg-white/5 border-teal-500/50 text-white' : 'bg-white border-teal-500/20 text-teal-700 shadow-xl shadow-teal-500/5') 
                      : (isDark ? 'border-transparent text-gray-500 hover:bg-white/[0.02]' : 'border-transparent text-slate-400 hover:bg-slate-100/50')
                  }`}
                >
                  <span className="text-[13px] font-black tracking-tight truncate w-full text-left">{draft.companyName}</span>
                  <span className="text-[10px] font-bold opacity-40 mt-1">{draft.questions.length} Questions</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: Question List */}
      <div className={`w-72 border-r flex flex-col h-full overflow-hidden transition-colors ${isDark ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-6 border-b flex items-center justify-between">
          <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>設問一覧</span>
          <button onClick={handleAddQuestion} className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-500 transition-all"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeDraft?.questions.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQuestionId(q.id)}
              className={`w-full text-left px-6 py-5 border-b transition-all relative ${
                activeQuestionId === q.id 
                  ? (isDark ? 'bg-white/5 border-l-4 border-l-teal-500' : 'bg-teal-50/30 border-l-4 border-l-teal-500') 
                  : (isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-slate-50 hover:bg-slate-50/50')
              }`}
            >
              <h4 className={`text-[13px] font-black truncate ${activeQuestionId === q.id ? (isDark ? 'text-white' : 'text-teal-600') : (isDark ? 'text-gray-400' : 'text-slate-500')}`}>{q.title || '設問名なし'}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold ${q.content.length > q.limit ? 'text-red-500' : 'opacity-40'}`}>{q.content.length} / {q.limit}文字</span>
                {q.content.length > 0 && <Check className="w-3 h-3 text-teal-500" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Editor */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {activeQuestion ? (
          <>
            <div className={`p-8 border-b transition-colors ${isDark ? 'border-white/5 bg-[#1e1e1e]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <input 
                    type="text" 
                    value={activeQuestion.title} 
                    onChange={(e) => updateQuestion({ title: e.target.value })}
                    className={`bg-transparent text-2xl font-black tracking-tight outline-none w-full ${isDark ? 'text-white' : 'text-slate-900'}`}
                    placeholder="設問のタイトルを入力..."
                  />
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Updated {new Date(activeQuestion.updatedAt).toLocaleTimeString()}</span>
                    <span className="flex items-center gap-1.5"><Layout className="w-3 h-3" /> Draft</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className={`px-5 py-3 rounded-2xl flex items-center gap-4 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                      <span className={`text-sm font-black ${activeQuestion.content.length > activeQuestion.limit ? 'text-red-500 animate-pulse' : 'text-teal-600'}`}>{activeQuestion.content.length}</span>
                      <div className="w-[1px] h-4 bg-gray-500/20" />
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Limit</span>
                        <input 
                          type="number" 
                          value={activeQuestion.limit} 
                          onChange={(e) => updateQuestion({ limit: parseInt(e.target.value) })}
                          className={`w-12 bg-transparent text-[13px] font-black outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                        />
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
              <div className="max-w-3xl mx-auto space-y-10">
                <textarea
                  value={activeQuestion.content}
                  onChange={(e) => updateQuestion({ content: e.target.value })}
                  placeholder="ここに文章を入力..."
                  className={`w-full min-h-[500px] bg-transparent text-lg font-bold leading-relaxed outline-none resize-none transition-all ${
                    isDark ? 'text-gray-300 placeholder:text-gray-700' : 'text-slate-700 placeholder:text-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* AI Assistant Placeholder */}
            <div className={`p-6 border-t flex items-center justify-between transition-colors ${isDark ? 'bg-[#151515] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>AIによる添削・要約 (BETA)</p>
                  <p className="text-[10px] font-bold text-gray-500 tracking-tight">AIが文章を分析し、より魅力的な表現を提案します。</p>
                </div>
              </div>
              <button className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-400 cursor-not-allowed'}`}>
                AIアシスタントを起動
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
            <BookOpen className="w-16 h-16" />
            <p className="text-sm font-black uppercase tracking-widest">設問を選択するか新規作成してください</p>
          </div>
        )}
      </div>
    </div>

      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{confirmModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{confirmModal.message}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                  className={`flex-1 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal({ ...confirmModal, show: false });
                  }}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all"
                >
                  確定
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {promptModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPromptModal({ ...promptModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{promptModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">{promptModal.message}</p>
              </div>
              <input
                type="text"
                autoFocus
                value={promptModal.value}
                onChange={(e) => setPromptModal({ ...promptModal, value: e.target.value })}
                className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    promptModal.onConfirm(promptModal.value);
                    setPromptModal({ ...promptModal, show: false });
                  }
                }}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setPromptModal({ ...promptModal, show: false })}
                  className={`flex-1 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    promptModal.onConfirm(promptModal.value);
                    setPromptModal({ ...promptModal, show: false });
                  }}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all"
                >
                  確定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
