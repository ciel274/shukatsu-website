import { motion, useScroll, useTransform } from 'motion/react';
import { Chrome, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import { useRef, memo } from 'react';
import { Link } from 'react-router';
import MagneticButton from './MagneticButton';
import Particles from './Particles';

// Memoized for performance
const Hero = memo(() => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.9]);
  const dashboardY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -50, -150]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Animated Background - Optimized with hardware acceleration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/40" />

        <Particles count={20} />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-0 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/10 via-emerald-400/10 to-transparent rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-transparent rounded-full blur-[100px] will-change-transform"
        />
        
        {/* Animated Grid Pattern - Reduced complexity */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 shadow-lg border"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(16,185,129,0.08))',
            borderColor: 'rgba(20,184,166,0.3)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
          </motion.div>
          <span className="text-sm bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent font-bold tracking-wide">
            ✓ Chrome Web Store 公開中 · 完全無料
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-[#0f172a] mb-6 leading-[1.1] tracking-tight"
        >
          選考管理・ES・資料を
          <br />
          <span className="bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0f766e] bg-clip-text text-transparent">
            すべて一箇所に
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-bold"
        >
          選考管理・ES・マイページ自動入力が、これ一つで全部できます
          <br />
          <span className="text-[#0d9488]">ログイン不要・データはあなたのPCだけに保存</span>
        </motion.p>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MagneticButton className="px-12 py-5 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all text-lg">
              <Chrome className="w-5 h-5" />
              <span>無料でインストール</span>
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </a>
          <span className="text-xs text-gray-400 font-medium">Chrome Web Store で公開中 · クレジットカード不要</span>
        </div>

        {/* Dashboard Preview - Optimized for smooth scrolling */}
        <motion.div
          style={{ y: dashboardY, opacity: dashboardOpacity, scale }}
          className="mt-24 relative max-w-6xl mx-auto"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-3xl blur-3xl" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/30 bg-white/10 backdrop-blur-md">
            {/* Browser Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center gap-3 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-lg px-4 py-1.5 text-[10px] font-mono text-slate-400 text-left">
                chrome-extension://shukatsu-dash/dashboard
              </div>
            </div>
            {/* Mock UI */}
            <div className="aspect-video bg-[#0a0f1e] p-10 flex flex-col">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-teal-400" /></div>
                 <div className="h-4 w-40 bg-white/5 rounded-full" />
               </div>
               <div className="grid grid-cols-4 gap-6 flex-1">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3">
                     <div className="h-3 w-2/3 bg-white/10 rounded-full" />
                     <div className="h-10 w-full bg-white/5 rounded-xl" />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default Hero;
