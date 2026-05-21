import { motion } from 'motion/react';
import { Chrome, ArrowRight, Star, Users, Zap, Shield, Apple, Smartphone } from 'lucide-react';
import { Link } from 'react-router';
import MagneticButton from './MagneticButton';

export default function CTA() {
  return (
    <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 360],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-teal-400/25 via-emerald-400/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.4, 1, 1.4],
            rotate: [360, 0],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-400/25 via-purple-400/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-6xl mx-auto px-6"
      >
        {/* Values Section */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { icon: Shield, value: '0件', label: '外部へのデータ送信', color: 'from-blue-500 to-cyan-500' },
            { icon: Zap, value: '1/3', label: '管理時間の削減目標', color: 'from-purple-500 to-pink-500' },
            { icon: Users, value: '100%', label: '全機能無料で提供', color: 'from-teal-500 to-emerald-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="relative group"
            >
              <div className={`absolute -inset-1 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 shadow-lg text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#0f172a] to-[#334155] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA */}
        <div className="relative">
          {/* Outer Glow */}
          <motion.div
            animate={{
              opacity: [0.4, 0.6, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -inset-4 bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0f766e] rounded-3xl blur-3xl opacity-40"
          />

          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative bg-gradient-to-br from-[#0d9488] via-[#0f766e] to-[#0d9488] rounded-3xl p-16 text-center overflow-hidden"
          >
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Floating Shapes */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-10 left-10 w-24 h-24 border-2 border-white/20 rounded-3xl"
            />
            <motion.div
              animate={{
                y: [0, 30, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full"
            />

            <div className="relative z-10">
              {/* Stars */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                className="flex items-center justify-center gap-1 mb-8"
              >
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    <Star className="w-7 h-7 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
              >
                今すぐ就活を
                <br />
                効率化しませんか？
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
              >
                オープンベータ版、準備中。無料でインストールして、
                <br />
                <span className="font-semibold">煩雑な就活管理をシンプルに</span>
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center gap-4 flex-wrap"
              >
                <Link to="/install">
                  <MagneticButton className="group relative px-10 py-5 bg-white text-[#0d9488] rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-2xl overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-50 via-cyan-50 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <Chrome className="w-6 h-6 relative z-10" />
                    <span className="relative z-10 text-lg">無料でインストール</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 relative z-10" />
                    </motion.div>
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Platform Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="mt-8 flex items-center justify-center gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <Chrome className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-medium">Chrome</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 opacity-60"
                >
                  <Apple className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-medium">iOS</span>
                  <span className="text-xs text-white/60">(開発中)</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 opacity-60"
                >
                  <Smartphone className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-medium">Android</span>
                  <span className="text-xs text-white/60">(開発中)</span>
                </motion.div>
              </motion.div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8 text-sm text-white/80 flex items-center justify-center gap-4 flex-wrap"
              >
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  クレジットカード不要
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  完全無料
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  いつでもアンインストール可
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="text-sm text-gray-500 mb-4">
            © 2026 就活ダッシュボード. All rights reserved.
          </div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: 'プライバシーポリシー', href: '#' },
              { label: '利用規約', href: '#' },
              { label: 'お問い合わせ', href: '#contact' },
              { label: 'よくある質問', href: '#faq' },
            ].map((link, index) => (
              <motion.a
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                href={link.href}
                className="text-sm text-gray-600 hover:text-[#0d9488] transition-colors font-medium relative group"
              >
                {link.label}
                <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0d9488] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.a>
            ))}
          </div>
        </motion.footer>
      </motion.div>
    </section>
  );
}