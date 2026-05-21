import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Circle, Clock, CheckCircle2, TrendingUp, GripVertical, MoreVertical, Paperclip } from 'lucide-react';

const kanbanColumns = [
  {
    title: 'エントリー',
    icon: Circle,
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    cards: [
      { company: '株式会社A', position: 'エンジニア職', deadline: '5/20', priority: 'high', attachments: 2 },
      { company: '株式会社B', position: 'データサイエンティスト', deadline: '5/25', priority: 'medium', attachments: 1 },
    ],
  },
  {
    title: '書類選考中',
    icon: Clock,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    cards: [
      { company: '株式会社C', position: 'PM職', deadline: '結果待ち', priority: 'medium', attachments: 3 },
    ],
  },
  {
    title: '面接',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    cards: [
      { company: '株式会社D', position: 'デザイナー職', deadline: '5/18 14:00', priority: 'high', attachments: 4 },
      { company: '株式会社E', position: 'マーケティング職', deadline: '5/22 10:00', priority: 'low', attachments: 2 },
    ],
  },
  {
    title: '内定',
    icon: CheckCircle2,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    cards: [
      { company: '株式会社F', position: 'エンジニア職', deadline: '承諾期限: 6/1', priority: 'high', attachments: 5 },
    ],
  },
];

export default function KanbanShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
          }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/15 via-emerald-400/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/15 via-pink-400/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-purple-500/10 border border-white/20"
          >
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              Kanban Dashboard
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            直感的な
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              カンバン管理
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            選考状況を一目で把握。ドラッグ&ドロップで簡単更新。
            <br />
            <span className="text-purple-600 font-medium">まるでTrelloやNotionのような使い心地</span>
          </motion.p>
        </div>

        <motion.div
          style={{ scale }}
          className="relative"
        >
          {/* Enhanced Glow Effect */}
          <motion.div
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -inset-8 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-3xl"
          />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 overflow-hidden">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a]">就活管理ボード</h3>
                  <p className="text-xs text-gray-500">最終更新: 今日 10:30</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
                  全 {kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0)} 件
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {kanbanColumns.map((column, columnIndex) => (
                  <motion.div
                    key={columnIndex}
                    initial={{ y: 60, opacity: 0, scale: 0.9 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: columnIndex * 0.1, type: 'spring' }}
                    className="w-80 flex-shrink-0"
                  >
                    {/* Column Header */}
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${column.bgColor} border ${column.borderColor} mb-4 shadow-sm`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${column.color} flex items-center justify-center`}>
                        <column.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-[#0f172a]">{column.title}</span>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold text-gray-700">
                          {column.cards.length}
                        </span>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                      {column.cards.map((card, cardIndex) => (
                        <motion.div
                          key={cardIndex}
                          initial={{ scale: 0.8, opacity: 0, y: 20 }}
                          whileInView={{ scale: 1, opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: columnIndex * 0.1 + cardIndex * 0.05, type: 'spring' }}
                          whileHover={{ y: -8, scale: 1.03, rotate: cardIndex % 2 === 0 ? 2 : -2 }}
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                          dragElastic={0.1}
                          className="group relative bg-white p-5 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-grab active:cursor-grabbing"
                        >
                          {/* Priority Indicator */}
                          <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
                            card.priority === 'high' ? 'bg-red-500' :
                            card.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />

                          {/* Drag Handle */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Card Content */}
                          <h4 className="font-bold text-[#0f172a] mb-2 pr-6">{card.company}</h4>
                          <p className="text-sm text-gray-600 mb-4">{card.position}</p>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{card.deadline}</span>
                            </div>
                            {card.attachments > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                                <Paperclip className="w-3 h-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600">{card.attachments}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Card Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:border-[#0d9488] hover:text-[#0d9488] transition-all duration-200 font-medium"
                      >
                        + カードを追加
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
