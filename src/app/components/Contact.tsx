import { motion } from 'motion/react';
import { Mail, MessageSquare, ExternalLink, Bug, Lightbulb, HelpCircle, Shield, FileText } from 'lucide-react';

// GASスクリプト実行後にここを更新してください
const CONTACT_FORM_URL = 'https://forms.gle/n5NAZoJh5LXmN4C87';

const CONTACT_TYPES = [
  { icon: Bug,       label: 'バグ・不具合の報告',         color: 'from-red-500 to-rose-500' },
  { icon: Lightbulb, label: '機能リクエスト・改善提案',   color: 'from-yellow-500 to-amber-500' },
  { icon: HelpCircle,label: '使い方・操作方法の質問',     color: 'from-blue-500 to-cyan-500' },
  { icon: Shield,    label: 'プライバシー・データに関するご質問', color: 'from-purple-500 to-violet-500' },
  { icon: FileText,  label: 'その他',                     color: 'from-teal-500 to-emerald-500' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-teal-500/10 border border-white/20"
          >
            <MessageSquare className="w-4 h-4 text-[#0d9488]" />
            <span className="text-sm bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent font-semibold">
              Contact
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            お問い合わせ
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            ご質問・バグ報告・機能リクエストはいつでもお気軽にどうぞ。
            <br />
            <span className="text-[#0d9488] font-medium">通常2〜3営業日以内にご返信いたします</span>
          </motion.p>
        </div>

        {/* Contact type chips */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {CONTACT_TYPES.map((t, i) => (
            <motion.a
              key={i}
              href={CONTACT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-semibold text-gray-700 group"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                <t.icon className="w-3.5 h-3.5 text-white" />
              </div>
              {t.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Main CTA card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-[#0f172a] mb-3">フォームからお問い合わせ</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              お問い合わせの種類を選んで内容を送信してください。<br />
              返信希望の場合はメールアドレスをご記入ください。
            </p>

            <motion.a
              href={CONTACT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-xl font-semibold text-base shadow-xl hover:shadow-2xl hover:shadow-teal-500/40 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              お問い合わせフォームを開く
              <ExternalLink className="w-4 h-4 opacity-70" />
            </motion.a>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span>または </span>
              <a
                href="mailto:reopon1524@gmail.com"
                className="text-[#0d9488] font-medium hover:underline"
              >
                reopon1524@gmail.com
              </a>
              <span>へ直接メール</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
