'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  BookOpen,
  Award,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const StudentSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/student',
      icon: <LayoutDashboard className='w-5 h-5' />,
    },
    {
      name: 'Lớp học',
      href: '/student/classroom',
      icon: <BookOpen className='w-5 h-5' />,
      badge: '3',
    },
    {
      name: 'Lịch học',
      href: '/student/studying-schedule',
      icon: <Calendar className='w-5 h-5' />,
      badge: '8',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/student') {
      return pathname === '/student';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 z-30'>
      {/* Logo */}
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center'>
            <GraduationCap className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Cổng học viên</h1>
            <p className='text-xs text-gray-500'>Bảng học tập</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='mt-6 px-3'>
        <div className='space-y-1'>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  isActive(item.href)
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <span
                  className={`
                    ${
                      isActive(item.href)
                        ? 'text-purple-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                    }
                  `}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>

              <div className='flex items-center gap-2'>
                {item.badge && (
                  <span
                    className={`
                      px-2 py-0.5 text-xs font-medium rounded-full
                      ${
                        isActive(item.href)
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive(item.href) && (
                  <ChevronRight className='w-4 h-4 text-purple-600' />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StudentSidebar;
