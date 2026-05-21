import { useEffect } from 'react';
import { Outlet, useRouteError, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Navigation from '../components/Navigation';
import ScrollProgress from '../components/ScrollProgress';

export function ErrorBoundary() {
  const error: any = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl space-y-6 border border-red-100 dark:border-red-900/20"
      >
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto text-red-500">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">問題が発生しました</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            アプリの実行中に予期せぬエラーが発生しました。<br/>
            <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-2 inline-block">
              {error?.message || error?.statusText || '不明なエラー'}
            </code>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 bg-[#0d9488] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            アプリを再読み込み
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
          >
            <Home className="w-5 h-5" />
            ダッシュボードへ戻る
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Check saved theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Handle hash links
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Only handle hashes that are not router paths (not starting with #/)
      if (hash && !hash.startsWith('#/')) {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (e) {
          console.warn('Invalid hash selector:', hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <ScrollProgress />
      <Navigation />
      <Outlet />
    </div>
  );
}
