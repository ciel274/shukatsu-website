import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Chrome, Download, Pin, CheckCircle2, ArrowRight, Home, Smartphone, Apple } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

const chromeSteps = [
  {
    number: '01',
    title: 'Chrome Web Storeにアクセス',
    description: '下のボタンをクリックして、Chromeウェブストアの拡張機能ページを開きます。',
    icon: Chrome,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    title: 'Chromeに追加をクリック',
    description: '「Chromeに追加」ボタンをクリックして、拡張機能をインストールします。',
    icon: Download,
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    title: '拡張機能を固定',
    description: 'ツールバーのパズルアイコンから拡張機能を固定して、簡単にアクセスできるようにします。',
    icon: Pin,
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '04',
    title: '完了！就活管理を開始',
    description: 'これで準備完了です。企業ページを開いて、右クリックメニューから追加してみましょう。',
    icon: CheckCircle2,
    color: 'from-teal-500 to-emerald-500',
  },
];

export default function InstallPage() {
  const [platform, setPlatform] = useState<'chrome' | 'ios' | 'android'>('chrome');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#0f172a] font-bold text-xl hover:text-[#0d9488] transition-colors">
            <Home className="w-5 h-5" />
            <span>ホームに戻る</span>
          </Link>
          <div className="text-sm text-gray-600">
            インストールガイド
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="pt-32 pb-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-blue-500/10 border border-white/20"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Installation Guide
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
            >
              お好みのプラットフォームで
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                すぐに始められます
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Chrome拡張機能または、スマートフォンアプリで就活管理を開始できます。
            </motion.p>
          </div>

          {/* Platform Selection */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <Tabs defaultValue="chrome" className="w-full" onValueChange={(value) => setPlatform(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/60 backdrop-blur-xl p-2 rounded-2xl border border-gray-200/50 shadow-lg h-auto">
                <TabsTrigger 
                  value="chrome" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 min-h-[4rem]"
                >
                  <Chrome className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-center">Chrome拡張機能</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ios" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 min-h-[4rem]"
                >
                  <Apple className="w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-sm sm:text-base">iOS</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-md whitespace-nowrap">開発中</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="android" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 min-h-[4rem]"
                >
                  <Smartphone className="w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-sm sm:text-base">Android</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-md whitespace-nowrap">開発中</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Chrome Tab Content */}
              <TabsContent value="chrome" className="mt-0">
                <div className="text-center mb-8">
                  <p className="text-sm text-amber-600 font-semibold">※現在オープンベータ版準備中です</p>
                </div>

                {/* Chrome Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {chromeSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 60, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, type: 'spring' }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative group"
                    >
                      {/* Glow */}
                      <motion.div
                        animate={{
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                        className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
                      />

                      {/* Card */}
                      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                        {/* Step Number */}
                        <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100">
                          {step.number}
                        </div>

                        <div className="relative p-8 z-10">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                          >
                            <step.icon className="w-8 h-8 text-white" />
                          </motion.div>

                          {/* Content */}
                          <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Progress Line */}
                        {index < chromeSteps.length - 1 && (
                          <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chrome CTA */}
                <div className="text-center">
                  <div className="inline-flex flex-col gap-4 items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 hover:shadow-2xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Chrome className="w-6 h-6 relative z-10" />
                      <span className="relative z-10 text-lg">Chrome Web Storeで入手</span>
                      <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                    </motion.button>

                    <p className="text-sm text-gray-500">
                      対応ブラウザ: Google Chrome 90+
                    </p>
                  </div>
                </div>

                {/* Browser Compatibility */}
                <div className="mt-20 text-center">
                  <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-500 mb-1">動作環境</div>
                      <div className="text-lg font-bold text-[#0f172a]">Chrome 90+</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-500 mb-1">容量</div>
                      <div className="text-lg font-bold text-[#0f172a]">約 2MB</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-500 mb-1">価格</div>
                      <div className="text-lg font-bold text-[#0f172a]">完全無料</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* iOS Tab Content */}
              <TabsContent value="ios" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="max-w-3xl mx-auto">
                    {/* Coming Soon Card */}
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-12 mb-12 overflow-hidden">
                      {/* Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
                        >
                          <Apple className="w-12 h-12 text-white" />
                        </motion.div>

                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-300">現在開発中</Badge>
                        
                        <h2 className="text-4xl font-bold text-[#0f172a] mb-4">
                          iOSアプリ 開発中
                        </h2>
                        
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                          iPhoneやiPadでも快適に就活管理ができるよう、<br />
                          ネイティブアプリを開発中です。
                        </p>

                        <div className="space-y-4 text-left max-w-md mx-auto">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">モバイル専用の最適化されたUI/UX</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">オフラインでもデータアクセス可能</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">プッシュ通知で面接日を逃さない</p>
                          </div>
                        </div>

                        <div className="mt-10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 rounded-2xl font-bold cursor-not-allowed opacity-60"
                            disabled
                          >
                            App Store 公開予定
                          </motion.button>
                          <p className="text-sm text-gray-500 mt-4">
                            リリース時期は未定です
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Info */}
                    <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-500 mb-1">対応予定</div>
                        <div className="text-lg font-bold text-[#0f172a]">iOS 15+</div>
                      </div>
                      <div className="w-px h-12 bg-gray-200" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-500 mb-1">価格</div>
                        <div className="text-lg font-bold text-[#0f172a]">完全無料</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Android Tab Content */}
              <TabsContent value="android" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="max-w-3xl mx-auto">
                    {/* Coming Soon Card */}
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-12 mb-12 overflow-hidden">
                      {/* Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 opacity-50" />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl"
                        >
                          <Smartphone className="w-12 h-12 text-white" />
                        </motion.div>

                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-300">現在開発中</Badge>
                        
                        <h2 className="text-4xl font-bold text-[#0f172a] mb-4">
                          Androidアプリ 開発中
                        </h2>
                        
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                          Androidスマートフォンでも快適に就活管理ができるよう、<br />
                          ネイティブアプリを開発中です。
                        </p>

                        <div className="space-y-4 text-left max-w-md mx-auto">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">モバイル専用の最適化されたUI/UX</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">オフラインでもデータアクセス可能</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700">ウィジェットで選考状況を一目で確認</p>
                          </div>
                        </div>

                        <div className="mt-10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 rounded-2xl font-bold cursor-not-allowed opacity-60"
                            disabled
                          >
                            Google Play 公開予定
                          </motion.button>
                          <p className="text-sm text-gray-500 mt-4">
                            リリース時期は未定です
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Info */}
                    <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-500 mb-1">対応予定</div>
                        <div className="text-lg font-bold text-[#0f172a]">Android 8.0+</div>
                      </div>
                      <div className="w-px h-12 bg-gray-200" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-500 mb-1">価格</div>
                        <div className="text-lg font-bold text-[#0f172a]">完全無料</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  );
}