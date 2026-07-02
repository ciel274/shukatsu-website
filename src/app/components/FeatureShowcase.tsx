import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Chrome, Columns3, FileText, Lightbulb, MousePointer2, CheckCircle2, Plus } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Animated demo: マイページ → 拡張機能 → カンバン追加
function ClickToRegisterDemo() {
  const [step, setStep] = useState(0); // 0=browsing, 1=popup open, 2=added

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 2600),
      setTimeout(() => setStep(0), 4200),
    ];
    const interval = setInterval(() => {
      setStep(0);
      setTimeout(() => setStep(1), 1200);
      setTimeout(() => setStep(2), 2600);
    }, 5000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-3xl blur-2xl" />

      <div className="relative w-full max-w-sm space-y-3">
        {/* Browser mockup */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Browser chrome */}
          <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-[9px] font-mono text-gray-400 truncate">
              mypage.recruit.co.jp/applicants/top
            </div>
          </div>
          {/* Page content */}
          <div className="p-4 bg-white">
            <div className="text-[10px] font-bold text-gray-500 mb-2">リクルートマイページ</div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0" />
              <div>
                <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-1" />
                <div className="h-2 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
            {/* Cursor */}
            <motion.div
              animate={step === 0 ? { x: [0, 30, 30], y: [0, 10, 10], opacity: [0, 1, 1] } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute bottom-10 left-16 pointer-events-none"
            >
              <MousePointer2 className="w-5 h-5 text-gray-700 fill-white drop-shadow" />
            </motion.div>
          </div>
        </div>

        {/* Extension popup */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2.5 flex items-center gap-2">
                <Chrome className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold">就活Dash!</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">R</div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">リクルート株式会社</div>
                    <div className="text-[10px] text-gray-400">mypage.recruit.co.jp</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full font-medium border border-teal-100">本選考</span>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">未応募</span>
                </div>
                <motion.button
                  animate={step === 1 ? { scale: [1, 0.94, 1] } : {}}
                  transition={{ delay: 0.6, duration: 0.25 }}
                  className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  カンバンに追加
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success toast */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white text-xs font-bold">カンバンに追加しました！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const showcaseFeatures = [
  {
    title: 'マイページを開くだけで\nワンクリック登録',
    description: '企業のマイページや採用ページを開いているとき、拡張機能のアイコンをクリックするだけ。企業名・URL・ステータスを自動で取得してカンバンに追加します。手入力は一切不要です。',
    icon: Chrome,
    color: 'from-teal-500 to-emerald-500',
    isCustomDemo: true,
  },
  {
    title: 'ドラッグ&ドロップで\n進捗管理',
    description: '「未応募」→「ES提出済」→「1次面接」→「内定」の列にカードを置くだけ。どの会社がどの段階か、開けば一目でわかります。',
    icon: Columns3,
    displayIcon: Columns3,
    color: 'from-blue-500 to-cyan-500',
    isCustomDemo: false,
  },
  {
    title: 'ES回答を\n企業ごとに保存',
    description: '「志望動機」「ガクチカ」など書いた回答を企業ごとに保存できます。次の企業に使うときはコピペして少し直すだけ。毎回ゼロから書かなくてよくなります。',
    icon: FileText,
    displayIcon: FileText,
    color: 'from-purple-500 to-pink-500',
    isCustomDemo: false,
  },
];

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            実際に
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              こう使います
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto font-light"
          >
            就活中に自分が欲しいと思って作りました。
          </motion.p>
        </div>

        {/* Feature Showcase */}
        <div className="space-y-32">
          {showcaseFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 items-center`}
            >
              {/* Visual */}
              <motion.div
                whileHover={{ scale: feature.isCustomDemo ? 1.02 : 1.05, rotate: feature.isCustomDemo ? 0 : (index % 2 === 0 ? 2 : -2) }}
                className="flex-1 relative"
              >
                <div className={`absolute -inset-4 bg-gradient-to-br ${feature.color} rounded-3xl blur-2xl opacity-20`} />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8 aspect-square flex items-center justify-center overflow-hidden">
                  {feature.isCustomDemo ? (
                    <ClickToRegisterDemo />
                  ) : (
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}
                      />
                      <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="relative z-10"
                      >
                        <div className={`w-48 h-48 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-2xl`}>
                          {'displayIcon' in feature && feature.displayIcon && <feature.displayIcon className="w-24 h-24 text-white" strokeWidth={1.5} />}
                        </div>
                      </motion.div>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -30, 0], x: [0, Math.sin(i) * 20, 0], opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                          className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${feature.color}`}
                          style={{ left: `${10 + i * 12}%`, top: `${20 + i * 10}%` }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className={`inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r ${feature.color} rounded-full`}>
                    <feature.icon className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">機能 {index + 1}</span>
                  </div>

                  <h3 className="text-4xl font-bold text-[#0f172a] mb-6 tracking-tight whitespace-pre-line">
                    {feature.title}
                  </h3>

                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {feature.description}
                  </p>

                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700">
              <span className="font-semibold text-[#0f172a]">他にも機能を追加していく予定です。</span>
              <span className="text-gray-500 ml-2">使ってみて気になることがあれば教えてください。</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
