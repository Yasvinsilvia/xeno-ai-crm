'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsRow() {
  const [stats, setStats] = useState({ dispatched: 0, delivered: 0, opened: 0 });

  useEffect(() => {
    // Ping the Python backend for live updates
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to sync analytics");
      }
    };

    // Poll every 2 seconds (2000ms)
    const interval = setInterval(fetchStats, 2000);
    
    // Initial fetch on mount
    fetchStats(); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full grid grid-cols-3 gap-4 mt-6 transition-all duration-500">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
        <span className="text-gray-400 text-xs font-medium tracking-wider uppercase mb-1">Dispatched</span>
        {/* Dynamic Data */}
        <span className="text-2xl font-bold text-white transition-all">{stats.dispatched}</span>
      </div>
      
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
        <span className="text-gray-400 text-xs font-medium tracking-wider uppercase mb-1">Delivered</span>
        {/* Dynamic Data */}
        <span className="text-2xl font-bold text-blue-400 transition-all">{stats.delivered}</span>
      </div>
      
      <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
        <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase mb-1">Opened</span>
        {/* Dynamic Data */}
        <span className="text-2xl font-bold text-emerald-400 transition-all">{stats.opened}</span>
      </div>
    </div>
  );
}