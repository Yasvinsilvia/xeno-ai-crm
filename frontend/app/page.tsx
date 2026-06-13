'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const letter = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  const headingText = "Your AI Marketing Strategist";
  const subText = "Describe your goal. We'll segment the audience, craft the message, and launch the campaign automatically.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-white/[0.03] backdrop-blur-md text-xs font-semibold text-gray-300 tracking-widest mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
      >
        XENO SYSTEM V1.0
      </motion.div>
      
      <motion.h1 
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl"
      >
        {headingText.split('').map((char, index) => (
          <motion.span key={index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.p 
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-12"
      >
        {subText.split('').map((char, index) => (
          <motion.span key={index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.p>

      {/* The Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <Link href="/copilot">
          <button className="relative group px-8 py-4 bg-white text-black text-lg font-semibold rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-transform hover:scale-105 active:scale-95">
            <span className="relative z-10">Get Started</span>
            {/* Button Hover Sweep Effect */}
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </Link>
      </motion.div>

    </main>
  );
}