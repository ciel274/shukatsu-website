import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, LayoutDashboard, List, Calendar, Settings, ChevronRight, LogOut, Sparkles, Building2, StickyNote, ArrowUpRight, PanelLeftClose, PanelLeftOpen, User, Search, FileText, X, Clock } from 'lucide-react';
import { useStorage } from '../imports/useStorage';
import { useEffect, useMemo, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const menuItems = [
  { icon: Building2, label: 'マイページ一覧', path: '/list' },
  { icon: List, label: '選考管理', path: '/kanban' },
  { icon: Calendar, label: '締切カレンダー', path: '/calendar' },
  { icon: StickyNote, label: 'ナレッジ・ベース', path: '/notes' },
  { icon: FileText, label: 'エントリーシート', path: '/es' },
  { icon: LayoutDashboard, label: 'ダッシュボード', path: '/overview' },
  { icon: Settings, label: '設定・プロフィール', path: '/settings' },
];

const CommandPalette = memo(({ isOpen, onClose, isDark, data }: any) => {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const matches: any[] = [];

    // Search Companies
    (data.selections || []).forEach((s: any) => {
      if (s.companyName?.toLowerCase().includes(q) || s.industry?.toLowerCase().includes(q)) {
        matches.push({ type: 'company', id: s.id, title: s.companyName, sub: s.status, path: `/list?id=${s.id}` });
      }
    });

    // Search ES
    (data.esDrafts || []).forEach((es: any) => {
      if (es.title?.toLowerCase().includes(q) || es.companyName?.toLowerCase().includes(q)) {
        matches.push({ type: 'es', id: es.id, title: es.title, sub: es.companyName, path: `/es` });
      }
    });

    // Search Notes
    (data.notes || []).forEach((n: any) => {
      if (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)) {
        matches.push({ type: 'note', id: n.id, title: n.title, sub: 'ナレッジ・ベース', path: `/notes` });
      }
    });

    return matches.slice(0, 8);
  }, [query, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className={`relative w-full max-w-2xl rounded-[2.5rem] border shadow-3xl overflow-hidden flex flex-col ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}
      >
        <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-50 dark:border-white/5">
          <Search className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="企業、ES、メモを横断検索..." 
            className={`flex-1 bg-transparent border-none outline-none text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
          />
          <div className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${isDark ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>ESC</div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
          {results.length > 0 ? (
            <div className="p-4 space-y-1">
              {results.map((res: any) => (
                <Link 
                  key={`${res.type}-${res.id}`} 
                  to={res.path} 
                  onClick={onClose}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      res.type === 'company' ? 'bg-teal-500/10 text-teal-500' : 
                      res.type === 'es' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {res.type === 'company' ? <Building2 className="w-5 h-5" /> : 
                       res.type === 'es' ? <FileText className="w-5 h-5" /> : <StickyNote className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{res.title}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{res.sub}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="py-20 text-center opacity-40">
              <div className="text-[11px] font-black uppercase tracking-[0.3em]">No Results Found</div>
            </div>
          ) : (
             <div className="p-8 space-y-6">
                <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-gray-400" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-4 opacity-40">
                   <div className={`p-4 rounded-2xl border border-dashed ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      <div className="h-3 w-2/3 bg-gray-400 rounded-full mb-2" />
                      <div className="h-2 w-1/2 bg-gray-300 rounded-full" />
                   </div>
                   <div className={`p-4 rounded-2xl border border-dashed ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      <div className="h-3 w-2/3 bg-gray-400 rounded-full mb-2" />
                      <div className="h-2 w-1/2 bg-gray-300 rounded-full" />
                   </div>
                </div>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});

const NavItem = memo(({ item, isActive, isDark }: any) => (
  <Link 
    to={item.path}
    className={`flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-300 group ${
      isActive 
        ? (isDark ? 'bg-white/5 text-white' : 'bg-teal-50 text-[#0d9488]')
        : (isDark ? 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900')
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`transition-colors duration-300 ${isActive ? 'text-teal-500' : 'group-hover:text-teal-500/50'}`}>
        <item.icon className="w-4 h-4" />
      </div>
      <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
    </div>
    {isActive && (
      <motion.div layoutId="active-pill" className="w-1 h-4 bg-teal-500 rounded-full" />
    )}
  </Link>
));

export default function SidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useStorage();
  const isDark = useMemo(() => data.settings?.darkMode === true, [data.settings?.darkMode]);
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Global Navigation Shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'a': e.preventDefault(); navigate('/list?add=true'); break;
          case 'l': e.preventDefault(); navigate('/list'); break;
          case 'k': e.preventDefault(); navigate('/kanban'); break;
          case 'e': e.preventDefault(); navigate('/es'); break;
          case 's': e.preventDefault(); navigate('/settings'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDark]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <AnimatePresence>
        {isSearchOpen && <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} isDark={isDark} data={data} />}
      </AnimatePresence>

      <PanelGroup direction="horizontal" className="h-full w-full">
        {/* Sidebar Panel */}
        {!collapsed && (
          <>
            <Panel defaultSize={18} minSize={10} maxSize={30} className={`flex flex-col relative z-50 ${isDark ? 'bg-[#0f1115] border-r border-white/5' : 'bg-white border-r border-slate-100 shadow-2xl shadow-slate-200/50'}`}>
              <div className="px-8 py-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:rotate-12 transition-transform duration-500`}>
                      <div className="w-6 h-6 border-4 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h1 className={`text-xl font-black tracking-tighter truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Shukatsu<span className="text-teal-600">Dash</span></h1>
                      <span className={`text-[8px] font-black uppercase tracking-[0.4em] opacity-40 truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro Edition</span>
                    </div>
                  </div>
                  <button onClick={() => setCollapsed(true)} className={`p-2 rounded-xl transition-all flex-shrink-0 ${isDark ? 'hover:bg-white/5 text-gray-600' : 'hover:bg-slate-50 text-slate-300'}`}>
                    <PanelLeftClose className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className={`w-full mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${isDark ? 'bg-white/5 border-white/5 text-gray-500 hover:text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900'}`}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[12px] font-black tracking-tight">検索 (⌘K)</span>
                </button>
              </div>

              <div className="px-6 space-y-10 flex-1 overflow-y-auto scrollbar-hide">
                <div>
                  <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-6">Main Menu</span>
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 relative group overflow-hidden ${
                          location.pathname === item.path
                            ? (isDark ? 'text-white' : 'text-teal-700')
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {location.pathname === item.path && (
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 z-0 ${
                              isDark ? 'bg-white/5' : 'bg-teal-50 shadow-sm'
                            }`}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        {location.pathname === item.path && (
                          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-teal-500 rounded-full z-10" />
                        )}
                        <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 flex-shrink-0 ${location.pathname === item.path ? 'text-teal-500' : 'text-gray-400'}`} />
                        <span className="text-[13px] font-black relative z-10 tracking-tight truncate">{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>

            </Panel>
            <PanelResizeHandle className={`w-1 transition-colors ${isDark ? 'hover:bg-teal-500/20' : 'hover:bg-teal-100'}`} />
          </>
        )}

        {/* Main Content Panel */}
        <Panel className="flex-1 relative overflow-hidden flex flex-col">
          {/* Floating Toggle Button */}
          {collapsed && (
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setCollapsed(false)}
              className={`absolute left-6 top-6 z-[100] w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isDark ? 'bg-[#14171c] text-teal-400 border border-white/5' : 'bg-white text-teal-600 border border-slate-100'}`}
            >
              <PanelLeftOpen className="w-6 h-6" />
            </motion.button>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Outlet />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
