import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Chrome, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.95)']
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3]);
  const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor,
        boxShadow: useTransform(
          shadowOpacity,
          (o) => `0 4px 20px rgba(0, 0, 0, ${o})`
        ),
      }}
      className="fixed top-0 w-full backdrop-blur-2xl z-50 border-b"
    >
      <motion.div
        style={{
          borderColor: useTransform(borderOpacity, (o) => `rgba(0, 0, 0, ${o})`),
        }}
        className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-11 h-11 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Chrome className="w-6 h-6 text-white" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-teal-400 rounded-xl blur-md"
              />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-[#0f172a] to-[#334155] bg-clip-text text-transparent">
                就活ダッシュボード
              </div>
              <div className="text-xs text-gray-500 font-medium">Premium Dashboard</div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: '機能', href: '#features' },
            { label: 'セキュリティ', href: '#security' },
            { label: 'FAQ', href: '#faq' },
            { label: 'お問い合わせ', href: '#contact' },
          ].map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative text-sm font-medium text-gray-600 hover:text-[#0d9488] transition-colors group"
            >
              {item.label}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              />
            </motion.a>
          ))}
          <a
            href="https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-6 py-2.5 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Chrome className="w-4 h-4" />
            無料でインストール
          </a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200/50"
      >
        <div className="px-6 py-4 space-y-3">
          {[
            { label: '機能', href: '#features' },
            { label: 'セキュリティ', href: '#security' },
            { label: 'FAQ', href: '#faq' },
            { label: 'お問い合わせ', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-gray-600 hover:text-[#0d9488] transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-2.5 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-xl font-semibold text-center text-sm hover:opacity-90 transition-opacity block"
            onClick={() => setIsOpen(false)}
          >
            無料でインストール
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
