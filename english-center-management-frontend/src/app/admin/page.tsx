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
  BarChart3,
  ArrowUp,
} from 'lucide-react';
import { useAdminApi, StatCard, DashboardStats } from './_hooks/use-api';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
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
  const { loading, error, getDashboardStats, getStatCards } = useAdminApi();
  const [stats, setStats] = useState<StatCard[]>([]);
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
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Quản lý giáo viên',
      description: 'Giám sát hồ sơ và phân công giáo viên',
      icon: <UserCheck size={24} />,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      title: 'Quản lý lớp học',
      description: 'Tạo và lên lịch lớp học mới',
      icon: <Calendar size={24} />,
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Xem báo cáo',
      description: 'Truy cập phân tích và báo cáo chi tiết',
      icon: <BarChart3 size={24} />,
      iconBg: 'bg-orange-100 text-orange-600',
    },
  ];

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    iconBg,
  }) => (
    <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-gray-500 text-sm font-medium'>{title}</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <ArrowUp size={16} className='text-green-500' />
        <span className='text-green-500 text-sm font-medium'>{change}</span>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionProps> = ({
    title,
    description,
    icon,
    iconBg,
  }) => (
    <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer'>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} mb-4`}
      >
        {icon}
      </div>
      <h3 className='font-semibold text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-500 text-sm'>{description}</p>
    </div>
  );

  const EnrollmentItem: React.FC<EnrollmentProps> = ({
    name,
    course,
    time,
    avatar,
  }) => (
    <div className='flex items-center gap-3 py-3'>
      <img
        src={avatar}
        alt={name}
        className='w-10 h-10 rounded-full object-cover'
      />
      <div className='flex-1'>
        <p className='font-medium text-gray-900'>{name}</p>
        <p className='text-sm text-gray-500'>Đăng ký {course}</p>
      </div>
      <p className='text-sm text-gray-400'>{time}</p>
    </div>
  );

  const StatusItem: React.FC<SystemStatusProps> = ({
    service,
    status,
    statusColor,
  }) => (
    <div className='flex items-center justify-between py-2'>
      <div className='flex items-center gap-2'>
        <div
          className={`w-2 h-2 rounded-full ${statusColor.replace(
            'text-',
            'bg-'
          )}`}
        ></div>
        <span className='text-gray-700'>{service}</span>
      </div>
      <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
    </div>
  );

  return (
    <>
      {/* Loading state */}
      {loading && (
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      {/* Thống kê */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            icon={getIconComponent(stat.icon)}
            iconBg='bg-blue-100 text-blue-600'
          />
        ))}
      </div>

      {/* Thao tác nhanh */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-6'>Thao tác nhanh</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Đăng ký gần đây */}
      <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Đăng ký gần đây
          </h3>
          <button className='text-blue-600 text-sm font-medium hover:text-blue-700'>
            Xem tất cả
          </button>
        </div>
        <div className='space-y-1'>
          {dashboardStats?.recentEnrollments?.map((enrollment, index) => (
            <EnrollmentItem key={index} {...enrollment} />
          )) || (
            <p className='text-gray-500 text-center py-4'>
              Không có đăng ký gần đây
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;
