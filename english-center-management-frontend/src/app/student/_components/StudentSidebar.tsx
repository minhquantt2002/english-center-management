'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Settings,
  FileText,
  Target,
  Trophy,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
}

const StudentSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/student',
      icon: <LayoutDashboard className='w-5 h-5' />,
      description: 'Dashboard chính',
    },
    {
      name: 'Lớp học',
      href: '/student/classroom',
      icon: <BookOpen className='w-5 h-5' />,
      badge: '3',
      description: 'Các lớp đang học',
    },
    {
      name: 'Lịch học',
      href: '/student/studying-schedule',
      icon: <Calendar className='w-5 h-5' />,
      badge: '8',
      description: 'Lịch học cá nhân',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/student') {
      return pathname === '/student';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='h-screen w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 fixed left-0 top-0 z-30'>
      {/* Logo */}
      <div className='h-20 flex items-center px-6 border-b border-gray-200 bg-white'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Cổng học viên</h1>
            <p className='text-xs text-gray-500 font-medium'>Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='mt-6 px-3 pb-6'>
        <div className='space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${
                      isActive(item.href)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }
                  `}
                >
                  {item.icon}
                </div>
                <div>
                  <span className='font-semibold'>{item.name}</span>
                  {item.description && (
                    <p className='text-xs text-gray-500 mt-0.5'>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2'>
                {item.badge && (
                  <span
                    className={`
                    px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200
                    ${
                      isActive(item.href)
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
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

        {/* Divider */}
        <div className='my-6 border-t border-gray-200'></div>

        {/* Additional Tools */}
        <div className='space-y-2'>
          <Link
            href='/student/progress'
            className='group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200'
          >
            <div className='w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700 flex items-center justify-center transition-all duration-200'>
              <BarChart3 className='w-5 h-5' />
            </div>
            <div>
              <span className='font-semibold'>Tiến độ học</span>
              <p className='text-xs text-gray-500 mt-0.5'>Theo dõi tiến độ</p>
            </div>
          </Link>

          <Link
            href='/student/achievements'
            className='group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200'
          >
            <div className='w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700 flex items-center justify-center transition-all duration-200'>
              <Trophy className='w-5 h-5' />
            </div>
            <div>
              <span className='font-semibold'>Thành tích</span>
              <p className='text-xs text-gray-500 mt-0.5'>
                Huy chương & giải thưởng
              </p>
            </div>
          </Link>

          <Link
            href='/student/materials'
            className='group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200'
          >
            <div className='w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700 flex items-center justify-center transition-all duration-200'>
              <FileText className='w-5 h-5' />
            </div>
            <div>
              <span className='font-semibold'>Tài liệu</span>
              <p className='text-xs text-gray-500 mt-0.5'>Tài liệu học tập</p>
            </div>
          </Link>

          <Link
            href='/student/goals'
            className='group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200'
          >
            <div className='w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700 flex items-center justify-center transition-all duration-200'>
              <Target className='w-5 h-5' />
            </div>
            <div>
              <span className='font-semibold'>Mục tiêu</span>
              <p className='text-xs text-gray-500 mt-0.5'>
                Đặt mục tiêu học tập
              </p>
            </div>
          </Link>

          <Link
            href='/student/settings'
            className='group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200'
          >
            <div className='w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700 flex items-center justify-center transition-all duration-200'>
              <Settings className='w-5 h-5' />
            </div>
            <div>
              <span className='font-semibold'>Cài đặt</span>
              <p className='text-xs text-gray-500 mt-0.5'>
                Tùy chỉnh tài khoản
              </p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white'>
        <div className='text-center'>
          <p className='text-xs text-gray-500 font-medium'>Zenlish Student</p>
          <p className='text-xs text-gray-400 mt-1'>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
