'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TopDynamicIsland() {
  const pathname = usePathname();
  
  // If we are on the Landing Page, hide the navigation completely
  if (pathname === '/') return null;
  
  const navItems = [
    { name: 'Copilot', path: '/copilot' }, // Changed path to the new Copilot page
    { name: 'Customers', path: '/customers' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Intelligence', path: '/analytics' },
  ];

  return (
    <motion.div 
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 origin-top"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-[rgba(20,20,20,0.6)] backdrop-blur-2xl border border-gray-800 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-white/[0.1] rounded-full"
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
    </motion.div>
  );
}