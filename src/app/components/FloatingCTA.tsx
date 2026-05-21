import { motion, useScroll, useTransform } from 'motion/react';
import { Chrome, X, Apple, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 800 && !isDismissed) {
        setIsVisible(true);
      } else if (latest < 400) {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY, isDismissed]);

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <div className="relative group">
        {/* Glow */}
        <motion.div
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute -inset-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-2xl blur-xl opacity-50"
        />

        {/* Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 max-w-sm">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Chrome className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#0f172a] mb-1">オープンベータ版 準備中</div>
              <div className="text-xs text-gray-600">完全無料・Chrome拡張機能</div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 rounded-lg border border-teal-200">
              <Chrome className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-xs font-medium text-teal-700">Chrome</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
              <Apple className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">iOS</span>
              <span className="text-[0.6rem] text-gray-400">(開発中)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
              <Smartphone className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Android</span>
              <span className="text-[0.6rem] text-gray-400">(開発中)</span>
            </div>
          </div>

          <Link to="/install" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              インストール詳細を見る
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}