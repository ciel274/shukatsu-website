import { motion, AnimatePresence } from 'motion/react';
import { Building2, Search, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, FileText, Trash2, ArrowUpRight, Plus, X, Info, StickyNote, ClipboardList, Star, Filter, Hash, Copy, Bold, Italic, List as ListIcon, ListOrdered, Type, Link2, Image as ImageIcon, FilePlus, Calendar, Palette, Highlighter, Heading1, Heading2, MoreHorizontal, CheckCircle2, Eye, EyeOff, Table, AlignLeft, AlignCenter, AlignRight, Underline, Strikethrough, Quote } from 'lucide-react';
import { useState, useRef, useMemo, memo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStorage } from '../imports/useStorage';
import MemoPage from './MemoPage';

import { getSafeDomain, getLogoUrl } from '../imports/utils';

const detectCompanyName = async (url: string) => {
  if (!url) return null;
  
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (!data || !data.contents) throw new Error('No content');

    const doc = new DOMParser().parseFromString(data.contents, 'text/html');
    
    // 1. Try og:site_name or og:title (Often contains the clean brand name)
    const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');

    // 2. Domain Fallback Check (Super reliable for known brands)
    const domainIdentifier = getSafeDomain(url);
    if (domainIdentifier) {
      // Logic for company name detection using domain could also be moved to utils if needed
      // For now, keeping the manual map check here as it returns the NAME, not domain
      const BRAND_INFO: any = {
        'jri': '日本総研', 'nssol': '日鉄ソリューションズ', 'nipponsteel': '日本製鉄', 'nttdata': 'NTTデータ',
        'hakuhodo': '博報堂', 'dentsu': '電通', 'cyberagent': 'サイバーエージェント', 'recruit': 'リクルート',
        'mufg': '三菱UFJ銀行', 'smbc': '三井住友銀行', 'mizuho': 'みずほフィナンシャルグループ',
        'nomura': '野村證券', 'hitachi': '日立製作所', 'toshiba': '東芝', 'panasonic': 'パナソニック',
        'sony': 'ソニー', 'rakuten': '楽天グループ', 'softbank': 'ソフトバンク', 'toyota': 'トヨタ自動車',
        'honda': '本田技研工業', 'nissan': '日産自動車', 'mitsubishi': '三菱商事', 'mitsui': '三井物産',
        'itochu': '伊藤忠商事', 'marubeni': '丸紅', 'sumitomo': '住友商事', 'keyence': 'キーエンス',
        'jsol': 'JSOL', 'nri': '野村総合研究所', 'scsk': 'SCSK'
      };
      for (const [key, name] of Object.entries(BRAND_INFO)) {
        if (domainIdentifier.includes(key)) return name as string;
      }
    }

    const pageTitle = ogSiteName || ogTitle || doc.title || '';

    if (pageTitle) {
      const separators = /[|｜－\-_:：/]/;
      const parts = pageTitle.split(separators).map(p => p.trim());
      const filterKeywords = /インターン|新卒|採用|就職|リクナビ|マイナビ|TOP|MyPage|マイページ|ログイン|Login|HOME|ホーム|エントリー|RECRUIT|CAREER|OFFICIAL|公式/i;
      const orgKeywords = /株式会社|有限会社|合同会社|研究所|ソリューションズ|グループ|HD|ホールディングス|銀行|証券|製作所|商事|生命|損保/i;

      const validParts = parts.filter(p => p && !filterKeywords.test(p));
      
      let candidate = pageTitle;
      if (validParts.length > 0) {
        let best = validParts[0];
        validParts.forEach(p => {
          const pHasOrg = orgKeywords.test(p);
          const bestHasOrg = orgKeywords.test(best);
          if (pHasOrg && !bestHasOrg) best = p;
          else if (p.length > best.length && (pHasOrg || !bestHasOrg)) best = p;
        });
        candidate = best;
      }

      // Final Cleanup
      return candidate.replace(/株式会社|有限会社|\(株\)|（株）|公式|採用情報|採用|RECRUIT|CAREER|INTERNSHIP/gi, '').trim();
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Memoized Card for performance
const CompanyCard = memo(({ item, isDark, onClick, onDelete }: any) => {
  const selectionColor = item.jobColor || item.industryColor || (item.category === 'intern' ? '#14b8a6' : '#6366f1');

  return (
    <div
      onClick={onClick}
      className={`group px-6 py-5 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col gap-4 ${isDark
        ? 'bg-[#1a1d23] border-white/10 hover:border-teal-500/50 hover:bg-[#1e222a] shadow-xl'
        : 'bg-white border-slate-200 hover:border-teal-500/30 hover:shadow-lg shadow-sm'
        }`}
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-sm ${isDark ? 'bg-[#252a33] border-white/5' : 'bg-white border-slate-100'
          }`}>
          <img
            src={item.logoUrl || getLogoUrl(item.mypageUrl) || `https://www.google.com/s2/favicons?sz=128&domain=${getSafeDomain(item.mypageUrl)}`}
            alt={item.companyName}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.backgroundColor = selectionColor;
                if (!parent.querySelector('.company-initial')) {
                  const span = document.createElement('span');
                  span.className = 'company-initial font-black text-white text-lg';
                  span.innerText = item.companyName?.[0] || '';
                  parent.appendChild(span);
                }
              }
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-black text-[18px] leading-tight tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {item.companyName}
            </h3>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <a 
            href={item.mypageUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-blue-500 hover:underline truncate block mt-0.5 opacity-80 font-bold"
          >
            {item.mypageUrl}
          </a>
          <div className="flex gap-2 mt-2">
            {item.industry && (
              <span 
                className={`px-2.5 py-1 rounded-md text-[9px] font-black text-white shadow-sm ${!item.industryColor?.startsWith('#') ? (item.industryColor || 'bg-slate-400') : ''}`}
                style={item.industryColor?.startsWith('#') ? { backgroundColor: item.industryColor } : {}}
              >
                {item.industry}
              </span>
            )}
            {item.jobType && (
              <span 
                className={`px-2.5 py-1 rounded-md text-[9px] font-black text-white shadow-sm ${!item.jobColor?.startsWith('#') ? (item.jobColor || 'bg-slate-400') : ''}`}
                style={item.jobColor?.startsWith('#') ? { backgroundColor: item.jobColor } : {}}
              >
                {item.jobType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className={`px-4 py-3 rounded-xl flex items-center justify-between border transition-colors ${isDark ? 'bg-white/5 border-white/5 group-hover:border-teal-500/20' : 'bg-slate-50/50 border-slate-100 group-hover:border-teal-500/10'}`}>
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">MyPage ID</span>
            <span className={`text-[13px] font-black tracking-widest ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{item.mypageId || '未設定'}</span>
          </div>
          <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
            {item.status}
          </div>
        </div>
      </div>
    </div>
  );
});

function ResearchLink({ label, url, isDark }: { label: string; url: string; isDark: boolean }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all group ${
        isDark 
          ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' 
          : 'bg-white border-slate-100 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 text-slate-700'
      }`}
    >
      <span className="text-[11px] font-black tracking-tight">{label}</span>
      <ExternalLink className={`w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
    </a>
  );
}

const COLORS = [
  '#000000', '#4b5563', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
];

function ToolbarButton({ icon: Icon, onClick, title, active = false }: { icon: any, onClick: () => void, title: string, active?: boolean }) {
  return (
    <button 
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title} 
      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
        active 
          ? 'bg-teal-50 text-teal-600' 
          : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function FontSizePicker({ onSelect, isDark }: { onSelect: (size: string) => void, isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const sizes = ['1', '2', '3', '4', '5', '6', '7'];
  const labels = ['極小', '小', '通常', '中', '大', '極大', '最大'];

  return (
    <div className="relative">
      <button 
        onMouseDown={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`p-2 rounded-lg transition-all flex items-center gap-1 ${isOpen ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'}`}
        title="文字サイズ"
      >
        <Type className="w-4 h-4" />
        <ChevronDown className="w-3 h-3 opacity-40" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setIsOpen(false)} />
          <div className={`absolute top-full left-0 mt-2 p-2 rounded-xl shadow-2xl z-50 border flex flex-col min-w-[100px] animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#1a1d23] border-white/5' : 'bg-white border-slate-100'}`}>
            {sizes.map((size, i) => (
              <button
                key={size}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(size);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-left rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                {labels[i]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ColorBar({ onSelect, isDark, type }: { onSelect: (color: string) => void, isDark: boolean, type: 'foreColor' | 'hiliteColor' }) {
  const Icon = type === 'foreColor' ? Palette : Highlighter;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
      <Icon className="w-3.5 h-3.5 opacity-40 mr-1" />
      {COLORS.slice(0, 7).map(color => (
        <button 
          key={color}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(color);
          }}
          className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 transition-transform"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function TablePicker({ onSelect, isDark }: { onSelect: (rows: number, cols: number) => void, isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverPos, setHoverPos] = useState({ r: 0, c: 0 });

  return (
    <div className="relative">
      <button 
        onMouseDown={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'}`}
        title="テーブル挿入"
      >
        <Table className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setIsOpen(false)} />
          <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl z-50 border animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#1a1d23] border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Select Grid</div>
            <div className="grid grid-cols-5 gap-1">
              {[1,2,3,4,5].map(r => [1,2,3,4,5].map(c => (
                <button
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHoverPos({ r, c })}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(r, c);
                    setIsOpen(false);
                  }}
                  className={`w-4 h-4 rounded-sm border transition-colors ${
                    r <= hoverPos.r && c <= hoverPos.c 
                      ? 'bg-teal-500 border-teal-600' 
                      : (isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200')
                  }`}
                />
              )))}
            </div>
            <div className="mt-3 text-[9px] font-black text-center opacity-40">{hoverPos.r} x {hoverPos.c}</div>
          </div>
        </>
      )}
    </div>
  );
}

function LinkPopover({ onSelect, isDark }: { onSelect: (url: string) => void, isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('https://');

  return (
    <div className="relative">
      <button 
        onMouseDown={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'}`}
        title="リンク挿入"
      >
        <Link2 className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setIsOpen(false)} />
          <div className={`absolute top-full left-0 mt-2 p-3 rounded-xl shadow-2xl z-50 border flex items-center gap-2 min-w-[280px] animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#1a1d23] border-white/5' : 'bg-white border-slate-100'}`}>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold outline-none border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              placeholder="URLを入力..."
              autoFocus
            />
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(url);
                setIsOpen(false);
              }}
              className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-[10px] font-black uppercase"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export const CompanyDetailView = ({ id, onBack, setAlertModal, setConfirmModal }: { id: string; onBack: () => void, setAlertModal: any, setConfirmModal: any }) => {
  const { data, saveData } = useStorage();
  const selections = useMemo(() => data.selections || [], [data.selections]);
  const [activeTab, setActiveTab] = useState<'info' | 'es' | 'memo' | 'free'>('info');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const company = useMemo(() => selections.find((s: any) => s.id === id), [selections, id]);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState('');
  const [newJobName, setNewJobName] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = data.settings?.darkMode === true;

  const rawFreeNotes = useMemo(() => company?.freeNotes || [], [company?.freeNotes]);
  const freeNotes = useMemo(() => [...rawFreeNotes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)), [rawFreeNotes]);

  // Handle note selection and auto-creation
  useEffect(() => {
    if (!activeNoteId && freeNotes.length > 0) {
      setActiveNoteId(freeNotes[0].id);
    } else if (freeNotes.length === 0 && company) {
      const newNote = { id: Date.now().toString(), title: '', content: '', updatedAt: new Date().toISOString() };
      const updated = selections.map((s: any) => s.id === id ? { ...s, freeNotes: [newNote] } : s);
      saveData({ selections: updated });
      setActiveNoteId(newNote.id);
    }
  }, [freeNotes, activeNoteId, company, selections, id, saveData]);

  const activeNote = useMemo(() => freeNotes.find((n: any) => n.id === activeNoteId) || freeNotes[0] || { id: 'temp', title: '', content: '' }, [freeNotes, activeNoteId]);

  const themeColor = company?.themeColor || '#0d9488';

  const updateCompanyData = useCallback((targetId: string, field: string, value: any) => {
    const updated = selections.map((s: any) => s.id === targetId ? { ...s, [field]: value } : s);
    saveData({ selections: updated });
  }, [selections, saveData]);

  const updateFreeNote = useCallback((noteId: string, field: string, value: string) => {
    const updatedNotes = rawFreeNotes.map((n: any) => n.id === noteId ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n);
    updateCompanyData(id, 'freeNotes', updatedNotes);
  }, [rawFreeNotes, updateCompanyData, id]);

  const handleAddFreeNote = () => {
    const newNote = { id: Date.now().toString(), title: '', content: '', updatedAt: new Date().toISOString() };
    updateCompanyData(id, 'freeNotes', [newNote, ...rawFreeNotes]);
    setActiveNoteId(newNote.id);
  };

  const togglePinFreeNote = useCallback((noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = rawFreeNotes.map((n: any) => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n);
    updateCompanyData(id, 'freeNotes', updatedNotes);
  }, [rawFreeNotes, updateCompanyData, id]);

  const handleDeleteFreeNote = (noteId: string) => {
    setConfirmModal({
      show: true,
      title: 'メモの削除',
      message: 'このメモを削除しますか？',
      onConfirm: () => {
        const updated = rawFreeNotes.filter((n: any) => n.id !== noteId);
        updateCompanyData(id, 'freeNotes', updated);
        if (activeNoteId === noteId) setActiveNoteId(updated[0]?.id || null);
      }
    });
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    const sel = window.getSelection();
    let savedRange: Range | null = null;
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }

    editorRef.current?.focus();
    
    // Restore range if possible to keep selection
    if (savedRange && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }

    if (command === 'createLink' && value) {
      if (sel && sel.rangeCount > 0 && sel.toString().length === 0) {
        document.execCommand('insertHTML', false, `<a href="${value}" target="_blank" style="color: #0d9488; text-decoration: underline;">${value}</a>`);
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    // Style images after insertion
    if (command === 'insertImage' || (command === 'insertHTML' && value?.includes('<img'))) {
      setTimeout(() => {
        const imgs = editorRef.current?.querySelectorAll('img');
        imgs?.forEach(img => {
          img.style.maxWidth = '100%';
          img.style.borderRadius = '1rem';
          img.style.cursor = 'pointer';
          img.style.display = 'block';
          img.style.margin = '10px 0';
        });
      }, 0);
    }
    if (editorRef.current) {
      updateFreeNote(activeNote.id, 'content', editorRef.current.innerHTML);
      
      // Auto-title logic
      if (!activeNote?.title || activeNote.title.trim() === '') {
        const text = editorRef.current.innerText.trim();
        if (text) {
          const firstLine = text.split('\n')[0].substring(0, 30);
          if (firstLine) {
             updateFreeNote(activeNote.id, 'title', firstLine);
          }
        }
      }
    }
  };

  const updateThemeColor = (color: string) => {
    const updated = selections.map((s: any) => s.id === id ? { ...s, themeColor: color } : s);
    saveData({ selections: updated });
  };

  if (!company) return null;

  return (
    <div className={`h-full flex flex-col transition-all duration-500 ${isDark ? 'bg-[#0f1115] text-gray-200' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <div className={`px-8 py-6 border-b flex items-center justify-between transition-colors ${isDark ? 'bg-[#0f1115] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center gap-6">
          <button onClick={onBack} className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative group flex-shrink-0 w-24 h-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl overflow-hidden flex items-center justify-center p-4">
            <img 
              src={company.logoUrl || getLogoUrl(company.mypageUrl) || `https://www.google.com/s2/favicons?sz=128&domain=${getSafeDomain(company.mypageUrl)}`}
              alt={company.companyName}
              className="w-full h-full object-contain relative z-10"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.backgroundColor = company.jobColor || company.industryColor || (company.category === 'intern' ? '#14b8a6' : '#6366f1');
                  if (!parent.querySelector('.company-initial')) {
                    const span = document.createElement('span');
                    span.className = 'company-initial font-black text-white text-2xl';
                    span.innerText = company.companyName?.[0] || '';
                    parent.appendChild(span);
                  }
                }
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <input
              type="color"
              value={company.jobColor || company.industryColor || (company.category === 'intern' ? '#14b8a6' : '#6366f1')}
              onChange={(e) => {
                const newColor = e.target.value;
                if (company.jobType) {
                  updateCompanyData(id, 'jobColor', newColor);
                  selections.filter((s: any) => s.jobType === company.jobType).forEach((s: any) => updateCompanyData(s.id, 'jobColor', newColor));
                } else if (company.industry) {
                  updateCompanyData(id, 'industryColor', newColor);
                  selections.filter((s: any) => s.industry === company.industry).forEach((s: any) => updateCompanyData(s.id, 'industryColor', newColor));
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <input
              type="text"
              value={company.companyName || ''}
              onChange={(e) => updateCompanyData(id, 'companyName', e.target.value)}
              className={`text-3xl sm:text-4xl font-black tracking-tighter bg-transparent border-none outline-none w-full ${isDark ? 'text-white' : 'text-slate-900'}`}
              placeholder="企業名を入力"
            />
            <div className="flex items-center gap-3">
              {/* Industry Toggle */}
              <button
                onClick={() => setIsIndustryModalOpen(true)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl transition-all border ${company.industry
                  ? (isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-600 border-teal-100')
                  : (isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-slate-50 text-slate-400 border-slate-100 shadow-sm')
                  }`}
              >
                {company.industry || '業種を選択'}
              </button>
               <button
                onClick={() => setIsJobModalOpen(true)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl transition-all border ${company.jobType
                  ? (isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100')
                  : (isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-slate-50 text-slate-400 border-slate-100 shadow-sm')
                  }`}
              >
                {company.jobType || '職種を選択'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
            <button
              onClick={() => updateCompanyData(id, 'category', 'main')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(company.category || 'main') === 'main'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              本選考
            </button>
            <button
              onClick={() => updateCompanyData(id, 'category', 'intern')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${company.category === 'intern'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              インターン
            </button>
          </div>
          {company.mypageUrl && (
            <a href={company.mypageUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#0d9488] text-white rounded-xl text-[11px] font-black hover:bg-teal-500 transition-all shadow-lg shadow-teal-500/20">マイページを表示</a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`px-8 border-b transition-colors ${isDark ? 'bg-[#0f1115] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="flex gap-8">
          {[
            { id: 'info', label: '基本情報', icon: Info },
            { id: 'es', label: 'ES管理', icon: FileText },
            { id: 'memo', label: '自由メモ', icon: StickyNote },
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-3 py-5 border-b-2 transition-all font-black text-[13px] sm:text-[14px] uppercase tracking-[0.15em] ${activeTab === tab.id 
                ? 'text-slate-900 border-slate-900 dark:text-white dark:border-white' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-teal-500' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'es' && <MemoPage companyId={id} />}
        {activeTab === 'memo' && (
          <div className="h-full flex overflow-hidden">
            {/* Folder List */}
            <div className={`w-72 border-r flex flex-col transition-colors ${isDark ? 'bg-[#0f1115] border-white/5' : 'bg-slate-50/30 border-slate-100'}`}>
              <div className="p-6 flex items-center justify-between">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">All Notes</span>
                <button onClick={handleAddFreeNote} className="p-2 text-teal-600 hover:bg-teal-50 rounded-xl transition-all shadow-sm bg-white"><FilePlus className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10 scrollbar-hide">
                {freeNotes.length === 0 ? (
                  <div className="py-20 text-center px-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                      <StickyNote className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">No Notes Yet<br />Start Writing</p>
                  </div>
                ) : (
                  freeNotes.map((note: any) => (
                    <div
                      key={note.id}
                      onClick={() => setActiveNoteId(note.id)}
                      className={`group relative w-full text-left px-5 py-4 rounded-[1.5rem] transition-all duration-300 cursor-pointer ${activeNoteId === note.id || (!activeNoteId && note.id === freeNotes[0]?.id)
                        ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100')
                        : 'text-gray-400 hover:bg-slate-50/50 hover:text-gray-600'
                        }`}
                    >
                      <div className="pr-12">
                        <div className="flex items-center gap-2">
                          {note.isPinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          <p className={`text-[14px] font-black truncate leading-tight ${!note.title ? 'opacity-30 italic' : ''}`}>{note.title || '(無題)'}</p>
                        </div>
                        <p className="text-[10px] opacity-40 mt-2 font-black uppercase tracking-widest">{new Date(note.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => togglePinFreeNote(note.id, e)}
                          className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-amber-400' : 'hover:text-amber-400'}`}
                        >
                          <Star className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFreeNote(note.id); }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Specialized Editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#15171c]">
              <div className={`px-4 py-2 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-10 transition-colors ${isDark ? 'bg-[#15171c]/80 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'}`}>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
                  {/* Style Group */}
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1.5 gap-0.5">
                    <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="太字" />
                    <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="斜体" />
                    <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="下線" />
                    <ToolbarButton icon={Strikethrough} onClick={() => execCommand('strikeThrough')} title="打ち消し線" />
                  </div>

                  <div className="w-[1px] h-4 mx-1 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

                  {/* Alignment Group */}
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1.5 gap-0.5">
                    <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="左揃え" />
                    <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="中央揃え" />
                    <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="右揃え" />
                  </div>

                  <div className="w-[1px] h-4 mx-1 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

                  {/* List Group */}
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1.5 gap-0.5">
                    <ToolbarButton icon={ListIcon} onClick={() => execCommand('insertUnorderedList')} title="リスト" />
                    <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="番号リスト" />
                  </div>

                  <div className="w-[1px] h-4 mx-1 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

                  {/* Colors Group - Specified style */}
                  <div className="flex items-center gap-2">
                    <ColorBar type="foreColor" onSelect={(c) => execCommand('foreColor', c)} isDark={isDark} />
                    <ColorBar type="hiliteColor" onSelect={(c) => execCommand('hiliteColor', c)} isDark={isDark} />
                  </div>

                  <div className="w-[1px] h-4 mx-1 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

                  {/* Heading Group */}
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1.5 gap-0.5">
                    <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', '<h1>')} title="H1" />
                    <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', '<h2>')} title="H2" />
                    <ToolbarButton icon={Quote} onClick={() => execCommand('formatBlock', '<blockquote>')} title="引用" />
                  </div>

                  <div className="w-[1px] h-4 mx-1 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

                  {/* Insert Group */}
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1.5 gap-0.5">
                    <FontSizePicker onSelect={(size) => execCommand('fontSize', size)} isDark={isDark} />
                    <LinkPopover onSelect={(url) => execCommand('createLink', url)} isDark={isDark} />
                    <ToolbarButton icon={ImageIcon} onClick={() => fileInputRef.current?.click()} title="画像" />
                    <TablePicker onSelect={(rows, cols) => {
                      let html = '<table style="width:100%; border-collapse:collapse; margin:15px 0; border:1px solid #e2e8f0; table-layout:fixed;">';
                      for (let i = 0; i < rows; i++) {
                        html += '<tr>';
                        for (let j = 0; j < cols; j++) {
                          html += '<td style="padding:12px; border:1px solid #e2e8f0; min-height:40px; word-break:break-word;"></td>';
                        }
                        html += '</tr>';
                      }
                      html += '</table><p><br></p>';
                      execCommand('insertHTML', html);
                    }} isDark={isDark} />
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-12 scrollbar-hide max-w-4xl mx-auto w-full bg-white dark:bg-[#15171c]">
                <AnimatePresence mode="wait">
                  {(!activeNote.content || activeNote.content === '<br>' || activeNote.title) && (
                    <motion.div
                      initial={{ height: 'auto', opacity: 1, marginBottom: 40 }}
                      animate={{ 
                        height: (activeNote.content && activeNote.content !== '<br>' && !activeNote.title) ? 0 : 'auto',
                        opacity: (activeNote.content && activeNote.content !== '<br>' && !activeNote.title) ? 0 : 1,
                        marginBottom: (activeNote.content && activeNote.content !== '<br>' && !activeNote.title) ? 0 : 40,
                        overflow: 'hidden'
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <input
                        type="text"
                        value={activeNote.title || ''}
                        onChange={(e) => updateFreeNote(activeNote.id, 'title', e.target.value)}
                        placeholder="タイトルを入力..."
                        className={`w-full text-4xl sm:text-5xl font-black bg-transparent border-none outline-none tracking-tighter placeholder:font-black placeholder:opacity-10 ${isDark ? 'text-white' : 'text-slate-900'}`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateFreeNote(activeNote.id, 'content', e.currentTarget.innerHTML)}
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML;
                    updateFreeNote(activeNote.id, 'content', content);
                    
                    // Auto-title if empty
                    if (!activeNote.title) {
                      const text = e.currentTarget.innerText.trim();
                      if (text) {
                        const firstLine = text.split('\n')[0].substring(0, 30);
                        if (firstLine) {
                          updateFreeNote(activeNote.id, 'title', firstLine);
                        }
                      }
                    }
                  }}
                  data-placeholder="ここから入力..."
                  className={`w-full min-h-[70vh] outline-none text-[18px] sm:text-[20px] leading-[1.8] font-medium selection:bg-teal-500/10 ${isDark ? 'text-gray-300' : 'text-slate-700'} editor-content pb-40 relative before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:opacity-20 before:pointer-events-none empty:before:block before:hidden`}
                  dangerouslySetInnerHTML={{ __html: activeNote.content }}
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'info' && (
          <div className="p-10 max-w-4xl mx-auto h-full overflow-y-auto scrollbar-hide pb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Status Section */}
              <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">選考ステータス</label>
                <select
                  value={company.status}
                  onChange={(e) => updateCompanyData(company.id, 'status', e.target.value)}
                  className={`w-full bg-transparent text-xl font-black outline-none cursor-pointer ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  <option value="未応募">未応募</option>
                  <option value="書類選考中">書類選考中</option>
                  <option value="面接進行中">面接進行中</option>
                  <option value="内定/終了">内定/終了</option>
                </select>
              </div>

              {/* Category Section */}
              <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">選考種別</label>
                <select
                  value={company.category || 'main'}
                  onChange={(e) => updateCompanyData(company.id, 'category', e.target.value)}
                  className={`w-full bg-transparent text-xl font-black outline-none cursor-pointer ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  <option value="main">本選考</option>
                  <option value="intern">インターン</option>
                  <option value="both">両方</option>
                </select>
              </div>

              {/* Deadline Section */}
              <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                   締切 / 予定
                </label>
                <div className="flex items-end gap-3">
                  <input
                    type="date"
                    value={company.deadline || ''}
                    onChange={(e) => updateCompanyData(company.id, 'deadline', e.target.value)}
                    className={`bg-transparent text-xl font-black outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                  />
                  <input
                    type="time"
                    value={company.time || ''}
                    onChange={(e) => updateCompanyData(company.id, 'time', e.target.value)}
                    className={`bg-transparent text-sm font-bold opacity-60 outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Job & Industry Section */}
              <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">志望職種</label>
                      <input
                        type="text"
                        value={company.jobType || ''}
                        onChange={(e) => updateCompanyData(company.id, 'jobType', e.target.value)}
                        placeholder="例: システムエンジニア"
                        className={`w-full bg-transparent text-lg font-black outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">業種</label>
                      <button 
                        onClick={() => setIsIndustryModalOpen(true)}
                        className={`w-full text-left bg-transparent text-lg font-black outline-none truncate ${company.industry ? (isDark ? 'text-white' : 'text-slate-900') : 'text-gray-400'}`}
                      >
                        {company.industry || '業種を選択'}
                      </button>
                   </div>
                 </div>
              </div>

              {/* Logo Section */}
              <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">カスタムロゴ URL</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={company.logoUrl || ''}
                    onChange={(e) => updateCompanyData(company.id, 'logoUrl', e.target.value)}
                    placeholder="https://... (ロゴ画像URL)"
                    className={`flex-1 bg-transparent text-sm font-bold outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                  />
                  {company.logoUrl && (
                    <button onClick={() => updateCompanyData(company.id, 'logoUrl', '')} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

              {/* MyPage & Research Links */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* MyPage Credentials Section */}
                <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">マイページ ID</label>
                      <input
                        type="text"
                        value={company.mypageId || ''}
                        onChange={(e) => updateCompanyData(company.id, 'mypageId', e.target.value)}
                        placeholder="UserID / ID"
                        className={`w-full bg-transparent text-lg font-black outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">パスワード</label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={company.mypagePassword || ''}
                          onChange={(e) => updateCompanyData(company.id, 'mypagePassword', e.target.value)}
                          placeholder="Password"
                          className={`w-full bg-transparent text-lg font-black outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 p-2 text-gray-400 hover:text-teal-500 transition-all"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Links Section */}
                <div className={`p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">外部サイトで検索</label>
                  <div className="grid grid-cols-2 gap-3">
                    <ResearchLink 
                      label="就職会議"
                      url={`https://syukatsu-kaigi.jp/search?q=${encodeURIComponent(company.companyName)}`}
                      isDark={isDark}
                    />
                    <ResearchLink 
                      label="ONE CAREER" 
                      url={`https://www.onecareer.jp/search?q=${encodeURIComponent(company.companyName)}`}
                      isDark={isDark}
                    />
                    <ResearchLink 
                      label="OpenWork" 
                      url={`https://www.vorkers.com/search_full.php?q=${encodeURIComponent(company.companyName)}`}
                      isDark={isDark}
                    />
                    <ResearchLink 
                      label="Google検索" 
                      url={`https://www.google.com/search?q=${encodeURIComponent(company.companyName)}`}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>

              {/* URL Section */}
              <div className={`md:col-span-2 p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">マイページ URL</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={company.mypageUrl || ''}
                    onChange={(e) => updateCompanyData(company.id, 'mypageUrl', e.target.value)}
                    placeholder="https://..."
                    className={`flex-1 bg-transparent text-sm font-bold outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                  />
                  {company.mypageUrl && (
                    <a href={company.mypageUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-teal-500/10 text-teal-500 rounded-xl hover:bg-teal-500 hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* General Memo Section */}
              <div className={`md:col-span-2 p-8 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-slate-50/50 border-slate-100 shadow-sm'}`}>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">選考メモ・注意事項</label>
                <textarea
                  value={company.memo || ''}
                  onChange={(e) => updateCompanyData(company.id, 'memo', e.target.value)}
                  placeholder="提出物やID/PASS、面接の感触などをメモ..."
                  className={`w-full bg-transparent text-sm font-medium leading-relaxed outline-none min-h-[120px] resize-none ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
                />
              </div>

              {/* Actions Section */}
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => {
                    const title = encodeURIComponent(`[就活] ${company.companyName} ${company.deadlineTitle || '締切'}`);
                    const details = encodeURIComponent(`URL: ${company.url || 'なし'}\nメモ: ${company.memo || ''}`);
                    const date = company.deadline ? company.deadline.replace(/-/g, '') : '';
                    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${date}/${date}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 py-5 bg-[#4285F4] text-white rounded-3xl text-[13px] font-black uppercase tracking-widest hover:bg-[#3367d6] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  Googleカレンダーに追加
                </button>
                <button
                  onClick={() => {
                    setConfirmModal({
                      show: true,
                      title: '企業データの削除',
                      message: `「${company.companyName}」のデータを削除しますか？\nこの操作は取り消せません。`,
                      onConfirm: () => {
                        saveData({ selections: selections.filter((s: any) => s.id !== id) });
                        onBack();
                      }
                    });
                  }}
                  className="px-10 py-5 rounded-3xl border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[11px] font-black uppercase tracking-widest"
                >
                  Delete Company Data
                </button>
              </div>
            </div>
        )}

        {/* Industry Manager Modal */}
        <AnimatePresence>
          {isIndustryModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsIndustryModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 space-y-8 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>業種管理</h2>
                  <button onClick={() => setIsIndustryModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="新しい業種を追加"
                      value={newIndustryName}
                      onChange={(e) => setNewIndustryName(e.target.value)}
                      className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}
                    />
                    <button
                      onClick={() => {
                        if (newIndustryName) {
                          updateCompanyData(id, 'industry', newIndustryName);
                          setNewIndustryName('');
                          setIsIndustryModalOpen(false);
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-teal-500 hover:bg-teal-50 rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                    {Array.from(new Set(selections.map((s: any) => s.industry).filter(Boolean) || [])).map((ind: any) => {
                      const industryColor = selections.find((s: any) => s.industry === ind)?.industryColor || '#6366f1';
                      return (
                        <div key={ind} className={`flex items-center justify-between p-4 rounded-2xl border group transition-all ${isDark ? 'bg-white/5 border-white/5 hover:border-teal-500/30' : 'bg-slate-50 border-slate-100 hover:border-teal-500/30'}`}>
                          <button
                            onClick={() => {
                              updateCompanyData(id, 'industry', ind);
                              updateCompanyData(id, 'industryColor', industryColor);
                              setIsIndustryModalOpen(false);
                            }}
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: industryColor }} />
                            <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ind}</span>
                          </button>
                          <div className="flex items-center gap-2 relative">
                            <Palette className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <input
                              type="color"
                              value={industryColor}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                selections.forEach((s: any) => {
                                  if (s.industry === ind) updateCompanyData(s.id, 'industryColor', newColor);
                                });
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setIsIndustryModalOpen(false)}
                  className="w-full py-4 bg-gray-100 text-gray-500 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  完了
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Job Type Manager Modal */}
        <AnimatePresence>
          {isJobModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJobModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 space-y-8 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>職種管理</h2>
                  <button onClick={() => setIsJobModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="新しい職種を追加"
                      value={newJobName}
                      onChange={(e) => setNewJobName(e.target.value)}
                      className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}
                    />
                    <button
                      onClick={() => {
                        if (newJobName) {
                          updateCompanyData(id, 'jobType', newJobName);
                          setNewJobName('');
                          setIsJobModalOpen(false);
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                    {Array.from(new Set(selections.map((s: any) => s.jobType).filter(Boolean) || [])).map((jt: any) => {
                      const jobColor = selections.find((s: any) => s.jobType === jt)?.jobColor || '#6366f1';
                      return (
                        <div key={jt} className={`flex items-center justify-between p-4 rounded-2xl border group transition-all ${isDark ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-100 hover:border-indigo-500/30'}`}>
                          <button
                            onClick={() => {
                              updateCompanyData(id, 'jobType', jt);
                              updateCompanyData(id, 'jobColor', jobColor);
                              setIsJobModalOpen(false);
                            }}
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: jobColor }} />
                            <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{jt}</span>
                          </button>
                          <div className="flex items-center gap-2 relative">
                            <Palette className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <input
                              type="color"
                              value={jobColor}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                selections.forEach((s: any) => {
                                  if (s.jobType === jt) updateCompanyData(s.id, 'jobColor', newColor);
                                });
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setIsJobModalOpen(false)}
                  className="w-full py-4 bg-gray-100 text-gray-500 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  完了
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CompanyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, saveData } = useStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<any>({
    name: '',
    job: '',
    deadline: '',
    time: '',
    deadlineTitle: '',
    url: '',
    memo: '',
    mypageId: '',
    mypagePassword: '',
    category: 'main' as 'main' | 'intern' | 'both',
    industry: '',
    industryColor: '',
    status: '未応募'
  });
  const isDark = data.settings?.darkMode === true;
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });

  const handleAutoFixAll = async () => {
    if (!data.selections || data.selections.length === 0) return;
    
    setConfirmModal({
      show: true,
      title: '情報を自動修正',
      message: '全ての企業名とロゴを自動的に再取得して修正しますか？\n(手動で変更した内容も上書きされる可能性があります)',
      onConfirm: async () => {
        setIsAutoFixing(true);
        const updatedSelections = [...data.selections];

        for (let i = 0; i < updatedSelections.length; i++) {
          const company = updatedSelections[i];
          const url = company.mypageUrl || company.url;
          if (!url) continue;

          try {
            const detectedName = await detectCompanyName(url);
            if (detectedName) {
              updatedSelections[i] = {
                ...updatedSelections[i],
                companyName: detectedName,
                logoUrl: getLogoUrl(url)
              };
            }
          } catch (e) {
            console.error(`Failed to fix ${company.companyName}:`, e);
          }
        }

        saveData({ selections: updatedSelections });
        setIsAutoFixing(false);
        setAlertModal({ show: true, title: '完了', message: '自動修正が完了しました。' });
      }
    });
  };

  const [filterCategory, setFilterCategory] = useState<'all' | 'main' | 'intern'>('all');

  const selections = useMemo(() => data.selections || [], [data.selections]);

  const processed = useMemo(() => {
    return selections
      .filter((s: any) => s.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((s: any) => filterCategory === 'all' || s.category === filterCategory);
  }, [selections, searchTerm, filterCategory]);

  if (selectedId) return <CompanyDetailView id={selectedId} onBack={() => setSelectedId(null)} setAlertModal={setAlertModal} setConfirmModal={setConfirmModal} />;

  return (
    <div className={`p-10 h-full flex flex-col transition-all duration-700 relative overflow-y-auto overflow-x-hidden ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      {/* Background Accents */}
      <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-teal-500/5' : 'bg-teal-100/40'}`} />
      <div className={`absolute -left-40 -bottom-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-100/40'}`} />

      <div className="flex items-end justify-between px-2 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]`} />
            <span className="text-[11px] font-black text-teal-600/80 tracking-[0.5em] uppercase">Enterprise CRM</span>
          </div>
          <h1 className={`text-5xl font-black tracking-tighter mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            マイページ<span className="text-teal-600">一覧</span>
          </h1>
        </div>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[1.5rem] gap-2">
            {['all', 'main', 'intern'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat as any)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  filterCategory === cat 
                  ? 'bg-white dark:bg-white/10 text-teal-600 shadow-xl shadow-teal-500/10' 
                  : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                {cat === 'all' ? 'すべて' : cat === 'main' ? '本選考' : 'インターン'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAutoFixAll}
            disabled={isAutoFixing}
            className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${
              isAutoFixing 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {isAutoFixing ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                修正中...
              </>
            ) : (
              <>
                <Highlighter className="w-4 h-4" />
                情報を自動修正
              </>
            )}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group flex items-center gap-3 px-10 py-5 bg-[#0d9488] text-white rounded-[2rem] text-[14px] font-black hover:bg-teal-500 transition-all shadow-2xl shadow-teal-500/30 active:scale-95"
          >
            <div className="p-1.5 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform duration-500">
              <Plus className="w-5 h-5" />
            </div>
            企業を登録
          </button>
        </div>
      </div>

      <div className="mt-12 relative px-2 z-10 group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-10 transition duration-1000`} />
        <div className="relative">
          <Search className={`absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${isDark ? 'text-gray-600 group-focus-within:text-teal-400' : 'text-slate-300 group-focus-within:text-teal-500'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="会社名で検索、管理情報を瞬時に特定..."
            className={`w-full pl-18 pr-8 py-6 rounded-[2rem] text-[18px] font-bold outline-none transition-all ${isDark
              ? 'bg-[#14171c]/80 text-white border border-white/5 focus:bg-[#1a1d23] focus:border-teal-500/50'
              : 'bg-white text-slate-900 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] focus:shadow-xl focus:shadow-teal-500/5 focus:border-teal-500/50'
              }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-12 pb-20 relative z-10">
        {processed.map((item: any) => (
          <CompanyCard 
            key={item.id} 
            item={item} 
            isDark={isDark} 
            onClick={() => setSelectedId(item.id)} 
            onDelete={() => {
              setConfirmModal({
                show: true,
                title: '企業データの削除',
                message: `「${item.companyName}」のデータを削除しますか？`,
                onConfirm: () => {
                  saveData({ selections: selections.filter((s: any) => s.id !== item.id) });
                }
              });
            }}
          />
        ))}
        {processed.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-30">
            <div className={`w-24 h-24 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center mb-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Building2 className="w-10 h-10" />
            </div>
            <p className="text-xl font-black tracking-widest uppercase">No Companies Found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-4xl rounded-[2rem] sm:rounded-[3rem] border shadow-3xl flex flex-col transition-all overflow-hidden ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}
              style={{ maxHeight: 'calc(100vh - 20px)' }}
            >
              {/* Header */}
              <div className="px-6 py-4 sm:px-10 sm:py-6 flex items-center justify-between flex-shrink-0 border-b border-gray-50 dark:border-white/5">
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>企業登録</h2>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Register New Company</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={async () => {
                      const profile = data.profile || {};
                      if (Object.keys(profile).length > 0) {
                        setNewCompany((prev: any) => ({
                          ...prev,
                          memo: `${prev.memo}\n\n【プロフィール情報】\n氏名: ${profile.lastName || ''}${profile.firstName || ''}\n学校: ${profile.schoolName || ''}\n学部: ${profile.department || ''}`.trim()
                        }));
                        setAlertModal({ show: true, title: '成功', message: 'プロフィール情報をメモに追加しました' });
                      } else {
                        setAlertModal({ show: true, title: 'エラー', message: 'プロフィール情報が設定されていません' });
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'}`}
                  >
                    Profile引用
                  </button>
                  <button onClick={() => setIsAddModalOpen(false)} className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-slate-50 text-slate-400'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-10 sm:py-6 space-y-6 sm:space-y-8 scrollbar-hide">
                {/* Section: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-3 bg-teal-500 rounded-full" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>基本情報</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">企業名</label>
                      <input type="text" placeholder="会社名" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} className={`w-full px-4 py-3 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">募集職種</label>
                        <div className="flex gap-1.5">
                          {['bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500'].map(color => (
                            <button 
                              key={color} 
                              onClick={() => setNewCompany({ ...newCompany, jobColor: color })}
                              className={`w-3 h-3 rounded-full transition-all ${color} ${newCompany.jobColor === color ? 'ring-2 ring-offset-2 ring-teal-500 scale-125' : 'opacity-40 hover:opacity-100'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <input type="text" placeholder="職種" value={newCompany.job} onChange={(e) => setNewCompany({ ...newCompany, job: e.target.value })} className={`w-full px-4 py-3 rounded-2xl font-bold text-sm outline-none border-l-4 ${newCompany.jobColor ? `border-l-${newCompany.jobColor.split('-')[1]}-500` : 'border-l-transparent'} ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">業界</label>
                        <div className="flex gap-1.5">
                          {['bg-violet-500', 'bg-emerald-500', 'bg-sky-500', 'bg-pink-500'].map(color => (
                            <button 
                              key={color} 
                              onClick={() => setNewCompany({ ...newCompany, industryColor: color })}
                              className={`w-3 h-3 rounded-full transition-all ${color} ${newCompany.industryColor === color ? 'ring-2 ring-offset-2 ring-teal-500 scale-125' : 'opacity-40 hover:opacity-100'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <input type="text" placeholder="業界" value={newCompany.industry} onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })} className={`w-full px-4 py-3 rounded-2xl font-bold text-sm outline-none border-l-4 ${newCompany.industryColor ? `border-l-${newCompany.industryColor.split('-')[1]}-500` : 'border-l-transparent'} ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                  </div>
                </div>

                {/* Section: Deadlines */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-3 bg-teal-500 rounded-full" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>締切・選考</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">選考締切</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={newCompany.deadline} onChange={(e) => setNewCompany({ ...newCompany, deadline: e.target.value })} className={`w-full px-2 py-2.5 rounded-xl font-bold text-[10px] outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                        <input type="time" step="300" value={newCompany.time} onChange={(e) => setNewCompany({ ...newCompany, time: e.target.value })} className={`w-full px-2 py-2.5 rounded-xl font-bold text-[10px] outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">締切内容</label>
                      <input type="text" placeholder="例: ES提出" value={newCompany.deadlineTitle} onChange={(e) => setNewCompany({ ...newCompany, deadlineTitle: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">選考種別</label>
                      <div className={`flex p-0.5 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        {['main', 'intern', 'both'].map((cat) => (
                          <button key={cat} onClick={() => setNewCompany({ ...newCompany, category: cat as any })} className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${newCompany.category === cat ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-500'}`}>
                            {cat === 'main' ? '本選考' : cat === 'intern' ? 'インターン' : '両方'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: MyPage */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-3 bg-teal-500 rounded-full" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>ログイン情報</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">マイページ URL</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={newCompany.mypageUrl}
                          onChange={async (e) => {
                            const mypageUrl = e.target.value;
                            setNewCompany({ ...newCompany, mypageUrl });
                            if (mypageUrl.length > 10 && mypageUrl.includes('.') && (!newCompany.name || newCompany.name === '')) {
                              const detected = await detectCompanyName(mypageUrl);
                              if (detected) setNewCompany((prev: any) => ({ ...prev, name: detected }));
                            }
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm outline-none pr-8 ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">ID</label>
                      <input type="text" placeholder="ID" value={newCompany.mypageId} onChange={(e) => setNewCompany({ ...newCompany, mypageId: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">パスワード</label>
                      <input type="password" placeholder="Pass" value={newCompany.mypagePassword} onChange={(e) => setNewCompany({ ...newCompany, mypagePassword: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                  </div>
                </div>

                {/* Row 4: Notes */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">メモ</label>
                  <textarea placeholder="自由にメモを入力..." value={newCompany.memo} onChange={(e) => setNewCompany({ ...newCompany, memo: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm outline-none min-h-[60px] resize-none ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 sm:px-10 sm:py-6 border-t border-gray-50 dark:border-white/5 flex-shrink-0">
                <button
                  onClick={() => {
                    if (!newCompany.name) return;
                    const id = Date.now().toString();
                    const newEntry = {
                      ...newCompany,
                      id,
                      companyName: newCompany.name,
                      jobType: newCompany.job,
                      jobColor: newCompany.jobColor,
                      industryColor: newCompany.industryColor,
                      updatedAt: new Date().toISOString()
                    };
                    saveData({ selections: [newEntry, ...selections] });
                    setIsAddModalOpen(false);
                    setNewCompany({
                      name: '', job: '', jobColor: '', deadline: '', time: '', deadlineTitle: '', mypageUrl: '', memo: '', mypageId: '', mypagePassword: '', category: 'main', industry: '', industryColor: '', status: '未応募', logoUrl: ''
                    });
                  }}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] transition-all ${
                    newCompany.name ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  登録を完了する
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Modals */}
      <AnimatePresence>
        {alertModal.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAlertModal({ ...alertModal, show: false })} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-sm rounded-[3rem] p-10 text-center space-y-6 border shadow-2xl transition-all ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
              <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto text-teal-500">
                <Info className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{alertModal.title}</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">{alertModal.message}</p>
              </div>
              <button
                onClick={() => setAlertModal({ ...alertModal, show: false })}
                className="w-full py-4 bg-teal-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}

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
      </AnimatePresence>
    </div>
  );
}
