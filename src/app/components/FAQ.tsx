import { motion } from 'motion/react';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: '基本機能',
    items: [
      {
        question: '就活ダッシュボードとは何ですか？',
        answer: '就活ダッシュボードは、選考管理、ES保存、企業資料管理など、就活に必要な全ての機能を一箇所に集約したChrome拡張機能です。カンバンボード形式で選考状況を可視化し、複数企業の情報を効率的に管理できます。',
      },
      {
        question: 'どのような機能がありますか？',
        answer: 'Webクリッパー、カンバンボード、ES・面接回答ストッカー、ドキュメントリポジトリ、アカウントマネージャー、カレンダー連携など、就活に必要な6つの主要機能を提供しています。すべて無料でご利用いただけます。',
      },
      {
        question: '本当に無料ですか？',
        answer: 'はい、完全無料です。インストール費用、月額費用、隠れたコストは一切ありません。すべての機能を無制限にご利用いただけます。',
      },
    ],
  },
  {
    category: 'セキュリティ',
    items: [
      {
        question: 'データは安全ですか？',
        answer: 'はい。すべてのデータはあなたのブラウザ内でローカルに保存され、外部サーバーには一切送信されません。パスワードや個人情報は暗号化して保存されるため、第三者がアクセスすることはできません。',
      },
      {
        question: 'データの同期はどうなっていますか？',
        answer: '文字データ（ステータス、ES回答など）はGoogleアカウント経由で端末間同期が可能です。大容量の資料（PDF、画像）は各端末のローカルストレージに保存されます。すべてあなたの管理下にあります。',
      },
      {
        question: 'データのバックアップは？',
        answer: 'データはブラウザのローカルストレージとGoogle Syncに自動保存されます。また、いつでもエクスポート機能でJSONファイルとしてダウンロードできます。',
      },
    ],
  },
  {
    category: 'インストール・使い方',
    items: [
      {
        question: 'インストール方法を教えてください。',
        answer: 'Chrome Web Storeのページにアクセスし、「Chromeに追加」ボタンをクリックするだけです。インストール後、企業の採用ページで右クリックメニューから企業情報を追加できます。',
      },
      {
        question: 'スマートフォンでも使えますか？',
        answer: '現在はデスクトップ版のGoogle Chromeのみ対応しています。モバイル版は開発中です。',
      },
      {
        question: 'データの移行はできますか？',
        answer: 'はい。エクスポート/インポート機能を使って、データを他の端末に移行したり、バックアップを取ることができます。',
      },
    ],
  },
  {
    category: 'トラブルシューティング',
    items: [
      {
        question: '拡張機能が動作しません。',
        answer: 'Chromeを最新版に更新してください。それでも解決しない場合は、拡張機能を一度無効化してから再度有効化してみてください。問題が続く場合はお問い合わせください。',
      },
      {
        question: 'データが消えてしまいました。',
        answer: 'Google Syncが有効になっている場合、同じGoogleアカウントでログインすれば復元できます。また、定期的にエクスポート機能でバックアップを取ることをお勧めします。',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 4 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between gap-4 text-left group hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-transparent px-4 -mx-4 rounded-lg transition-all duration-300"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#0f172a] group-hover:text-[#0d9488] transition-colors">
            {question}
          </h3>
        </div>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.15 }}
          className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-teal-500/30 transition-shadow"
        >
          {isOpen ? (
            <Minus className="w-5 h-5 text-white" />
          ) : (
            <Plus className="w-5 h-5 text-white" />
          )}
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6 px-4 -mx-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-teal-500/10 border border-white/20"
          >
            <HelpCircle className="w-4 h-4 text-[#0d9488]" />
            <span className="text-sm bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent font-semibold">
              FAQ
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            よくある質問
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            お客様からよくいただく質問をまとめました。
            <br />
            <span className="text-[#0d9488] font-medium">解決しない場合はお問い合わせください</span>
          </motion.p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="relative"
            >
              {/* Category Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                  <div className="w-2 h-2 rounded-full bg-[#0d9488]" />
                  <h3 className="text-lg font-bold text-[#0f172a]">{category.category}</h3>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg p-8">
                {category.items.map((item, itemIndex) => (
                  <FAQItem key={itemIndex} question={item.question} answer={item.answer} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 via-white to-blue-50 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg p-12">
            <HelpCircle className="w-16 h-16 text-[#0d9488] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#0f172a] mb-3">
              まだ解決しませんか？
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              お気軽にお問い合わせください。専門スタッフが24時間以内に返信いたします。
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
            >
              お問い合わせ
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
