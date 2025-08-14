'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Receipt,
  ChevronRight,
  Calendar,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const StaffSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/staff',
      icon: <LayoutDashboard className='w-5 h-5' />,
      description: 'Dashboard',
    },
    {
      name: 'Học viên',
      href: '/staff/list-student',
      icon: <Users className='w-5 h-5' />,
      description: 'Quản lý học viên',
    },
    {
      name: 'Giáo viên',
      href: '/staff/list-teacher',
      icon: <GraduationCap className='w-5 h-5' />,
      description: 'Xem danh sách giáo viên',
    },
    // {
    //   name: 'Khóa học',
    //   href: '/staff/list-course',
    //   icon: <BookOpen className='w-5 h-5' />,
    //   description: 'Quản lý khóa học',
    // },
    {
      name: 'Lớp học',
      href: '/staff/list-classroom',
      icon: <School className='w-5 h-5' />,
      description: 'Quản lý lớp học',
    },
    {
      name: 'Thời khóa biểu',
      href: '/staff/schedule',
      icon: <Calendar className='w-5 h-5' />,
      description: 'Xem lịch học hàng tuần',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/staff') {
      return pathname === '/staff';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='h-screen w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 fixed left-0 top-0 z-30'>
      {/* Logo */}
      <div className='h-16 flex items-center px-6 border-b border-gray-200 bg-white'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white font-bold text-lg'>S</span>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Nhân sự</h1>
            <p className='text-xs text-gray-500 font-medium'>Staff Panel</p>
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
                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm'
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
                        ? 'bg-green-600 text-white shadow-lg'
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
                  <ChevronRight className='w-4 h-4 text-green-600' />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white'>
        <div className='text-center'>
          <p className='text-xs text-gray-500 font-medium'>Zenlish Staff</p>
          <p className='text-xs text-gray-400 mt-1'>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
