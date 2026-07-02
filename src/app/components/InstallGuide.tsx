import { motion } from 'motion/react';
import { Chrome, Download, Pin, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
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

export default function InstallGuide() {
  return (
    <section id="install" className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
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
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-blue-500/10 border border-white/20"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Installation Guide
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            たった
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              4ステップ
            </span>
            で完了
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            インストールは簡単。2分以内に就活管理を開始できます。
            <br />
            <span className="text-sm text-teal-600 font-semibold">Chrome Web Store で公開中・完全無料</span>
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 60, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
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
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex flex-col gap-4 items-center">
            <motion.a
              href="https://chromewebstore.google.com/detail/%E5%B0%B1%E6%B4%BBdash/lkfkcnncfglcaakolloipfndhaedkmfl?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Chrome className="w-6 h-6 relative z-10" />
              <span className="relative z-10 text-lg">Chrome Web Storeで入手</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            </motion.a>

            <p className="text-sm text-gray-500">
              対応ブラウザ: Google Chrome 最新版
            </p>
          </div>
        </motion.div>

        {/* Browser Compatibility */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
