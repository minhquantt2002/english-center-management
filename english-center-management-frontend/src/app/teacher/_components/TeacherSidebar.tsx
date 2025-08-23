'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  School,
  ChevronRight,
  GraduationCap,
  FileText,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const TeacherSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/teacher',
      icon: <LayoutDashboard className='w-5 h-5' />,
      description: 'Dashboard chính',
    },
    {
      name: 'Lịch giảng dạy',
      href: '/teacher/teaching-schedule',
      icon: <Calendar className='w-5 h-5' />,
      description: 'Lịch dạy học',
    },
    {
      name: 'Lớp học',
      href: '/teacher/classroom',
      icon: <School className='w-5 h-5' />,
      description: 'Quản lý lớp học',
    },
    {
      name: 'Kỳ thi',
      href: '/teacher/exam',
      icon: <FileText className='w-5 h-5' />,
      description: 'Quản lý kỳ thi',
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
      <div className='h-16 flex items-center px-6 border-b border-gray-200 bg-white'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Cổng giáo viên</h1>
            <p className='text-xs text-gray-500 font-medium'>Teacher Portal</p>
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
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm'
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
                        ? 'bg-orange-600 text-white shadow-lg'
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
                {isActive(item.href) && (
                  <ChevronRight className='w-4 h-4 text-orange-600' />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white'>
        <div className='text-center'>
          <p className='text-xs text-gray-500 font-medium'>Zenlish Teacher</p>
          <p className='text-xs text-gray-400 mt-1'>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
