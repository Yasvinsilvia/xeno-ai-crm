'use client';

import { useCrmStore } from '@/store/useCrmStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CustomersPage() {
  const { customers, initializeData } = useCrmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', totalSpent: '', lastOrder: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load real data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('http://localhost:8000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          city: formData.city,
          totalSpent: parseFloat(formData.totalSpent) || 0,
          lastOrder: formData.lastOrder || new Date().toISOString().split('T')[0]
        }),
      });
      // Refresh the table with the new data
      await initializeData();
      setIsModalOpen(false);
      setFormData({ name: '', city: '', totalSpent: '', lastOrder: '' });
    } catch (error) {
      console.error("Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto mt-12 relative z-10">
      
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Customer Database</h1>
          <p className="text-gray-400">Manage your {customers.length} indexed shoppers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] text-sm"
        >
          + Add Customer
        </button>
      </div>

      {/* Premium Table Layout */}
      <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[rgba(10,10,10,0.6)] backdrop-blur-xl shadow-2xl">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-black/80 sticky top-0 z-20 backdrop-blur-md">
              <tr>
                <th className="p-5 font-semibold text-gray-400 border-b border-white/[0.05]">Name</th>
                <th className="p-5 font-semibold text-gray-400 border-b border-white/[0.05]">Location</th>
                <th className="p-5 font-semibold text-gray-400 border-b border-white/[0.05]">Total Spent</th>
                <th className="p-5 font-semibold text-gray-400 border-b border-white/[0.05]">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {customers.slice(0, 50).map((c) => ( // Showing top 50 to prevent lag
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-medium text-gray-200 group-hover:text-white transition-colors">{c.name}</td>
                  <td className="p-5 text-gray-500">{c.city}</td>
                  <td className="p-5 text-emerald-400/80 font-mono">${Number(c.totalSpent).toLocaleString()}</td>
                  <td className="p-5 text-gray-500 font-mono">{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
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
              <h2 className="text-xl font-bold text-white mb-6">Add New Customer</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">City / Location</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. London" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Total Spent ($)</label>
                    <input required type="number" value={formData.totalSpent} onChange={e => setFormData({...formData, totalSpent: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Last Order Date</label>
                    <input required type="date" value={formData.lastOrder} onChange={e => setFormData({...formData, lastOrder: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" />
                  </div>
                </div>
                <div className="mt-8 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Customer'}
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