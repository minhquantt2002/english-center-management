'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { usePersonalInfo } from '../../../components/PersonalInfoContext';

interface StaffNavbarProps {
  onToggleSidebar?: () => void;
}

const StaffNavbar: React.FC<StaffNavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { openModal } = usePersonalInfo();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (paths.length === 1 && paths[0] === 'staff') {
      return [{ name: 'Tổng quan', href: '/staff' }];
    }

    breadcrumbs.push({ name: 'Tổng quan', href: '/staff' });

    if (paths.length > 1) {
      const pageName = paths[1];
      const pageNames: { [key: string]: string } = {
        'list-student': 'Danh sách học viên',
        'list-teacher': 'Danh sách giáo viên',
        'list-course': 'Danh sách khóa học',
        'list-classroom': 'Danh sách lớp học',
        'create-student': 'Tạo học viên',
        'assign-student': 'Phân công học viên',
        'create-schedule': 'Tạo lịch học',
        'teaching-schedule': 'Lịch giảng dạy',
        'create-student-invoice': 'Hóa đơn học viên',
      };

      breadcrumbs.push({
        name:
          pageNames[pageName] ||
          pageName.charAt(0).toUpperCase() + pageName.slice(1),
        href: `/staff/${pageName}`,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: 'Yêu cầu đăng ký mới',
      message: 'Maria Garcia muốn đăng ký khóa tiếng Anh nâng cao',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Xung đột lịch học',
      message: 'Phòng A bị xung đột với lớp tiếng Anh thương mại',
      time: '15 phút trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Xác nhận thanh toán',
      message: 'Hóa đơn #1234 đã được thanh toán thành công',
      time: '1 giờ trước',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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

        {/* Right side - Search, Notifications, Profile */}
        <div className='flex items-center gap-4'>
          {/* Search */}
          <div className='relative hidden md:block'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search students, courses...'
              className='block w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500'
            />
          </div>

          {/* Quick actions */}
          <button className='p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900'>
            <MessageSquare className='w-5 h-5' />
          </button>

          <button className='p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900'>
            <HelpCircle className='w-5 h-5' />
          </button>

          {/* Notifications */}
          <div className='relative'>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className='p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 relative'
            >
              <Bell className='w-5 h-5' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                <div className='p-4 border-b border-gray-200'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    Thông báo
                  </h3>
                </div>
                <div className='max-h-64 overflow-y-auto'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        notification.unread ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-900'>
                            {notification.title}
                          </p>
                          <p className='text-sm text-gray-600 mt-1'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-400 mt-2'>
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='p-4 text-center'>
                  <button className='text-sm text-green-600 hover:text-green-800 font-medium'>
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className='relative'>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <img
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                alt='Staff'
                className='w-8 h-8 rounded-full object-cover'
              />
              <div className='hidden md:block text-left'>
                <p className='text-sm font-medium text-gray-900'>Staff</p>
                <p className='text-xs text-gray-500'>Staff</p>
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
                      alt='Staff'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>Staff</p>
                      <p className='text-xs text-gray-500'>staff@zenlish.com</p>
                    </div>
                  </div>
                </div>
                <div className='py-2'>
                  <button
                    onClick={() => {
                      openModal('staff');
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                  >
                    <User className='w-4 h-4' />
                    Hồ sơ
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

export default StaffNavbar;
