'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Settings } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'الصفحة الرئيسية',
      href: '/',
      icon: Calendar,
    },
    {
      name: 'لوحة التحكم',
      href: '/dashboard',
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-xl font-bold text-blue-600">
              د. سعد المهدي
            </Link>
            <div className="hidden md:flex space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}