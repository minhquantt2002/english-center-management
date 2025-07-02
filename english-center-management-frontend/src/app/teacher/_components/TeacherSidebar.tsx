'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardCheck,
  MessageSquare,
  School,
  BarChart3,
  BookOpen,
  Settings,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const TeacherSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/teacher',
      icon: <LayoutDashboard className='w-5 h-5' />,
    },
    {
      name: 'Lịch giảng dạy',
      href: '/teacher/teaching-schedule',
      icon: <Calendar className='w-5 h-5' />,
      badge: '12',
    },
    {
      name: 'Lớp học',
      href: '/teacher/classroom',
      icon: <School className='w-5 h-5' />,
      badge: '4',
    },
    {
      name: 'Nhập điểm',
      href: '/teacher/score-entry',
      icon: <ClipboardCheck className='w-5 h-5' />,
      badge: '8',
    },
    {
      name: 'Nhận xét học viên',
      href: '/teacher/student-feedback',
      icon: <MessageSquare className='w-5 h-5' />,
      badge: '3',
    },
    {
      name: 'Học viên',
      href: '/teacher/students',
      icon: <Users className='w-5 h-5' />,
      badge: '45',
    },
    {
      name: 'Báo cáo',
      href: '/teacher/reports',
      icon: <BarChart3 className='w-5 h-5' />,
    },
    {
      name: 'Tài liệu',
      href: '/teacher/resources',
      icon: <BookOpen className='w-5 h-5' />,
    },
    {
      name: 'Thông tin cá nhân',
      href: '/personal-info',
      icon: <GraduationCap className='w-5 h-5' />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/teacher') {
      return pathname === '/teacher';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 z-30'>
      {/* Logo */}
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center'>
            <GraduationCap className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Cổng giáo viên</h1>
            <p className='text-xs text-gray-500'>Bảng giảng dạy</p>
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
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <span
                  className={`
                    ${
                      isActive(item.href)
                        ? 'text-orange-600'
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
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive(item.href) && (
                  <ChevronRight className='w-4 h-4 text-orange-600' />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Teaching Stats Card */}
      <div className='absolute bottom-20 left-3 right-3'>
        <div className='bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-4 text-white'>
          <div className='text-sm font-medium mb-2'>Thống kê giảng dạy</div>
          <div className='text-xs opacity-90 mb-3'>
            Lớp đang dạy: 4 • Học viên: 45
          </div>
          <div className='w-full bg-white/20 rounded-full h-2'>
            <div className='bg-white rounded-full h-2 w-4/5'></div>
          </div>
          <div className='text-xs mt-2 opacity-90'>Hoàn thành 80% buổi học</div>
        </div>
      </div>

      {/* Settings at bottom */}
      <div className='absolute bottom-4 left-3 right-3'>
        <Link
          href='/teacher/settings'
          className='group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200'
        >
          <Settings className='w-5 h-5 text-gray-500 group-hover:text-gray-700' />
          <span>Cài đặt</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherSidebar;
