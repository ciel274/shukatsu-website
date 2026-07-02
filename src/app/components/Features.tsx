import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';
import { MousePointer2, Columns3, FileText, Lock, Calendar, Database, ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useState, memo } from 'react';

const features = [
  {
    icon: MousePointer2,
    title: 'Webクリッパー',
    description: '右クリック一つで訪問中の採用ページを自動取得し、カンバンに追加。',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-500/10 to-cyan-500/10',
  },
  {
    icon: Columns3,
    title: 'カンバンボード',
    description: 'ドラッグ&ドロップ感覚で選考ステータスを視覚的に管理。',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: FileText,
    title: 'ES・面接回答ストッカー',
    description: '企業ごとに過去の回答を保存し、いつでもコピー&ペースト可能。',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: Database,
    title: 'ドキュメントリポジトリ',
    description: '企業資料（PDF）をアプリ内で直接プレビュー。',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-500/10 to-red-500/10',
  },
  {
    icon: Lock,
    title: 'アカウントマネージャー',
    description: '企業別のID・パスワードをセキュアに管理・表示。',
    color: 'from-green-500 to-teal-500',
    bgColor: 'from-green-500/10 to-teal-500/10',
  },
  {
    icon: Calendar,
    title: 'カレンダー連携',
    description: 'GoogleカレンダーやTimeTreeへの締切自動登録。',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-500/10 to-rose-500/10',
  },
];

// Optimized Feature Card with Reduced CPU Load
const FeatureCard = memo(({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use simplified CSS-based transform instead of per-frame JS spring calculations
  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full will-change-transform"
    >
      {/* Optimized Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

      {/* Card Body */}
      <div className={`relative h-full bg-white p-8 rounded-3xl border border-gray-100 transition-all duration-500 overflow-hidden ${isHovered ? 'shadow-2xl -translate-y-2' : 'shadow-sm'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transform transition-transform group-hover:rotate-6`}>
            <feature.icon className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
          <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">{feature.description}</p>

          <div className="flex items-center gap-2 text-[#0d9488] font-black text-xs tracking-widest opacity-60 group-hover:opacity-100 transition-all">
            <span>詳しく見る</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Features() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="features" ref={containerRef} className="py-32 bg-white relative overflow-hidden">
      <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full mb-8 shadow-sm border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Core Features</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            すべての機能を、<span className="text-teal-500">一箇所に。</span>
          </h2>
          <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">就活に必要なあらゆる機能を、一つのダッシュボードで統合管理。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
