import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Chrome, X, GripVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { scrollY } = useScroll();
  const constraintsRef = useRef(null);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 800 && !isDismissed) {
        setIsVisible(true);
      } else if (latest < 400) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY, isDismissed]);

  if (isDismissed) return null;

  return (
    <>
      {/* Invisible full-screen drag boundary */}
      <div ref={constraintsRef} className="fixed inset-4 z-30 pointer-events-none" />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            dragElastic={0.05}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-40 select-none"
            style={{ touchAction: 'none' }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                /* ── Expanded card ── */
                <motion.div
                  key="card"
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {/* Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl blur-xl opacity-30" />

                  {/* Card */}
                  <div className="relative bg-white/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-100/60 w-72 overflow-hidden">
                    {/* Drag handle bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 cursor-grab active:cursor-grabbing">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-white/70" />
                        <span className="text-white text-xs font-bold tracking-wide">就活Dash!</span>
                      </div>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDragging) setIsExpanded(false);
                        }}
                        className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        選考管理・ES保存・マイページ自動入力がChrome拡張機能で全部できます。
                        <span className="font-semibold text-gray-800"> 完全無料・ログイン不要。</span>
                      </p>

                      <a
                        href={CHROME_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        <Chrome className="w-3.5 h-3.5" />
                        Chromeに追加する（無料）
                      </a>

                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
                        className="w-full mt-2 text-[10px] text-gray-400 hover:text-gray-600 transition-colors py-1"
                      >
                        今は不要
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ── Collapsed icon button ── */
                <motion.button
                  key="icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => { if (!isDragging) setIsExpanded(true); }}
                  className="relative group cursor-pointer"
                  title="就活Dash! を開く"
                >
                  {/* Pulse ring */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-teal-400"
                  />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-teal-500/40 group-hover:scale-110 transition-transform">
                    <Chrome className="w-6 h-6 text-white" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-gray-900 text-white text-[10px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    就活Dash! を開く
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
