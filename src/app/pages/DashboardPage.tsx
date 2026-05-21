import { motion } from 'motion/react';
import { Building2, FileText, Calendar, ArrowUpRight, Plus, Clock, Star, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { useStorage } from '../imports/useStorage';
import { useMemo, memo } from 'react';

// Memoized Stat Card for better performance
const StatCard = memo(({ label, value, icon: Icon, color, isDark }: any) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
    isDark 
      ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] shadow-2xl' 
      : 'bg-white border-slate-100 hover:shadow-xl shadow-slate-200/40'
  }`}>
    <div className="flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{label}</p>
        <h3 className={`text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
      </div>
    </div>
  </div>
));

export default function DashboardPage() {
  const { data } = useStorage();
  const isDark = data.settings?.darkMode === true;

  // Optimized data processing using useMemo
  const selections = useMemo(() => data.selections || [], [data.selections]);
  const notesCount = useMemo(() => {
    return (data.notes?.folders?.flatMap((f: any) => f.notes || []) || []).length;
  }, [data.notes]);

  const stats = useMemo(() => [
    { label: '登録企業', value: selections.length, icon: Building2, color: isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600' },
    { label: '進行中の選考', value: selections.filter((s: any) => s.status !== '未応募').length, icon: TrendingUp, color: isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600' },
    { label: 'ナレッジ数', value: notesCount, icon: MessageSquare, color: isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600' },
  ], [selections.length, notesCount, isDark]);

  const upcomingDeadlines = useMemo(() => {
    return selections
      .filter((s: any) => s.deadline)
      .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 4);
  }, [selections]);

  return (
    <div className={`p-10 space-y-12 w-full h-full flex flex-col transition-all duration-700 ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-teal-500 tracking-[0.4em] uppercase"
          >
            Control Center
          </motion.span>
          <h1 className={`text-5xl font-black tracking-tighter mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/notes" className="px-8 py-4 bg-[#0d9488] text-white rounded-[1.5rem] text-[13px] font-black hover:bg-teal-500 transition-all shadow-2xl shadow-teal-500/20 flex items-center gap-3 group">
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
             <span>新規ナレッジ作成</span>
           </Link>
        </div>
      </div>

      {/* Optimized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} isDark={isDark} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
        {/* Deadlines Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] flex items-center gap-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              Upcoming Deadlines
            </h3>
            <Link to="/calendar" className="text-[10px] font-black text-teal-500 hover:underline uppercase tracking-widest">View All</Link>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item: any) => (
              <div key={item.id} className={`p-6 rounded-[2.5rem] border flex items-center justify-between group cursor-pointer transition-all ${
                isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] shadow-2xl' : 'bg-white border-slate-100 hover:border-teal-500/30 shadow-sm'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                    {item.companyName[0]}
                  </div>
                  <div>
                    <h4 className={`font-black text-[17px] truncate tracking-tight ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{item.companyName}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{item.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[11px] font-black px-4 py-2 rounded-xl shadow-inner ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}>
                    {item.deadline}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>
            )) : (
              <div className={`h-64 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center space-y-4 transition-colors ${isDark ? 'border-white/5 bg-white/[0.01] text-gray-700' : 'border-slate-100 bg-white/40 text-slate-300'}`}>
                <Calendar className="w-12 h-12 opacity-10" />
                <p className="text-[12px] font-black uppercase tracking-widest opacity-30">登録された締切はありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Selection Analytics Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] flex items-center gap-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
              Selection Funnel
            </h3>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Conversion</div>
          </div>
          
          <div className={`p-10 rounded-[3rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="space-y-8">
              {/* Funnel Calculation & Rendering */}
              {(() => {
                const stages = [
                  { label: 'エントリー', key: 'applied', filter: (s: any) => s.status !== '未応募' },
                  { label: '書類通過', key: 'es', filter: (s: any) => !['未応募', 'ES提出済', '書類選考中', '不合格', '辞退'].includes(s.status) },
                  { label: '面接進行中', key: 'interview', filter: (s: any) => s.status.includes('面接') },
                  { label: '内定獲得', key: 'offer', filter: (s: any) => s.status === '内定' },
                ];

                const total = selections.length || 1;
                
                return stages.map((stage, idx) => {
                  const count = selections.filter(stage.filter).length;
                  const percent = Math.round((count / total) * 100);
                  const colors = [
                    'from-indigo-500 to-indigo-600',
                    'from-teal-500 to-teal-600',
                    'from-amber-500 to-amber-600',
                    'from-rose-500 to-rose-600'
                  ];

                  return (
                    <div key={stage.key} className="space-y-3">
                      <div className="flex items-end justify-between px-2">
                        <div className="flex items-center gap-3">
                           <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${colors[idx]}`}>{idx + 1}</span>
                           <span className={`text-[13px] font-black tracking-tight ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{stage.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{count}</span>
                           <span className="text-[10px] font-black text-gray-500 uppercase">Companies</span>
                        </div>
                      </div>
                      <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1.5, delay: idx * 0.1, ease: "circOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${colors[idx]} shadow-lg`}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className={`mt-10 pt-8 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
               <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Conversion Rate</p>
                  <h4 className={`text-2xl font-black mt-1 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                    {Math.round((selections.filter((s: any) => s.status === '内定').length / (selections.length || 1)) * 100)}%
                  </h4>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Pipeline</p>
                  <h4 className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selections.filter((s: any) => !['未応募', '内定', '不合格', '辞退'].includes(s.status)).length}
                  </h4>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
