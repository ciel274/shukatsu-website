import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Building2, ExternalLink, Search, Check, Star, X, Share2, Info, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStorage } from '../imports/useStorage';

export default function CalendarPage() {
  const { data, saveData } = useStorage();
  const selections = data.selections || [];
  const isDark = data.settings?.darkMode === true;
  
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState<'all' | 'main' | 'intern'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: '', message: '', onConfirm: () => { } });
  const [newEntry, setNewEntry] = useState({ 
    companyId: '', 
    name: '', 
    deadlineTitle: '', 
    time: '',
    mypageUrl: '', 
    memo: '',
    category: 'main' as 'main' | 'intern'
  });

  const getSafeDomain = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    try {
      const targetUrl = url.includes('://') ? url : `https://${url}`;
      const urlObj = new URL(targetUrl);
      let hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
      const parts = hostname.split('.');
      
      const brandDomains = [
        'nssol.nipponsteel.com', 'nipponsteel.com', 'jri.co.jp', 'nri.co.jp'
      ];
      for (const brandDom of brandDomains) {
        if (hostname === brandDom || hostname.endsWith('.' + brandDom)) {
          return brandDom;
        }
      }
      
      const portalDomains = [
        'i-webs.jp', 'job-connector.jp', 'as-hub.jp', 'my-page.jp', 
        'opencareer.jp', 'smart-hr.jp', 'hire-planner.com', 'taleo.net', 
        'workday.com', 'applytojob.com', 'job-can.jp', 'recruit-mg.com', 
        'axol.jp', 'disc-entry.com', 'jobsuite.jp', 'job-suitetemp.jp',
        'snar.jp', 'hrmos.co', 'talentry.jp', 'e-recruit.jp', 'job-gear.jp'
      ];
      if (portalDomains.some(p => hostname.endsWith(p))) {
        if (parts.length > 2) {
          const first = parts[0];
          if (!['job', 'mypage', 'www', 'entry', 'portal'].includes(first)) {
            return first;
          }
        }
        const segments = urlObj.pathname.toLowerCase().split('/').filter(Boolean);
        for (const segment of segments) {
          const clean = segment.replace(/_\d+$/, '').replace(/\d+$/, '').replace(/-main$/, '').replace(/-intern$/, '');
          if (clean && clean.length > 2 && !['zw', 's', 'recruit', 'vb', 'entry', 'login', 'input', 'mypage', 'index', 'portal'].includes(clean)) {
            return clean;
          }
        }
      }

      // Strip generic hiring-related subdomains to get the root corporate domain
      const genericSubdomains = ['job', 'jobs', 'mypage', 'entry', 'portal', 'working', 'saiyo', 'recruit', 'career', 'careers', 'member', 'apply', 'applicant', 'sys', 'system', 'hiring', 'intern', 'recruit-mypage'];
      let cleanHostname = hostname;
      let stripped = true;
      while (stripped) {
        stripped = false;
        for (const sub of genericSubdomains) {
          if (cleanHostname.startsWith(sub + '.')) {
            cleanHostname = cleanHostname.slice(sub.length + 1);
            stripped = true;
            break;
          }
        }
      }

      const cleanParts = cleanHostname.split('.');
      const isMultiPartTLD = cleanHostname.endsWith('.co.jp') || cleanHostname.endsWith('.or.jp') || cleanHostname.endsWith('.ne.jp') || cleanHostname.endsWith('.ac.jp');
      if (isMultiPartTLD && cleanParts.length >= 3) return cleanParts.slice(-3).join('.');
      return cleanParts.slice(-2).join('.');
    } catch { return null; }
  };

  const getLogoUrl = (url: string) => {
    const domain = getSafeDomain(url);
    return domain ? `https://logos.hunter.io/${domain}` : null;
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrev = () => {
    if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
    else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
    else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const getDayData = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return selections
      .filter((s: any) => s.deadline === dateStr)
      .filter((s: any) => filterCategory === 'all' || s.category === filterCategory);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 overflow-y-auto overflow-x-hidden ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      {/* Full-width Header */}
      <div className={`px-10 py-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${isDark ? 'border-white/5 bg-[#14171c]' : 'border-slate-100 bg-white shadow-sm'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-lg ${isDark ? 'bg-teal-500/10 text-teal-400 shadow-teal-500/5' : 'bg-teal-50 text-[#0d9488] shadow-teal-500/10'}`}>
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {view === 'month' ? `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月` : 
               view === 'week' ? `${weekDays[0].getMonth() + 1}月${weekDays[0].getDate()}日 - ${weekDays[6].getMonth() + 1}月${weekDays[6].getDate()}日` :
               `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月${currentDate.getDate()}日`}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Global Selection Schedule</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
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
          
          <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[1.5rem]">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  view === v 
                  ? 'bg-white dark:bg-white/10 text-teal-600 shadow-xl shadow-teal-500/10' 
                  : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                {v === 'month' ? '月' : v === 'week' ? '週' : '日'}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex items-center gap-1 p-1.5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <button onClick={handlePrev} className={`p-3 rounded-xl transition-all ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-white text-slate-400 shadow-sm'}`}><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(new Date())} className={`px-8 py-2 text-[12px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Today</button>
            <button onClick={handleNext} className={`p-3 rounded-xl transition-all ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-white text-slate-400 shadow-sm'}`}><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 flex flex-col p-4">
        {view === 'month' && (
          <>
            <div className={`grid grid-cols-7 border-b transition-colors ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white shadow-sm'} rounded-t-[2rem] overflow-hidden`}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div key={day} className={`py-3 text-center text-[10px] font-black tracking-[0.3em] ${i === 0 ? 'text-rose-500/70' : i === 6 ? 'text-blue-500/70' : 'text-gray-400'}`}>{day}</div>
              ))}
            </div>
    
            <div className={`flex-1 grid grid-cols-7 bg-white/5 rounded-b-[2rem] overflow-hidden min-h-[600px] ${
              (firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) + daysInMonth(currentDate.getFullYear(), currentDate.getMonth())) > 35 
                ? 'grid-rows-6' 
                : 'grid-rows-5'
            }`}>
              {Array.from({ length: firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                <div key={`empty-${i}`} className={`border-r border-b transition-colors ${isDark ? 'border-white/[0.03] bg-black/10' : 'border-slate-50 bg-slate-50/50'}`} />
              ))}
              {Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const dayEvents = getDayData(dayDate);
                const isToday = new Date().toDateString() === dayDate.toDateString();
                
                return (
                  <div
                    key={i}
                    onClick={() => handleDateClick(dayDate)}
                    className={`border-r border-b p-2 flex flex-col gap-1.5 transition-all group hover:z-10 relative cursor-pointer min-h-[120px] ${
                      isDark 
                        ? `border-white/[0.03] ${isToday ? 'bg-teal-500/5' : 'hover:bg-white/[0.03]'}` 
                        : `border-slate-100 ${isToday ? 'bg-teal-50/50 shadow-inner' : 'bg-white hover:bg-slate-50/50'}`
                    }`}
                  >
                    <span className={`text-[13px] font-black transition-colors ${isToday ? 'text-teal-500' : (isDark ? 'text-gray-700 group-hover:text-gray-300' : 'text-slate-300 group-hover:text-slate-900')}`}>{i + 1}</span>
                    <div className="space-y-1 overflow-y-auto flex-1 scrollbar-hide">
                      {dayEvents.map((ev: any) => (
                        <div key={ev.id} className={`px-2 py-1.5 rounded-lg text-[9px] font-black border transition-all hover:scale-[1.03] shadow-sm flex flex-col leading-tight ${
                          isDark ? 'bg-teal-600/20 text-teal-400 border-teal-500/10' : 'bg-teal-50 text-teal-700 border-teal-100'
                        }`}>
                          <div className="truncate">{ev.companyName} - {ev.deadlineTitle || '締切'}</div>
                          {ev.time && <div className="text-[8px] opacity-70 mt-0.5"><Clock className="w-2 h-2 inline mr-1" />{ev.time}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === 'week' && (
          <div className="flex-1 grid grid-cols-7 gap-4 min-h-[600px]">
            {weekDays.map((d, i) => {
              const dayEvents = getDayData(d);
              const isToday = new Date().toDateString() === d.toDateString();
              return (
                <div key={i} className={`flex flex-col rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className={`p-6 text-center border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                    <div className={`text-[10px] font-black tracking-widest ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]}
                    </div>
                    <div className={`text-2xl font-black mt-2 ${isToday ? 'text-teal-500' : (isDark ? 'text-white' : 'text-slate-900')}`}>{d.getDate()}</div>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {dayEvents.map((ev: any) => (
                      <div key={ev.id} onClick={() => handleDateClick(d)} className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
                        <div className="text-[12px] font-black">{ev.companyName}</div>
                        <div className="text-[10px] font-bold mt-1 opacity-80">{ev.deadlineTitle}</div>
                        {ev.time && <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black"><Clock className="w-3 h-3" /> {ev.time}</div>}
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <div className="h-full flex items-center justify-center opacity-10 font-black text-[10px] uppercase tracking-widest vertical-text">No Events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'day' && (
          <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className={`p-10 rounded-[3rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentDate.getMonth() + 1}月 {currentDate.getDate()}日の予定</h2>
                <button onClick={() => handleDateClick(currentDate)} className="bg-teal-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-500 transition-all shadow-lg shadow-teal-500/20"><Plus className="w-4 h-4 mr-2 inline" /> 予定を追加</button>
              </div>
              <div className="space-y-4">
                {getDayData(currentDate).map((ev: any) => (
                  <div key={ev.id} className={`p-8 rounded-[2rem] border flex items-center justify-between transition-all ${isDark ? 'bg-teal-500/5 border-teal-500/10' : 'bg-teal-50/50 border-teal-100'}`}>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl border shadow-sm flex items-center justify-center overflow-hidden p-3">
                          <img src={getLogoUrl(ev.mypageUrl) || `https://www.google.com/s2/favicons?sz=128&domain=${getSafeDomain(ev.mypageUrl)}`} className="w-full h-full object-contain" />
                       </div>
                       <div>
                          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{ev.companyName}</div>
                          <div className="text-sm font-bold text-teal-600 mt-1">{ev.deadlineTitle}</div>
                       </div>
                    </div>
                    {ev.time && (
                      <div className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 ${isDark ? 'bg-black/40 text-teal-400' : 'bg-white shadow-sm text-teal-700'}`}>
                        <Clock className="w-4 h-4" /> {ev.time}
                      </div>
                    )}
                  </div>
                ))}
                {getDayData(currentDate).length === 0 && (
                  <div className="py-20 text-center opacity-20 font-black text-xl uppercase tracking-[0.5em]">No Schedule Today</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 space-y-8 border shadow-2xl transition-all scrollbar-hide ${isDark ? 'bg-[#14171c] border-white/10' : 'bg-white border-slate-100'}`}>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20"><Plus className="w-6 h-6" /></div>
                    <div>
                      <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>締切を追加</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">カレンダーに手動で登録します</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-6 h-6 text-slate-300" /></button>
               </div>

               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">マイページ</label>
                    <select 
                      value={newEntry.companyId} 
                      onChange={(e) => {
                        const comp = selections.find((s: any) => s.id === e.target.value);
                        setNewEntry({ ...newEntry, companyId: e.target.value, name: comp?.companyName || '', mypageUrl: comp?.mypageUrl || '' });
                      }}
                      className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none appearance-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}
                    >
                      <option value="">未連携で追加</option>
                      {selections.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.companyName}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">企業名</label>
                    <input type="text" placeholder="企業名" value={newEntry.name} onChange={(e) => setNewEntry({...newEntry, name: e.target.value})} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">締切名</label>
                    <input type="text" placeholder="ES提出締切、面接予約締切など" value={newEntry.deadlineTitle} onChange={(e) => setNewEntry({...newEntry, deadlineTitle: e.target.value})} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">日付</label>
                      <input type="date" value={selectedDateStr || ''} onChange={(e) => setSelectedDateStr(e.target.value)} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">時刻</label>
                      <input type="time" step="300" value={newEntry.time} onChange={(e) => setNewEntry({...newEntry, time: e.target.value})} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL</label>
                    <input type="text" placeholder="https://..." value={newEntry.mypageUrl} onChange={(e) => setNewEntry({...newEntry, mypageUrl: e.target.value})} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">メモ</label>
                    <textarea placeholder="提出物、注意事項、補足メモ" value={newEntry.memo} onChange={(e) => setNewEntry({...newEntry, memo: e.target.value})} className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none h-32 resize-none ${isDark ? 'bg-white/5 text-white border-none' : 'bg-slate-50 text-slate-900 border border-slate-100'}`} />
                 </div>
                 
                 <button 
                    onClick={() => {
                      const gcalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`【締切】${newEntry.name} - ${newEntry.deadlineTitle}`)}&dates=${selectedDateStr?.replace(/-/g, '')}T${newEntry.time?.replace(':', '') || '0900'}00/${selectedDateStr?.replace(/-/g, '')}T${Number(newEntry.time?.replace(':', '') || '0900') + 100}00&details=${encodeURIComponent(newEntry.memo)}&location=${encodeURIComponent(newEntry.mypageUrl)}&sf=true&output=xml`;
                      window.open(gcalUrl, '_blank');
                    }}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-dashed transition-all ${isDark ? 'border-teal-500/30 text-teal-400 hover:bg-teal-500/5' : 'border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                  >
                    <Share2 className="w-4 h-4" /> Googleカレンダーに追加
                  </button>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className={`flex-1 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'}`}>キャンセル</button>
                  <button onClick={() => {
                    if (!newEntry.name) return;
                    const item = { 
                      id: Date.now().toString(), 
                      companyName: newEntry.name, 
                      deadlineTitle: newEntry.deadlineTitle, 
                      deadline: selectedDateStr, 
                      time: newEntry.time,
                      mypageUrl: newEntry.mypageUrl,
                      memo: newEntry.memo,
                      status: '未応募', 
                      createdAt: new Date().toISOString(), 
                      rating: 0 
                    };
                    saveData({ selections: [item, ...selections] });
                    setIsModalOpen(false);
                    setNewEntry({ companyId: '', name: '', deadlineTitle: '', time: '', mypageUrl: '', memo: '', category: 'main' });
                  }} className="flex-1 py-4 bg-teal-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-500 transition-all">保存</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
