import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo, memo } from 'react';
import { useStorage } from '../imports/useStorage';
import { useNavigate } from 'react-router';
import { Building2, Plus, Info, LayoutGrid } from 'lucide-react';
import { CompanyDetailView } from './CompanyListPage';
import { motion, AnimatePresence } from 'motion/react';
import { getLogoUrl } from '../imports/utils';


const COLUMNS = [
  { id: '未応募', label: '未応募', color: 'indigo', gradient: 'from-indigo-500 to-blue-500' },
  { id: '書類選考中', label: '書類選考中', color: 'teal', gradient: 'from-teal-500 to-emerald-500' },
  { id: '面接進行中', label: '面接進行中', color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  { id: '内定/終了', label: '内定/終了', color: 'rose', gradient: 'from-rose-500 to-pink-500' },
];

const SortableItem = memo(({ id, item, isDark, onClick, isOverlay }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const logoUrl = getLogoUrl(item.mypageUrl || '');
  const selectionColor = item.industryColor || (item.category === 'intern' ? '#14b8a6' : '#6366f1');
  
  const daysRemaining = useMemo(() => {
    if (!item.deadline) return null;
    const today = new Date();
    const deadline = new Date(item.deadline);
    const diff = deadline.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }, [item.deadline]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.3 : 1,
    zIndex: isOverlay ? 1000 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`group p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isOverlay ? 'shadow-2xl scale-105 rotate-2 border-teal-500/50' : ''
      } ${
        isDark 
          ? 'bg-[#1a1d23] border-white/5 hover:border-white/10 shadow-xl' 
          : 'bg-white border-slate-100 hover:shadow-lg shadow-sm shadow-slate-200/20 hover:border-slate-200'
      }`}
    >
      {/* Industry Accent */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${!selectionColor.startsWith('#') ? selectionColor : ''}`} 
        style={selectionColor.startsWith('#') ? { backgroundColor: selectionColor } : {}}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            {logoUrl ? (
              <img src={logoUrl} alt={item.companyName} className="w-5 h-5 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <Building2 className={`w-5 h-5 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-black text-[15px] truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.companyName}</h4>
            <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5">{item.jobType || '職種未設定'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                item.category === 'intern' ? 'bg-teal-500/10 text-teal-500' : 'bg-indigo-500/10 text-indigo-500'
            }`}>
                {item.category === 'intern' ? 'Intern' : 'Main'}
            </span>
          </div>
          
          {daysRemaining !== null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
              daysRemaining < 0 ? (isDark ? 'bg-gray-500/10 border-gray-500/20 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400') :
              daysRemaining <= 3 ? (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-500') :
              (isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-100 text-teal-600')
            }`}>
              <div className={`w-1 h-1 rounded-full animate-pulse ${
                daysRemaining < 0 ? 'bg-gray-400' :
                daysRemaining <= 3 ? 'bg-red-500' : 'bg-teal-500'
              }`} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {daysRemaining < 0 ? '終了' : daysRemaining === 0 ? '今日' : `あと${daysRemaining}日`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const DroppableColumn = ({ col, items, isDark, onCardClick, onAddClick }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col h-full min-h-[600px] space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-8 bg-gradient-to-b ${col.gradient} rounded-full shadow-lg`} />
          <h3 className={`text-[13px] font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{col.label}</h3>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${isDark ? 'bg-white/5 text-gray-500' : 'bg-slate-100 text-slate-400'}`}>{items.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 rounded-[2.5rem] p-4 space-y-4 border-2 transition-all duration-300 flex flex-col ${
          isOver ? (isDark ? 'bg-teal-500/5 border-teal-500/20' : 'bg-teal-50/50 border-teal-500/20') : 
          (isDark ? 'bg-white/[0.02] border-white/[0.02]' : 'bg-slate-50/50 border-slate-100')
        } border-dashed`}
      >
        <div className="flex-1 space-y-4">
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
              <SortableItem 
                key={item.id} 
                id={item.id} 
                item={item} 
                isDark={isDark} 
                onClick={() => onCardClick(item.id)}
              />
            ))}
          </SortableContext>
          
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-3 opacity-20">
              <div className={`w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                 <LayoutGrid className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Drop here</p>
            </div>
          )}
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddClick(col.id);
          }}
          className={`w-full py-5 rounded-[2rem] border-2 border-dashed transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest flex-shrink-0 mt-auto ${
            isDark ? 'border-white/5 text-gray-700 hover:text-teal-500 hover:border-teal-500/20' : 'border-slate-100 text-slate-300 hover:text-teal-600 hover:border-teal-500/20 hover:bg-teal-50/50 shadow-sm'
          }`}
        >
          <Plus className="w-4 h-4" /> カードを追加
        </button>
      </div>
    </div>
  );
};

export default function KanbanPage() {
  const navigate = useNavigate();
  const { data, saveData } = useStorage();
  const selections = useMemo(() => data.selections || [], [data.selections]);
  const isDark = data.settings?.darkMode === true;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'main' | 'intern'>('main');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredSelections = useMemo(() => {
    return selections.filter((s: any) => {
      const cat = s.category || 'main';
      return cat === activeCategory || cat === 'both';
    });
  }, [selections, activeCategory]);

  const activeItem = useMemo(() => 
    activeId ? selections.find((s: any) => s.id === activeId) : null
  , [activeId, selections]);

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleDragOver = (event: any) => {
    // No-op to avoid excessive updates during movement
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeItem = selections.find((s: any) => s.id === activeId);
    if (!activeItem) return;

    // 1. Handle drop on a column (move to new status)
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    if (isOverColumn) {
      if (activeItem.status !== overId) {
        const updated = selections.map((s: any) => 
          s.id === activeId ? { ...s, status: overId } : s
        );
        saveData({ selections: updated });
      }
      return;
    }

    // 2. Handle drop on an item (reorder or move status)
    const overItem = selections.find((s: any) => s.id === overId);
    if (overItem) {
      if (activeId !== overId) {
        const oldIndex = selections.findIndex((s: any) => s.id === activeId);
        const newIndex = selections.findIndex((s: any) => s.id === overId);
        
        let updated = [...selections];
        // If items are in different columns, update status first
        if (activeItem.status !== overItem.status) {
          updated = updated.map(s => s.id === activeId ? { ...s, status: overItem.status } : s);
        }
        
        const finalUpdated = arrayMove(updated, oldIndex, newIndex);
        saveData({ selections: finalUpdated });
      }
    }
  };

  if (selectedId) return <CompanyDetailView id={selectedId} onBack={() => setSelectedId(null)} />;

  return (
    <div className={`p-10 min-h-full flex flex-col transition-all duration-700 relative overflow-y-auto overflow-x-hidden ${isDark ? 'bg-[#0f1115]' : 'bg-slate-50/50'}`}>
      {/* Background Accents */}
      <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-100/40'}`} />
      <div className={`absolute -left-40 -bottom-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-teal-500/5' : 'bg-teal-100/40'}`} />

      <div className="flex items-end justify-between px-2 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]`} />
            <span className="text-[11px] font-black text-indigo-600/80 tracking-[0.5em] uppercase">Visual Management</span>
          </div>
          <h1 className={`text-5xl font-black tracking-tighter mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            選考<span className="text-indigo-600">管理</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-end">
          <div className={`flex p-1 rounded-2xl border transition-all ${isDark ? 'bg-[#14171c] border-white/5' : 'bg-white shadow-xl shadow-slate-200/50 border-slate-100'}`}>
            {['main', 'intern'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat === 'main' ? '本選考' : 'インターン'}
              </button>
            ))}
          </div>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border shadow-sm ${
            isDark ? 'bg-[#14171c] border-white/5 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">要アクション: {filteredSelections.filter((s: any) => s.status === '書類選考中').length}件</span>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-14 relative z-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="min-h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {COLUMNS.map((col) => (
              <DroppableColumn 
                key={col.id} 
                col={col} 
                items={filteredSelections.filter((s: any) => s.status === col.id)} 
                isDark={isDark} 
                onCardClick={setSelectedId}
                onAddClick={(status: string) => {
                  // Redirect to Company List with specific status and category
                  navigate(`/list?add=true&status=${encodeURIComponent(status)}&category=${activeCategory}`);
                }}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: { opacity: '0.5' },
              },
            }),
          }}>
            {activeId && activeItem ? (
              <SortableItem 
                id={activeId} 
                item={activeItem} 
                isDark={isDark} 
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
