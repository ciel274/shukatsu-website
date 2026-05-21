import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'teal' | 'purple' | 'blue';
}

export default function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const colors = {
    default: {
      primary: 'from-teal-400/20 to-cyan-400/20',
      secondary: 'from-blue-400/20 to-purple-400/20',
      tertiary: 'from-teal-300/10 to-emerald-300/10',
    },
    teal: {
      primary: 'from-teal-500/25 to-emerald-500/25',
      secondary: 'from-cyan-500/20 to-teal-500/20',
      tertiary: 'from-teal-400/15 to-cyan-400/15',
    },
    purple: {
      primary: 'from-purple-500/25 to-pink-500/25',
      secondary: 'from-blue-500/20 to-purple-500/20',
      tertiary: 'from-purple-400/15 to-pink-400/15',
    },
    blue: {
      primary: 'from-blue-500/25 to-cyan-500/25',
      secondary: 'from-indigo-500/20 to-blue-500/20',
      tertiary: 'from-blue-400/15 to-cyan-400/15',
    },
  };

  const selected = colors[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-0 -left-20 w-[600px] h-[600px] bg-gradient-to-br ${selected.primary} rounded-full blur-3xl`}
      />

      {/* Secondary Orb */}
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -bottom-20 -right-20 w-[700px] h-[700px] bg-gradient-to-br ${selected.secondary} rounded-full blur-3xl`}
      />

      {/* Tertiary Orb */}
      <motion.div
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${selected.tertiary} rounded-full blur-3xl`}
      />

      {/* Grid Pattern */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      {/* Floating Particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
          }}
          className="absolute w-2 h-2 bg-teal-500/30 rounded-full"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );
}
