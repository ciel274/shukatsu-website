import { motion, useScroll, useTransform } from 'motion/react';
import { Chrome, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja';

const NAV_LINKS = [
  { label: '機能', href: '#features' },
  { label: 'セキュリティ', href: '#security' },
  { label: 'FAQ', href: '#faq' },
  { label: 'お問い合わせ', href: '#contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const scrolled = useTransform(scrollY, [0, 80], [0, 1]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 w-full z-50"
    >
      {/* Backdrop blur layer */}
      <motion.div
        style={{ opacity: scrolled }}
        className="absolute inset-0 bg-white/90 backdrop-blur-2xl border-b border-gray-200/60 shadow-sm shadow-gray-200/40"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
              <Chrome className="w-5 h-5 text-white" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-teal-400 blur-sm"
              />
            </div>
            <div>
              <div className="text-[15px] font-black text-gray-900 leading-none tracking-tight">
                就活<span className="text-teal-500">Dash</span>
                <span className="text-teal-400">!</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                Job Hunting Dashboard
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-4 py-2 text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors duration-200 rounded-xl hover:bg-teal-50 group"
            >
              {item.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full group-hover:w-4/5 transition-all duration-300" />
            </motion.button>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-2" />

          <motion.a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white overflow-hidden group shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <Chrome className="w-4 h-4 relative z-10" />
            <span className="relative z-10">無料でインストール</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 text-white/80"
            >
              →
            </motion.div>
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100"
      >
        <div className="px-6 py-4 space-y-1">
          {NAV_LINKS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all font-semibold text-sm"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/20"
            >
              <Chrome className="w-4 h-4" />
              無料でインストール
            </a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
