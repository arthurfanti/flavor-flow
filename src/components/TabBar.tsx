'use client';

import React from 'react';
import { Link, usePathname } from '@/navigation';
import { Home, Calendar, Refrigerator, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

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
];

export default function TabBar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass rounded-2xl px-6 py-3 flex justify-around items-center z-[100] shadow-2xl border border-white/10 ring-1 ring-white/5 animate-slide-up">
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
    </nav>
  );
}
