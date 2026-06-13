'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCrmStore } from '@/store/useCrmStore';

export default function IntelligencePage() {
  const { customers, initializeData } = useCrmStore();
  const [stats, setStats] = useState({ dispatched: 0, delivered: 0, opened: 0 });

  // Ensure customer store is initialized
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Poll the live Python Backend for real-time campaign stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use environment variable for production URL, fallback to localhost
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const res = await fetch(`${baseUrl}/api/stats`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Intelligence Sync Failed:", error);
      }
    };
    
    const interval = setInterval(fetchStats, 2000);
    fetchStats();
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic rates
  const deliveryRate = stats.dispatched > 0 ? Math.round((stats.delivered / stats.dispatched) * 100) : 0;
  const openRate = stats.delivered > 0 ? Math.round((stats.opened / stats.delivered) * 100) : 0;

  // Improved AI Insights Logic
  const getDynamicInsight = () => {
    if (stats.dispatched === 0) return "Awaiting campaign launch. No active data streams.";
    if (stats.dispatched > 0 && stats.delivered === 0) return "Campaign active: Simulator is processing delivery...";
    if (openRate > 40) return `High engagement detected! Your recent campaigns are converting at ${openRate}%, which is above the industry benchmark.`;
    if (deliveryRate < 80) return "Warning: Delivery rates are suboptimal. The Channel Simulator is detecting network failures.";
    return "Campaign is stabilizing. Engagement metrics are accumulating in real-time.";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-5xl mx-auto mt-12 relative z-10 p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Performance Intelligence</h1>
        <p className="text-gray-400">High-level metrics across all channels and active campaigns.</p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-white/[0.08] rounded-2xl p-6 bg-[rgba(10,10,10,0.6)] backdrop-blur-xl shadow-lg">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Dispatched</h3>
          <p className="text-4xl font-bold text-white transition-all">{stats.dispatched}</p>
        </div>
        
        <div className="border border-blue-500/20 rounded-2xl p-6 bg-blue-900/10 backdrop-blur-xl shadow-lg">
          <h3 className="text-xs font-medium text-blue-400/80 uppercase tracking-wider mb-2">Delivery Rate</h3>
          <p className="text-4xl font-bold text-blue-400 transition-all">{deliveryRate}%</p>
        </div>
        
        <div className="border border-emerald-500/20 rounded-2xl p-6 bg-emerald-900/10 backdrop-blur-xl shadow-lg">
          <h3 className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-2">Open Rate</h3>
          <p className="text-4xl font-bold text-emerald-400 transition-all">{openRate}%</p>
        </div>
      </div>

      {/* Dynamic AI Insights Section */}
      <div className="border border-purple-500/20 rounded-2xl p-6 bg-gradient-to-br from-gray-900/40 to-purple-900/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <h3 className="font-semibold text-lg text-purple-100">Live AI Synthesis</h3>
        </div>
        <ul className="space-y-4 text-sm text-gray-300">
          <li className="flex gap-3">
            <span className="text-purple-400">→</span> {getDynamicInsight()}
          </li>
          <li className="flex gap-3">
            <span className="text-purple-400">→</span> The database currently holds <strong className="text-white mx-1">{customers.length}</strong> fully indexed shopper profiles ready for targeting.
          </li>
        </ul>
      </div>
    </motion.div>
  );
}