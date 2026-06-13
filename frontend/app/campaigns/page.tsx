'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CampaignsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  
  // Real-time stats pulled from Python
  const [stats, setStats] = useState({ dispatched: 0, delivered: 0, opened: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to sync analytics");
      }
    };
    const interval = setInterval(fetchStats, 2000);
    fetchStats();
    return () => clearInterval(interval);
  }, []);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    
    try {
      // Send the campaign instruction to the AI backend to trigger dispatch
      await fetch('http://localhost:8000/api/ai-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Send campaign to ${targetAudience}` }),
      });
      setIsModalOpen(false);
      setTargetAudience('');
    } catch (error) {
      console.error("Failed to launch campaign");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto mt-12 relative z-10">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Active Campaigns</h1>
          <p className="text-gray-400">Track delivery lifecycles powered by the Channel Simulator.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] text-sm cursor-pointer"
        >
          + New Campaign
        </button>
      </div>

      {/* Premium Campaign Card */}
      <div className="grid grid-cols-1 gap-6">
        <div className="border border-white/[0.08] rounded-2xl p-8 bg-[rgba(10,10,10,0.6)] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Global Retargeting Initiative</h3>
              <p className="text-sm text-gray-400">Audience Segment: <span className="text-gray-200 font-medium">Dynamic API Targets</span></p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Loop
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 text-sm mb-6">
            <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.05]">
              <span className="block text-gray-500 uppercase tracking-wider text-xs mb-2">Dispatched</span>
              <span className="text-3xl font-bold text-white transition-all">{stats.dispatched}</span>
            </div>
            <div className="bg-blue-900/10 rounded-xl p-5 border border-blue-500/20">
              <span className="block text-blue-400/80 uppercase tracking-wider text-xs mb-2">Delivered</span>
              <span className="text-3xl font-bold text-blue-400 transition-all">{stats.delivered}</span>
            </div>
            <div className="bg-emerald-900/10 rounded-xl p-5 border border-emerald-500/20">
              <span className="block text-emerald-400/80 uppercase tracking-wider text-xs mb-2">Opened / Clicked</span>
              <span className="text-3xl font-bold text-emerald-400 transition-all">{stats.opened}</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10"
            >
              <h2 className="text-xl font-bold text-white mb-2">Launch New Campaign</h2>
              <p className="text-sm text-gray-400 mb-6">Define your target and the AI will handle dispatch.</p>
              
              <form onSubmit={handleLaunch} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Target Audience Intent</label>
                  <input 
                    required 
                    type="text" 
                    value={targetAudience} 
                    onChange={e => setTargetAudience(e.target.value)} 
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. VIP customers in the UK" 
                  />
                </div>
                
                <div className="mt-8 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isLaunching || !targetAudience} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50">
                    {isLaunching ? 'Synthesizing...' : 'Dispatch Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}