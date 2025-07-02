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
  FolderOpen,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/admin',
      icon: <LayoutDashboard className='w-5 h-5' />,
    },
    {
      name: 'Học viên',
      href: '/admin/student',
      icon: <Users className='w-5 h-5' />,
      badge: '156',
    },
    {
      name: 'Giáo viên',
      href: '/admin/teacher',
      icon: <GraduationCap className='w-5 h-5' />,
      badge: '12',
    },
    {
      name: 'Khóa học',
      href: '/admin/course',
      icon: <BookOpen className='w-5 h-5' />,
      badge: '8',
    },
    {
      name: 'Lớp học',
      href: '/admin/classroom',
      icon: <School className='w-5 h-5' />,
      badge: '15',
    },
    {
      name: 'Danh mục',
      href: '/admin/category',
      icon: <FolderOpen className='w-5 h-5' />,
    },
    {
      name: 'Vai trò & Quyền',
      href: '/admin/role',
      icon: <Shield className='w-5 h-5' />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 z-30'>
      {/* Logo */}
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>Z</span>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Zenlish</h1>
            <p className='text-xs text-gray-500'>Bảng điều khiển</p>
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
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <span
                  className={`
                    ${
                      isActive(item.href)
                        ? 'text-blue-600'
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
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive(item.href) && (
                  <ChevronRight className='w-4 h-4 text-blue-600' />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Settings at bottom */}
      <div className='absolute bottom-4 left-3 right-3'>
        <Link
          href='/admin/settings'
          className='group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200'
        >
          <Settings className='w-5 h-5 text-gray-500 group-hover:text-gray-700' />
          <span>Cài đặt</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
