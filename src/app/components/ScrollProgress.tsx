import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Main Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0f766e] origin-left z-50 shadow-lg shadow-teal-500/50"
        style={{ scaleX }}
      >
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500/50 via-cyan-500/50 to-teal-500/50 origin-left z-49 blur-sm"
        style={{ scaleX }}
      />
    </>
  );
}
