import { motion, useScroll, useTransform } from 'motion/react';
import { Chrome, Columns3, FileText, Calendar, Lock, Database, Lightbulb } from 'lucide-react';
import { useRef } from 'react';

const showcaseFeatures = [
  {
    title: 'ワンクリックで企業を追加',
    description: '企業の採用ページを開いて右クリック。Webクリッパーが企業情報を自動で取得してカンバンに追加します。',
    icon: Chrome,
    displayIcon: Chrome,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'ドラッグ&ドロップで進捗管理',
    description: 'カンバンボードで選考フェーズを視覚的に管理。「エントリー」→「書類選考」→「面接」→「内定」とカードを移動するだけ。',
    icon: Columns3,
    displayIcon: Columns3,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'ES回答を一元管理',
    description: '「志望動機」「学生時代頑張ったこと」など、よく聞かれる質問の回答をストック。企業ごとにカスタマイズして使い回せます。',
    icon: FileText,
    displayIcon: FileText,
    color: 'from-purple-500 to-pink-500',
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
            こんな使い方を
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              想定しています
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto font-light"
          >
            自分が就活中に「こんな機能があったら便利だな」と思ったものを形にしました。
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
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="flex-1 relative"
              >
                <div className={`absolute -inset-4 bg-gradient-to-br ${feature.color} rounded-3xl blur-2xl opacity-30`} />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-12 aspect-square flex items-center justify-center overflow-hidden">
                  {/* Animated Background */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}
                  />

                  {/* Large Icon */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                    }}
                    className="relative z-10"
                  >
                    <div className={`w-48 h-48 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-2xl`}>
                      <feature.displayIcon className="w-24 h-24 text-white" strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Floating Icons */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.sin(i) * 20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                      className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${feature.color}`}
                      style={{
                        left: `${10 + i * 12}%`,
                        top: `${20 + i * 10}%`,
                      }}
                    />
                  ))}
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

                  <h3 className="text-4xl font-bold text-[#0f172a] mb-6 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-transparent rounded-full" />
                    <span className="text-sm text-gray-400 font-medium">
                      開発中の機能です
                    </span>
                  </div>
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
              <span className="font-semibold text-[#0f172a]">他にも便利な機能を構想中。</span>
              <span className="text-gray-500 ml-2">あなたのアイデアも募集しています！</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
