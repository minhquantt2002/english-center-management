'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  PlayCircle,
  UserPlus,
  UserCheck,
  Calendar,
  ArrowUp,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useDashboardApi } from './_hooks';
import { DashboardStatCards, DashboardStats } from '../../types/admin';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: 'up' | 'down' | 'neutral';
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
}

interface EnrollmentProps {
  name: string;
  course: string;
  time: string;
  avatar: string;
}

interface SystemStatusProps {
  service: string;
  status: string;
  statusColor: string;
}

const AdminDashboard: React.FC = () => {
  const { loading, error, getDashboardStats, getStatCards } = useDashboardApi();
  const [stats, setStats] = useState<DashboardStatCards>();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, dashboardData] = await Promise.all([
          getStatCards(),
          getDashboardStats(),
        ]);
        setStats(statsData);
        setDashboardStats(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [getStatCards, getDashboardStats]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users size={24} />;
      case 'GraduationCap':
        return <GraduationCap size={24} />;
      case 'BookOpen':
        return <BookOpen size={24} />;
      case 'PlayCircle':
        return <PlayCircle size={24} />;
      default:
        return <Users size={24} />;
    }
  };

  const quickActions = [
    {
      title: 'Quản lý học viên',
      description: 'Thêm, chỉnh sửa hoặc xóa tài khoản học viên',
      icon: <UserPlus size={24} />,
      iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      href: '/admin/student',
    },
    {
      title: 'Quản lý giáo viên',
      description: 'Giám sát hồ sơ và phân công giáo viên',
      icon: <UserCheck size={24} />,
      iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
      href: '/admin/teacher',
    },
    {
      title: 'Quản lý lớp học',
      description: 'Tạo và lên lịch lớp học mới',
      icon: <Calendar size={24} />,
      iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      href: '/admin/classroom',
    },
    {
      title: 'Quản lý khóa học',
      description: 'Tạo và cập nhật các khóa học',
      icon: <BookOpen size={24} />,
      iconBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
      href: '/admin/course',
    },
  ];

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    iconBg,
    trend,
  }) => (
    <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-gray-500 text-sm font-medium'>{title}</p>
          <p className='text-3xl font-bold text-gray-900 mt-1'>{value}</p>
        </div>
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {trend === 'up' ? (
          <ArrowUp size={16} className='text-green-500' />
        ) : trend === 'down' ? (
          <ArrowUp size={16} className='text-red-500 rotate-180' />
        ) : (
          <TrendingUp size={16} className='text-gray-500' />
        )}
        <span
          className={`text-sm font-medium ${
            trend === 'up'
              ? 'text-green-500'
              : trend === 'down'
              ? 'text-red-500'
              : 'text-gray-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionProps> = ({
    title,
    description,
    icon,
    iconBg,
    href,
  }) => (
    <a
      href={href}
      className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group'
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <h3 className='font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
        {title}
      </h3>
      <p className='text-gray-500 text-sm leading-relaxed'>{description}</p>
    </a>
  );

  const EnrollmentItem: React.FC<EnrollmentProps> = ({
    name,
    course,
    time,
    avatar,
  }) => (
    <div className='flex items-center gap-4 py-4 border-b border-gray-50 last:border-b-0'>
      <div className='relative'>
        <img
          src={
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          }
          alt={name}
          className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-100'
        />
        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
      </div>
      <div className='flex-1'>
        <p className='font-semibold text-gray-900'>{name}</p>
        <p className='text-sm text-gray-500'>Đăng ký {course}</p>
      </div>
      <div className='text-right'>
        <p className='text-sm text-gray-400'>{time}</p>
        <div className='flex items-center gap-1 mt-1'>
          <CheckCircle size={12} className='text-green-500' />
          <span className='text-xs text-green-600 font-medium'>Hoàn thành</span>
        </div>
      </div>
    </div>
  );

  const StatusItem: React.FC<SystemStatusProps> = ({
    service,
    status,
    statusColor,
  }) => (
    <div className='flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0'>
      <div className='flex items-center gap-3'>
        <div
          className={`w-3 h-3 rounded-full ${statusColor.replace(
            'text-',
            'bg-'
          )}`}
        ></div>
        <span className='text-gray-700 font-medium'>{service}</span>
      </div>
      <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Chào mừng trở lại, Admin!
        </h1>
        <p className='text-gray-600'>
          Đây là tổng quan về trung tâm tiếng Anh của bạn
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-6 mb-6'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-red-500' />
            <p className='text-red-800 font-medium'>{error}</p>
          </div>
        </div>
      )}

      {/* Thống kê chính */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats && (
          <>
            <StatCard
              title='Tổng học viên'
              value={stats.totalStudents?.toString() || '0'}
              change='+12% so với tháng trước'
              icon={getIconComponent('Users')}
              iconBg='bg-gradient-to-r from-blue-500 to-blue-600'
              trend='up'
            />
            <StatCard
              title='Tổng giáo viên'
              value={stats.totalTeachers?.toString() || '0'}
              change='+3% so với tháng trước'
              icon={getIconComponent('GraduationCap')}
              iconBg='bg-gradient-to-r from-green-500 to-green-600'
              trend='up'
            />
            <StatCard
              title='Tổng khóa học'
              value={stats.totalCourses?.toString() || '0'}
              change='+5% so với tháng trước'
              icon={getIconComponent('BookOpen')}
              iconBg='bg-gradient-to-r from-orange-500 to-orange-600'
              trend='up'
            />
            <StatCard
              title='Tổng lớp học'
              value={stats.totalClasses?.toString() || '0'}
              change='+8% so với tháng trước'
              icon={getIconComponent('PlayCircle')}
              iconBg='bg-gradient-to-r from-purple-500 to-purple-600'
              trend='up'
            />
          </>
        )}
      </div>

      {/* Thao tác nhanh */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
          <div className='w-1 h-8 bg-blue-600 rounded-full'></div>
          Thao tác nhanh
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Đăng ký gần đây */}
        <div className='lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <Users className='w-5 h-5 text-blue-600' />
                Đăng ký gần đây
              </h3>
              <button className='text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors'>
                Xem tất cả
              </button>
            </div>
          </div>
          <div className='p-6'>
            <div className='space-y-2'>
              {dashboardStats?.recentEnrollments?.map((enrollment, index) => (
                <EnrollmentItem key={index} {...enrollment} />
              )) || (
                <div className='text-center py-8'>
                  <Users className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500 font-medium'>
                    Không có đăng ký gần đây
                  </p>
                  <p className='text-gray-400 text-sm'>
                    Học viên mới sẽ xuất hiện ở đây
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trạng thái hệ thống */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-600' />
              Trạng thái hệ thống
            </h3>
          </div>
          <div className='p-6'>
            <div className='space-y-2'>
              <StatusItem
                service='Cơ sở dữ liệu'
                status='Hoạt động'
                statusColor='text-green-600'
              />
              <StatusItem
                service='API Server'
                status='Hoạt động'
                statusColor='text-green-600'
              />
              <StatusItem
                service='Email Service'
                status='Hoạt động'
                statusColor='text-green-600'
              />
              <StatusItem
                service='File Storage'
                status='Hoạt động'
                statusColor='text-green-600'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
