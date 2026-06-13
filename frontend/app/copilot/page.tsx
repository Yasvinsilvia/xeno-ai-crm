'use client';

import { motion } from 'framer-motion';
import AiCommandTerminal from '@/components/AICommandTerminal';
import AnalyticsRow from '@/components/AnalyticsRow';

export default function CopilotPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto mt-12"
    >
      {/* The big "XENO SYSTEM V1.0" header has been completely removed.
        The user goes straight into the workspace.
      */}

      <AiCommandTerminal />
      <AnalyticsRow />
      
      <div className="mt-12 flex gap-4 text-sm text-gray-500 font-medium justify-center">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
          Systems Online
        </p>
        <p>•</p>
        <p>Real-Time Simulator Active</p>
      </div>
    </motion.div>
  );
}