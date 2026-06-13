'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function FloatingDynamicIsland() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Copilot', path: '/' },
    { name: 'Customers', path: '/customers' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Intelligence', path: '/analytics' }, // Renamed from Analytics for premium feel
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-white/[0.08] rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}