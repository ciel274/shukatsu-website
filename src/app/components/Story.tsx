import { motion } from 'motion/react';
import { Lightbulb, Target, Heart, Code, Users } from 'lucide-react';

export default function Story() {
  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
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
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl"
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
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-3xl"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full mb-8 shadow-lg shadow-amber-500/10 border border-white/20"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="text-sm bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">
              Our Story
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight"
          >
            なぜ、このツールを
            <br />
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              作ったのか
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed"
          >
            就活生として感じた「不便」から生まれたツール。
            <br />
            すべては、後輩たちの就活を少しでも楽にしたいという想いから始まりました。
          </motion.p>
        </div>

        {/* Story Content */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-teal-500/20 rounded-3xl blur-2xl" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-12">
            {/* Main Story */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                私は現在、大学3年生で就活の真っ只中にいます。30社以上にエントリーする中で、毎日のように感じていたこと。それは、
                <span className="font-semibold text-[#0f172a]">
                  「なぜ企業ごとに異なるマイページで、バラバラに管理しなければならないのか」
                </span>
                という素朴な疑問でした。
              </p>

              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Excelで管理を試みました。でも、締切を見逃してしまったり、ESの回答を探すのに時間がかかったり。
                面接の準備や企業研究に集中したいのに、
                <span className="font-semibold text-[#0f172a]">
                  「どこに何があるか探す」という管理作業だけで、毎日30分以上を消費している
                </span>
                自分に気づきました。
              </p>

              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                「だったら、自分で作ればいいんじゃないか。」そう思い立ち、プログラミングの勉強をしながら、
                <span className="font-semibold text-[#0f172a]">
                  自分が本当に欲しいツールを形にしています。
                </span>
                まだ就活中の学生が作っているツールなので、機能は発展途上です。でも、同じ悩みを抱える就活生の役に立てたら嬉しい。そんな想いで開発を続けています。
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {[
                {
                  icon: Target,
                  title: 'シンプルな目標',
                  description: '就活の「管理時間」を1/3に減らす。選考準備に集中できる環境を。',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Heart,
                  title: '誠実な姿勢',
                  description: '広告なし、データ収集なし。学生のプライバシーを第一に。',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  icon: Code,
                  title: 'オープンな開発',
                  description: 'フィードバックを受けながら、みんなで作るツール。',
                  color: 'from-purple-500 to-indigo-500',
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gradient-to-r from-amber-50 via-orange-50 to-teal-50 backdrop-blur-xl rounded-3xl border border-orange-100 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">開発者より</p>
                <p className="text-xs text-gray-400">大学3年生・就活生</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl">
              就活しながら開発しているため、リリースは時間がかかるかもしれません。
              <br />
              <span className="font-semibold text-[#0f172a]">
                でも、同じ悩みを持つあなたのフィードバックが、このツールを育てます。
              </span>
            </p>
            <p className="text-sm text-gray-500">
              バグ報告・機能リクエスト・応援メッセージ、すべて大歓迎です。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
