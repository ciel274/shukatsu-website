import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Copy, Check, Save, FileText, Layout, Hash, Lightbulb, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStorage } from '../imports/useStorage';

interface MemoItem {
  id: string;
  q: string;
  a: string;
  isPinned?: boolean;
}

export default function MemoPage({ companyId }: { companyId: string }) {
  const { data, saveData } = useStorage();
  const selections = data.selections || [];
  const company = selections.find((s: any) => s.id === companyId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });

  const rawMemos: MemoItem[] = company?.memos || [{ id: '1', q: '', a: '' }];
  const memos = [...rawMemos].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  useEffect(() => {
    if (memos.length > 0 && !activeId) {
      setActiveId(memos[0].id);
    }
  }, [memos, activeId]);

  const updateMemos = (updated: MemoItem[]) => {
    setSaveStatus('saving');
    const newSelections = selections.map((s: any) => 
      s.id === companyId ? { ...s, memos: updated } : s
    );
    saveData({ selections: newSelections });
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  const activeMemo = memos.find(m => m.id === activeId) || memos[0];

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = rawMemos.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m);
    updateMemos(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopying(id);
    setTimeout(() => setIsCopying(null), 2000);
  };

  const templates = [
    { label: '自己PR', text: '【自己PR】\n私の強みは、〇〇です。この強みを活かして、大学時代には〇〇に取り組みました。' },
    { label: 'ガクチカ', text: '【学生時代に力を入れたこと】\n私が最も力を入れたのは〇〇です。直面した困難に対し、〇〇という工夫を行うことで、〇〇という成果を上げました。' },
    { label: '志望動機', text: '【志望動機】\n貴社を志望する理由は、〇〇というビジョンに共感したからです。入社後は〇〇として貢献したいと考えています。' },
  ];

  return (
    <div className="h-full flex bg-gray-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar: List of Questions */}
      <div className="w-80 border-r border-gray-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#0d9488]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question List</span>
          </div>
          <button 
            onClick={() => {
              const newMemo = { id: Date.now().toString(), q: '新しい質問', a: '' };
              updateMemos([...rawMemos, newMemo]);
              setActiveId(newMemo.id);
            }}
            className="p-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-[#0d9488] rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 scrollbar-hide">
          {memos.map((memo) => (
            <div 
              key={memo.id}
              onClick={() => setActiveId(memo.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${
                activeId === memo.id 
                  ? 'bg-white dark:bg-slate-800 border-teal-500/20 shadow-lg shadow-teal-500/5' 
                  : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {memo.isPinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    <p className={`text-sm font-bold truncate ${activeId === memo.id ? 'text-[#0d9488]' : ''}`}>
                      {memo.q || '無題の質問'}
                    </p>
                  </div>
                  <p className="text-[10px] mt-1 font-medium text-gray-400 truncate">
                    {memo.a.length} 文字
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => togglePin(memo.id, e)}
                    className={`p-1 transition-colors ${memo.isPinned ? 'text-amber-400' : 'hover:text-amber-400'}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${memo.isPinned ? 'fill-amber-400' : ''}`} />
                  </button>
                  {rawMemos.length > 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          show: true,
                          title: '項目の削除',
                          message: 'この回答を削除しますか？',
                          onConfirm: () => {
                            updateMemos(rawMemos.filter(m => m.id !== memo.id));
                          }
                        });
                      }}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor: Writing Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all">
        {/* Editor Toolbar */}
        <div className="px-8 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' ? (
                <div className="flex items-center gap-2 text-orange-400">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#0d9488]">
                  <Check className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase">Saved to Cloud</span>
                </div>
              )}
            </div>
            
            <div className="h-4 w-[1px] bg-gray-100 dark:bg-slate-800" />
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                {activeMemo.a.length} characters
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={() => handleCopy(activeMemo.a, activeMemo.id)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                 isCopying === activeMemo.id ? 'bg-[#0d9488] text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
               }`}
             >
               {isCopying === activeMemo.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
               {isCopying === activeMemo.id ? 'Copied!' : '全文コピー'}
             </button>
          </div>
        </div>

        {/* Writing Content */}
        <div className="flex-1 flex flex-col p-10 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
          <input 
            type="text"
            value={activeMemo.q}
            onChange={(e) => {
              const updated = memos.map(m => m.id === activeId ? { ...m, q: e.target.value } : m);
              updateMemos(updated);
            }}
            placeholder="質問内容を入力 (例: 自己PRを400文字で)"
            className="text-2xl font-black text-[#0f172a] dark:text-white bg-transparent border-none outline-none placeholder:text-gray-200 dark:placeholder:text-slate-800"
          />
          
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
             <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mr-2">
               <Lightbulb className="w-3 h-3" /> Templates:
             </span>
             {templates.map(tmp => (
               <button 
                 key={tmp.label}
                 onClick={() => {
                   if(activeMemo.a) {
                     setConfirmModal({
                       show: true,
                       title: 'テンプレートの適用',
                       message: '現在の内容を上書きしますか？',
                       onConfirm: () => {
                         const updated = memos.map(m => m.id === activeId ? { ...m, a: tmp.text } : m);
                         updateMemos(updated);
                       }
                     });
                   } else {
                     const updated = memos.map(m => m.id === activeId ? { ...m, a: tmp.text } : m);
                     updateMemos(updated);
                   }
                 }}
                 className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-[11px] font-bold text-gray-500 hover:text-[#0d9488] rounded-lg transition-all"
               >
                 {tmp.label}
               </button>
             ))}
          </div>

          <textarea 
            value={activeMemo.a}
            onChange={(e) => {
              const updated = memos.map(m => m.id === activeId ? { ...m, a: e.target.value } : m);
              updateMemos(updated);
            }}
            placeholder="ここに回答を入力してください..."
            className="flex-1 w-full p-0 bg-transparent border-none outline-none text-lg leading-relaxed text-[#334155] dark:text-gray-300 resize-none font-medium selection:bg-[#0d9488]/10"
          />
        </div>
      </div>

      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${data.settings?.darkMode ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${data.settings?.darkMode ? 'text-white' : 'text-slate-900'}`}>{confirmModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{confirmModal.message}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                  className={`flex-1 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${data.settings?.darkMode ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}
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
      </AnimatePresence>
    </div>
  );
}
