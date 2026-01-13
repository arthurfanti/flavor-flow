'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const navItems = [
  {
    name: 'Home',
    href: '/',
    iconName: 'home',
  },
  {
    name: 'Planner',
    href: '/planner',
    iconName: 'calendar_month',
  },
  {
    name: 'Pantry',
    href: '/pantry',
    iconName: 'kitchen',
  },
  {
    name: 'Shopping',
    href: '/shopping-list',
    iconName: 'shopping_bag',
  },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-4 py-2 pb-6 flex justify-around items-center z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            aria-label={item.name}
            className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 ${
              isActive ? 'text-brand-yellow-dark' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon name={item.iconName} className="text-[24px]" />
          </Link>
        );
      })}
    </nav>
  );
}
