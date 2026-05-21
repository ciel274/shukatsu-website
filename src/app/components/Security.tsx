import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, Lock, Eye, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef } from 'react';

const securityFeatures = [
  {
    icon: Shield,
    title: '完全プライバシー保護',
    description: '外部サーバーを介さず、すべてのデータはブラウザ内で完結。',
    color: 'from-teal-500 to-emerald-500',
    stats: '100%',
    label: 'ローカル保存',
  },
  {
    icon: Lock,
    title: 'ローカル暗号化',
    description: 'IDやパスワードは、PC内部でAES-256形式で暗号化保存されます。',
    color: 'from-blue-500 to-cyan-500',
    stats: 'AES-256',
    label: '暗号化方式',
  },
  {
    icon: Eye,
    title: 'ゼロトラッキング',
    description: 'ユーザーの行動を一切追跡しません。完全匿名。',
    color: 'from-purple-500 to-pink-500',
    stats: '0件',
    label: 'データ収集',
  },
  {
    icon: Server,
    title: 'ゼロサーバー設計',
    description: 'データ漏洩リスクゼロ。外部サーバーを一切持たない設計です。',
    color: 'from-orange-500 to-red-500',
    stats: '0%',
    label: '漏洩リスク',
  },
];

export default function Security() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="security" ref={containerRef} className="py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"
        />

        {/* Floating Lock Icons */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
        >
          <Lock className="w-8 h-8 text-teal-500/40" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
        >
          <Shield className="w-10 h-10 text-blue-500/40" />
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-teal-500/10 border border-white/20"
          >
            <div className="relative">
              <Shield className="w-4 h-4 text-[#0d9488]" />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-[#0d9488] rounded-full blur-sm"
              />
            </div>
            <span className="text-sm bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent font-semibold">
              Security First
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            あなたのデータは、
            <br />
            <span className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent">
              あなただけのもの
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            サーバーレス設計：あなたのデータにアクセスできるのは、あなただけです
            <br />
            <span className="text-[#0d9488] font-medium">Chrome Web Store 審査済み・Googleの厳格なセキュリティ基準をクリア</span>
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 60, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
              className="group relative"
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
                className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
              />

              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 hover:border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className="relative flex items-start gap-6">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-xl`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent">
                          {feature.stats}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{feature.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-teal-50 via-white to-blue-50 backdrop-blur-xl rounded-3xl border border-white/40 p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: CheckCircle2, text: 'Chrome Web Store認証済み', color: 'text-green-600' },
                { icon: Lock, text: 'オープンソース', color: 'text-blue-600' },
                { icon: AlertCircle, text: '外部送信なし', color: 'text-teal-600' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1, type: 'spring' }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md ${badge.color}`}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-[#0f172a]">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
