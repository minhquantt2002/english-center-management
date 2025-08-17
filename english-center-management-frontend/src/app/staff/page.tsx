'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  ArrowUp,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Receipt,
  Clock,
} from 'lucide-react';
import { useStaffStatsApi } from './_hooks';

const Dashboard = () => {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { error, getStats } = useStaffStatsApi();

  // Fetch staff stats on component mount
  useEffect(() => {
    fetchStaffStats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStaffStats = async () => {
    try {
      const data = await getStats();

      // Transform the data for display
      const transformedStats = [
        {
          title: 'Học viên mới đăng ký',
          value: String(data.totalStudents || 0),
          change: '+18% so với tháng qua',
          changeType: 'positive',
          icon: Users,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        },
        {
          title: 'Lớp đang hoạt động',
          value: String(data.totalClasses || 0),
          change: '— Không đổi so với tuần trước',
          changeType: 'neutral',
          icon: Calendar,
          color: 'bg-gradient-to-r from-orange-500 to-orange-600',
        },
        {
          title: 'Lịch học hôm nay',
          value: String(data.totalClasses || 0),
          change: '5 lớp đang diễn ra',
          changeType: 'info',
          icon: BarChart3,
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        },
        {
          title: 'Hóa đơn chờ xử lý',
          value: String(data.totalEnrollments || 0),
          change: '+3 so với hôm qua',
          changeType: 'positive',
          icon: Receipt,
          color: 'bg-gradient-to-r from-green-500 to-green-600',
        },
      ];

      setStatsData(transformedStats);
      setRecentRegistrations(data.recentEnrollments || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch staff stats:', err);
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Thêm học viên',
      subtitle: 'Đăng ký học viên mới',
      icon: Users,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      textColor: 'text-white',
      href: '/staff/list-student',
    },
    {
      title: 'Phân lớp',
      subtitle: 'Xếp lớp cho học viên',
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-white',
      href: '/staff/list-classroom',
    },
    {
      title: 'Thời khóa biểu',
      subtitle: 'Quản lý lịch học',
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-white',
      href: '/staff/list-classroom',
    },
    {
      title: 'Tạo hóa đơn',
      subtitle: 'Tạo hóa đơn học viên',
      icon: Receipt,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-white',
      href: '/staff/create-student-invoice',
    },
  ];

  const weeklyStats = [
    { day: 'T2', value: 3 },
    { day: 'T3', value: 5 },
    { day: 'T4', value: 2 },
    { day: 'T5', value: 8 },
    { day: 'T6', value: 4 },
    { day: 'T7', value: 6 },
    { day: 'CN', value: 1 },
  ];

  const maxValue = Math.max(...weeklyStats.map((stat) => stat.value));

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-6 mb-6'>
        <div className='flex items-center gap-3'>
          <AlertCircle className='w-5 h-5 text-red-500' />
          <p className='text-red-800 font-medium'>
            Có lỗi xảy ra khi tải dữ liệu
          </p>
        </div>
        <button
          onClick={fetchStaffStats}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {statsData.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'
          >
            <div className='flex items-center justify-between mb-4'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  {stat.title}
                </p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color} text-white shadow-lg`}
              >
                <stat.icon className='w-6 h-6' />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {stat.changeType === 'positive' ? (
                <ArrowUp size={16} className='text-green-500' />
              ) : stat.changeType === 'neutral' ? (
                <TrendingUp size={16} className='text-gray-500' />
              ) : (
                <BarChart3 size={16} className='text-blue-500' />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : stat.changeType === 'neutral'
                    ? 'text-gray-500'
                    : 'text-blue-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
          <div className='w-1 h-8 bg-green-600 rounded-full'></div>
          Truy cập nhanh
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`${action.color} ${action.textColor} rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            >
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <action.icon className='w-6 h-6' />
                </div>
                <div>
                  <div className='font-semibold text-lg'>{action.title}</div>
                  <div className='text-sm opacity-90'>{action.subtitle}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Recent Registrations */}
        <div className='lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <Users className='w-5 h-5 text-green-600' />
                Đăng ký gần đây
              </h3>
              <button className='text-green-600 text-sm font-semibold hover:text-green-700 transition-colors'>
                Xem tất cả
              </button>
            </div>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((student, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-4 py-3 border-b border-gray-50 last:border-b-0'
                  >
                    <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                      {student.avatar}
                    </div>
                    <div className='flex-1'>
                      <div className='font-semibold text-gray-900'>
                        {student.name}
                      </div>
                      <div className='text-sm text-gray-500 flex items-center gap-2'>
                        <BookOpen className='w-4 h-4' />
                        {student.level}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${student.statusColor}`}
                    >
                      {student.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <Users className='w-16 h-16 text-gray-300 mx-auto mb-3' />
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

        {/* Weekly Stats */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-purple-600' />
              Thống kê đăng ký tuần
            </h3>
          </div>
          <div className='p-6'>
            <div className='flex items-end justify-between space-x-2 h-40'>
              {weeklyStats.map((stat, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center space-y-2'
                >
                  <div className='text-xs text-gray-600 font-medium'>
                    {stat.value}
                  </div>
                  <div
                    className='bg-gradient-to-t from-purple-500 to-purple-600 rounded-t shadow-sm'
                    style={{
                      height: `${(stat.value / maxValue) * 100}px`,
                      width: '24px',
                    }}
                  ></div>
                  <div className='text-xs text-gray-600 font-medium'>
                    {stat.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className='mt-8 bg-white rounded-xl border border-gray-100 shadow-sm'>
        <div className='p-6 border-b border-gray-100'>
          <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <Calendar className='w-5 h-5 text-orange-600' />
            Lịch học hôm nay
          </h3>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
