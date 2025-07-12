'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  Calendar,
  Award,
} from 'lucide-react';
import { usePersonalInfo } from '../../../components/PersonalInfoContext';

interface TeacherNavbarProps {
  onToggleSidebar?: () => void;
}

const TeacherNavbar: React.FC<TeacherNavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { openModal } = usePersonalInfo();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (paths.length === 1 && paths[0] === 'teacher') {
      return [{ name: 'Tổng quan', href: '/teacher' }];
    }

    breadcrumbs.push({ name: 'Tổng quan', href: '/teacher' });

    if (paths.length > 1) {
      const pageName = paths[1];
      const pageNames: { [key: string]: string } = {
        'teaching-schedule': 'Lịch giảng dạy',
        classroom: 'Lớp học',
        'score-entry': 'Nhập điểm',
        'student-feedback': 'Nhận xét học viên',
        students: 'Học viên',
        reports: 'Báo cáo',
        resources: 'Tài liệu',
        settings: 'Cài đặt',
      };

      breadcrumbs.push({
        name:
          pageNames[pageName] ||
          pageName.charAt(0).toUpperCase() + pageName.slice(1),
        href: `/teacher/${pageName}`,
      });
    }

    // Handle personal-info which is outside teacher folder
    if (pathname === '/personal-info') {
      return [
        { name: 'Tổng quan', href: '/teacher' },
        { name: 'Thông tin cá nhân', href: '/personal-info' },
      ];
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className='h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-20'>
      <div className='h-full flex items-center justify-between px-6'>
        {/* Left side - Breadcrumbs */}
        <div className='flex items-center gap-4'>
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100'
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </button>

          {/* Breadcrumbs */}
          <nav className='flex items-center space-x-2 text-sm'>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className='flex items-center'>
                {index > 0 && <span className='text-gray-400 mx-2'>/</span>}
                <span
                  className={`
                    ${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                    }
                  `}
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          {/* User Profile */}
          <div className='relative'>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <img
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                alt='Teacher'
                className='w-8 h-8 rounded-full object-cover'
              />
              <div className='hidden md:block text-left'>
                <p className='text-sm font-medium text-gray-900'>
                  Mr. Anderson
                </p>
                <p className='text-xs text-gray-500'>English Teacher</p>
              </div>
              <ChevronDown className='w-4 h-4 text-gray-500' />
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                <div className='p-4 border-b border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <img
                      src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                      alt='Teacher'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Mr. Anderson
                      </p>
                      <p className='text-xs text-gray-500'>
                        anderson@zenlish.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className='py-2'>
                  <button
                    onClick={() => {
                      openModal('teacher');
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                  >
                    <User className='w-4 h-4' />
                    Hồ sơ
                  </button>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                    <Calendar className='w-4 h-4' />
                    My Schedule
                  </button>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                    <Award className='w-4 h-4' />
                    Performance
                  </button>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                    <Settings className='w-4 h-4' />
                    Cài đặt
                  </button>
                  <hr className='my-2' />
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
                    <LogOut className='w-4 h-4' />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherNavbar;
