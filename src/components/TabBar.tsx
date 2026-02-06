'use client';

import React from 'react';
import { Link, usePathname } from '@/navigation';
import { Home, Calendar, Refrigerator, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useTabBarScroll } from '@/lib/hooks/useTabBarScroll';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  {
    key: 'home',
    href: '/app',
    icon: Home,
  },
  {
    key: 'planner',
    href: '/app/planner',
    icon: Calendar,
  },
  {
    key: 'pantry',
    href: '/app/pantry',
    icon: Refrigerator,
  },
  {
    key: 'shoppingList',
    href: '/app/shopping-list',
    icon: ShoppingBag,
  },
  {
    key: 'profile',
    href: '/app/profile',
    icon: User,
  },
];

export default function TabBar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { isVisible } = useTabBarScroll();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 w-full bg-[#121212] px-6 py-3 flex justify-around items-center z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.3)] border-t border-white/5"
        >
          <div className="flex justify-around items-center w-full max-w-md mx-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-label={t(item.key)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-90",
                    isActive ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-200"
                  )}
                >
                  <IconComponent className={cn(
                    "h-6 w-6 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                  <span className="text-[10px] font-medium mt-1">{t(item.key)}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(224,93,68,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
