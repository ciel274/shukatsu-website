import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Copy, Check, Save, FileText, Layout, Hash, Lightbulb, ChevronDown, Type, PanelLeftOpen, Maximize2, Archive, Folder, FolderPlus, FilePlus, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Palette, Highlighter, Heading1, Heading2, Quote, Link2, Table, Image as ImageIcon, StickyNote, Info } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useState, useEffect, useRef } from 'react';
import { useStorage } from '../imports/useStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface FolderData {
  id: string;
  name: string;
  notes: Note[];
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
    <div className="flex items-center gap-1 px-1.5 py-1 bg-slate-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
      <Icon className="w-3.5 h-3.5 opacity-40 mr-1" />
      {COLORS.slice(0, 7).map(color => (
        <button 
          key={color}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(color);
          }}
          className="w-3.5 h-3.5 rounded-full border border-black/10 hover:scale-125 transition-transform"
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

export default function NotesPage() {
  const { data, saveData } = useStorage();
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(true);
  
  const isDark = data.settings?.darkMode === true;

  // Collapse states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);
  
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });
  const [promptModal, setPromptModal] = useState<{ show: boolean; title: string; message: string; value: string; onConfirm: (val: string) => void }>({ show: false, title: '', message: '', value: '', onConfirm: () => { } });

  const folders: FolderData[] = data.notes?.folders || [
    { id: 'all', name: 'すべてのメモ', notes: [] }
  ];

  const activeFolder = folders.find(f => f.id === activeFolderId) || folders[0];
  const activeNote = activeFolder?.notes.find(n => n.id === activeNoteId) || activeFolder?.notes[0];

  useEffect(() => {
    if (!activeFolderId && folders.length > 0) setActiveFolderId(folders[0].id);
    if (!activeNoteId && folders[0]?.notes.length > 0) setActiveNoteId(folders[0].notes[0].id);
  }, [folders]);

  const updateNotesData = (newFolders: FolderData[]) => {
    setIsSaved(false);
    saveData({ notes: { folders: newFolders } });
    setTimeout(() => setIsSaved(true), 1000);
  };

  const handleUpdateNote = (field: keyof Note, value: any) => {
    const updatedFolders = folders.map(f => ({
      ...f,
      notes: f.notes.map(n => n.id === activeNoteId ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n)
    }));
    updateNotesData(updatedFolders);
  };

  const handleDeleteNote = (noteId: string) => {
    setConfirmModal({
      show: true,
      title: 'メモの削除',
      message: 'このメモを削除しますか？',
      onConfirm: () => {
        const updatedFolders = folders.map(f => ({
          ...f,
          notes: f.notes.filter(n => n.id !== noteId)
        }));
        updateNotesData(updatedFolders);
        if (activeNoteId === noteId) setActiveNoteId(null);
      }
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    if (folderId === 'all') return;
    setConfirmModal({
      show: true,
      title: 'フォルダの削除',
      message: 'このフォルダを削除しますか？（中のメモも削除されます）',
      onConfirm: () => {
        const updatedFolders = folders.filter(f => f.id !== folderId);
        updateNotesData(updatedFolders);
        if (activeFolderId === folderId) setActiveFolderId('all');
      }
    });
  };

  const handleAddFolder = () => {
    setPromptModal({
      show: true,
      title: '新規フォルダ',
      message: 'フォルダ名を入力してください',
      value: '',
      onConfirm: (name) => {
        if (name) {
          const newFolder = { id: Date.now().toString(), name, notes: [] };
          updateNotesData([...folders, newFolder]);
        }
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

    // After inserting image, add some styling
    if (command === 'insertImage' || (command === 'insertHTML' && value?.includes('<img'))) {
      setTimeout(() => {
        const imgs = editorRef.current?.querySelectorAll('img');
        imgs?.forEach(img => {
          img.style.maxWidth = '100%';
          img.style.borderRadius = '1rem';
          img.style.cursor = 'pointer';
        });
      }, 0);
    }

    if (editorRef.current) {
      handleUpdateNote('content', editorRef.current.innerHTML);
      
      if (!activeNote?.title || activeNote.title.trim() === '') {
        const text = editorRef.current.innerText.trim();
        if (text) {
          const firstLine = text.split('\n')[0].substring(0, 30);
          if (firstLine && firstLine !== activeNote?.title) {
             handleUpdateNote('title', firstLine);
          }
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        execCommand('insertImage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = () => {
    const newNote = { id: Date.now().toString(), title: '', content: '', updatedAt: new Date().toISOString() };
    const updatedFolders = folders.map(f => f.id === activeFolderId ? { ...f, notes: [newNote, ...f.notes] } : f);
    updateNotesData(updatedFolders);
    setActiveNoteId(newNote.id);
  };

  return (
    <div className={`h-full flex overflow-hidden font-sans select-none relative transition-colors duration-500 ${isDark ? 'bg-[#0f1115] text-gray-200' : 'bg-white text-slate-900'}`}>
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      <PanelGroup direction="horizontal" className="h-full w-full">
        {isSidebarOpen && (
          <>
            <Panel defaultSize={20} minSize={10} maxSize={40} className={`border-r flex flex-col h-full overflow-hidden transition-colors ${isDark ? 'bg-[#0a0c10] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-full flex flex-col">
                <div className="p-8 pb-4">
                   <h2 className={`text-[11px] font-black uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Knowledge Base</h2>
                   <div className="space-y-1">
                     {folders.map(folder => (
                       <div key={folder.id} className="group relative">
                        <button
                          onClick={() => { setActiveFolderId(folder.id); setActiveNoteId(folder.notes[0]?.id || null); }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                            activeFolderId === folder.id 
                              ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-teal-600 shadow-sm ring-1 ring-slate-200') 
                              : (isDark ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100')
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {folder.id === 'archive' ? <Archive className="w-4 h-4 text-orange-400 flex-shrink-0" /> : <Folder className={`w-4 h-4 flex-shrink-0 ${activeFolderId === folder.id ? 'text-teal-500' : 'text-gray-400'}`} />}
                            <span className="text-[13px] font-bold tracking-tight truncate">{folder.name}</span>
                          </div>
                          <span className="text-[11px] opacity-30 font-black ml-2 flex-shrink-0">{folder.notes.length}</span>
                        </button>
                        {folder.id !== 'all' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                       </div>
                     ))}
                   </div>
                </div>
                <div className={`mt-auto p-6 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                   <button onClick={handleAddFolder} className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-teal-600 transition-colors font-bold">
                      <FolderPlus className="w-4 h-4" />
                      新規フォルダ
                   </button>
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className={`w-1 transition-colors ${isDark ? 'hover:bg-teal-500/20' : 'hover:bg-teal-100'}`} />
          </>
        )}

        {isListOpen && (
          <>
            <Panel defaultSize={25} minSize={15} maxSize={45} className={`border-r flex flex-col h-full overflow-hidden transition-colors ${isDark ? 'bg-[#0f1115] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="h-full flex flex-col">
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                   <span className={`text-[13px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{activeFolder?.name}</span>
                   <button onClick={handleAddNote} className="p-2 hover:bg-teal-50 rounded-xl text-teal-500 transition-all shadow-sm bg-teal-50/30"><FilePlus className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
                   {activeFolder?.notes.map(note => (
                     <div
                       key={note.id}
                       onClick={() => setActiveNoteId(note.id)}
                       className={`p-4 rounded-[1.5rem] cursor-pointer transition-all border relative group ${
                         activeNoteId === note.id 
                           ? (isDark ? 'bg-white/10 border-white/10 shadow-xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50') 
                           : (isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-slate-50')
                       }`}
                     >
                       <h4 className={`text-[14px] font-bold truncate pr-6 ${activeNoteId === note.id ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-400' : 'text-slate-500')}`}>{note.title || 'タイトルなし'}</h4>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-[11px] font-bold opacity-30 uppercase">{new Date(note.updatedAt).toLocaleDateString()}</span>
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className={`w-1 transition-colors ${isDark ? 'hover:bg-teal-500/20' : 'hover:bg-teal-100'}`} />
          </>
        )}

        <Panel className={`flex-1 min-w-0 flex flex-col relative transition-colors ${isDark ? 'bg-[#0f1115]' : 'bg-white'} overflow-hidden`}>
        <div className={`px-4 py-2 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-10 transition-colors ${isDark ? 'bg-[#0f1115]/80 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isSidebarOpen ? 'text-teal-500 bg-teal-50' : 'text-gray-400 hover:text-teal-500'}`} title="Sidebar"><PanelLeftOpen className="w-4 h-4" /></button>
               <button onClick={() => setIsListOpen(!isListOpen)} className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isListOpen ? 'text-teal-500 bg-teal-50' : 'text-gray-400 hover:text-teal-500'}`} title="List View"><Hash className="w-4 h-4" /></button>
               
               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />
               
               <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1 gap-0.5">
                 <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="太字" />
                 <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="斜体" />
                 <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="下線" />
                 <ToolbarButton icon={Strikethrough} onClick={() => execCommand('strikeThrough')} title="打ち消し線" />
               </div>

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <FontSizePicker onSelect={(s) => execCommand('fontSize', s)} isDark={isDark} />

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1 gap-0.5">
                 <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="左揃え" />
                 <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="中央揃え" />
                 <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="右揃え" />
               </div>

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1 gap-0.5">
                 <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="リスト" />
                 <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="番号リスト" />
               </div>

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <div className="flex items-center gap-2">
                 <ColorBar type="foreColor" onSelect={(c) => execCommand('foreColor', c)} isDark={isDark} />
                 <ColorBar type="hiliteColor" onSelect={(c) => execCommand('hiliteColor', c)} isDark={isDark} />
               </div>

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1 gap-0.5">
                 <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', '<h1>')} title="H1" />
                 <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', '<h2>')} title="H2" />
                 <ToolbarButton icon={Quote} onClick={() => execCommand('formatBlock', '<blockquote>')} title="引用" />
               </div>

               <div className="w-[1px] h-4 mx-2 flex-shrink-0 opacity-10 bg-black dark:bg-white" />

               <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl p-0.5 px-1 gap-0.5">
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
           
            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden sm:inline">{isSaved ? 'Saved' : 'Saving...'}</span>
               <button onClick={() => { setIsSidebarOpen(false); setIsListOpen(false); }} className="p-2 text-gray-400 hover:text-teal-500 transition-colors"><Maximize2 className="w-4 h-4" /></button>
            </div>
        </div>

        {activeNote ? (
          <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-12 max-w-4xl mx-auto w-full scrollbar-hide">
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
                    onChange={(e) => handleUpdateNote('title', e.target.value)}
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
              onBlur={(e) => handleUpdateNote('content', e.currentTarget.innerHTML)}
              onInput={(e) => {
                const content = e.currentTarget.innerHTML;
                handleUpdateNote('content', content);
                
                if (!activeNote.title) {
                  const text = e.currentTarget.innerText.trim();
                  if (text) {
                    const firstLine = text.split('\n')[0].substring(0, 30);
                    if (firstLine) {
                      handleUpdateNote('title', firstLine);
                    }
                  }
                }
              }}
              data-placeholder="ここから入力..."
              className={`w-full min-h-[80vh] outline-none text-[18px] sm:text-[20px] leading-[1.8] font-medium selection:bg-teal-500/10 ${isDark ? 'text-gray-300' : 'text-slate-700'} editor-content pb-40 relative before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:opacity-20 before:pointer-events-none empty:before:block before:hidden`}
              dangerouslySetInnerHTML={{ __html: activeNote.content }}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-200 dark:text-slate-800 space-y-4">
             <StickyNote className="w-20 h-20 opacity-10" />
             <p className="text-xs font-black uppercase tracking-widest opacity-20">メモを選択してください</p>
          </div>
        )}
      </Panel>
    </PanelGroup>

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
    </div>
  );
}
